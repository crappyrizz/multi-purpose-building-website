// smooth scrolling

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // select all internal navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // only scroll if target exists
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ACTIVE NAV LINK =====

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop - sectionHeight / 3) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ===== LAZY LOADING =====
    initLazyLoading();
    initBackgroundLazyLoading();

    // ===== GALLERY SLIDER =====
    initGallerySlider();

    // ===== NAVBAR SHRINK =====
    initNavbarShrink();
});

// Lazy Loading Implementation
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Create new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    };
                    newImg.onerror = () => {
                        // Fallback to original if optimized fails
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    };
                    newImg.src = img.dataset.src;
                }
            });
        }, {
            rootMargin: '100px 0px', // Load 100px before entering viewport
            threshold: 0.01
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Background Image Lazy Loading
function initBackgroundLazyLoading() {
    const bgElements = document.querySelectorAll('[data-bg]');
    console.log('🔍 Found background elements:', bgElements.length);
    
    // Use IntersectionObserver for all background images (excluding CSS-based heroes)
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bgUrl = element.dataset.bg;
                    
                    console.log('🎯 Loading background on scroll:', bgUrl);
                    
                    // Preload background image
                    const img = new Image();
                    img.onload = () => {
                        element.style.backgroundImage = `url('${bgUrl}')`;
                        element.classList.add('bg-loaded');
                        console.log('✅ Background loaded:', bgUrl);
                        observer.unobserve(element);
                    };
                    img.onerror = () => {
                        console.error('❌ Failed to load background:', bgUrl);
                        // Try alternative path
                        const altBg = bgUrl.startsWith('./') ? bgUrl.substring(2) : './' + bgUrl;
                        console.log('🔄 Trying alternative background path:', altBg);
                        const altImg = new Image();
                        altImg.onload = () => {
                            element.style.backgroundImage = `url('${altBg}')`;
                            element.classList.add('bg-loaded');
                            console.log('✅ Alternative background worked:', altBg);
                            observer.unobserve(element);
                        };
                        altImg.onerror = () => {
                            console.error('❌ Both background paths failed:', bgUrl);
                            observer.unobserve(element);
                        };
                        altImg.src = altBg;
                    };
                    img.src = bgUrl;
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        bgElements.forEach(element => {
            bgObserver.observe(element);
        });
    } else {
        // Fallback
        bgElements.forEach(element => {
            element.style.backgroundImage = `url('${element.dataset.bg}')`;
        });
    }
}

