# Link Saver - Usage Examples

This document provides detailed examples of how to use the Link Saver extension.

## Installation

1. **Download and Install Dependencies**
   ```bash
   cd link-saver
   npm install
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `link-saver` directory

3. **Pin the Extension**
   - Click the puzzle icon (🧩) in Chrome toolbar
   - Find "Link Saver" and click the pin icon

## Configuration

### Setting up OpenAI API Key

The extension uses OpenAI's GPT-3.5-turbo for summarization and Q&A features.

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click the Link Saver icon in your toolbar
3. Click the ⚙️ (Settings) button
4. Paste your API key in the "API Key" field
5. Click "💾 Save"
6. Optionally click "🧪 Test Connection" to verify

**Note:** Your API key is stored locally in your browser and never sent anywhere except to OpenAI's API.

## Basic Usage

### Saving Links

**Method 1: Using the Save Button**
1. Navigate to any webpage you want to save
2. Click the Link Saver extension icon
3. Click the "💾 Save" button in the popup
4. Wait for confirmation

**What happens when you save:**
- The page URL and title are captured
- The page content is extracted
- An AI summary is generated (if API key is configured)
- Everything is stored in your local browser database

**Example:**
```
Page: "Introduction to JavaScript - MDN"
URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction
Summary: "This page provides a comprehensive introduction to JavaScript, 
         covering its history, basic concepts, and relationship with other 
         web technologies like HTML and CSS."
```

### Viewing Saved Links

1. Click the Link Saver icon in your toolbar
2. The popup displays all your saved links
3. Each link shows:
   - 📌 Title
   - 🔗 URL
   - 📝 AI-generated summary
   - ⏰ Time saved
   - 🗑️ Delete button

### Deleting Links

1. Open the Link Saver popup
2. Find the link you want to remove
3. Click the "🗑️ Delete" button
4. Confirm the deletion

## AI Search Feature

The AI Search allows you to find relevant links by asking natural language questions.

### Example Searches

**Example 1: Finding Documentation**
```
Question: "Show me links about JavaScript documentation"
AI Response: "Based on your saved links, here are the most relevant ones for 
             JavaScript documentation:
             
             1. 'Introduction to JavaScript - MDN' - This comprehensive guide 
                covers JavaScript fundamentals...
             2. 'JavaScript Reference - MDN' - A complete reference for 
                JavaScript APIs..."
```

**Example 2: Topic-Based Search**
```
Question: "What do I have saved about web development?"
AI Response: "You have several web development related links:
             
             1. 'HTML Basics' - Covers fundamental HTML concepts
             2. 'CSS Grid Layout' - Detailed guide on CSS Grid
             3. 'JavaScript ES6 Features' - Modern JavaScript features..."
```

**Example 3: Finding Specific Information**
```
Question: "I need links about API design"
AI Response: "I found these links related to API design:
             
             1. 'RESTful API Best Practices' - Comprehensive guide on 
                designing REST APIs
             2. 'GraphQL vs REST' - Comparison of different API approaches..."
```

### Tips for Better AI Search

1. **Be Specific**: "Show me Python tutorials" works better than "Python"
2. **Use Natural Language**: Ask questions as you would ask a person
3. **Multiple Topics**: "Find links about both React and Vue.js"
4. **Time-Based**: "What did I save recently about databases?"

## Advanced Features

### Understanding Summaries

The extension generates summaries automatically when you save a link. The summary includes:
- Main topic of the page
- Key points or concepts
- Context about why the content is useful

**Summary Quality Depends On:**
- Page content quality and structure
- Amount of text on the page
- How well-structured the HTML is

### Data Storage

All data is stored locally using IndexedDB through the Dexie library:
- **Database Name**: LinkSaverDB
- **Tables**: 
  - `links`: Stores URLs, titles, summaries, and timestamps
  - `settings`: Stores your API key and other preferences

### Privacy

- ✅ All links stored locally in your browser
- ✅ API key stored locally (not synced)
- ✅ Only necessary data sent to OpenAI API
- ✅ No tracking or analytics
- ✅ No data sent to third parties (except OpenAI for AI features)

## Troubleshooting

### Issue: "No API key configured"

**Solution:**
1. Click ⚙️ (Settings)
2. Enter your OpenAI API key
3. Click Save

### Issue: Summary Generation Failed

**Possible Causes:**
- Invalid API key
- OpenAI API rate limit reached
- Network connection issues
- Insufficient API credits

**Solutions:**
1. Verify API key in settings
2. Check OpenAI account status and credits
3. Try again after a few minutes

### Issue: Cannot Save Certain Pages

**Limitations:**
- Chrome internal pages (chrome://, edge://)
- Some websites block content extraction
- PDF files may not work well

**Workaround:**
- Save the link manually with a note
- Try opening the page in a regular tab first

### Issue: Extension Not Appearing

**Solution:**
1. Check `chrome://extensions/` to ensure it's enabled
2. Click the puzzle icon (🧩) and pin the extension
3. Reload the extension if needed

## Best Practices

### Organizing Your Links

1. **Save Regularly**: Save interesting content as you browse
2. **Use AI Search**: Leverage AI to find related content later
3. **Clean Up**: Periodically delete outdated or irrelevant links
4. **Descriptive Titles**: Pages with good titles are easier to find

### API Usage Optimization

To minimize API costs:
1. **Batch Operations**: Save multiple links at once if needed
2. **Review Summaries**: Check if summaries are helpful
3. **Use Search Wisely**: AI search consumes API credits too
4. **Consider Limits**: OpenAI charges per token used

### Security Tips

1. **Protect Your API Key**: Never share your API key
2. **Monitor Usage**: Check OpenAI dashboard for usage
3. **Use Environment**: Consider using separate API keys for testing
4. **Regular Updates**: Keep the extension updated

## Example Workflow

### Research Project Workflow

1. **Start Research**: Begin browsing for information
2. **Save as You Go**: Click "💾 Save" on useful pages
3. **Summaries Generated**: Extension creates summaries automatically
4. **Later Review**: Use AI search to find specific topics
5. **Export/Use**: Click links to revisit pages

Example AI Questions During Research:
- "Show me all links about machine learning algorithms"
- "What resources did I save about data preprocessing?"
- "Find tutorials about neural networks"

### Learning New Technology Workflow

1. **Save Tutorials**: Save beginner and advanced guides
2. **Save Documentation**: Official docs and references
3. **Save Examples**: Code examples and demos
4. **Organized Review**: Use AI to find "beginner tutorials" or "advanced concepts"

## API Costs

Approximate costs (as of 2024):
- **Summary Generation**: ~$0.002 per page (varies by page size)
- **AI Search**: ~$0.003 per query (varies by number of saved links)

**Note:** Costs depend on:
- Length of page content
- Number of saved links
- Complexity of AI queries
- Current OpenAI pricing

## Future Use Cases

Ideas for how to use Link Saver:
- 📚 **Learning**: Organize tutorial and documentation links
- 🔬 **Research**: Keep track of papers and articles
- 💼 **Work**: Save important resources for projects
- 🎯 **Inspiration**: Collect design and creative examples
- 📰 **News**: Archive interesting articles
- 🛠️ **Tools**: Remember useful web tools and services

---

For more information, see the main [README.md](README.md) file.
