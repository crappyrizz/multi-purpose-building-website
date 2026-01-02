// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some animation on scroll (optional)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(card);
});

// Gallery filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Add fade-in animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Initialize gallery items with transition styles
    galleryItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const shareFacebook = lightbox.querySelector('.share-btn.facebook');
    const shareTwitter = lightbox.querySelector('.share-btn.twitter');
    const downloadBtn = lightbox.querySelector('.download-btn');

    let currentImageIndex = 0;
    let visibleImages = [];

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const imageSrc = this.querySelector('.gallery-image').style.backgroundImage;
            const imageUrl = imageSrc.replace('url("', '').replace('")', '');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');

            // Update visible images array based on current filter
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            visibleImages = Array.from(galleryItems).filter(item => {
                return activeFilter === 'all' || item.classList.contains(activeFilter);
            });

            currentImageIndex = visibleImages.indexOf(this);

            openLightbox(imageUrl, title, description);
        });
    });

    function openLightbox(imageSrc, title, description) {
        lightboxImage.src = imageSrc;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;

        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Progressive loading effect
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 100);
    }

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Navigation
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    function showPrevImage() {
        if (visibleImages.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            updateLightboxImage();
        }
    }

    function showNextImage() {
        if (visibleImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            updateLightboxImage();
        }
    }

    function updateLightboxImage() {
        const currentItem = visibleImages[currentImageIndex];
        const imageSrc = currentItem.querySelector('.gallery-image').style.backgroundImage;
        const imageUrl = imageSrc.replace('url("', '').replace('")', '');
        const title = currentItem.getAttribute('data-title');
        const description = currentItem.getAttribute('data-description');

        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = imageUrl;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            lightboxImage.style.opacity = '1';
        }, 200);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    // Social sharing
    shareFacebook.addEventListener('click', function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this amazing gym facility: ${lightboxTitle.textContent}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    });

    shareTwitter.addEventListener('click', function() {
        const text = encodeURIComponent(`Check out this amazing gym facility: ${lightboxTitle.textContent} ${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    });

    // Download functionality (placeholder - would need server-side implementation for actual download)
    downloadBtn.addEventListener('click', function() {
        // For demo purposes, show alert. In production, this would trigger a download
        alert('High-resolution download available for business inquiries. Please contact us for access.');
    });
});

// Car Wash Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    // View toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const galleryContents = document.querySelectorAll('.gallery-content');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // View toggle
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');

            // Remove active class from all toggle buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Hide all gallery contents
            galleryContents.forEach(content => content.classList.remove('active'));
            // Show selected view
            document.getElementById(view + '-view').classList.add('active');
        });
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Initialize gallery items with transition styles
    galleryItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
    });

    // Before/After Slider Functionality
    const sliderContainers = document.querySelectorAll('.before-after-container');
    const mainSlider = document.querySelector('.slider-container');

    function initSlider(container) {
        const sliderHandle = container.querySelector('.slider-handle');
        const sliderButton = container.querySelector('.slider-button');
        const percentage = container.querySelector('.percentage');
        const afterImage = container.querySelector('.after-image');
        let isDragging = false;

        function updateSlider(position) {
            const containerRect = container.getBoundingClientRect();
            let x = position - containerRect.left;
            x = Math.max(0, Math.min(x, containerRect.width));

            const percentageValue = (x / containerRect.width) * 100;
            afterImage.style.clipPath = `inset(0 ${100 - percentageValue}% 0 0)`;
            sliderHandle.style.left = `${percentageValue}%`;

            if (percentage) {
                percentage.textContent = Math.round(percentageValue) + '%';
            }
        }

        sliderHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        container.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        container.addEventListener('click', (e) => {
            if (!isDragging) {
                updateSlider(e.clientX);
            }
        });

        // Touch events for mobile
        sliderHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        });

        container.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // Initialize all sliders
    sliderContainers.forEach(initSlider);
    if (mainSlider) {
        initSlider(mainSlider);
    }

    // Lightbox functionality for car wash gallery
    const carwashLightbox = document.getElementById('carwash-lightbox');
    const carwashLightboxImage = carwashLightbox.querySelector('.lightbox-image');
    const carwashLightboxTitle = carwashLightbox.querySelector('.lightbox-title');
    const carwashLightboxDescription = carwashLightbox.querySelector('.lightbox-description');
    const carwashVehicleInfo = carwashLightbox.querySelector('.vehicle-info');
    const carwashServicesInfo = carwashLightbox.querySelector('.services-info');
    const carwashTimeInfo = carwashLightbox.querySelector('.time-info');
    const carwashLightboxClose = carwashLightbox.querySelector('.lightbox-close');
    const carwashShareFacebook = carwashLightbox.querySelector('.share-btn.facebook');
    const carwashShareTwitter = carwashLightbox.querySelector('.share-btn.twitter');
    const carwashDownloadBtn = carwashLightbox.querySelector('.download-btn');

    // Open lightbox for grid items
    galleryItems.forEach(item => {
        if (!item.classList.contains('before-after')) {
            item.addEventListener('click', function() {
                const imageSrc = this.querySelector('.gallery-image').style.backgroundImage;
                const imageUrl = imageSrc.replace('url("', '').replace('")', '');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');
                const vehicle = this.getAttribute('data-vehicle');
                const services = this.getAttribute('data-services');
                const time = this.getAttribute('data-time');

                openCarwashLightbox(imageUrl, title, description, vehicle, services, time);
            });
        }
    });

    function openCarwashLightbox(imageSrc, title, description, vehicle, services, time) {
        carwashLightboxImage.src = imageSrc;
        carwashLightboxTitle.textContent = title;
        carwashLightboxDescription.textContent = description;
        carwashVehicleInfo.textContent = vehicle || 'Various Vehicles';
        carwashServicesInfo.textContent = services || 'Multiple Services';
        carwashTimeInfo.textContent = time || 'Varies by service';

        carwashLightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Progressive loading effect
        carwashLightboxImage.style.opacity = '0';
        setTimeout(() => {
            carwashLightboxImage.style.opacity = '1';
        }, 100);
    }

    // Close lightbox
    carwashLightboxClose.addEventListener('click', closeCarwashLightbox);
    carwashLightbox.addEventListener('click', function(e) {
        if (e.target === carwashLightbox) {
            closeCarwashLightbox();
        }
    });

    function closeCarwashLightbox() {
        carwashLightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (carwashLightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeCarwashLightbox();
            }
        }
    });

    // Social sharing for car wash
    carwashShareFacebook.addEventListener('click', function() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out our premium car wash services: ${carwashLightboxTitle.textContent}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    });

    carwashShareTwitter.addEventListener('click', function() {
        const text = encodeURIComponent(`Check out our premium car wash services: ${carwashLightboxTitle.textContent} ${window.location.href}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    });

    // Download functionality
    carwashDownloadBtn.addEventListener('click', function() {
        alert('High-resolution download available for business inquiries. Please contact us for access.');
    });

    // Slider navigation for showcase view
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');

    if (sliderPrev && sliderNext) {
        let currentSlide = 0;
        const slides = [
            {
                before: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=500&fit=crop&crop=center',
                after: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=500&fit=crop&crop=center',
                title: 'Exterior Wash Transformation',
                description: 'Mercedes C-Class - Complete exterior detailing with paint correction'
            },
            {
                before: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=500&fit=crop&crop=center',
                after: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=500&fit=crop&crop=center',
                title: 'Interior Deep Clean',
                description: 'BMW X5 - Full interior detailing and leather conditioning'
            }
        ];

        function updateSliderShowcase() {
            const slide = slides[currentSlide];
            const beforeImage = mainSlider.querySelector('.before-image');
            const afterImage = mainSlider.querySelector('.after-image');
            const sliderInfoTitle = document.querySelector('.slider-info h3');
            const sliderInfoDesc = document.querySelector('.slider-info p');

            beforeImage.style.backgroundImage = `url('${slide.before}')`;
            afterImage.style.backgroundImage = `url('${slide.after}')`;
            sliderInfoTitle.textContent = slide.title;
            sliderInfoDesc.textContent = slide.description;

            // Reset slider position
            const sliderHandle = mainSlider.querySelector('.slider-handle');
            const percentage = mainSlider.querySelector('.percentage');
            afterImage.style.clipPath = 'inset(0 0 0 50%)';
            sliderHandle.style.left = '50%';
            if (percentage) percentage.textContent = '50%';
        }

        sliderPrev.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSliderShowcase();
        });

        sliderNext.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSliderShowcase();
        });
    }
});

