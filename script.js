// NEW: Main function to load config and initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            // -- Apply theme first --
            applyTheme(config.theme);
            
            // -- Call functions to populate the page with data from config.json --
            populateNavigation(config);
            populateHero(config.hero);
            populateGraphics(config.graphics);
            populateTestimonials(config.testimonials);
            populateFaq(config.faq);
            populateContact(config.contact);
            populateShortForm(config.shortFormData);
            
            // -- Initialize all the dynamic components --
            initializePage(config);
        })
        .catch(error => console.error('Error loading config.json:', error));
});

// --- NEW: Apply Theme Function ---
function applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply color variables
    if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVarName}`, value);
        });
    }
    
    // Apply typography
    if (theme.typography) {
        if (theme.typography.fontFamily) {
            document.body.style.fontFamily = theme.typography.fontFamily;
        }
        if (theme.typography.headingFont) {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                heading.style.fontFamily = theme.typography.headingFont;
            });
        }
    }
    
    // Apply layout variables
    if (theme.layout) {
        Object.entries(theme.layout).forEach(([key, value]) => {
            const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVarName}`, value);
        });
    }
    
    // Apply navigation styles
    if (theme.navigation) {
        const header = document.querySelector('.header');
        if (header && theme.navigation.backgroundColor) {
            header.style.background = theme.navigation.backgroundColor;
        }
        if (header && theme.navigation.backdropFilter) {
            header.style.backdropFilter = theme.navigation.backdropFilter;
        }
        if (header && theme.navigation.borderColor) {
            header.style.borderColor = theme.navigation.borderColor;
        }
        if (header && theme.navigation.borderRadius) {
            header.style.borderRadius = theme.navigation.borderRadius;
        }
    }
}


// --- NEW: Functions to Populate HTML from JSON ---

function populateNavigation(config) {
    document.title = `${config.siteTitle} - Professional Video Editing & Content Creation`;
    
    // Handle logo display
    const logoContainer = document.querySelector('.header .text-2xl');
    const logoLink = document.getElementById('site-logo-link');
    
    if (config.logo && config.logo.url && !config.logo.showText) {
        // Show logo image instead of text
        logoContainer.innerHTML = `<img src="${config.logo.url}" alt="${config.logo.altText || config.siteTitle}" style="width: ${config.logo.width || 'auto'}; height: ${config.logo.height || 'auto'}; max-height: 40px;">`;
    } else if (config.logo && config.logo.url && config.logo.showText) {
        // Show both logo and text
        logoContainer.innerHTML = `<img src="${config.logo.url}" alt="${config.logo.altText || config.siteTitle}" style="width: ${config.logo.width || 'auto'}; height: ${config.logo.height || 'auto'}; max-height: 32px; margin-right: 8px;"> ${config.siteTitle}`;
    } else {
        // Show only text (fallback)
        logoContainer.textContent = config.siteTitle;
    }
    
    const mainNav = document.getElementById('main-nav');
    const mobileMenu = document.getElementById('mobile-menu');
    mainNav.innerHTML = ''; // Clear existing links
    mobileMenu.innerHTML = ''; // Clear existing links

    config.navigation.forEach(item => {
        mainNav.innerHTML += `<a href="${item.href}" class="nav-link">${item.text}</a>`;
        mobileMenu.innerHTML += `<a href="${item.href}" class="mobile-nav-link">${item.text}</a>`;
    });
    mobileMenu.innerHTML += `<a href="#contact" class="mobile-nav-link">Contact</a>`; // Add static contact link
}

function populateHero(heroConfig) {
    document.getElementById('hero-title').textContent = heroConfig.title;
    document.getElementById('hero-subtitle').textContent = heroConfig.subtitle;
    document.getElementById('hero-description').textContent = heroConfig.description;

    const statsBar = document.getElementById('stats-bar');
    statsBar.innerHTML = '';
    heroConfig.stats.forEach(stat => {
        statsBar.innerHTML += `<div class="stat-item"> <div class="stat-number">${stat.number}</div> <div class="stat-label">${stat.label}</div> </div>`;
    });

    const brandsContainer = document.getElementById('brands-container');
    brandsContainer.innerHTML = '';
    const duplicatedBrands = [...heroConfig.trustedBrands, ...heroConfig.trustedBrands]; // Duplicate for smooth marquee
    duplicatedBrands.forEach(brand => {
        brandsContainer.innerHTML += `
            <div class="brand-item">
                <div class="brand-logo">${brand.logo}</div>
                <div class="brand-text">
                    <div class="brand-name">${brand.name}</div>
                    <div class="brand-subs">${brand.subs}</div>
                </div>
            </div>`;
    });
}

