// UI interactions, effects, and event handlers

// Navigation and mobile menu functionality
class Navigation {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburger-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.getElementById('main-nav').querySelectorAll('a.nav-link');
        this.viewWorkBtn = document.getElementById('view-work-btn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollObserver();
    }
    
    setupEventListeners() {
        this.hamburgerBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        this.mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', this.closeMobileMenu.bind(this));
        });

        // No special handler for view-work button since it is now a direct anchor link
    }
    
    toggleMobileMenu() {
        document.body.classList.toggle('mobile-nav-open');
        document.body.classList.toggle('no-scroll');
    }
    
    closeMobileMenu() {
        document.body.classList.remove('mobile-nav-open');
        document.body.classList.remove('no-scroll');
    }

    handleViewWorkClick() {
        // Prefer the graphics/templates section if present
        const graphicsSection = document.getElementById('graphics');
        const servicesSection = document.getElementById('services');
        const targetSection = graphicsSection || servicesSection;
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // If services is visible, open a category (Gaming preferred)
        if (servicesSection) {
            const gamingBtn = document.querySelector('.category-btn[data-category="Gaming"]');
            const fallbackBtn = document.querySelector('.category-btn');
            const targetBtn = gamingBtn || fallbackBtn;
            if (targetBtn) targetBtn.click();
        }
    }
    
    setupScrollObserver() {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.getElementById('main-nav').querySelector(`a[href="#${id}"]`);
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if(activeLink) { 
                        activeLink.classList.add('active'); 
                    }
                }
            });
        }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
        
        this.sections.forEach(section => { 
            sectionObserver.observe(section); 
        });
    }
}

// Artwork filter functionality
class ArtworkFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.artworkGrid = document.getElementById('artwork-grid');
        this.artworkCards = []; // Initialize as empty, will be populated dynamically
        this.filterState = 'hidden'; // possible states: hidden, thumbnails, graphics
        this.currentFilter = 'thumbnails';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.artworkGrid.classList.add('hidden');
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.filterState === 'hidden') {
                    this.filterState = 'thumbnails';
                    this.currentFilter = 'thumbnails';
                    button.textContent = 'Thumbnails';
                    this.filterArtwork(this.currentFilter);
                    this.artworkGrid.classList.remove('hidden');
                } else if (this.filterState === 'thumbnails') {
                    this.filterState = 'graphics';
                    this.currentFilter = 'graphics';
                    button.textContent = 'thumbnails';
                    this.filterArtwork(this.currentFilter);
                    this.artworkGrid.classList.remove('hidden');
                } else { // filterState is 'graphics'
                this.filterState = 'hidden';
                button.textContent = 'Thumbnails';
                this.artworkGrid.classList.add('hidden');
            }

                this.updateButtonStates();
            });
        });
    }

    updateButtonStates() {
        this.filterButtons.forEach(btn => {
            if (this.filterState !== 'hidden') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    filterArtwork(filter) {
        // Always re-select cards to get the latest set
        this.artworkCards = document.querySelectorAll('.artwork-card');
        this.artworkCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Poison water effect
class WaterEffect {
    constructor() {
        this.waterLayer = document.getElementById('waterLayer');
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > this.lastScrollY && scrollY > 50) {
            this.waterLayer.classList.add('drain');
            this.waterLayer.classList.remove('splash');
        } else if (scrollY < this.lastScrollY) {
            this.waterLayer.classList.add('splash');
            this.waterLayer.classList.remove('drain');
        }
        
        if (scrollY < 10) {
            this.waterLayer.classList.add('splash');
            this.waterLayer.classList.remove('drain');
        }
        
        this.lastScrollY = scrollY;
    }
}

// Stats counter animation
class StatsCounter {
    constructor() {
        this.statsBar = document.querySelector('.stats-bar');
        
        this.init();
    }
    
    init() {
        if (this.statsBar) {
            this.setupObserver();
        }
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stat-number').forEach(el => {
                        if (!el.dataset.animated) {
                            this.animateCountUp(el);
                            el.dataset.animated = 'true';
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.statsBar);
    }
    
    animateCountUp(el) {
        const finalValueString = el.textContent;
        const suffix = finalValueString.replace(/[0-9.]/g, '');
        const target = parseFloat(finalValueString);
        
        if (isNaN(target)) return;
        
        let startTimestamp = null;
        const duration = 2000;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easedProgress * target);
            el.textContent = currentValue + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = finalValueString;
            }
        };
        
        el.textContent = '0' + suffix;
        window.requestAnimationFrame(step);
    }
}

// FAQ toggle functionality
function toggleFAQ(item) {
    item.classList.toggle('active');
    const icon = item.querySelector('.faq-question span');
    icon.textContent = item.classList.contains('active') ? '−' : '+';
}

// Initialize all interactions
function initializeInteractions() {
    new Navigation();
    new ArtworkFilter();
    new WaterEffect();
    new StatsCounter();
}

// Make toggleFAQ globally available for onclick attributes
window.toggleFAQ = toggleFAQ;