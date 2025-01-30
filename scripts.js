document.addEventListener('DOMContentLoaded', function() {
    const slider = {
        container: document.querySelector('.slider-container'),
        slides: document.querySelector('.slides'),
        dots: document.querySelector('.slider-dots'),
        prevBtn: document.querySelector('.prev'),
        nextBtn: document.querySelector('.next'),
        progressBar: document.querySelector('.progress-bar'),
        slideItems: document.querySelectorAll('.slide'),
        currentSlide: 0,
        slideInterval: null,
        intervalDuration: 5000, // 5 seconds per slide
        
        init() {
            // Create dots
            this.createDots();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Show first slide
            this.showSlide(0);
            
            // Start autoplay
            this.startAutoplay();
        },
        
        createDots() {
            this.slideItems.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('data-slide', index);
                this.dots.appendChild(dot);
            });
        },
        
        setupEventListeners() {
            // Navigation buttons
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Dot navigation
            this.dots.addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    this.showSlide(slideIndex);
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });
            
            // Touch events
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
            
            // Pause autoplay on hover
            this.container.addEventListener('mouseenter', () => this.stopAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        },
        
        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        },
        
        showSlide(index) {
            // Remove active class from all slides and dots
            this.slideItems.forEach(slide => slide.classList.remove('active'));
            document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
            
            // Update current slide index
            this.currentSlide = index;
            
            // Handle wraparound
            if (this.currentSlide >= this.slideItems.length) {
                this.currentSlide = 0;
            } else if (this.currentSlide < 0) {
                this.currentSlide = this.slideItems.length - 1;
            }
            
            // Show current slide and dot
            this.slideItems[this.currentSlide].classList.add('active');
            document.querySelector(`.dot[data-slide="${this.currentSlide}"]`).classList.add('active');
            
            // Reset and start progress bar
            this.resetProgressBar();
        },
        
        nextSlide() {
            this.showSlide(this.currentSlide + 1);
        },
        
        prevSlide() {
            this.showSlide(this.currentSlide - 1);
        },
        
        startAutoplay() {
            this.stopAutoplay(); // Clear any existing interval
            this.slideInterval = setInterval(() => this.nextSlide(), this.intervalDuration);
            this.startProgressBar();
        },
        
        stopAutoplay() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
            this.stopProgressBar();
        },
        
        startProgressBar() {
            this.progressBar.style.transition = `width ${this.intervalDuration}ms linear`;
            this.progressBar.style.width = '100%';
        },
        
        stopProgressBar() {
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = '0';
        },
        
        resetProgressBar() {
            this.progressBar.style.width = '0';
            // Force reflow
            void this.progressBar.offsetWidth;
            this.startProgressBar();
        }
    };
    
    // Initialize the slider
    slider.init();
});