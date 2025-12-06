// Dark/Light mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupThemeToggle();
});

// Initialize theme based on user preference or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }
}

// Apply theme to document
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    }
}

// Update theme icon
function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('#theme-icon');
    icons.forEach(icon => {
        if (icon && window.Icons) {
            if (theme === 'dark') {
                icon.innerHTML = `<span class="icon-wrapper icon-lg icon-sun">${Icons.sun}</span>`;
            } else {
                icon.innerHTML = `<span class="icon-wrapper icon-lg icon-moon">${Icons.moon}</span>`;
            }
        } else if (icon) {
            // Fallback to emoji if icons not loaded
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    });
}

// Setup theme toggle buttons
function setupThemeToggle() {
    const toggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    
    toggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', function() {
                const currentTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

