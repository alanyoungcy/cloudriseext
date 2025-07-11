// API configuration
const API_KEY = process.env.FREECURRECY_API_KEY || 'YOUR_API_KEY_HERE';
const TRANSLATION_KEY = process.env.TRANSLATION_KEY || 'YOUR_TRANSLATION_KEY_HERE';
const API_BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';
const TRANSLATION_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Currency data
const CURRENCIES = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'BGN', name: 'Bulgarian Lev' },
  { code: 'CZK', name: 'Czech Republic Koruna' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'HUF', name: 'Hungarian Forint' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'RON', name: 'Romanian Leu' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'ISK', name: 'Icelandic Króna' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'HRK', name: 'Croatian Kuna' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'ILS', name: 'Israeli New Sheqel' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'ZAR', name: 'South African Rand' }
];

// Translation languages
const LANGUAGES = [
  { code: 'auto', name: 'Detect language' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'uk', name: 'Ukrainian' }
];

// DOM elements
const elements = {
  amountFrom: document.getElementById('fx-amount-from'),
  amountTo: document.getElementById('fx-amount-to'),
  fromCurrency: document.getElementById('fx-from'),
  toCurrency: document.getElementById('fx-to'),
  fromDropdown: document.getElementById('fx-from-dropdown'),
  toDropdown: document.getElementById('fx-to-dropdown'),
  sourceLang: document.getElementById('source-lang'),
  targetLang: document.getElementById('target-lang'),
  sourceLangDropdown: document.getElementById('source-lang-dropdown'),
  targetLangDropdown: document.getElementById('target-lang-dropdown'),
  sourceText: document.getElementById('source-text'),
  targetText: document.getElementById('target-text'),
  swapButton: document.getElementById('swap-languages'),
  profitRate: document.getElementById('profit-rate'),
  profitMargin: document.getElementById('profit-margin'),
  profitQuote: document.getElementById('profit-quote')
};

// Language selector functions
const filterLanguages = (searchTerm) => {
  if (!searchTerm) return LANGUAGES;
  
  const term = searchTerm.toLowerCase();
  return LANGUAGES.filter(language => 
    language.code.toLowerCase().includes(term) || 
    language.name.toLowerCase().includes(term)
  );
};

// Currency selector functions
const filterCurrencies = (searchTerm) => {
  if (!searchTerm) return CURRENCIES;
  
  const term = searchTerm.toLowerCase();
  return CURRENCIES.filter(currency => 
    currency.code.toLowerCase().includes(term) || 
    currency.name.toLowerCase().includes(term)
  );
};

const populateLanguageDropdown = (dropdown, languages, selectedName = '') => {
  dropdown.innerHTML = '';
  
  languages.forEach(language => {
    const option = document.createElement('div');
    option.className = 'language-option';
    if (language.name === selectedName) {
      option.classList.add('selected');
    }
    
    option.innerHTML = language.name;
    
    option.addEventListener('click', () => {
      selectLanguage(dropdown, language.name, language.code);
    });
    
    dropdown.appendChild(option);
  });
};

const populateDropdown = (dropdown, currencies, selectedCode = '') => {
  dropdown.innerHTML = '';
  
  currencies.forEach(currency => {
    const option = document.createElement('div');
    option.className = 'currency-option';
    if (currency.code === selectedCode) {
      option.classList.add('selected');
    }
    
    option.innerHTML = `
      <span class="currency-code">${currency.code}</span>
      <span class="currency-name">${currency.name}</span>
    `;
    
    option.addEventListener('click', () => {
      selectCurrency(dropdown, currency.code);
    });
    
    dropdown.appendChild(option);
  });
};

const selectLanguage = (dropdown, name, code) => {
  const input = dropdown.previousElementSibling;
  input.value = name;
  input.dataset.previousValue = name;
  input.dataset.langCode = code;
  hideDropdown(dropdown);
  
  // Trigger translation if source text exists
  if (elements.sourceText.value.trim()) {
    translateText();
  }
};

const selectCurrency = (dropdown, code) => {
  const input = dropdown.previousElementSibling;
  input.value = code;
  input.dataset.previousValue = code;
  hideDropdown(dropdown);
  
  // Trigger exchange rate update
  triggerCurrencyUpdate();
};

