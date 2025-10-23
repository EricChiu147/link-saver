// Save current page
async function saveCurrentPage() {
  const saveCurrentBtn = document.getElementById('saveCurrentBtn');
  saveCurrentBtn.disabled = true;
  saveCurrentBtn.textContent = '⏳ Saving...';
  
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      alert('Could not get current tab');
      return;
    }
    
    // Skip internal pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      alert('Cannot save internal browser pages');
      return;
    }
    
    // Get page content
    let pageContent = '';
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return document.body.innerText || document.body.textContent || '';
        }
      });
      
      if (results && results[0]) {
        pageContent = results[0].result;
      }
    } catch (error) {
      console.error('Error getting page content:', error);
      pageContent = tab.title;
    }
    
    // Send message to background to save
    const response = await chrome.runtime.sendMessage({
      action: 'saveLink',
      url: tab.url,
      title: tab.title,
      pageContent: pageContent
    });
    
    if (response.success) {
      alert('✅ Link saved successfully!');
      await loadLinks(); // Reload the list
    } else {
      alert(response.message || 'Failed to save link');
    }
  } catch (error) {
    console.error('Error saving page:', error);
    alert('Error: ' + error.message);
  } finally {
    saveCurrentBtn.disabled = false;
    saveCurrentBtn.textContent = '💾 Save';
  }
}

// Load and display all saved links
async function loadLinks() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAllLinks' });
    
    if (response.success) {
      const links = response.links;
      const linksList = document.getElementById('linksList');
      const linkCount = document.getElementById('linkCount');
      
      linkCount.textContent = links.length;
      
      if (links.length === 0) {
        linksList.innerHTML = `
          <div class="empty-state">
            <p>📭 No saved links yet</p>
            <small>Click the extension icon to save the current page</small>
          </div>
        `;
        return;
      }
      
      linksList.innerHTML = links.map(link => `
        <div class="link-item" data-id="${link.id}">
          <div class="link-header">
            <div style="flex: 1;">
              <div class="link-title">${escapeHtml(link.title)}</div>
              <a href="${escapeHtml(link.url)}" target="_blank" class="link-url">${escapeHtml(link.url)}</a>
            </div>
          </div>
          ${link.summary ? `<div class="link-summary">📝 ${escapeHtml(link.summary)}</div>` : ''}
          <div class="link-meta">
            <span class="link-timestamp">⏰ ${formatTimestamp(link.timestamp)}</span>
            <button class="delete-btn" data-id="${link.id}">🗑️ Delete</button>
          </div>
        </div>
      `).join('');
      
      // Add delete button listeners
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = parseInt(btn.getAttribute('data-id'));
          if (confirm('Are you sure you want to delete this link?')) {
            await deleteLink(id);
          }
        });
      });
    } else {
      console.error('Error loading links:', response.error);
    }
  } catch (error) {
    console.error('Error loading links:', error);
  }
}

// Delete a link
async function deleteLink(id) {
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'deleteLink', 
      id: id 
    });
    
    if (response.success) {
      await loadLinks(); // Reload the list
    } else {
      alert('Failed to delete link: ' + response.error);
    }
  } catch (error) {
    console.error('Error deleting link:', error);
    alert('Failed to delete link: ' + error.message);
  }
}

// Handle AI search
async function handleAISearch() {
  const qaInput = document.getElementById('qaInput');
  const qaResult = document.getElementById('qaResult');
  const qaBtn = document.getElementById('qaBtn');
  const query = qaInput.value.trim();
  
  if (!query) {
    return;
  }
  
  // Show loading state
  qaResult.className = 'qa-result visible loading';
  qaResult.textContent = 'AI is thinking...';
  qaBtn.disabled = true;
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'searchWithAI', 
      query: query 
    });
    
    if (response.success) {
      qaResult.className = 'qa-result visible';
      qaResult.textContent = response.answer;
    } else {
      qaResult.className = 'qa-result visible error';
      qaResult.textContent = response.error || 'Search failed. Please make sure your API key is configured in settings.';
    }
  } catch (error) {
    qaResult.className = 'qa-result visible error';
    qaResult.textContent = 'Error: ' + error.message;
  } finally {
    qaBtn.disabled = false;
  }
}

// Format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Load links
  await loadLinks();
  
  // Set up save current page button
  const saveCurrentBtn = document.getElementById('saveCurrentBtn');
  saveCurrentBtn.addEventListener('click', saveCurrentPage);
  
  // Set up AI search
  const qaBtn = document.getElementById('qaBtn');
  const qaInput = document.getElementById('qaInput');
  
  qaBtn.addEventListener('click', handleAISearch);
  qaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAISearch();
    }
  });
  
  // Set up settings button
  const settingsBtn = document.getElementById('settingsBtn');
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
