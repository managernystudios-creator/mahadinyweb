// Carousel functionality for 2D and 3D carousels

// 3D Carousel functionality
class Carousel3D {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.videoCarouselContainer = document.getElementById('videoCarousel');
        this.categoryTitle = document.getElementById('categoryTitle');
        this.closeCarouselBtn = document.getElementById('closeCarousel');
        this.closeCarouselBottomBtn = document.getElementById('closeCarouselBottom');
        this.slider3D = this.videoCarouselContainer.querySelector('.carousel__slider');
        this.prevBtn3D = this.videoCarouselContainer.querySelector('.carousel__prev');
        this.nextBtn3D = this.videoCarouselContainer.querySelector('.carousel__next');
        
        this.items3D = [];
        this.width3D = 0;
        this.height3D = 0;
        this.totalWidth3D = 0;
        this.margin3D = 20;
        this.currIndex3D = 0;
        this.interval3D = null;
        this.intervalTime3D = 5000;
        this.selectedCategory = null;
        this.masterVideoData = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                if (this.selectedCategory === category) {
                    this.closeVideoCarousel();
                } else {
                    this.openVideoCarousel(category);
                }
            });
        });
        
        this.closeCarouselBtn.addEventListener('click', this.closeVideoCarousel.bind(this));
        this.closeCarouselBottomBtn.addEventListener('click', this.closeVideoCarousel.bind(this));
        this.prevBtn3D.addEventListener('click', this.prev3D.bind(this));
        this.nextBtn3D.addEventListener('click', this.next3D.bind(this));
        this.slider3D.addEventListener('mouseenter', () => clearInterval(this.interval3D));
        this.slider3D.addEventListener('mouseleave', this.timer3D.bind(this));
        window.addEventListener('resize', this.resize3D.bind(this));
    }
    
    setVideoData(videoData) {
        this.masterVideoData = videoData;
    }
    
    resize3D() {
        if (this.items3D.length === 0) return;
        const containerWidth = this.slider3D.parentElement.offsetWidth;
        this.width3D = containerWidth / (window.innerWidth < 768 ? 0.6 : 2.1);
        this.height3D = (this.width3D * (9 / 16)) + 90;
        this.totalWidth3D = this.width3D * this.items3D.length;
        this.slider3D.style.width = this.totalWidth3D + "px";
        this.items3D.forEach(item => {
            item.style.width = (this.width3D - this.margin3D * 2) + "px";
            item.style.height = this.height3D + "px";
        });
        this.move3D(this.currIndex3D, false);
    }
    
    move3D(index, animate = true) {
        if (this.items3D.length === 0) return;
        if (index < 0) index = this.items3D.length - 1;
        if (index >= this.items3D.length) index = 0;
        
        const iframes = this.slider3D.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.dataset.originalSrc) {
                iframe.dataset.originalSrc = iframe.src;
            }
            iframe.src = 'about:blank';
        });
        
        this.currIndex3D = index;
        const currentIframe = this.items3D[this.currIndex3D].querySelector('iframe');
        if (currentIframe) {
            currentIframe.src = currentIframe.dataset.originalSrc;
        }
        
        const centerX = this.slider3D.parentElement.offsetWidth / 2;
        const offset = centerX - this.width3D / 2;
        this.slider3D.style.transition = animate ? 'transform 1s ease-in-out' : 'none';
        this.slider3D.style.transform = `translate3d(${offset - this.width3D * index}px, 0, 0)`;
        
        this.items3D.forEach((item, i) => {
            item.classList.remove('carousel__slider__item--active', 'carousel__slider__item--prev', 'carousel__slider__item--next');
            const frame = item.querySelector('.item__3d-frame');
            frame.style.transition = animate ? 'transform 2s ease-in-out' : 'none';
            
            if (i === index) {
                item.classList.add('carousel__slider__item--active');
                frame.style.transform = "perspective(1200px)";
            } else if (i === (index - 1 + this.items3D.length) % this.items3D.length) {
                item.classList.add('carousel__slider__item--prev');
                frame.style.transform = "perspective(1200px) rotateY(40deg)";
            } else if (i === (index + 1) % this.items3D.length) {
                item.classList.add('carousel__slider__item--next');
                frame.style.transform = "perspective(1200px) rotateY(-40deg)";
            } else {
                frame.style.transform = "perspective(1200px) rotateY(" + (i < index ? 60 : -60) + "deg)";
            }
        });
    }
    
    timer3D() {
        clearInterval(this.interval3D);
        this.interval3D = setInterval(() => {
            this.move3D((this.currIndex3D + 1) % this.items3D.length);
        }, this.intervalTime3D);
    }
    
    prev3D() {
        this.move3D((this.currIndex3D - 1 + this.items3D.length) % this.items3D.length);
        this.timer3D();
    }
    
    next3D() {
        this.move3D((this.currIndex3D + 1) % this.items3D.length);
        this.timer3D();
    }
    
    initCarousel3D(videoData, startIndex = 0) {
        this.slider3D.innerHTML = '';
        this.items3D = [];
        clearInterval(this.interval3D);
        this.currIndex3D = startIndex;
        
        videoData.forEach(video => {
            const item = document.createElement('div');
            item.className = 'carousel__slider__item';
            item.innerHTML = `
                <div class="item__3d-frame">
                    <div class="item__3d-frame__box item__3d-frame__box--front">
                        <div class="video-container">
                            <iframe src="${video.src}" style="width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div class="item__info">
                            <h3 class="item__info__title">${video.title}</h3>
                        </div>
                    </div>
                    <div class="item__3d-frame__box item__3d-frame__box--left"></div>
                    <div class="item__3d-frame__box item__3d-frame__box--right"></div>
                </div>`;
            this.slider3D.appendChild(item);
            this.items3D.push(item);
        });
        
        if (this.items3D.length > 0) {
            setTimeout(() => {
                this.resize3D();
                this.move3D(this.currIndex3D, false);
                this.timer3D();
            }, 50);
        }
    }
    
    openVideoCarousel(category) {
        this.selectedCategory = category;
        this.categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        const videosForCategory = this.masterVideoData.filter(v => v.category === category);
        this.categoryTitle.textContent = category;
        
        // Start from subscriber count (last item) if available
        const startIndex = Math.max(0, videosForCategory.length - 1);
        this.initCarousel3D(videosForCategory, startIndex);
        
        this.videoCarouselContainer.classList.remove('hidden');
        this.videoCarouselContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    closeVideoCarousel() {
        clearInterval(this.interval3D);
        this.slider3D.querySelectorAll('iframe').forEach(iframe => {
            iframe.src = 'about:blank';
        });
        this.videoCarouselContainer.classList.add('hidden');
        this.selectedCategory = null;
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
    }
}