// Smart function to determine which direction to calculate
const triggerCurrencyUpdate = async () => {
  if (isUpdating) return;
  
  const fromAmount = parseNumber(elements.amountFrom.value);
  const toAmount = parseNumber(elements.amountTo.value);
  
  // If both fields have values, prioritize the 'from' field
  // If only one field has a value, use that as the source
  if (fromAmount > 0) {
    isUpdating = true;
    await updateExchangeAmount('from');
    isUpdating = false;
  } else if (toAmount > 0) {
    isUpdating = true;
    await updateExchangeAmount('to');
    isUpdating = false;
  }
  // If neither field has a value, don't calculate anything
};

const showDropdown = (dropdown, input) => {
  const searchTerm = input.value;
  const filteredCurrencies = filterCurrencies(searchTerm);
  populateDropdown(dropdown, filteredCurrencies, input.value);
  dropdown.classList.add('show');
};

const hideDropdown = (dropdown) => {
  dropdown.classList.remove('show');
};

const validateLanguage = (input) => {
  const inputName = input.value;
  const language = LANGUAGES.find(l => l.name.toLowerCase() === inputName.toLowerCase());
  
  if (language) {
    input.value = language.name;
    input.dataset.langCode = language.code;
    return true;
  } else if (inputName === '') {
    return true; // Allow empty
  } else {
    // Invalid language, reset to previous valid value or default
    const previousValue = input.dataset.previousValue || (input.id === 'source-lang' ? 'Detect language' : 'English');
    input.value = previousValue;
    const prevLang = LANGUAGES.find(l => l.name === previousValue);
    if (prevLang) input.dataset.langCode = prevLang.code;
    return false;
  }
};

const validateCurrency = (input) => {
  const code = input.value.toUpperCase();
  const currency = CURRENCIES.find(c => c.code === code);
  
  if (currency) {
    input.value = currency.code;
    return true;
  } else if (code === '') {
    return true; // Allow empty
  } else {
    // Invalid currency, reset to previous valid value or default
    const previousValue = input.dataset.previousValue || (input.id === 'fx-from' ? 'USD' : 'CNY');
    input.value = previousValue;
    return false;
  }
};

// Translation functions
let translationTimeout;