// GAMING GALLERY FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Zone Navigation
    const zoneButtons = document.querySelectorAll('.zone-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Lightbox elements
    const lightbox = document.getElementById('gaming-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxSpecs = document.getElementById('equipment-specs');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Initialize gallery - show all items by default
    showAllItems();

    // Zone button click handlers
    zoneButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            zoneButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const zoneFilter = this.getAttribute('data-zone');

            if (zoneFilter === 'all') {
                showAllItems();
            } else {
                filterByZone(zoneFilter);
            }
        });
    });

    // Gallery item click handlers
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const specs = this.getAttribute('data-specs');

            // Update lightbox content
            lightboxImage.src = imageSrc;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            if (specs) {
                lightboxSpecs.style.display = 'block';
                lightboxSpecs.querySelector('.specs-list').setAttribute('data-specs', specs);
            } else {
                lightboxSpecs.style.display = 'none';
            }

            // Show lightbox
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Lightbox close handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Function to show all gallery items
    function showAllItems() {
        galleryItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Function to filter items by zone
    function filterByZone(zone) {
        galleryItems.forEach(item => {
            const itemZone = item.getAttribute('data-zone');
            if (itemZone === zone) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Function to close lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // 360° View button handler
    const view360Btn = document.querySelector('.view360-btn');
    if (view360Btn) {
        view360Btn.addEventListener('click', function() {
            // Placeholder for 360° view functionality
            alert('360° View feature coming soon! This will allow you to explore the gaming equipment in full 3D.');
        });
    }

    // Share button handler
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const title = lightboxTitle.textContent;
            const url = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const text = `Check out this amazing gaming equipment: ${title} - ${url}`;
                navigator.clipboard.writeText(text).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        });
    }

    // Download button handler
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const imageSrc = lightboxImage.src;
            const title = lightboxTitle.textContent;

            // Create download link
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Video thumbnail handlers
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            if (videoUrl) {
                // For now, open video in new tab
                // In production, you might want to embed video player
                window.open(videoUrl, '_blank');
            }
        });
    });

    // Add hover effects for gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Initialize masonry layout (simple version)
    function initializeMasonry() {
        const gallery = document.querySelector('.gallery-masonry');
        if (gallery) {
            // Simple masonry effect using CSS Grid
            // In production, you might want to use a proper masonry library
            const items = gallery.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                // Stagger animation on load
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        }
    }

    // Add fadeInUp animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize on load
    initializeMasonry();
});

