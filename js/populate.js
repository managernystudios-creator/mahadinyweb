// Functions to populate HTML elements with data from config.json

function populateNavigation(config) {
    document.title = `${config.siteTitle} - Professional Video Editing & Content Creation`;
    const logoLink = document.getElementById('site-logo-link');
    // Check if both the URL and Height properties exist
    if (config.siteLogoUrl && config.siteLogoUrl.trim() !== '' && config.siteLogoHeight) {
        // If a logo URL exists and is not empty, attempt to use it with graceful fallback on error
        logoLink.innerHTML = '';
        const img = document.createElement('img');
        img.src = config.siteLogoUrl;
        img.alt = `${config.siteTitle} logo`;
        img.style.height = config.siteLogoHeight;
        img.style.width = 'auto';
        img.onerror = () => {
            logoLink.innerHTML = `<div class="text-2xl font-bold text-primary">${config.siteTitle}</div>`;
        };
        logoLink.appendChild(img);
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

    // Initialize trusted brands using the dedicated module
    if (typeof initTrustedBrands === 'function') {
        initTrustedBrands(heroConfig.trustedBrands || []);
    }
}

function populateGraphics(graphicsConfig) {
    const grid = document.getElementById('artwork-grid');
    grid.innerHTML = '';
    // Only render thumbnails
    (graphicsConfig || []).filter(item => (item.category || '').toLowerCase() === 'thumbnails').forEach(item => {
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

                <div class="author-info">
                    <img src="${item.avatarUrl}" alt="Author Avatar" class="avatar">
                    <div>
                        <p class="author-name">${item.author}</p>
                        <p class="author-subs">${item.subs}</p>
                    </div>
                </div>
                <div>
                    <p class="review-text">"${item.text}"</p>
                    <div class="rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
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
    
    // Build all social links HTML at once
    const socialLinksHTML = contactConfig.socials.map(item => {
        // Format URL for display - show domain and path
        let displayUrl = item.url;
        if (item.url.startsWith('mailto:')) {
            displayUrl = item.url.replace('mailto:', '');
        } else if (item.url.startsWith('https://') || item.url.startsWith('http://')) {
            try {
                const url = new URL(item.url);
                displayUrl = url.hostname.replace('www.', '') + url.pathname;
            } catch (e) {
                displayUrl = item.url;
            }
        }
        
        const isDiscord = (item.title || '').toLowerCase() === 'discord' || (item.iconClass || '').includes('fa-discord') || (item.url || '').includes('discord');
        if (isDiscord) {
            // Render as plain, non-interactive text (no hover, no click)
            return `<span class="social-link" style="pointer-events: none; cursor: default;">
                <i class="${item.iconClass}"></i>
                <span class="social-text">${displayUrl}</span>
            </span>`;
        }
        
        return `<a href="${item.url}" title="${item.title}" class="social-link">
            <i class="${item.iconClass}"></i>
            <span class="social-text">${displayUrl}</span>
        </a>`;
    }).join('');
    
    socialLinks.innerHTML = socialLinksHTML;

    document.getElementById('footer-year').textContent = `© ${contactConfig.copyrightYear} All rights reserved`;

    // Footer logo link + image from config
    const footerLogoLink = document.getElementById('footer-logo-link');
    const footerLogoImg = document.getElementById('footer-logo-img');
    if (footerLogoLink && footerLogoImg) {
        const cfg = window.__siteConfig || {};
        const footerHref = cfg.footerLogoHref || '#';
        const footerImg = cfg.footerLogoUrl || cfg.siteLogoUrl || '';
        footerLogoLink.href = footerHref;
        footerLogoImg.src = footerImg;
        footerLogoImg.alt = 'NY Studios logo';
        footerLogoImg.onload = () => {
            footerLogoImg.style.display = 'block';
        };
        footerLogoImg.onerror = () => {
            footerLogoImg.style.display = 'none';
        };
    }
}

// Global helper: copy text to clipboard with brief feedback
window.copyToClipboard = function(text, el) {
    const write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(text)
        : new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try { document.execCommand('copy') ? resolve() : reject(); }
            catch (e) { reject(e); }
            finally { document.body.removeChild(textarea); }
        });
    write.then(() => {
        if (!el) return;
        const original = el.innerHTML;
        el.innerHTML = `<i class="fas fa-check"></i><span class="social-text">Clipboarded</span>`;
        setTimeout(() => { el.innerHTML = original; }, 1200);
    }).catch(() => {
        if (!el) return;
        const original = el.innerHTML;
        el.innerHTML = `<i class="fas fa-times"></i><span class="social-text">Copy failed</span>`;
        setTimeout(() => { el.innerHTML = original; }, 1200);
    });
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