const translateText = async () => {
  const sourceText = elements.sourceText.value.trim();
  const sourceLang = elements.sourceLang.dataset.langCode || 'auto';
  const targetLang = elements.targetLang.dataset.langCode || 'en';
  
  if (!sourceText) {
    elements.targetText.value = '';
    return;
  }
  
  // Skip translation if source and target are the same (except for auto-detect)
  if (sourceLang === targetLang && sourceLang !== 'auto') {
    elements.targetText.value = sourceText;
    return;
  }
  
  try {
    // Prepare request body
    const requestBody = {
      q: sourceText,
      target: targetLang,
      format: 'text'
    };
    
    // Only include source if not auto-detecting
    if (sourceLang !== 'auto') {
      requestBody.source = sourceLang;
    }
    
    const response = await fetch(`${TRANSLATION_API_URL}?key=${TRANSLATION_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const translation = data.data?.translations?.[0];
    
    if (translation?.translatedText) {
      elements.targetText.value = translation.translatedText;
      
      // Update source language if auto-detected
      if (sourceLang === 'auto' && translation.detectedSourceLanguage) {
        const detectedLang = LANGUAGES.find(l => l.code === translation.detectedSourceLanguage);
        if (detectedLang) {
          elements.sourceLang.value = detectedLang.name;
          elements.sourceLang.dataset.langCode = detectedLang.code;
          elements.sourceLang.dataset.previousValue = detectedLang.name;
        }
      }
    } else {
      throw new Error('No translation received');
    }
    
  } catch (error) {
    console.error('Translation error:', error);
    elements.targetText.value = `Translation error: ${error.message}`;
  }
};

const debouncedTranslate = () => {
  clearTimeout(translationTimeout);
  translationTimeout = setTimeout(translateText, 300);
};

const swapLanguages = () => {
  // Swap language inputs
  const sourceLangValue = elements.sourceLang.value;
  const sourceLangCode = elements.sourceLang.dataset.langCode;
  const targetLangValue = elements.targetLang.value;
  const targetLangCode = elements.targetLang.dataset.langCode;
  
  elements.sourceLang.value = targetLangValue;
  elements.sourceLang.dataset.langCode = targetLangCode;
  elements.sourceLang.dataset.previousValue = targetLangValue;
  
  elements.targetLang.value = sourceLangValue;
  elements.targetLang.dataset.langCode = sourceLangCode;
  elements.targetLang.dataset.previousValue = sourceLangValue;
  
  // Swap text content
  const sourceTextValue = elements.sourceText.value;
  const targetTextValue = elements.targetText.value;
  
  elements.sourceText.value = targetTextValue;
  elements.targetText.value = sourceTextValue;
  
  // Trigger translation if there's text
  if (elements.sourceText.value.trim()) {
    translateText();
  }
};

// Utility functions
const formatNumber = (value) => {
  if (!value || isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0
  }).format(value);
};

const parseNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Cache management
const getCacheKey = (from, to) => `fx_rate_${from}_${to}`;

const getCachedRate = async (from, to) => {
  try {
    const cacheKey = getCacheKey(from, to);
    const result = await chrome.storage.local.get([cacheKey]);
    const cached = result[cacheKey];
    
    if (cached && cached.timestamp) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_DURATION) {
        return cached.rate;
      }
    }
  } catch (error) {
    console.warn('Cache read error:', error);
  }
  return null;
};

const setCachedRate = async (from, to, rate) => {
  try {
    const cacheKey = getCacheKey(from, to);
    await chrome.storage.local.set({
      [cacheKey]: {
        rate: rate,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.warn('Cache write error:', error);
  }
};

// Currency conversion
const fetchExchangeRate = async (from, to) => {
  // Check if same currency
  if (from === to) return 1;
  
  // Check cache first
  const cachedRate = await getCachedRate(from, to);
  if (cachedRate !== null) {
    return cachedRate;
  }
  
  try {
    const url = `${API_BASE_URL}?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.data?.[to];
    
    if (rate === undefined) {
      throw new Error('Rate not found in response');
    }
    
    // Cache the rate
    await setCachedRate(from, to, rate);
    return rate;
    
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    // Return cached rate if available, even if expired
    const expiredRate = await getCachedRate(from, to);
    if (expiredRate !== null) {
      console.warn('Using expired cached rate due to fetch error');
      return expiredRate;
    }
    throw error;
  }
};

const updateExchangeAmount = async (sourceField = 'from') => {
  const fromCurrency = elements.fromCurrency.value;
  const toCurrency = elements.toCurrency.value;
  
  if (sourceField === 'from') {
    const amountFrom = parseNumber(elements.amountFrom.value);
    
    if (amountFrom === 0) {
      elements.amountTo.value = '';
      return;
    }
    
    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      const amountTo = amountFrom * rate;
      const rounded = Math.round(amountTo * 10000) / 10000; // Round to 4 decimals
      elements.amountTo.value = formatNumber(rounded);
    } catch (error) {
      console.error('Currency conversion error:', error);
      elements.amountTo.value = 'Error';
    }
  } else {
    // Convert from 'to' field to 'from' field
    const amountTo = parseNumber(elements.amountTo.value);
    
    if (amountTo === 0) {
      elements.amountFrom.value = '';
      return;
    }
    
    try {
      const rate = await fetchExchangeRate(toCurrency, fromCurrency);
      const amountFrom = amountTo * rate;
      const rounded = Math.round(amountFrom * 10000) / 10000; // Round to 4 decimals
      elements.amountFrom.value = formatNumber(rounded);
    } catch (error) {
      console.error('Currency conversion error:', error);
      elements.amountFrom.value = 'Error';
    }
  }
};

// Margin calculation
const updateMarginQuote = () => {
  const rate = parseNumber(elements.profitRate.value);
  const margin = parseNumber(elements.profitMargin.value);
  
  if (rate === 0) {
    elements.profitQuote.value = '';
    return;
  }
  
  // Formula: quote = rate * (1 + margin/100)
  const quote = rate * (1 + margin / 100);
  const rounded = Math.round(quote * 10000) / 10000; // Round to 4 decimals
  elements.profitQuote.value = formatNumber(rounded);
};