// 2D Carousel functionality
class Carousel2D {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.slider = this.container.querySelector('.carousel__slider');
        this.prevBtn = this.container.querySelector('.carousel__prev');
        this.nextBtn = this.container.querySelector('.carousel__next');
        this.originalItems = Array.from(this.slider.children);
        
        if (this.originalItems.length === 0) return;
        
        this.init();
    }
    
    init() {
        this.setupClones();
        this.setupEventListeners();
        this.resize();
        this.timer();
    }
    
    setupClones() {
        // Clone first and last items for seamless looping
        const firstClone = this.originalItems[0].cloneNode(true);
        const lastClone = this.originalItems[this.originalItems.length - 1].cloneNode(true);
        this.slider.appendChild(firstClone);
        this.slider.insertBefore(lastClone, this.originalItems[0]);
        
        this.items = Array.from(this.slider.children);
        this.numOriginal = this.originalItems.length;
        this.currIndex = 1; // Start at first original item
        this.itemWidth = 0;
        this.gap = 20;
        this.direction = 1; // 1 for forward, -1 for backward
        this.interval = null;
        this.intervalTime = 4000;
        this.isDown = false;
        this.startX = 0;
        this.scrollLeft = 0;
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        
        this.slider.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.slider.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.slider.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.slider.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.slider.addEventListener('mouseenter', () => clearInterval(this.interval));
        this.slider.addEventListener('mouseleave', this.timer.bind(this));
        this.slider.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
        
        window.addEventListener('resize', this.resize.bind(this));
    }
    
    resize() {
        if (this.items.length > 0) {
            this.itemWidth = this.items[0].offsetWidth;
            const style = window.getComputedStyle(this.slider);
            this.gap = parseInt(style.gap) || 20;
        }
        // Set initial position to first original item
        this.move(this.currIndex, false);
    }
    
    move(index, animate = true) {
        this.slider.style.transition = animate ? 'transform 0.5s ease' : 'none';
        const offset = -index * (this.itemWidth + this.gap);
        this.slider.style.transform = `translateX(${offset}px)`;
        this.currIndex = index;
    }
    
    handleTransitionEnd() {
        if (this.currIndex === 0) {
            // Jump to last original item without animation
            this.move(this.numOriginal, false);
        } else if (this.currIndex === this.items.length - 1) {
            // Jump to first original item without animation
            this.move(1, false);
        }
    }
    
    timer() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            // Ping-pong effect: reverse direction at ends
            if (this.currIndex <= 1) this.direction = 1;
            else if (this.currIndex >= this.numOriginal) this.direction = -1;
            this.move(this.currIndex + this.direction);
        }, this.intervalTime);
    }
    
    next() {
        this.move(this.currIndex + 1);
        this.timer();
    }
    
    prev() {
        this.move(this.currIndex - 1);
        this.timer();
    }
    
    handleMouseDown(e) {
        this.isDown = true;
        clearInterval(this.interval);
        this.slider.classList.add('is-dragging');
        this.startX = e.pageX - this.slider.offsetLeft;
        this.scrollLeft = this.slider.getBoundingClientRect().left;
    }
    
    handleMouseLeave() {
        this.isDown = false;
        this.slider.classList.remove('is-dragging');
        this.timer();
    }
    
    handleMouseUp() {
        this.isDown = false;
        this.slider.classList.remove('is-dragging');
        this.timer();
    }
    
    handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.slider.offsetLeft;
        const walk = (x - this.startX);
        
        const newTransform = this.scrollLeft - this.slider.parentElement.getBoundingClientRect().left + walk;
        this.slider.style.transition = 'none';
        this.slider.style.transform = `translateX(${newTransform}px)`;
    }
}