function populateGraphics(graphicsConfig) {
    const grid = document.getElementById('artwork-grid');
    grid.innerHTML = '';
    graphicsConfig.forEach(item => {
        grid.innerHTML += `
            <div class="artwork-card" data-category="${item.category}">
                <img src="${item.imageUrl}" alt="${item.title}">
                <div class="artwork-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
                <div class="artwork-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>`;
    });
}

function populateTestimonials(testimonialsConfig) {
    const carousel = document.getElementById('testimonial-carousel');
    carousel.innerHTML = '';
    testimonialsConfig.forEach(item => {
        carousel.innerHTML += `
            <div class="testimonial-card">
                <div>
                    <p class="review-text">"${item.text}"</p>
                    <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                </div>
                <div class="author-info">
                    <img src="${item.avatarUrl}" alt="Author Avatar" class="avatar">
                    <div>
                        <p class="author-name">${item.author}</p>
                        <p class="author-subs">${item.subs}</p>
                    </div>
                </div>
            </div>`;
    });
}

function populateFaq(faqConfig) {
    const container = document.getElementById('faq-container');
    container.innerHTML = '';
    faqConfig.forEach(item => {
        container.innerHTML += `
            <div class="faq-item" onclick="toggleFAQ(this)">
                <div class="faq-question">${item.question}<span>+</span></div>
                <div class="faq-answer">${item.answer}</div>
            </div>`;
    });
}

function populateContact(contactConfig) {
    document.getElementById('founder-name').textContent = contactConfig.name;
    document.getElementById('founder-role').textContent = contactConfig.role;
    document.getElementById('founder-bio').textContent = contactConfig.bio;

    const socialLinks = document.getElementById('social-links');
    socialLinks.innerHTML = '';
    contactConfig.socials.forEach(item => {
        socialLinks.innerHTML += `<a href="${item.url}" title="${item.title}"><i class="${item.iconClass}"></i></a>`;
    });

    document.getElementById('footer-year').textContent = `© ${contactConfig.copyrightYear} All rights reserved`;
}

function populateShortForm(shortFormConfig) {
    const slider = document.getElementById('shortFormSlider');
    slider.innerHTML = '';
    shortFormConfig.forEach(item => {
        slider.innerHTML += `
            <div class="carousel-item vertical">
                <iframe src="${item.src}" title="YouTube Short" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <div class="iframe-overlay"></div>
            </div>`;
    });
}

