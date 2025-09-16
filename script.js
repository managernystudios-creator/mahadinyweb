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
            populateWhyUs(config.whyUs);
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
    const logoLink = document.getElementById('site-logo-link');
    // Check if both the URL and Height properties exist
    if (config.siteLogoUrl && config.siteLogoUrl.trim() !== '' && config.siteLogoHeight) {
        // If a logo URL exists and is not empty, use it
        // THIS IS THE KEY CHANGE: We use ${config.siteLogoHeight} instead of "32px"
        logoLink.innerHTML = `<img src="${config.siteLogoUrl}" alt="${config.siteTitle} logo" style="height: ${config.siteLogoHeight}; width: auto;">`;
    } else {
        // Otherwise, fall back to the site title text
        logoLink.innerHTML = `<div class="text-2xl font-bold text-primary">${config.siteTitle}</div>`;
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

    // Tools we master - from config
    const toolsContainer = document.getElementById('tools-container');
    if (toolsContainer) {
        toolsContainer.innerHTML = '';
        (heroConfig.tools || []).forEach(tool => {
            // Supports: iconUrl (image), label + className (chip style), or just label
            if (tool.iconUrl) {
                toolsContainer.innerHTML += `<div class="chip" title="${tool.title || tool.label || ''}" style="background:#0e0e0e; padding: 0; overflow: hidden;"><img src="${tool.iconUrl}" alt="${tool.title || tool.label || ''}" style="width: 40px; height: 40px; object-fit: contain; display:block;"></div>`;
            } else {
                const classes = ['chip'];
                if (tool.className) classes.push(tool.className);
                const text = tool.label || (tool.title ? tool.title[0] : '?');
                toolsContainer.innerHTML += `<div class="${classes.join(' ')}" title="${tool.title || tool.label || ''}">${text}</div>`;
            }
        });
    }

    const statsBar = document.getElementById('stats-bar');
    statsBar.innerHTML = '';
    heroConfig.stats.forEach(stat => {
        statsBar.innerHTML += `<div class="stat-item"> <div class="stat-number">${stat.number}</div> <div class="stat-label">${stat.label}</div> </div>`;
    });

    const brandsContainer = document.getElementById('brands-container');
    brandsContainer.innerHTML = '';
    const duplicatedBrands = [...(heroConfig.trustedBrands || []), ...(heroConfig.trustedBrands || [])];
    duplicatedBrands.forEach(brand => {
        const subs = brand.subs || '';
        const name = brand.name || '';
        const initial = name ? name.charAt(0).toUpperCase() : '?';
        const title = name ? `title="${name}"` : '';
        const content = `
            <div class="brand-logo">${initial}</div>
            <div class="brand-text">
                <div class="brand-name-box"><span class="brand-name">${name}</span></div>
                <div class="brand-subs">${subs}</div>
            </div>`;
        if (brand.ytUrl) {
            brandsContainer.innerHTML += `<a class="brand-item" href="${brand.ytUrl}" target="_blank" rel="noopener" ${title}>${content}</a>`;
        } else {
            brandsContainer.innerHTML += `<div class="brand-item" ${title}>${content}</div>`;
        }
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

function populateWhyUs(whyUsConfig) {
    if (!whyUsConfig) return;
    const titleEl = document.getElementById('whyus-title');
    const subtitleEl = document.getElementById('whyus-subtitle');
    const boxesEl = document.getElementById('whyus-boxes');
    if (!titleEl || !subtitleEl || !boxesEl) return;

    titleEl.textContent = whyUsConfig.title || '';
    subtitleEl.textContent = whyUsConfig.subtitle || '';

    boxesEl.innerHTML = '';
    (whyUsConfig.comparisonBoxes || []).forEach(box => {
        const isPro = (box.type || '').toLowerCase() === 'pro';
        const cardBorder = isPro ? 'hsl(var(--primary))' : 'hsl(var(--border))';
        const titleColor = isPro ? 'hsl(var(--primary))' : 'hsl(var(--foreground))';
        const glow = isPro ? '0 0 20px hsl(var(--primary) / 0.3)' : 'var(--shadow-card)';

        const card = document.createElement('div');
        card.className = 'card p-8';
        card.style.borderColor = cardBorder;
        card.style.boxShadow = glow;
        card.innerHTML = `
            <h3 class="text-2xl font-bold mb-4" style="color:${titleColor}">${box.title || ''}</h3>
            <ul style="list-style: none; padding-left: 0; display: grid; gap: 0.75rem;">
                ${(box.points || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        boxesEl.appendChild(card);
    });
}

function populateContact(contactConfig) {
    document.getElementById('founder-name').textContent = contactConfig.name;
    document.getElementById('founder-role').textContent = contactConfig.role;
    const bioEl = document.getElementById('founder-bio');
    const fullBio = contactConfig.bio || '';
    const bioHtml = (fullBio || '').replace(/\n/g, '<br>');
    bioEl.innerHTML = bioHtml;

    // Always add Read more / Show less toggle (default collapsed)
    bioEl.classList.add('collapsed');
    let isCollapsed = true;
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'bio-toggle';
    toggleBtn.textContent = 'Read more';
    toggleBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        bioEl.classList.toggle('collapsed', isCollapsed);
        toggleBtn.textContent = isCollapsed ? 'Read more' : 'Show less';
    });
    bioEl.after(toggleBtn);

    // --- CHANGE START: Populate founder avatar ---
    const avatarContainer = document.getElementById('founder-avatar');
    if (contactConfig.avatarUrl && contactConfig.avatarUrl.trim() !== '') {
        // If an avatar URL is provided, use it
        avatarContainer.style.background = 'none'; // Remove gradient background
        avatarContainer.innerHTML = `<img src="${contactConfig.avatarUrl}" alt="${contactConfig.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
        // Fallback to the first initial of the name
        const initial = contactConfig.name ? contactConfig.name.charAt(0).toUpperCase() : '';
        avatarContainer.textContent = initial;
    }
    // --- CHANGE END ---

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

    // --- Auto ping-pong for Testimonial Carousel + custom range scrollbar ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        let rafId = null;
        let direction = -1; // -1: right-to-left, 1: left-to-right
        let speedPxPerSec = 40; // adjusted for smoother motion
        let lastTs = 0;
        let paused = false;
        let resumeTimeoutId = null;
        const range = document.getElementById('testimonialRange');

        const getMaxScroll = () => Math.max(0, testimonialCarousel.scrollWidth - testimonialCarousel.clientWidth);

        const step = (ts) => {
            if (paused) { rafId = requestAnimationFrame(step); return; }
            if (!lastTs) lastTs = ts;
            const dt = (ts - lastTs) / 1000; // seconds
            lastTs = ts;
            const delta = direction * speedPxPerSec * dt;
            testimonialCarousel.scrollLeft += -delta; // invert because direction -1 means move content left
            const maxScroll = getMaxScroll();
            if (testimonialCarousel.scrollLeft <= 0) { testimonialCarousel.scrollLeft = 0; direction = -direction; }
            else if (testimonialCarousel.scrollLeft >= maxScroll) { testimonialCarousel.scrollLeft = maxScroll; direction = -direction; }
            // sync range
            if (range && maxScroll > 0) {
                const pct = (testimonialCarousel.scrollLeft / maxScroll) * 100;
                range.value = String(Math.round(pct));
            }
            rafId = requestAnimationFrame(step);
        };

        const startAuto = () => { if (rafId) cancelAnimationFrame(rafId); lastTs = 0; rafId = requestAnimationFrame(step); };
        const stopAuto = () => { if (rafId) cancelAnimationFrame(rafId); rafId = null; };

        // Do not pause on hover to prevent stutter; just reset timing baseline
        testimonialCarousel.addEventListener('mouseenter', () => { lastTs = 0; });
        testimonialCarousel.addEventListener('mouseleave', () => { lastTs = 0; });

        // Range control
        if (range) {
            const scheduleResume = () => {
                if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
                resumeTimeoutId = setTimeout(() => { paused = false; resumeTimeoutId = null; }, 700);
            };
            range.addEventListener('input', () => {
                paused = true;
                const maxScroll = getMaxScroll();
                testimonialCarousel.scrollLeft = (parseInt(range.value, 10) / 100) * maxScroll;
                lastTs = 0;
                scheduleResume();
            });
            range.addEventListener('mousedown', () => { paused = true; });
            range.addEventListener('change', () => { scheduleResume(); });
            range.addEventListener('touchstart', () => { paused = true; }, { passive: true });
            range.addEventListener('touchend', () => { scheduleResume(); }, { passive: true });
        }
        window.addEventListener('resize', () => { /* ensure we bounce properly after resize */ const maxScroll = getMaxScroll(); if (testimonialCarousel.scrollLeft > maxScroll) { testimonialCarousel.scrollLeft = maxScroll; direction = -1; } });

        startAuto();
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