// RESTAURANT GALLERY FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Lightbox elements
    const lightbox = document.getElementById('restaurant-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const winePairingInfo = document.getElementById('wine-pairing-info');
    const winePairingText = document.getElementById('wine-pairing-text');
    const chefNotesInfo = document.getElementById('chef-notes-info');
    const chefNotesText = document.getElementById('chef-notes-text');
    const menuReferenceBtn = document.getElementById('menu-reference-btn');
    const lightboxClose = document.querySelector('#restaurant-lightbox .lightbox-close');

    // Initialize gallery - show all items by default
    showAllGalleryItems();

    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const tabFilter = this.getAttribute('data-tab');

            if (tabFilter === 'all') {
                showAllGalleryItems();
            } else {
                filterByTab(tabFilter);
            }
        });
    });

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            if (filterValue === 'all') {
                showAllGalleryItems();
            } else {
                filterByCategory(filterValue);
            }
        });
    });

    // Gallery item click handlers
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const winePairing = this.getAttribute('data-wine-pairing');
            const chefNotes = this.getAttribute('data-chef-notes');
            const menuLink = this.getAttribute('data-menu-link');

            // Update lightbox content
            lightboxImage.src = imageSrc;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            // Handle wine pairing
            if (winePairing) {
                winePairingInfo.style.display = 'block';
                winePairingText.textContent = winePairing;
            } else {
                winePairingInfo.style.display = 'none';
            }

            // Handle chef notes
            if (chefNotes) {
                chefNotesInfo.style.display = 'block';
                chefNotesText.textContent = chefNotes;
            } else {
                chefNotesInfo.style.display = 'none';
            }

            // Handle menu reference
            if (menuLink) {
                menuReferenceBtn.style.display = 'inline-block';
                menuReferenceBtn.href = menuLink;
            } else {
                menuReferenceBtn.style.display = 'none';
            }

            // Show lightbox
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Lightbox close handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeRestaurantLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeRestaurantLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeRestaurantLightbox();
            }
        }
    });

    // Function to show all gallery items
    function showAllGalleryItems() {
        galleryItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Function to filter items by tab
    function filterByTab(tab) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === tab || tab === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Function to filter items by category
    function filterByCategory(category) {
        galleryItems.forEach(item => {
            const itemCategories = item.className.split(' ');
            if (itemCategories.includes(category) || category === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Function to close lightbox
    function closeRestaurantLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Share button handler
    const shareBtn = document.querySelector('#restaurant-lightbox .share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const title = lightboxTitle.textContent;
            const url = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const text = `Check out this amazing dish: ${title} - ${url}`;
                navigator.clipboard.writeText(text).then(() => {
                    alert('Link copied to clipboard!');
                });
            }
        });
    }

    // Download button handler
    const downloadBtn = document.querySelector('#restaurant-lightbox .download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const imageSrc = lightboxImage.src;
            const title = lightboxTitle.textContent;

            // Create download link
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Video thumbnail handlers
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            if (videoUrl) {
                // For now, open video in new tab
                // In production, you might want to embed video player
                window.open(videoUrl, '_blank');
            }
        });
    });

    // Add hover effects for gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.03)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Initialize masonry layout (simple version)
    function initializeRestaurantMasonry() {
        const gallery = document.querySelector('.restaurant-gallery .gallery-masonry');
        if (gallery) {
            // Simple masonry effect using CSS Grid
            // In production, you might want to use a proper masonry library
            const items = gallery.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                // Stagger animation on load
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        }
    }

    // Initialize on load
    initializeRestaurantMasonry();
});

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Show loading state
            btnText.textContent = 'Sending...';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide loading state
                btnText.textContent = 'Message Sent!';
                btnLoader.style.display = 'none';

                // Reset form
                this.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success feedback
        const copyBtn = event.target;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        const copyBtn = event.target;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    });
}

