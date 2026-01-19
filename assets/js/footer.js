// Function to determine the correct footer path
function getFooterPath() {
    const path = window.location.pathname;
    // Check if we're in the services directory
    if (path.includes('services/')) {
        return '../assets/components/footer.html';
    }
    // For index.html or root
    return 'assets/components/footer.html';
}

// Load footer component
fetch(getFooterPath())
    .then(response => response.text())
    .then(html => {
        document.getElementById("footer-placeholder").innerHTML = html;

        // Set current year automatically
        const yearSpan = document.getElementById("footer-year");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    })
    .catch(err => {
        console.error("Footer failed to load:", err);
    });