// --- Renamed the original DOMContentLoaded to initializePage ---
// This function now holds all the original logic that sets up event listeners, carousels, etc.
function initializePage(config) {
    // -- We get the master video data from the loaded config --
    const masterVideoData = config.videoData;
    
    // --- Navigation & Mobile Menu ---
    // (This part is now mostly static, but we'll re-add listeners)
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburgerBtn.addEventListener('click', () => { document.body.classList.toggle('mobile-nav-open'); document.body.classList.toggle('no-scroll'); });
    const closeMobileMenu = () => { document.body.classList.remove('mobile-nav-open'); document.body.classList.remove('no-scroll'); };
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => { link.addEventListener('click', closeMobileMenu); });
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.getElementById('main-nav').querySelectorAll('a.nav-link');
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.getElementById('main-nav').querySelector(`a[href="#${id}"]`);
                navLinks.forEach(link => link.classList.remove('active'));
                if(activeLink) { activeLink.classList.add('active'); }
            }
        });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => { sectionObserver.observe(section); });

    // --- 3D Carousel Data & Logic ---
    // (The rest of your original script content goes here, unchanged)
    const categoryButtons = document.querySelectorAll('.category-btn');
    const videoCarouselContainer = document.getElementById('videoCarousel');
    const categoryTitle = document.getElementById('categoryTitle');
    const closeCarouselBtn = document.getElementById('closeCarousel');
    const closeCarouselBottomBtn = document.getElementById('closeCarouselBottom');
    const slider3D = videoCarouselContainer.querySelector('.carousel__slider');
    const prevBtn3D = videoCarouselContainer.querySelector('.carousel__prev');
    const nextBtn3D = videoCarouselContainer.querySelector('.carousel__next');
    let items3D = [], width3D, height3D, totalWidth3D, margin3D = 20, currIndex3D = 0, interval3D, intervalTime3D = 5000, selectedCategory = null;
    const resize3D = () => { if (items3D.length === 0) return; const containerWidth = slider3D.parentElement.offsetWidth; width3D = containerWidth / (window.innerWidth < 768 ? 0.6 : 2.1); height3D = (width3D * (9 / 16)) + 90; totalWidth3D = width3D * items3D.length; slider3D.style.width = totalWidth3D + "px"; items3D.forEach(item => { item.style.width = (width3D - margin3D * 2) + "px"; item.style.height = height3D + "px"; }); move3D(currIndex3D, false); };
    const move3D = (index, animate = true) => { if (items3D.length === 0) return; if (index < 0) index = items3D.length - 1; if (index >= items3D.length) index = 0; const iframes = slider3D.querySelectorAll('iframe'); iframes.forEach(iframe => { if (!iframe.dataset.originalSrc) { iframe.dataset.originalSrc = iframe.src; } iframe.src = 'about:blank'; }); currIndex3D = index; const currentIframe = items3D[currIndex3D].querySelector('iframe'); if (currentIframe) { currentIframe.src = currentIframe.dataset.originalSrc; } const centerX = slider3D.parentElement.offsetWidth / 2; const offset = centerX - width3D / 2; slider3D.style.transition = animate ? 'transform 1s ease-in-out' : 'none'; slider3D.style.transform = `translate3d(${offset - width3D * index}px, 0, 0)`; items3D.forEach((item, i) => { item.classList.remove('carousel__slider__item--active', 'carousel__slider__item--prev', 'carousel__slider__item--next'); const frame = item.querySelector('.item__3d-frame'); frame.style.transition = animate ? 'transform 2s ease-in-out' : 'none'; if (i === index) item.classList.add('carousel__slider__item--active'), frame.style.transform = "perspective(1200px)"; else if (i === (index - 1 + items3D.length) % items3D.length) item.classList.add('carousel__slider__item--prev'), frame.style.transform = "perspective(1200px) rotateY(40deg)"; else if (i === (index + 1) % items3D.length) item.classList.add('carousel__slider__item--next'), frame.style.transform = "perspective(1200px) rotateY(-40deg)"; else frame.style.transform = "perspective(1200px) rotateY(" + (i < index ? 60 : -60) + "deg)"; }); };
    const timer3D = () => { clearInterval(interval3D); interval3D = setInterval(() => move3D((currIndex3D + 1) % items3D.length), intervalTime3D); };
    const prev3D = () => { move3D((currIndex3D - 1 + items3D.length) % items3D.length); timer3D(); };
    const next3D = () => { move3D((currIndex3D + 1) % items3D.length); timer3D(); };
    const initCarousel3D = (videoData) => { slider3D.innerHTML = ''; items3D = []; clearInterval(interval3D); currIndex3D = 0; videoData.forEach(video => { const item = document.createElement('div'); item.className = 'carousel__slider__item'; item.innerHTML = `<div class="item__3d-frame"><div class="item__3d-frame__box item__3d-frame__box--front"><div class="video-container"><iframe src="${video.src}" style="width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="item__info"><h3 class="item__info__title">${video.title}</h3></div></div><div class="item__3d-frame__box item__3d-frame__box--left"></div><div class="item__3d-frame__box item__3d-frame__box--right"></div></div>`; slider3D.appendChild(item); items3D.push(item); }); if (items3D.length > 0) { setTimeout(() => { resize3D(); timer3D(); }, 50); } };
    const openVideoCarousel = (category) => { selectedCategory = category; categoryButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category)); const videosForCategory = masterVideoData.filter(v => v.category === category); categoryTitle.textContent = category; initCarousel3D(videosForCategory); videoCarouselContainer.classList.remove('hidden'); videoCarouselContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    const closeVideoCarousel = () => { clearInterval(interval3D); slider3D.querySelectorAll('iframe').forEach(iframe => { iframe.src = 'about:blank'; }); videoCarouselContainer.classList.add('hidden'); selectedCategory = null; categoryButtons.forEach(btn => btn.classList.remove('active')); };
    categoryButtons.forEach(btn => { btn.addEventListener('click', () => { const category = btn.dataset.category; if (selectedCategory === category) closeVideoCarousel(); else openVideoCarousel(category); }); });
    closeCarouselBtn.addEventListener('click', closeVideoCarousel); closeCarouselBottomBtn.addEventListener('click', closeVideoCarousel); prevBtn3D.addEventListener('click', prev3D); nextBtn3D.addEventListener('click', next3D); slider3D.addEventListener('mouseenter', () => clearInterval(interval3D)); slider3D.addEventListener('mouseleave', timer3D); window.addEventListener('resize', resize3D);

    
    // --- START: NEW 2D Carousel Function ---
    const create2dCarousel = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const slider = container.querySelector('.carousel__slider');
        const prevBtn = container.querySelector('.carousel__prev');
        const nextBtn = container.querySelector('.carousel__next');
        const items = Array.from(slider.children);
        if (items.length === 0) return; // Don't run if no items

        let currIndex = 0;
        let itemWidth = 0;
        let gap = 20; // Default gap
        let interval, intervalTime = 4000;
        let isDown = false, startX, scrollLeft;

        const resize = () => {
            if (items.length > 0) {
                itemWidth = items[0].offsetWidth;
                const style = window.getComputedStyle(slider);
                gap = parseInt(style.gap) || 20;
            }
            move(currIndex, false);
        };

        const move = (index, animate = true) => {
            if (index < 0) index = 0;
            if (index > items.length - 1) index = items.length - 1;
            currIndex = index;
            
            const offset = -currIndex * (itemWidth + gap);
            slider.style.transition = animate ? 'transform 0.5s ease' : 'none';
            slider.style.transform = `translateX(${offset}px)`;
        };
        
        const timer = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                let nextIndex = currIndex + 1;
                if (nextIndex >= items.length) nextIndex = 0;
                move(nextIndex);
            }, intervalTime);
        };

        const prev = () => { move(currIndex - 1); timer(); };
        const next = () => { move(currIndex + 1); timer(); };

        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            clearInterval(interval);
            slider.classList.add('is-dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.getBoundingClientRect().left;
        });
        
        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('is-dragging'); timer(); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('is-dragging'); timer(); });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX);
            
            const newTransform = scrollLeft - slider.parentElement.getBoundingClientRect().left + walk;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(${newTransform}px)`;
        });
        
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', timer);
        
        window.addEventListener('resize', resize);
        resize();
        timer();
    };

    create2dCarousel('#shortFormCarouselContainer');


    // --- Artwork Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const artworkCards = document.querySelectorAll('.artwork-card');
    filterButtons.forEach(button => { button.addEventListener('click', () => { filterButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); const filter = button.getAttribute('data-filter'); artworkCards.forEach(card => { if (filter === 'all' || card.getAttribute('data-category') === filter) { card.style.display = 'block'; } else { card.style.display = 'none'; } }); }); });

    // --- Poison Water Effect ---
    const waterLayer = document.getElementById('waterLayer');
    let lastScrollY = 0;
    window.addEventListener('scroll', () => { const scrollY = window.scrollY; if (scrollY > lastScrollY && scrollY > 50) waterLayer.classList.add('drain'), waterLayer.classList.remove('splash'); else if (scrollY < lastScrollY) waterLayer.classList.add('splash'), waterLayer.classList.remove('drain'); if (scrollY < 10) waterLayer.classList.add('splash'), waterLayer.classList.remove('drain'); lastScrollY = scrollY; });

    // --- Drag to scroll for Testimonial Carousel ONLY ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        let isDown = false, startX, scrollLeft;
        testimonialCarousel.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - testimonialCarousel.offsetLeft; scrollLeft = testimonialCarousel.scrollLeft; });
        testimonialCarousel.addEventListener('mouseleave', () => { isDown = false; });
        testimonialCarousel.addEventListener('mouseup', () => { isDown = false; });
        testimonialCarousel.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - testimonialCarousel.offsetLeft; const walk = (x - startX) * 2; testimonialCarousel.scrollLeft = scrollLeft - walk; });
    }

    // --- Stats Counter Animation ---
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const animateCountUp = (el) => { const finalValueString = el.textContent; const suffix = finalValueString.replace(/[0-9.]/g, ''); const target = parseFloat(finalValueString); if (isNaN(target)) return; let startTimestamp = null; const duration = 2000; const step = (timestamp) => { if (!startTimestamp) startTimestamp = timestamp; const progress = Math.min((timestamp - startTimestamp) / duration, 1); const easedProgress = 1 - Math.pow(1 - progress, 3); const currentValue = Math.floor(easedProgress * target); el.textContent = currentValue + suffix; if (progress < 1) { window.requestAnimationFrame(step); } else { el.textContent = finalValueString; } }; el.textContent = '0' + suffix; window.requestAnimationFrame(step); };
        const observer = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { document.querySelectorAll('.stat-number').forEach(el => { if (!el.dataset.animated) { animateCountUp(el); el.dataset.animated = 'true'; } }); observer.unobserve(entry.target); } }); }, { threshold: 0.5 });
        observer.observe(statsBar);
    }
}

// --- FAQ toggle ---
// This needs to be in the global scope so the `onclick` attribute can find it
function toggleFAQ(item) { item.classList.toggle('active'); const icon = item.querySelector('.faq-question span'); icon.textContent = item.classList.contains('active') ? '−' : '+'; }
