document.addEventListener('DOMContentLoaded', () => {

    // ── Year ──────────────────────────────────────────────
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // ── Theme ─────────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        body.classList.replace(isDark ? 'dark-theme' : 'light-theme', isDark ? 'light-theme' : 'dark-theme');
        const newTheme = isDark ? 'light-theme' : 'dark-theme';
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark-theme'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    // ── Language ──────────────────────────────────────────
    const langToggle = document.getElementById('language-toggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    applyLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'jp' : 'en';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
    });

    function applyLanguage(lang) {
        langToggle.textContent = lang === 'en' ? 'JP' : 'EN';
        langToggle.dataset.lang = lang;
        document.body.dataset.lang = lang;

        document.querySelectorAll('[data-en]').forEach(el => {
            const val = el.dataset[lang];
            if (val) el.textContent = val;
        });
    }

    // ── Mobile nav ────────────────────────────────────────
    const hamburger = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    hamburger.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close nav on link click or backdrop click
    mainNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target === mainNav) {
            mainNav.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            mainNav.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // ── Scroll-triggered section reveals ─────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.skill-card, .stat-card, .highlight-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add visible class styling
    const style = document.createElement('style');
    style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ── Header scroll shadow ──────────────────────────────
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 10
            ? '0 2px 16px rgba(0,0,0,0.1)'
            : 'none';
    }, { passive: true });

});
