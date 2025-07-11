# Quick FX & Margin Chrome Extension

I vibe coded a Chrome extension for currency conversion, translation of response and margin calculations, designed for amazon traders and professionals.

## Features

- **Dedicated Window**: Opens in a persistent window that stays open until closed
- **Currency Exchange**: Real-time conversion between 33+ major world currencies
- **Searchable Currency Selector**: Type to search currencies by code (USD) or name (US Dollar)
- **Translation**: Real-time text translation powered by Google Cloud Translation API
- **Auto Language Detection**: Automatically detects the source language when typing
- **Margin Calculator**: Calculate profit quotes with customizable margin percentages
- **Smart Caching**: 12-hour cache for exchange rates to save API quota
- **Dark Mode**: Automatic dark/light theme based on system preference
- **Offline Fallback**: Uses cached rates when API is unavailable
- **Keyboard Navigation**: Arrow keys, Enter, and Escape support for all selectors

## Setup & Installation

### 1. Get API Keys

**FreeCurrencyAPI Key:**
1. Visit [FreeCurrencyAPI.com](https://freecurrencyapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

**Google Cloud Translation API Key:**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Translation API
4. Create credentials (API key)
5. Copy your API key

### 2. Environment Setup

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```
   FREECURRECY_API_KEY=your_actual_api_key_here
   TRANSLATION_KEY=your_google_cloud_translation_api_key_here
   ```

### 3. Build the Extension

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build for production:
   ```bash
   npm run build
   ```
   
   Or watch for development:
   ```bash
   npm run watch
   ```

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder (created after build)
5. The extension icon should appear in your toolbar

## Usage

### Opening the Extension

- **Click the extension icon** in your Chrome toolbar
- **A dedicated window opens** (400×650px) that stays open until you close it
- **Single window mode**: Clicking the icon again focuses the existing window instead of opening multiple windows
- **Persistent**: The window remains open even when you switch between Chrome tabs or other applications

### Currency Exchange

1. Enter amount in either currency field (both are editable)
2. **Select currencies** using the searchable fields:
   - Click on currency field or start typing
   - Search by currency code (e.g., "EUR", "JPY") or name (e.g., "Euro", "Yen")
   - Use arrow keys to navigate, Enter to select, Escape to close
   - Click on any currency from the dropdown list
3. Conversion happens automatically in both directions
4. **Supported currencies**: EUR, USD, JPY, GBP, CHF, CAD, CNY, AUD, and 25+ more

### Translation

1. **Select languages** using searchable dropdowns:
   - Source language: Choose "Detect language" for auto-detection or specific language
   - Target language: Choose your desired output language
   - Use the swap button (⇄) to quickly reverse translation direction
2. **Type or paste text** in the left textarea
3. **Translation appears automatically** as you type (300ms delay)
4. **Auto-detection**: When "Detect language" is selected, the source language updates automatically
5. **Supported languages**: 30+ languages including English, Chinese, Spanish, French, German, Japanese, Korean, Arabic, and more

### Margin Calculator

1. Enter the base rate/price
2. Enter desired margin percentage (e.g., 15 for 15%)
3. Quote price is calculated automatically using: `quote = rate × (1 + margin/100)`

## Rate Caching System

- Exchange rates are cached locally for 12 hours
- Reduces API calls and improves performance
- Cached data is stored using Chrome's storage API
- Falls back to expired cache if API is unavailable

### Cache Management

Cache keys are stored as: `fx_rate_${fromCurrency}_${toCurrency}`

Each cache entry contains:
- `rate`: The exchange rate value
- `timestamp`: When the rate was fetched

Cache is automatically cleaned up when expired entries are accessed.

## Development

### File Structure

```
├── env.example          # Environment variables template
├── package.json         # npm configuration and scripts
├── build.js            # Build configuration
├── manifest.json        # Chrome extension manifest
├── background.js        # Service worker for window management
├── popup.html          # Extension window HTML
├── popup.css           # Styling with dark mode support
├── popup.js            # Main functionality
├── icons/              # Extension icons
│   └── 128.png        # 128x128 icon (placeholder)
└── README.md          # This file
```

### Build Process

The extension uses Webpack with the `dotenv-webpack` plugin to:
- Bundle the JavaScript code
- Inject environment variables at build time
- Create a production-ready distribution

### Development Scripts

- `npm run build` - Production build
- `npm run watch` - Development build with file watching

### API Integration

The extension integrates with FreeCurrencyAPI using:
- Endpoint: `https://api.freecurrencyapi.com/v1/latest`
- Parameters: `apikey`, `base_currency`, `currencies`
- Response format: `{ data: { [currency]: rate } }`

## Customization

### Supported Currencies

The extension supports 33 major world currencies:

| Code | Currency Name | Code | Currency Name |
|------|---------------|------|---------------|
| EUR | Euro | USD | US Dollar |
| JPY | Japanese Yen | BGN | Bulgarian Lev |
| CZK | Czech Republic Koruna | DKK | Danish Krone |
| GBP | British Pound Sterling | HUF | Hungarian Forint |
| PLN | Polish Zloty | RON | Romanian Leu |
| SEK | Swedish Krona | CHF | Swiss Franc |
| ISK | Icelandic Króna | NOK | Norwegian Krone |
| HRK | Croatian Kuna | RUB | Russian Ruble |
| TRY | Turkish Lira | AUD | Australian Dollar |
| BRL | Brazilian Real | CAD | Canadian Dollar |
| CNY | Chinese Yuan | HKD | Hong Kong Dollar |
| IDR | Indonesian Rupiah | ILS | Israeli New Sheqel |
| INR | Indian Rupee | KRW | South Korean Won |
| MXN | Mexican Peso | MYR | Malaysian Ringgit |
| NZD | New Zealand Dollar | PHP | Philippine Peso |
| SGD | Singapore Dollar | THB | Thai Baht |
| ZAR | South African Rand |  |  |

### Adding More Currencies

To add additional currencies:

1. Update the `CURRENCIES` array in `popup.js`
2. The API supports many more currencies - check FreeCurrencyAPI documentation

### Modifying Cache Duration

Change `CACHE_DURATION` in `popup.js`:
```javascript
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
```

### Styling

The extension supports system-level dark mode via `prefers-color-scheme`.
Customize colors by modifying CSS custom properties in `popup.css`.

## Troubleshooting

### Common Issues

1. **"Error" in conversion field**
   - Check your API key in `.env` (should be `FREECURRECY_API_KEY=your_key`)
   - Verify internet connection
   - Check browser console for detailed errors

2. **"Translation error" message**
   - Check your Google Cloud Translation API key in `.env` (should be `TRANSLATION_KEY=your_key`)
   - Ensure the Cloud Translation API is enabled in Google Cloud Console
   - Verify API quotas haven't been exceeded
   - Check browser console for detailed error messages

3. **Extension not loading**
   - Ensure you've run `npm run build`
   - Load the `dist` folder, not the source folder
   - Check for JavaScript errors in the console

4. **API quota exceeded**
   - The free tier has usage limits
   - Extension uses caching to minimize API calls
   - Consider upgrading your FreeCurrencyAPI plan

### Browser Console

Check the browser console in the extension popup for detailed error messages:
1. Right-click the extension popup
2. Select "Inspect"
3. Check the Console tab

## License

ISC License - See package.json for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request 