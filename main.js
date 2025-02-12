// Constants
const SUPPORTED_LANGUAGES = ['pl', 'en'];
const DEFAULT_LANGUAGE = 'pl';

// State
let currentLanguage = DEFAULT_LANGUAGE;

// DOM Elements
const languageSwitchButton = document.getElementById('langSwitch');
const servicesContainer = document.querySelector('#services-grid');

// Custom error for language-related issues
class LanguageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LanguageError';
    }
}

/**
 * Updates the content of the page based on the selected language
 * @param {string} targetLanguage - The language code to switch to
 * @throws {LanguageError} If the language is not supported
 */
function updateContent(targetLanguage) {
    try {
        validateLanguage(targetLanguage);
        updateTextContent(targetLanguage);
        updateServicesSection(targetLanguage);
        updateLanguageButton(targetLanguage);
        updateHtmlLangAttribute(targetLanguage);
        currentLanguage = targetLanguage;
    } catch (error) {
        handleError(error);
    }
}

/**
 * Validates if the language is supported
 * @param {string} language - The language code to validate
 * @throws {LanguageError} If the language is not supported
 */
function validateLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        throw new LanguageError(`Unsupported language: ${language}. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`);
    }
}

/**
 * Updates all text content elements with translations
 * @param {string} language - The language code to use for translations
 */
function updateTextContent(language) {
    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = getTranslation(language, key);
        
        if (key === 'about-content') {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
}

/**
 * Gets translation for a specific key
 * @param {string} language - The language code
 * @param {string} key - The translation key
 * @returns {string} The translated text
 */
function getTranslation(language, key) {
    try {
        return translations[language][key] || key;
    } catch (error) {
        console.error(`Translation missing for key: ${key} in language: ${language}`);
        return key;
    }
}

/**
 * Updates the services section with translated content
 * @param {string} language - The language code
 */
function updateServicesSection(language) {
    if (!servicesContainer) return;

    servicesContainer.innerHTML = '';
    const services = translations[language].services || [];
    
    services.forEach(service => {
        const card = createServiceCard(service);
        servicesContainer.appendChild(card);
    });
}

/**
 * Creates a service card element
 * @param {Object} service - The service data
 * @returns {HTMLElement} The created service card
 */
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:border-accent transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1';
    
    const title = createServiceTitle(service.title);
    const list = createServiceList(service.items);
    
    card.appendChild(title);
    card.appendChild(list);
    
    return card;
}

/**
 * Creates a service title element
 * @param {string} titleText - The title text
 * @returns {HTMLElement} The created title element
 */
function createServiceTitle(titleText) {
    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold mb-4 text-gray-900 border-b pb-2 border-gray-100';
    title.textContent = titleText;
    return title;
}

/**
 * Creates a service list element
 * @param {string[]} items - Array of service items
 * @returns {HTMLElement} The created list element
 */
function createServiceList(items) {
    const list = document.createElement('ul');
    list.className = 'space-y-3 text-gray-600';
    
    items.forEach(item => {
        const listItem = createServiceListItem(item);
        list.appendChild(listItem);
    });
    
    return list;
}

/**
 * Creates a service list item element
 * @param {string} itemText - The item text
 * @returns {HTMLElement} The created list item element
 */
function createServiceListItem(itemText) {
    const listItem = document.createElement('li');
    listItem.className = 'flex items-start group';
    listItem.innerHTML = `
        <svg class="w-5 h-5 mt-0.5 mr-3 text-accent group-hover:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="group-hover:text-gray-900 transition-colors">${itemText}</span>
    `;
    return listItem;
}

/**
 * Updates the language switch button text
 * @param {string} language - The current language code
 */
function updateLanguageButton(language) {
    if (languageSwitchButton) {
        languageSwitchButton.textContent = language === 'pl' ? 'EN' : 'PL';
    }
}

/**
 * Updates the HTML lang attribute
 * @param {string} language - The language code
 */
function updateHtmlLangAttribute(language) {
    document.documentElement.lang = language;
}

/**
 * Handles errors in the application
 * @param {Error} error - The error to handle
 */
function handleError(error) {
    if (error instanceof LanguageError) {
        console.error(`Language Error: ${error.message}`);
    } else {
        console.error(`Unexpected error: ${error.message}`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateContent(currentLanguage);
    } catch (error) {
        handleError(error);
    }
});

if (languageSwitchButton) {
    languageSwitchButton.addEventListener('click', () => {
        const newLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
        updateContent(newLanguage);
    });
}
