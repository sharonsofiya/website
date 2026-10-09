/**
 * Theme Management Module
 * Manages Dark Mode & Light Mode using Bootstrap 5 data-bs-theme attribute
 * Persists selection in localStorage
 */

const ThemeManager = (() => {
  const STORAGE_KEY = 'portfolio_theme';
  const htmlElement = document.documentElement;

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.title = 'Switch to light mode';
        } else {
          icon.className = 'bi bi-moon-stars-fill text-primary';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.title = 'Switch to dark mode';
        }
      }
    });
  }

  function toggle() {
    const current = htmlElement.getAttribute('data-bs-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function init() {
    const theme = getPreferredTheme();
    setTheme(theme);

    // Bind event listeners to all theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    });

    // Listen for OS system theme changes if no explicit user override
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  return {
    init,
    toggle,
    setTheme,
    getCurrentTheme: () => htmlElement.getAttribute('data-bs-theme') || 'light'
  };
})();

// Self-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});