// Testimonial Carousel functionality
class TestimonialCarousel {
    constructor() {
        this.carousel = document.querySelector('.testimonial-carousel');
        if (!this.carousel) return;
        
        this.rafId = null;
        this.direction = -1; // -1: right-to-left, 1: left-to-right
        this.speedPxPerSec = 40; // adjusted for smoother motion
        this.lastTs = 0;
        this.paused = false;
        this.resumeTimeoutId = null;
        this.range = document.getElementById('testimonialRange');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAuto();
    }
    
    setupEventListeners() {
        // Do not pause on hover to prevent stutter; just reset timing baseline
        this.carousel.addEventListener('mouseenter', () => { this.lastTs = 0; });
        this.carousel.addEventListener('mouseleave', () => { this.lastTs = 0; });
        
        // Range control
        if (this.range) {
            this.range.addEventListener('input', this.handleRangeInput.bind(this));
            this.range.addEventListener('mousedown', () => { this.paused = true; });
            this.range.addEventListener('change', this.scheduleResume.bind(this));
            this.range.addEventListener('touchstart', () => { this.paused = true; }, { passive: true });
            this.range.addEventListener('touchend', this.scheduleResume.bind(this), { passive: true });
        }
        
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    getMaxScroll() {
        return Math.max(0, this.carousel.scrollWidth - this.carousel.clientWidth);
    }
    
    step(ts) {
        if (this.paused) { 
            this.rafId = requestAnimationFrame(this.step.bind(this)); 
            return; 
        }
        if (!this.lastTs) this.lastTs = ts;
        const dt = (ts - this.lastTs) / 1000; // seconds
        this.lastTs = ts;
        const delta = this.direction * this.speedPxPerSec * dt;
        this.carousel.scrollLeft += -delta; // invert because direction -1 means move content left
        const maxScroll = this.getMaxScroll();
        if (this.carousel.scrollLeft <= 0) { 
            this.carousel.scrollLeft = 0; 
            this.direction = -this.direction; 
        }
        else if (this.carousel.scrollLeft >= maxScroll) { 
            this.carousel.scrollLeft = maxScroll; 
            this.direction = -this.direction; 
        }
        // sync range
        if (this.range && maxScroll > 0) {
            const pct = (this.carousel.scrollLeft / maxScroll) * 100;
            this.range.value = String(Math.round(pct));
        }
        this.rafId = requestAnimationFrame(this.step.bind(this));
    }
    
    startAuto() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.lastTs = 0;
        this.rafId = requestAnimationFrame(this.step.bind(this));
    }
    
    stopAuto() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
    
    handleRangeInput() {
        this.paused = true;
        const maxScroll = this.getMaxScroll();
        this.carousel.scrollLeft = (parseInt(this.range.value, 10) / 100) * maxScroll;
        this.lastTs = 0;
        this.scheduleResume();
    }
    
    scheduleResume() {
        if (this.resumeTimeoutId) clearTimeout(this.resumeTimeoutId);
        this.resumeTimeoutId = setTimeout(() => { 
            this.paused = false; 
            this.resumeTimeoutId = null; 
        }, 700);
    }
    
    handleResize() {
        // ensure we bounce properly after resize
        const maxScroll = this.getMaxScroll();
        if (this.carousel.scrollLeft > maxScroll) { 
            this.carousel.scrollLeft = maxScroll; 
            this.direction = -1; 
        } 
    }
}

// Initialize carousels
let carousel3D, carousel2D, testimonialCarousel;

function initializeCarousels(videoData) {
    carousel3D = new Carousel3D();
    carousel3D.setVideoData(videoData);
    
    carousel2D = new Carousel2D('#shortFormCarouselContainer');
    
    testimonialCarousel = new TestimonialCarousel();
}

