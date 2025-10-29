document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const body = document.body;
    const currentYearSpan = document.getElementById('current-year');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav ul li a');

    currentYearSpan.textContent = new Date().getFullYear();

    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.classList.add(savedTheme);
    updateThemeToggleIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeToggleIcon('dark-theme');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeToggleIcon('light-theme');
        }
    });

    function updateThemeToggleIcon(theme) {
        if (theme === 'dark-theme') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    let translations = {};
    let currentLang = localStorage.getItem('lang') || 'en';

    Promise.all([
        fetch('en.json').then(response => response.json()),
        fetch('jp.json').then(response => response.json())
    ]).then(([enData, jpData]) => {
        translations = { en: enData, jp: jpData };
        setLanguage(currentLang);
    }).catch(error => console.error('Error loading translations:', error));

    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'jp' : 'en';
        localStorage.setItem('lang', currentLang);
        setLanguage(currentLang);
    });

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        languageToggle.dataset.lang = lang;
        if (lang === 'en') {
            languageToggle.textContent = 'JP / EN';
        } else {
            languageToggle.textContent = 'EN / JP';
        }

        document.querySelectorAll('[data-en], [data-jp]').forEach(element => {
            const enKey = element.dataset.en;
            const jpKey = element.dataset.jp;

            if (lang === 'en' && translations.en && translations.en[enKey]) {
                element.textContent = translations.en[enKey];
            } else if (lang === 'jp' && translations.jp && translations.jp[jpKey]) {
                element.textContent = translations.jp[jpKey];
            } else if (lang === 'en' && enKey) {
                element.textContent = enKey;
            } else if (lang === 'jp' && jpKey) {
                element.textContent = jpKey;
            }
        });
    }

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        body.classList.toggle('no-scroll'); 
    });

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            mainNav.classList.remove('active'); 
            body.classList.remove('no-scroll');
        });
    });

    mainNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('active')) {
            mainNav.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});