// Gallery Slider Initialization
function initGallerySlider() {
    const sliderTrack = document.querySelector(".slider-track");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const dots = document.querySelectorAll(".dot");
    
    if (!sliderTrack) return; // Exit if no slider exists

    // Apply slide background images using lazy loading system
    const slideImages = document.querySelectorAll(".slide-image[data-bg]");
    slideImages.forEach(el => {
        const bg = el.getAttribute("data-bg");
        if (!bg) return;
        
        // Add lazy loading classes
        el.classList.add('lazy-bg');
        
        // Preload critical slider images immediately
        const img = new Image();
        img.onload = () => {
            el.style.backgroundImage = `url("${bg}")`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.style.backgroundRepeat = "no-repeat";
            el.classList.add('bg-loaded');
            console.log('✅ Image loaded successfully:', bg);
        };
        img.onerror = () => {
            console.error('❌ Failed to load image:', bg);
            // Try alternative path for GitHub Pages
            const altBg = bg.startsWith('./') ? bg.substring(2) : './' + bg;
            console.log('🔄 Trying alternative path:', altBg);
            const altImg = new Image();
            altImg.onload = () => {
                el.style.backgroundImage = `url("${altBg}")`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
                el.style.backgroundRepeat = "no-repeat";
                el.classList.add('bg-loaded');
                console.log('✅ Alternative path worked:', altBg);
            };
            altImg.onerror = () => {
                console.error('❌ Both paths failed for:', bg);
            };
            altImg.src = altBg;
        };
        img.src = bg;
    });

    // ===== Infinite loop setup (clone first & last) =====
    const originalSlides = Array.from(sliderTrack.querySelectorAll(".slide"));
    const originalTotalSlides = originalSlides.length;

    if (originalTotalSlides > 1) {
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalTotalSlides - 1].cloneNode(true);
        firstClone.classList.add("clone");
        lastClone.classList.add("clone");
        sliderTrack.appendChild(firstClone);
        sliderTrack.insertBefore(lastClone, sliderTrack.firstChild);
    }

    // Slides now includes clones (if added)
    const slides = Array.from(sliderTrack.querySelectorAll(".slide"));
    const totalSlides = slides.length;

    // Start on the first REAL slide (index 1 when clones exist)
    let currentIndex = originalTotalSlides > 1 ? 1 : 0;

    // Move slider
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active slide (CSS hides non-active slides)
        slides.forEach(slide => slide.classList.remove("active"));
        if (slides[currentIndex]) slides[currentIndex].classList.add("active");

        // Update dots
        dots.forEach(dot => dot.classList.remove("active"));
        // Map track index -> real slide index
        let realIndex = currentIndex;
        if (originalTotalSlides > 1) realIndex = currentIndex - 1;
        if (realIndex < 0) realIndex = originalTotalSlides - 1;
        if (realIndex >= originalTotalSlides) realIndex = 0;
        if (dots[realIndex]) dots[realIndex].classList.add("active");
    }

    // Next slide
    nextBtn.addEventListener("click", () => {
        currentIndex += 1;
        updateSlider();
    });

    // Previous slide
    prevBtn.addEventListener("click", () => {
        currentIndex -= 1;
        updateSlider();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            // Dots refer to REAL slides; map to track index
            currentIndex = originalTotalSlides > 1 ? index + 1 : index;
            updateSlider();
        });
    });

    // On transition end, if we're on a clone, jump (without animation) to matching real slide
    sliderTrack.addEventListener("transitionend", () => {
        if (originalTotalSlides <= 1) return;

        // If we've moved to the appended firstClone (after last real slide)
        if (currentIndex === originalTotalSlides + 1) {
            sliderTrack.style.transition = "none";
            currentIndex = 1; // first real slide
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Force reflow then restore transition
            void sliderTrack.offsetHeight;
            sliderTrack.style.transition = "";
            updateSlider();
        }

        // If we've moved to the prepended lastClone (before first real slide)
        if (currentIndex === 0) {
            sliderTrack.style.transition = "none";
            currentIndex = originalTotalSlides; // last real slide
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            void sliderTrack.offsetHeight;
            sliderTrack.style.transition = "";
            updateSlider();
        }
    });

    // ===============================
    // SLIDER AUTOPLAY + PAUSE ON HOVER
    // ===============================

    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 2000; // 2 seconds

    function startAutoplay() {
        if (!autoplayInterval) {
            autoplayInterval = setInterval(() => {
                currentIndex += 1;
                updateSlider();
            }, AUTOPLAY_DELAY);
        }
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }

    // Start autoplay on load
    startAutoplay();

    // Ensure initial state is visible
    updateSlider();

    // Pause on hover
    const gallerySlider = document.querySelector(".gallery-slider");

    if (gallerySlider) {
        gallerySlider.addEventListener("mouseenter", stopAutoplay);
        gallerySlider.addEventListener("mouseleave", startAutoplay);
    }
}

// Navbar Shrink Initialization
function initNavbarShrink() {
    const navbar = document.querySelector(".navbar");
    
    if (!navbar) return; // Exit if no navbar exists

    function handleNavbarShrink() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbarShrink);
}

// ===== UTILITIES =====

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Address copied to clipboard!');
        })
        .catch(() => {
            alert('Failed to copy address');
        });
}

