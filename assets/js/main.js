// smooth scrolling

// select all internal navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // only scroll if the target exists
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

// ===============================
// PHASE 3A: GALLERY SLIDER
// ===============================

const sliderTrack = document.querySelector(".slider-track");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const dots = document.querySelectorAll(".dot");

// Apply slide background images from data-bg attributes
const slideImages = document.querySelectorAll(".slide-image[data-bg]");
slideImages.forEach(el => {
    const bg = el.getAttribute("data-bg");
    if (!bg) return;
    el.style.backgroundImage = `url("${bg}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
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

// On transition end, if we're on a clone, jump (without animation) to the matching real slide
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
// PHASE 3B: NAVBAR SHRINK ON SCROLL
// ===============================

const navbar = document.querySelector(".navbar");

function handleNavbarShrink() {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleNavbarShrink);

// ===============================
// PHASE 4B: SLIDER AUTOPLAY + PAUSE ON HOVER
// ===============================

let autoplayInterval = null;
const AUTOPLAY_DELAY = 2000; // 5 seconds

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

gallerySlider.addEventListener("mouseenter", stopAutoplay);
gallerySlider.addEventListener("mouseleave", startAutoplay);