// Language selector setup
const setupLanguageSelector = (input, dropdown, isSource = true) => {
  // Store previous value and language code for validation
  input.dataset.previousValue = input.value;
  const initialLang = LANGUAGES.find(l => l.name === input.value);
  if (initialLang) {
    input.dataset.langCode = initialLang.code;
  }
  
  // Show dropdown on focus
  input.addEventListener('focus', () => {
    const searchTerm = input.value;
    const filteredLanguages = filterLanguages(searchTerm);
    populateLanguageDropdown(dropdown, filteredLanguages, input.value);
    dropdown.classList.add('show');
  });
  
  // Filter languages as user types
  input.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const filteredLanguages = filterLanguages(searchTerm);
    populateLanguageDropdown(dropdown, filteredLanguages);
    
    if (!dropdown.classList.contains('show')) {
      dropdown.classList.add('show');
    }
  });
  
  // Validate language on blur
  input.addEventListener('blur', async (e) => {
    // Small delay to allow click on dropdown option
    setTimeout(async () => {
      if (!dropdown.classList.contains('show')) {
        const wasValid = validateLanguage(input);
        
        if (wasValid && input.dataset.previousValue !== input.value) {
          input.dataset.previousValue = input.value;
          
          // Trigger translation if source text exists
          if (elements.sourceText.value.trim()) {
            translateText();
          }
        }
      }
    }, 200);
  });
  
  // Handle keyboard navigation
  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll('.language-option');
    const selectedOption = dropdown.querySelector('.language-option.selected');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!dropdown.classList.contains('show')) {
        const searchTerm = input.value;
        const filteredLanguages = filterLanguages(searchTerm);
        populateLanguageDropdown(dropdown, filteredLanguages, input.value);
        dropdown.classList.add('show');
      } else {
        const nextOption = selectedOption?.nextElementSibling || options[0];
        if (nextOption) {
          selectedOption?.classList.remove('selected');
          nextOption.classList.add('selected');
          nextOption.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (dropdown.classList.contains('show')) {
        const prevOption = selectedOption?.previousElementSibling || options[options.length - 1];
        if (prevOption) {
          selectedOption?.classList.remove('selected');
          prevOption.classList.add('selected');
          prevOption.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedOption) {
        const name = selectedOption.textContent;
        const lang = LANGUAGES.find(l => l.name === name);
        if (lang) {
          selectLanguage(dropdown, lang.name, lang.code);
        }
      } else {
        validateLanguage(input);
        hideDropdown(dropdown);
        if (elements.sourceText.value.trim()) {
          translateText();
        }
      }
    } else if (e.key === 'Escape') {
      hideDropdown(dropdown);
    }
  });
};

// Currency selector setup
const setupCurrencySelector = (input, dropdown, fieldType) => {
  // Store previous value for validation
  input.dataset.previousValue = input.value;
  input.dataset.fieldType = fieldType;
  
  // Show dropdown on focus
  input.addEventListener('focus', () => {
    showDropdown(dropdown, input);
  });
  
  // Filter currencies as user types
  input.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const filteredCurrencies = filterCurrencies(searchTerm);
    populateDropdown(dropdown, filteredCurrencies);
    
    if (!dropdown.classList.contains('show')) {
      dropdown.classList.add('show');
    }
  });
  
  // Validate currency on blur
  input.addEventListener('blur', async (e) => {
    // Small delay to allow click on dropdown option
    setTimeout(async () => {
      if (!dropdown.classList.contains('show')) {
        const wasValid = validateCurrency(input);
        
        if (wasValid && input.dataset.previousValue !== input.value) {
          input.dataset.previousValue = input.value;
          
          // Trigger exchange rate update based on which field has value
          await triggerCurrencyUpdate();
        }
      }
    }, 200);
  });
  
  // Handle keyboard navigation
  input.addEventListener('keydown', (e) => {
    const options = dropdown.querySelectorAll('.currency-option');
    const selectedOption = dropdown.querySelector('.currency-option.selected');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!dropdown.classList.contains('show')) {
        showDropdown(dropdown, input);
      } else {
        const nextOption = selectedOption?.nextElementSibling || options[0];
        if (nextOption) {
          selectedOption?.classList.remove('selected');
          nextOption.classList.add('selected');
          nextOption.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (dropdown.classList.contains('show')) {
        const prevOption = selectedOption?.previousElementSibling || options[options.length - 1];
        if (prevOption) {
          selectedOption?.classList.remove('selected');
          prevOption.classList.add('selected');
          prevOption.scrollIntoView({ block: 'nearest' });
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedOption) {
        const code = selectedOption.querySelector('.currency-code').textContent;
        selectCurrency(dropdown, code);
      } else {
        validateCurrency(input);
        hideDropdown(dropdown);
        triggerCurrencyUpdate();
      }
    } else if (e.key === 'Escape') {
      hideDropdown(dropdown);
    }
  });
};

