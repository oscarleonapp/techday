/**
 * SERCO-SIT Enterprise Design System
 * JavaScript for Enhanced UX/UI Interactions
 * Version: 2.0
 */

// ==========================================================================
// 1. INITIALIZATION & DOM READY
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=€ SERCO-SIT Enterprise Design System initialized');

    // Initialize all modules
    initSmoothScroll();
    initPageTransitions();
    initCardAnimations();
    initNavigationEnhancements();
    initAccessibilityFeatures();
    initLazyLoading();
    initPerformanceOptimizations();
});

// ==========================================================================
// 2. SMOOTH SCROLL BEHAVIOR
// ==========================================================================

function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// ==========================================================================
// 3. PAGE TRANSITIONS & LOADING
// ==========================================================================

function initPageTransitions() {
    // Fade in page on load
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        // Small delay for smoother transition
        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 50);
    });

    // Show loading state on navigation
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't apply to external links
            if (this.hostname !== window.location.hostname) return;

            const href = this.getAttribute('href');
            if (href && href !== '#') {
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
            }
        });
    });
}

// ==========================================================================
// 4. CARD ANIMATIONS & HOVER EFFECTS
// ==========================================================================

function initCardAnimations() {
    const cards = document.querySelectorAll('.Card_principal, .Card_principal1, .columna, .columna_indice, .columna_tema, .boxshadow');

    cards.forEach(card => {
        // Enhanced hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        // Add subtle parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const maxRotation = 2; // degrees

            this.style.transform = `
                perspective(1000px)
                rotateY(${percentX * maxRotation}deg)
                rotateX(${-percentY * maxRotation}deg)
                translateY(-4px)
            `;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to cards on page load
    const animatedElements = document.querySelectorAll('.Card_principal, .columna_tema');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================================================
// 5. NAVIGATION ENHANCEMENTS
// ==========================================================================

function initNavigationEnhancements() {
    // Add active state to navigation links
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .enlace_volver');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.href).pathname;
        if (linkPath === currentPath) {
            link.style.fontWeight = '700';
            link.style.color = 'var(--accent-blue)';
        }
    });

    // Sticky navigation on scroll
    let lastScroll = 0;
    const nav = document.querySelector('nav');

    if (nav) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                nav.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }
}

// ==========================================================================
// 6. ACCESSIBILITY FEATURES
// ==========================================================================

function initAccessibilityFeatures() {
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('[role="dialog"]');
            if (modal && modal.style.display !== 'none') {
                modal.style.display = 'none';
                // Return focus to trigger element if stored
                const trigger = modal.dataset.trigger;
                if (trigger) {
                    document.querySelector(trigger)?.focus();
                }
            }
        }

        // Tab trap for modals
        if (e.key === 'Tab') {
            const modal = document.querySelector('[role="dialog"]:not([style*="display: none"])');
            if (modal) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    // Add skip to main content link
    if (!document.querySelector('.skip-to-main')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-to-main';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-blue);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 0 0 4px 0;
            z-index: 100;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Improve focus visibility
    const style = document.createElement('style');
    style.textContent = `
        :focus-visible {
            outline: 3px solid var(--accent-blue);
            outline-offset: 2px;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================================================
// 7. LAZY LOADING IMAGES
// ==========================================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// ==========================================================================
// 8. PERFORMANCE OPTIMIZATIONS
// ==========================================================================

function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            // Your scroll handler here
            checkScrollPosition();
        });
    });

    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResize();
        }, 250);
    });
}

function checkScrollPosition() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    // Show scroll to top button if scrolled more than 20%
    if (scrollPercent > 20) {
        showScrollToTop();
    } else {
        hideScrollToTop();
    }
}

function handleResize() {
    // Handle responsive adjustments
    const width = window.innerWidth;
    console.log('Window resized to:', width);
}

// ==========================================================================
// 9. SCROLL TO TOP BUTTON
// ==========================================================================

function showScrollToTop() {
    let scrollBtn = document.getElementById('scroll-to-top');

    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-to-top';
        scrollBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
        `;

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(0) scale(1.1)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        document.body.appendChild(scrollBtn);
    }

    scrollBtn.style.opacity = '1';
    scrollBtn.style.transform = 'translateY(0)';
}

function hideScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.transform = 'translateY(100px)';
    }
}

// ==========================================================================
// 10. UTILITY FUNCTIONS
// ==========================================================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// 11. ANALYTICS & TRACKING (Optional)
// ==========================================================================

function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', { category, action, label });

    // Integrate with your analytics platform
    // Example: gtag('event', action, { event_category: category, event_label: label });
}

// Track page views
window.addEventListener('load', function() {
    trackEvent('Page', 'View', window.location.pathname);
});

// Track button clicks
document.querySelectorAll('.enlace, .enlace_proceso, .enlace_contraste').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Button', 'Click', this.textContent.trim());
    });
});

// ==========================================================================
// 12. ERROR HANDLING
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can send errors to a logging service here
});

// ==========================================================================
// 13. SERVICE WORKER REGISTRATION (PWA Support)
// ==========================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('ServiceWorker registered:', registration))
        //     .catch(error => console.log('ServiceWorker registration failed:', error));
    });
}

// ==========================================================================
// Export functions for external use
// ==========================================================================

window.SERCO = {
    trackEvent,
    debounce,
    throttle
};

console.log(' All enterprise UX enhancements loaded successfully');
