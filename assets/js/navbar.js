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
        { text: 'Home', href: '#carwash-home' },
        { text: 'Packages', href: '#carwash-packages' },
        { text: 'Gallery', href: '#carwash-gallery' },
        { text: 'Booking', href: '#carwash-booking' },
        // { text: 'Contact', href: '../index.html#contact-location' }
    ],
    // Gaming page navigation
    gaming: [
        { text: 'Home', href: '#gaming-home' },
        { text: 'Zones', href: '#gaming-zones' },
        { text: 'Tournaments', href: '#tournament' },
        { text: 'Membership', href: '#gaming-membership' },
        { text: 'Gallery', href: '#gaming-gallery' }
    ],
    // Restaurant page navigation
    restaurant: [
        { text: 'Home', href: '#restaurant-home' },
        { text: 'Services', href: '#menu' },
        { text: 'Reservations', href: '#reservations' },
        { text: 'Gallery', href: '#restaurant-gallery' },
        // { text: 'Contact', href: '../index.html#contact-location' }
    ],
    // Gym page navigation (different structure)
    gym: [
        { text: 'Home', href: '#gym-home' },
        { text: 'Facilities', href: '#gym-facilities' },
        { text: 'Plans', href: '#gym-plans' },
        { text: 'Schedule', href: '#gym-schedule' },
        { text: 'Trainers', href: '#gym-trainers' },
        { text: 'Gallery', href: '#gym-gallery' }
    ]
};

// Page navigation configuration for dropdown
const pageNavigation = {
    'Home': '../index.html',
    'Gym': 'gym.html',
    'Gaming': 'gaming.html',
    'Restaurant': 'restaurant.html',
    'Car Wash': 'carwash.html'
};

// Color theme configuration for each page
const pageThemes = {
    'index': {
        primary: '#FF6B35',
        hover: '#E55A2B',
        glow: 'rgba(255, 107, 53, 0.3)'
    },
    'gym': {
        primary: '#2E8B57',
        hover: '#246c44',
        glow: 'rgba(46, 139, 87, 0.3)'
    },
    'gaming': {
        primary: '#9B5DE5',
        hover: '#7C3AED',
        glow: 'rgba(155, 93, 229, 0.3)'
    },
    'restaurant': {
        primary: '#FF6B35',
        hover: '#E55A2B',
        glow: 'rgba(255, 107, 53, 0.3)'
    },
    'carwash': {
        primary: '#4A90E2',
        hover: '#357ABD',
        glow: 'rgba(74, 144, 226, 0.3)'
    }
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

    // Apply the current page theme
    applyPageTheme(pageType);

    // Render the dropdown menu
    renderPageDropdown(pageType);
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

// Function to apply the current page theme to navbar elements
function applyPageTheme(pageType) {
    const theme = pageThemes[pageType] || pageThemes.index;
    
    // Create or update theme CSS variables
    let themeStyle = document.getElementById('navbar-theme-styles');
    if (!themeStyle) {
        themeStyle = document.createElement('style');
        themeStyle.id = 'navbar-theme-styles';
        document.head.appendChild(themeStyle);
    }
    
    // Apply theme colors using CSS custom properties
    themeStyle.textContent = `
        :root {
            --navbar-primary-color: ${theme.primary};
            --navbar-hover-color: ${theme.hover};
            --navbar-glow-color: ${theme.glow};
        }
        
        /* Apply theme to navbar links */
        nav ul li a:hover {
            color: var(--navbar-primary-color) !important;
        }
        
        /* Apply theme to dropdown elements */
        .dropdown-toggle {
            border-color: var(--navbar-primary-color) !important;
            color: #ffffff !important;
        }
        
        .dropdown-toggle:hover {
            background-color: var(--navbar-primary-color) !important;
            color: #ffffff !important;
        }
        
        .dropdown-toggle:focus {
            outline-color: var(--navbar-primary-color) !important;
        }
        
        .dropdown-menu a:hover {
            background-color: var(--navbar-primary-color) !important;
            color: #ffffff !important;
        }
        
        .dropdown-menu a.current-page {
            background-color: var(--navbar-glow-color) !important;
            color: var(--navbar-primary-color) !important;
            font-weight: 600 !important;
        }
        
        /* Apply theme to logo */
        .logo {
            color: var(--navbar-primary-color) !important;
        }
        
        /* Apply theme to active nav links */
        nav ul li a.active {
            color: var(--navbar-primary-color) !important;
        }
    `;
}

// Function to render the page dropdown menu
function renderPageDropdown(currentPageType) {
    const dropdownMenu = document.getElementById('page-dropdown-menu');
    if (!dropdownMenu) {
        console.error('Page dropdown menu not found');
        return;
    }

    // Determine the correct path for navigation
    const isInServices = window.location.pathname.includes('services/');
    const basePath = isInServices ? '' : 'services/';
    
    // Generate dropdown items
    const dropdownItems = Object.entries(pageNavigation).map(([pageName, pagePath]) => {
        const fullPath = basePath + pagePath;
        const isCurrentPage = isCurrentPageActive(pageName, currentPageType);
        const currentClass = isCurrentPage ? 'current-page' : '';
        
        return `<a href="${fullPath}" class="${currentClass}">${pageName}</a>`;
    }).join('');

    dropdownMenu.innerHTML = dropdownItems;

    // Initialize dropdown functionality
    initDropdownToggle();
}

// Function to check if a page is the current active page
function isCurrentPageActive(pageName, currentPageType) {
    const pageMap = {
        'Home': 'index',
        'Gym': 'gym',
        'Gaming': 'gaming',
        'Restaurant': 'restaurant',
        'Car Wash': 'carwash'
    };
    
    return pageMap[pageName] === currentPageType;
}

// Function to initialize dropdown toggle functionality
function initDropdownToggle() {
    const dropdownToggle = document.getElementById('page-dropdown-toggle');
    const dropdownMenu = document.getElementById('page-dropdown-menu');
    
    if (!dropdownToggle || !dropdownMenu) {
        console.error('Dropdown elements not found');
        return;
    }

    // Toggle dropdown on button click
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('show');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            closeDropdown();
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
}

// Function to open dropdown
function openDropdown() {
    const dropdownToggle = document.getElementById('page-dropdown-toggle');
    const dropdownMenu = document.getElementById('page-dropdown-menu');
    
    dropdownToggle.classList.add('active');
    dropdownMenu.classList.add('show');
}

// Function to close dropdown
function closeDropdown() {
    const dropdownToggle = document.getElementById('page-dropdown-toggle');
    const dropdownMenu = document.getElementById('page-dropdown-menu');
    
    dropdownToggle.classList.remove('active');
    dropdownMenu.classList.remove('show');
}

// Auto-load navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