// Global flag to prevent infinite loops during programmatic updates
let isUpdating = false;

// Event listeners
const setupEventListeners = () => {
  // Exchange section events
  elements.amountFrom.addEventListener('input', async (e) => {
    if (isUpdating) return;
    isUpdating = true;
    await updateExchangeAmount('from');
    isUpdating = false;
  });
  
  elements.amountTo.addEventListener('input', async (e) => {
    if (isUpdating) return;
    isUpdating = true;
    await updateExchangeAmount('to');
    isUpdating = false;
  });
  
  // Currency selector events
  setupCurrencySelector(elements.fromCurrency, elements.fromDropdown, 'from');
  setupCurrencySelector(elements.toCurrency, elements.toDropdown, 'to');
  
  // Translation selector events
  setupLanguageSelector(elements.sourceLang, elements.sourceLangDropdown, true);
  setupLanguageSelector(elements.targetLang, elements.targetLangDropdown, false);
  
  // Translation text events
  elements.sourceText.addEventListener('input', debouncedTranslate);
  
  // Swap languages button
  elements.swapButton.addEventListener('click', swapLanguages);
  
  // Click outside to close dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-selector') && !e.target.closest('.language-selector')) {
      hideDropdown(elements.fromDropdown);
      hideDropdown(elements.toDropdown);
      hideDropdown(elements.sourceLangDropdown);
      hideDropdown(elements.targetLangDropdown);
    }
  });
  
  // Profit section events
  elements.profitRate.addEventListener('keyup', updateMarginQuote);
  elements.profitMargin.addEventListener('keyup', updateMarginQuote);
  
  // Input validation - prevent negative values
  const numberInputs = [
    elements.amountFrom,
    elements.amountTo,
    elements.profitRate,
    elements.profitMargin
  ];
  
  numberInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      if (e.target.value < 0) {
        e.target.value = 0;
      }
    });
  });
};

// Initialize the popup
const init = () => {
  // Set default currency values if not already set
  if (!elements.fromCurrency.value) {
    elements.fromCurrency.value = 'USD';
  }
  if (!elements.toCurrency.value) {
    elements.toCurrency.value = 'CNY';
  }
  
  // Set default language values if not already set
  if (!elements.sourceLang.value) {
    elements.sourceLang.value = 'Detect language';
  }
  if (!elements.targetLang.value) {
    elements.targetLang.value = 'English';
  }
  
  // Initialize currency dropdowns
  populateDropdown(elements.fromDropdown, CURRENCIES, elements.fromCurrency.value);
  populateDropdown(elements.toDropdown, CURRENCIES, elements.toCurrency.value);
  
  // Initialize language dropdowns
  populateLanguageDropdown(elements.sourceLangDropdown, LANGUAGES, elements.sourceLang.value);
  populateLanguageDropdown(elements.targetLangDropdown, LANGUAGES, elements.targetLang.value);
  
  setupEventListeners();
  
  // Initial calculations if there are default values
  if (elements.amountFrom.value && parseNumber(elements.amountFrom.value) > 0) {
    updateExchangeAmount('from');
  } else if (elements.amountTo.value && parseNumber(elements.amountTo.value) > 0) {
    updateExchangeAmount('to');
  }
  
  if (elements.profitRate.value) {
    updateMarginQuote();
  }
  
  console.log('Quick FX & Margin extension initialized');
};

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 