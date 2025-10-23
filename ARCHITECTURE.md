# Link Saver - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   Popup UI   │   │   Options    │   │  Background  │   │
│  │              │   │    Page      │   │   Service    │   │
│  │ - Link List  │   │              │   │   Worker     │   │
│  │ - Save Btn   │   │ - API Key    │   │              │   │
│  │ - AI Search  │   │ - Settings   │   │ - Handlers   │   │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
│                     ┌──────▼───────┐                       │
│                     │   Database   │                       │
│                     │   (Dexie)    │                       │
│                     │              │                       │
│                     │ - Links      │                       │
│                     │ - Settings   │                       │
│                     └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
                   ┌─────────────────┐
                   │   OpenAI API    │
                   │                 │
                   │ - Summarization │
                   │ - Q&A Search    │
                   └─────────────────┘
```

## Data Flow

### 1. Saving a Link

```
User clicks Save Button
         │
         ▼
Get current tab info (URL, Title)
         │
         ▼
Extract page content (scripting API)
         │
         ▼
Send to OpenAI for summarization
         │
         ▼
Store in Dexie database
  - URL
  - Title
  - Summary
  - Timestamp
         │
         ▼
Update UI / Show notification
```

### 2. AI Search

```
User enters question
         │
         ▼
Retrieve all saved links from DB
         │
         ▼
Prepare context with links + summaries
         │
         ▼
Send to OpenAI with user question
         │
         ▼
Receive AI recommendations
         │
         ▼
Display results in UI
```

## File Structure

```
link-saver/
├── manifest.json          # Extension configuration
├── package.json          # NPM dependencies
├── README.md             # Project overview
├── USAGE.md              # Detailed usage guide
├── TESTING.html          # Testing instructions
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
│
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── scripts/             # Utility scripts
│   └── validate.js      # Extension validator
│
├── background.js        # Service worker
├── db.js               # Database operations
│
├── popup.html          # Main UI
├── popup.css           # Main UI styles
├── popup.js            # Main UI logic
│
├── options.html        # Settings UI
├── options.css         # Settings styles
├── options.js          # Settings logic
│
└── node_modules/       # Dependencies
    └── dexie/          # IndexedDB wrapper
```

## Key Technologies

### Frontend
- **HTML5 + CSS3**: Modern UI with gradients and animations
- **Vanilla JavaScript**: No framework dependencies
- **Chrome Extensions API**: Tabs, Storage, Scripting, Notifications

### Data Storage
- **Dexie.js**: IndexedDB wrapper for local storage
- **IndexedDB**: Browser-native database

### AI Features
- **OpenAI GPT-3.5-turbo**: 
  - Text summarization
  - Semantic search
  - Natural language Q&A

## Database Schema

### Links Table
```javascript
{
  id: number (auto-increment),
  url: string,
  title: string,
  summary: string,
  timestamp: ISO date string,
  tags: array (future use)
}
```

### Settings Table
```javascript
{
  key: string (primary key),
  value: any
}
```

Current settings:
- `apiKey`: OpenAI API key

## API Integration

### Summarization Request
```javascript
POST https://api.openai.com/v1/chat/completions
{
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant..."
    },
    {
      role: "user", 
      content: "Please summarize this webpage..."
    }
  ],
  max_tokens: 150
}
```

### Search Request
```javascript
POST https://api.openai.com/v1/chat/completions
{
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: "You are a helpful assistant..."
    },
    {
      role: "user",
      content: "Here are my saved links: ... Question: ..."
    }
  ],
  max_tokens: 500
}
```

## Security Considerations

1. **API Key Storage**: 
   - Stored in browser's IndexedDB
   - Never transmitted except to OpenAI
   - Not synced across devices

2. **Content Security**:
   - Manifest V3 compliance
   - No inline scripts
   - Host permissions limited to OpenAI API

3. **Data Privacy**:
   - All data stored locally
   - No telemetry or tracking
   - User controls all data

## Extension Permissions

- `activeTab`: Access current tab information
- `storage`: Store data locally
- `tabs`: Query and access tabs
- `notifications`: Show save confirmations
- `scripting`: Extract page content

## Chrome Extension Lifecycle

```
Extension Installed
        │
        ▼
Service Worker Loaded (background.js)
        │
        ├─→ Database Initialized (db.js)
        │
        └─→ Event Listeners Registered
                │
                ├─→ Action Click Handler
                ├─→ Message Handlers
                └─→ Runtime Events
                        │
                        ▼
                Ready to Use!
```

## UI Components

### Popup Window (600x600px)
- **Header**: Title + Action Buttons
- **AI Search Section**: Input field + Ask button
- **Links List**: Scrollable list of saved links
- Each link shows:
  - Title (clickable)
  - URL (clickable)
  - Summary (in styled box)
  - Timestamp (relative)
  - Delete button

### Options Page
- **API Configuration**: Input field for API key
- **Test Connection**: Verify API key
- **About Section**: Extension information
- **How to Use**: Quick guide

## Future Enhancements

Possible additions:
- [ ] Tags/categories for links
- [ ] Export/import functionality
- [ ] Chrome sync support
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] Statistics dashboard
- [ ] Multiple AI model support
- [ ] Offline mode improvements