// SPHERICAL MAP INTERACTIVITY
document.addEventListener('DOMContentLoaded', function() {
    const sphereContainer = document.querySelector('.sphere-container');
    const transportationOrbit = document.querySelector('.transportation-orbit');
    const controlBtns = document.querySelectorAll('.control-btn');
    const transportIcons = document.querySelectorAll('.transport-icon');
    const directionsBtn = document.querySelector('.directions-btn');
    const locationMarker = document.querySelector('.location-marker');

    if (!sphereContainer) return; // Exit if spherical map doesn't exist

    let isRotating = true;
    let currentZoom = 1;
    let isDragging = false;
    let startX, startY;
    let currentRotation = 0;

    // Control button functionality
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.toLowerCase();

            switch(action) {
                case '⏸️':
                    toggleRotation();
                    this.textContent = isRotating ? '▶️' : '⏸️';
                    break;
                case '🔍+':
                    zoomIn();
                    break;
                case '🔍-':
                    zoomOut();
                    break;
                case '🎯':
                    centerView();
                    break;
            }
        });
    });

    // Transportation icon tooltips
    transportIcons.forEach(icon => {
        const transportType = icon.classList[1]; // subway, parking, walking, biking
        const tooltips = {
            subway: 'Metro Station: 2 min walk',
            parking: 'Parking: Available on-site',
            walking: 'Walking distance to downtown',
            biking: 'Bike lanes available'
        };

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'transport-tooltip';
        tooltip.textContent = tooltips[transportType];
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-family: 'Inter', sans-serif;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 1000;
            white-space: nowrap;
            border: 1px solid rgba(255, 107, 53, 0.3);
        `;

        icon.appendChild(tooltip);

        icon.addEventListener('mouseenter', function(e) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });

        icon.addEventListener('mouseleave', function(e) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
        });

        // Click to pause orbit and highlight
        icon.addEventListener('click', function() {
            transportationOrbit.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.3)';
            this.style.background = 'rgba(255, 107, 53, 0.3)';
            this.style.borderColor = '#FF6B35';

            setTimeout(() => {
                transportationOrbit.style.animationPlayState = 'running';
                this.style.transform = '';
                this.style.background = '';
                this.style.borderColor = '';
            }, 2000);
        });
    });

    // Directions button functionality
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            // Open Google Maps with Verve Hub location
            const address = encodeURIComponent('Verve Hub, Downtown Area');
            const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(url, '_blank');
        });
    }

    // Location marker interaction
    if (locationMarker) {
        locationMarker.addEventListener('click', function() {
            // Pulse animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pinPulse 0.6s ease-in-out';
            }, 10);

            // Show coordinates temporarily
            const coords = this.querySelector('.coordinates');
            coords.style.opacity = '1';
            setTimeout(() => {
                coords.style.opacity = '0';
            }, 3000);
        });
    }

    // Mouse/touch interaction for manual rotation
    sphereContainer.addEventListener('mousedown', startDrag);
    sphereContainer.addEventListener('touchstart', startDrag, { passive: false });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        startX = clientX;
        startY = clientY;
        sphereContainer.style.cursor = 'grabbing';

        // Pause automatic rotation
        if (isRotating) {
            sphereContainer.style.animationPlayState = 'paused';
        }
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        currentRotation += deltaX * 0.5;
        sphereContainer.style.transform = `rotate(${currentRotation}deg) scale(${currentZoom})`;

        startX = clientX;
        startY = clientY;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        sphereContainer.style.cursor = '';

        // Resume automatic rotation if it was active
        if (isRotating) {
            sphereContainer.style.animationPlayState = 'running';
        }
    }

    // Control functions
    function toggleRotation() {
        isRotating = !isRotating;
        sphereContainer.style.animationPlayState = isRotating ? 'running' : 'paused';
    }

    function zoomIn() {
        currentZoom = Math.min(currentZoom * 1.2, 2);
        updateZoom();
    }

    function zoomOut() {
        currentZoom = Math.max(currentZoom / 1.2, 0.5);
        updateZoom();
    }

    function centerView() {
        currentZoom = 1;
        currentRotation = 0;
        sphereContainer.style.transform = 'scale(1) rotate(0deg)';
        if (isRotating) {
            sphereContainer.style.animationPlayState = 'running';
        }
    }

    function updateZoom() {
        sphereContainer.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
    }

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.key) {
            case ' ':
                e.preventDefault();
                toggleRotation();
                break;
            case '+':
            case '=':
                zoomIn();
                break;
            case '-':
                zoomOut();
                break;
            case '0':
                centerView();
                break;
        }
    });

    // Intersection Observer for animation triggers
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start loading animation
                setTimeout(() => {
                    const loading = document.querySelector('.sphere-loading');
                    if (loading) {
                        loading.style.opacity = '0';
                        setTimeout(() => loading.remove(), 500);
                    }
                }, 1000);
            }
        });
    }, { threshold: 0.3 });

    mapObserver.observe(sphereContainer);

    // Performance optimization: reduce animations on low-power devices
    if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
        sphereContainer.style.animationDuration = '60s';
        transportationOrbit.style.animationDuration = '40s';
    }

    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'sphere-loading';
    loadingDiv.innerHTML = `
        <div class="loading-dots">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
            <div class="dot dot-4"></div>
        </div>
    `;
    sphereContainer.appendChild(loadingDiv);
});