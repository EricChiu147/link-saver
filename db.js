// Database configuration using Dexie
importScripts('node_modules/dexie/dist/dexie.min.js');

const db = new Dexie('LinkSaverDB');

// Define database schema
db.version(1).stores({
  links: '++id, url, title, summary, timestamp, tags',
  settings: 'key, value'
});

// Helper function to get API key
async function getApiKey() {
  const settings = await db.settings.get('apiKey');
  return settings ? settings.value : null;
}

// Helper function to save API key
async function saveApiKey(apiKey) {
  await db.settings.put({ key: 'apiKey', value: apiKey });
}

// Helper function to fetch page content and generate summary
async function generateSummary(url, title, content) {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    console.log('No API key configured, skipping summary generation');
    return 'No summary available (API key not configured)';
  }

  try {
    // Use OpenAI API to generate summary
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of web pages. Provide a brief summary in 2-3 sentences.'
          },
          {
            role: 'user',
            content: `Please summarize this webpage:\nTitle: ${title}\nURL: ${url}\nContent preview: ${content.substring(0, 1000)}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Summary generation failed: ${error.message}`;
  }
}

// Save a link with summary
async function saveLink(url, title, pageContent) {
  // Check if URL already exists
  const existing = await db.links.where('url').equals(url).first();
  if (existing) {
    console.log('URL already saved:', url);
    return { success: false, message: 'URL already saved' };
  }

  // Generate summary
  const summary = await generateSummary(url, title, pageContent);

  // Save to database
  const id = await db.links.add({
    url: url,
    title: title,
    summary: summary,
    timestamp: new Date().toISOString(),
    tags: []
  });

  console.log('Link saved with ID:', id);
  return { success: true, id: id, summary: summary };
}

// Get all links
async function getAllLinks() {
  return await db.links.reverse().toArray();
}

// Delete a link
async function deleteLink(id) {
  await db.links.delete(id);
}

// Search links with AI
async function searchWithAI(query) {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    return { error: 'API key not configured' };
  }

  // Get all links
  const links = await getAllLinks();
  
  // Prepare context with all links and summaries
  const linksContext = links.map(link => 
    `Title: ${link.title}\nURL: ${link.url}\nSummary: ${link.summary}\n---`
  ).join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that helps users find relevant links from their saved collection. Based on the user\'s question, identify and recommend the most relevant links.'
          },
          {
            role: 'user',
            content: `Here are my saved links:\n\n${linksContext}\n\nQuestion: ${query}\n\nPlease recommend the most relevant links and explain why they are relevant.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return { 
      success: true, 
      answer: data.choices[0].message.content.trim() 
    };
  } catch (error) {
    console.error('Error searching with AI:', error);
    return { 
      success: false, 
      error: `Search failed: ${error.message}` 
    };
  }
}
