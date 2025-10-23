// Load saved API key
async function loadApiKey() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getApiKey' });
    if (response.success && response.apiKey) {
      document.getElementById('apiKey').value = response.apiKey;
    }
  } catch (error) {
    console.error('Error loading API key:', error);
  }
}

// Save API key
async function saveApiKey() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const messageDiv = document.getElementById('message');
  const saveBtn = document.getElementById('saveBtn');
  
  if (!apiKey) {
    showMessage('Please enter an API key', 'error');
    return;
  }
  
  if (!apiKey.startsWith('sk-')) {
    showMessage('Invalid API key format. OpenAI API keys start with "sk-"', 'error');
    return;
  }
  
  saveBtn.disabled = true;
  
  try {
    const response = await chrome.runtime.sendMessage({ 
      action: 'saveApiKey', 
      apiKey: apiKey 
    });
    
    if (response.success) {
      showMessage('✅ API key saved successfully!', 'success');
    } else {
      showMessage('❌ Failed to save API key: ' + response.error, 'error');
    }
  } catch (error) {
    showMessage('❌ Error saving API key: ' + error.message, 'error');
  } finally {
    saveBtn.disabled = false;
  }
}

// Test API connection
async function testConnection() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const testBtn = document.getElementById('testBtn');
  
  if (!apiKey) {
    showMessage('Please enter an API key first', 'error');
    return;
  }
  
  testBtn.disabled = true;
  showMessage('🔄 Testing connection...', 'info');
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      showMessage('✅ Connection successful! API key is valid.', 'success');
    } else if (response.status === 401) {
      showMessage('❌ Invalid API key. Please check your key.', 'error');
    } else {
      showMessage(`❌ Connection failed with status: ${response.status}`, 'error');
    }
  } catch (error) {
    showMessage('❌ Connection test failed: ' + error.message, 'error');
  } finally {
    testBtn.disabled = false;
  }
}

// Show message
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message visible ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.className = 'message';
  }, 5000);
}

// Toggle API key visibility
function toggleKeyVisibility() {
  const apiKeyInput = document.getElementById('apiKey');
  const toggleBtn = document.getElementById('toggleKey');
  
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    toggleBtn.textContent = '🙈 Hide';
  } else {
    apiKeyInput.type = 'password';
    toggleBtn.textContent = '👁️ Show';
  }
}

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
  // Load saved API key
  await loadApiKey();
  
  // Set up event listeners
  document.getElementById('saveBtn').addEventListener('click', saveApiKey);
  document.getElementById('testBtn').addEventListener('click', testConnection);
  document.getElementById('toggleKey').addEventListener('click', toggleKeyVisibility);
  
  // Allow saving with Enter key
  document.getElementById('apiKey').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveApiKey();
    }
  });
});
