// Theme toggle script
(function () {
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');

    if (!toggleBtn) return; // safety check

    // Apply saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        setIcon(true);
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        setIcon(isDark);
    });

    function setIcon(isDark) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }
})();
