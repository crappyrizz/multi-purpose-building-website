// Navbar configuration for different pages
const navbarConfig = {
    // Index page navigation
    index: [
        { text: 'Home', href: '#home' },
        { text: 'Services', href: '#services' },
        { text: 'Gallery', href: '#gallery' },
        { text: 'Why Choose Us', href: '#why-choose-us' },
        { text: 'Reviews', href: '#reviews' },
        { text: 'Contact', href: '#contact-location' }
    ],
    // Carwash page navigation
    carwash: [
        { text: 'Home', href: '../index.html#home' },
        { text: 'Services', href: '../index.html#services' },
        { text: 'Why Choose Us', href: '../index.html#why-choose-us' },
        { text: 'Reviews', href: '../index.html#reviews' },
        { text: 'Contact', href: '../index.html#contact-location' }
    ],
    // Gaming page navigation
    gaming: [
        { text: 'Home', href: '../index.html#home' },
        { text: 'Services', href: '../index.html#services' },
        { text: 'Why Choose Us', href: '../index.html#why-choose-us' },
        { text: 'Reviews', href: '../index.html#reviews' },
        { text: 'Contact', href: '../index.html#contact-location' }
    ],
    // Restaurant page navigation
    restaurant: [
        { text: 'Home', href: '../index.html#home' },
        { text: 'Services', href: '../index.html#services' },
        { text: 'Why Choose Us', href: '../index.html#why-choose-us' },
        { text: 'Reviews', href: '../index.html#reviews' },
        { text: 'Contact', href: '../index.html#contact-location' }
    ],
    // Gym page navigation (different structure)
    gym: [
        { text: 'Home', href: '#ghome' },
        { text: 'Facilities', href: '#gfacilities' },
        { text: 'Plans', href: '#plans' },
        { text: 'Schedule', href: '#schedule' },
        { text: 'Trainers', href: '#trainers' },
        { text: 'Gallery', href: '#ggallery' }
    ]
};

// Function to determine the current page type
function getPageType() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (filename === 'index.html' || filename === '' || path.endsWith('/')) {
        return 'index';
    }
    
    // Check if we're in the services directory
    if (path.includes('services/')) {
        const serviceFile = filename.replace('.html', '');
        return serviceFile;
    }
    
    return 'index';
}

// Function to determine the correct navbar path
function getNavbarPath() {
    const path = window.location.pathname;
    // Check if we're in the services directory
    if (path.includes('services/')) {
        return '../assets/components/navbar.html';
    }
    // For index.html or root
    return 'assets/components/navbar.html';
}

// Function to load and render the navbar
function loadNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.error('Navbar placeholder not found');
        return;
    }

    const navbarPath = getNavbarPath();
    
    // Load the navbar HTML
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            navbarPlaceholder.innerHTML = html;
            
            // Wait for DOM to update, then render menu
            setTimeout(() => {
                const pageType = getPageType();
                renderNavbarMenu(pageType);
                initNavbarScroll();
            }, 0);
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            // Fallback: create navbar inline if fetch fails
            createFallbackNavbar();
        });
}

// Fallback function to create navbar if fetch fails
function createFallbackNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const pageType = getPageType();
    const menuItems = navbarConfig[pageType] || navbarConfig.index;
    
    navbarPlaceholder.innerHTML = `
        <header class="navbar">
            <nav aria-label="Main navigation">
                <div class="logo">Verve Hub</div>
                <ul id="navbar-menu">
                    ${menuItems.map(item => `<li><a href="${item.href}">${item.text}</a></li>`).join('')}
                </ul>
            </nav>
        </header>
    `;
    
    initNavbarScroll();
}

// Function to render the navbar menu based on page type
function renderNavbarMenu(pageType) {
    const menuContainer = document.getElementById('navbar-menu');
    if (!menuContainer) {
        console.error('Navbar menu container not found');
        return;
    }

    const menuItems = navbarConfig[pageType] || navbarConfig.index;
    
    menuContainer.innerHTML = menuItems.map(item => 
        `<li><a href="${item.href}">${item.text}</a></li>`
    ).join('');
}

// Function to initialize navbar scroll behavior
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Auto-load navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
