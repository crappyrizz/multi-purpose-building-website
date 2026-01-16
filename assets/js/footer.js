fetch("/assets/components/footer.html")
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
