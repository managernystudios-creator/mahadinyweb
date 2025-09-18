// Main application loader and initializer
document.addEventListener('DOMContentLoaded', () => {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            // expose for modules that may read it
            window.__siteConfig = config;
            // Apply theme first
            applyTheme(config.theme);
            
            // Call functions to populate the page with data from config.json
            populateNavigation(config);
            populateHero(config.hero);
            populateGraphics(config.graphics);
            populateTestimonials(config.testimonials);
            populateFaq(config.faq);
            populateWhyUs(config.whyUs);
            populateContact(config.contact);
            populateShortForm(config.shortFormData);
            
            // Initialize all the dynamic components
            initializePage(config);
        })
        .catch(error => console.error('Error loading config.json:', error));
});

