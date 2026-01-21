/**
 * HEAR ME OUT - Malaysian Hip-Hop Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeroCarousel();
    initStickyHeader();
    initBackToTop();
    initScrollAnimations();
    initDropdownMenus();
    initViewToggle();
    initVideoCards();
    initSearchOverlay();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');

    if (mobileToggle && navMenu) {
        // Toggle menu
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close button in mobile menu
        if (navClose) {
            navClose.addEventListener('click', function() {
                closeMenu();
            });
        }

        // Close menu when clicking outside (on overlay)
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when clicking on a non-dropdown link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if this is a dropdown toggle
                const parentItem = this.closest('.nav-item');
                if (parentItem && parentItem.classList.contains('has-dropdown')) {
                    // Don't close menu, let dropdown handler manage it
                    return;
                }

                if (window.innerWidth <= 992) {
                    closeMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        function closeMenu() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            // Also close any open dropdowns
            document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
                item.classList.remove('dropdown-open');
            });
        }
    }
}

/**
 * Hero Carousel
 */
function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 6000; // 6 seconds

    function showSlide(index) {
        // Handle wrap around
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        currentSlide = index;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoPlay();
        }
    });

    // Start autoplay
    startAutoPlay();
}

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    const mainNav = document.querySelector('.main-nav');
    if (!header || !mainNav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            mainNav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            header.classList.add('scrolled');
        } else {
            mainNav.style.boxShadow = 'none';
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.slide-left, .slide-right, .slide-up, .feature-content, .feature-image');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Also animate cards on scroll
    const cards = document.querySelectorAll('.content-card, .news-card, .event-card, .product-card, .artist-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        cardObserver.observe(card);
    });
}

/**
 * Dropdown Menus (Mobile)
 */
function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');

        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                item.classList.toggle('dropdown-open');

                // Close other dropdowns
                dropdownItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('dropdown-open');
                    }
                });
            }
        });
    });
}

/**
 * View Toggle (Grid/List)
 */
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const videoGrid = document.getElementById('videoGrid');

    if (!viewBtns.length || !videoGrid) return;

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;

            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update grid layout
            if (view === 'list') {
                videoGrid.style.gridTemplateColumns = '1fr';
                videoGrid.querySelectorAll('.content-card').forEach(card => {
                    card.style.display = 'grid';
                    card.style.gridTemplateColumns = '300px 1fr';
                    card.querySelector('.card-media').style.aspectRatio = '16/9';
                });
            } else {
                videoGrid.style.gridTemplateColumns = '';
                videoGrid.querySelectorAll('.content-card').forEach(card => {
                    card.style.display = '';
                    card.style.gridTemplateColumns = '';
                });
            }
        });
    });
}

/**
 * Video Cards Interaction
 */
function initVideoCards() {
    const playBtns = document.querySelectorAll('.play-btn');

    playBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Here you would typically open a video modal
            // For now, let's show an alert
            const card = this.closest('.content-card');
            const title = card.querySelector('.card-title').textContent;

            // Create and show a simple modal
            showVideoModal(title);
        });
    });
}

/**
 * Video Modal (Simple implementation)
 */
function showVideoModal(title) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <div class="video-modal-body">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <p>Video: ${title}</p>
                    <span>Video player would appear here</span>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .video-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .video-modal-content {
            position: relative;
            width: 90%;
            max-width: 900px;
            background: #151515;
            border-radius: 12px;
            overflow: hidden;
        }
        .video-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            transition: background 0.3s;
        }
        .video-modal-close:hover {
            background: rgba(255,255,255,0.2);
        }
        .video-modal-body {
            aspect-ratio: 16/9;
        }
        .video-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
        }
        .video-placeholder i {
            font-size: 80px;
            color: #81d742;
            margin-bottom: 20px;
        }
        .video-placeholder p {
            font-size: 18px;
            color: white;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close handlers
    const closeBtn = modal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            style.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

/**
 * Search Overlay
 */
function initSearchOverlay() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;

    if (!searchToggle || !searchOverlay) return;

    // Toggle search overlay
    searchToggle.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus on input after animation
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    });

    // Close search overlay
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            closeSearchOverlay();
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });

    // Close when clicking outside
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }
    });

    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
    }

    // Search form submission
    const searchForm = searchOverlay.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                console.log('Searching for:', query);
                // Here you would typically redirect to search results
                // window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

/**
 * Newsletter Form
 */
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;
            const checkbox = this.querySelector('input[type="checkbox"]').checked;

            if (!checkbox) {
                alert('Please agree to receive marketing emails.');
                return;
            }

            // Simulate form submission
            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Subscribing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Subscribed!';
                btn.style.background = 'linear-gradient(135deg, #00a7ef 0%, #0077b6 100%)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
});

/**
 * Lazy Loading Images
 */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

/**
 * Smooth Scroll for Anchor Links
 */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * Filter Select Enhancement
 */
document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-select');

    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const value = this.value;
            const name = this.options[0].text;

            console.log(`Filter ${name}: ${value || 'All'}`);

            // Here you would typically filter the content
            // For now, just add a visual feedback
            this.style.borderColor = value ? '#81d742' : '#2a2a2a';
        });
    });
});

/**
 * Artist Card Hover Effect
 */
document.addEventListener('DOMContentLoaded', function() {
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.artist-image').style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.artist-image').style.transform = '';
        });
    });
});

/**
 * Category Card Ripple Effect
 */
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(129, 215, 66, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

/**
 * Console Easter Egg
 */
console.log('%c🎤 HEAR ME OUT 🎤', 'font-size: 24px; font-weight: bold; color: #81d742;');
console.log('%cMalaysian Hip-Hop Platform', 'font-size: 14px; color: #666;');
console.log('%c----------------------------', 'color: #333;');
console.log('%cBuilt with ❤️ for the culture', 'font-size: 12px; color: #888;');
