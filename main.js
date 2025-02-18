// Constants
const STORAGE_KEY = 'selectedLanguage';
const DEFAULT_LANGUAGE = 'pl';
const SUPPORTED_LANGUAGES = ['pl', 'en'];

// Get the stored language or use default
let currentLanguage = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;

// DOM Elements
const languageSwitchButton = document.getElementById('langSwitch');
const servicesContainer = document.querySelector('#services-grid');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Custom error for language-related issues
class LanguageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LanguageError';
    }
}

/**
 * Updates all content on the page for the given language
 */
function updateContent(language) {
    try {
        validateLanguage(language);
        updateLanguageButton(language);
        updateTextContent(language);
        updateServicesSection(language);
        updateHtmlLangAttribute(language);
        currentLanguage = language;
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
 * Updates the language button display
 */
function updateLanguageButton(language) {
    if (!languageSwitchButton) return;
    languageSwitchButton.innerHTML = `
        <span class="${language === 'pl' ? 'opacity-100' : 'opacity-50'} hover:opacity-100 transition-opacity">PL</span>
        <span class="mx-1">|</span>
        <span class="${language === 'en' ? 'opacity-100' : 'opacity-50'} hover:opacity-100 transition-opacity">EN</span>
    `;
}

/**
 * Updates text content based on translations
 */
function updateTextContent(language) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        const translation = translations[language][key] || key;
        
        if (key === 'about-content') {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
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
    card.appendChild(title);

    if (service.items && service.items.length > 0) {
        const list = createServiceList(service.items);
        card.appendChild(list);
    } else if (service.description) {
        const description = document.createElement('p');
        description.className = 'mt-4 text-gray-600 leading-relaxed';
        description.textContent = service.description;
        card.appendChild(description);
    }
    
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
 * Updates the HTML lang attribute
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

// Mobile menu functionality
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
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
        try {
            const newLanguage = currentLanguage === 'pl' ? 'en' : 'pl';
            localStorage.setItem(STORAGE_KEY, newLanguage);
            updateContent(newLanguage);
        } catch (error) {
            handleError(error);
        }
    });
}
