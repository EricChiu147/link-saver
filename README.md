# Link Saver

A Chrome extension for saving and organizing web links with AI-powered summarization and Q&A capabilities.

## Features

- 📌 **Quick Save**: Save the current page with one click
- 🤖 **AI Summarization**: Automatically generates summaries for saved links using OpenAI
- 🔍 **AI-Powered Search**: Ask questions to find relevant links from your collection
- 💾 **Local Storage**: All data stored locally using IndexedDB (Dexie)
- 🎨 **Beautiful UI**: Modern, intuitive interface with gradient design

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extension directory

## Setup

1. After installing, click the extension icon in your browser toolbar
2. Click the ⚙️ (Settings) button
3. Enter your OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))
4. Click "Save" and optionally test the connection

## Usage

### Saving Links

- Click the "💾 Save" button in the popup to save the current page
- The extension will automatically generate a summary using AI
- If no API key is configured, links are saved without summaries

### Viewing Saved Links

- Click the extension icon to open the popup
- All saved links are displayed with their titles, URLs, and summaries
- Click on any link to open it in a new tab
- Click the "🗑️ Delete" button to remove a link

### AI Search

- Type a question in the "AI Search" field
- Click "Ask" or press Enter
- The AI will analyze your saved links and recommend the most relevant ones

## Technologies Used

- **Dexie.js**: Wrapper for IndexedDB for local data storage
- **OpenAI API**: For generating summaries and powering AI search
- **Chrome Extensions API**: Manifest V3

## Privacy

- All your saved links and data are stored locally in your browser
- API calls to OpenAI only send the necessary data for summarization and search
- No data is sent to any other third-party services

## License

MIT License - see LICENSE file for details

## Development

The extension uses:
- `manifest.json`: Extension configuration
- `background.js`: Background service worker
- `db.js`: Database operations with Dexie
- `popup.html/css/js`: Main popup interface
- `options.html/css/js`: Settings page

## Requirements

- Chrome browser (version 88 or higher for Manifest V3)
- OpenAI API key (for AI features)
- Node.js and npm (for installing dependencies)
