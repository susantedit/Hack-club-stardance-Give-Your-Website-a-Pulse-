import { loadAPOD } from './apod.js';

export function initNavigation() {
    const navHome = document.getElementById('nav-home');
    const navToday = document.getElementById('nav-today');
    const navArchive = document.getElementById('nav-archive');
    const navSolar = document.getElementById('nav-solar');
    const navAbout = document.getElementById('nav-about');

    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const homeContent = document.getElementById('home-content');
    const apodContent = document.getElementById('apod-content');
    const solarContent = document.getElementById('solar-content');
    const viewTodayBtn = document.getElementById('view-today-apod-btn');

    const archiveModal = document.getElementById('archive-modal');
    const aboutModal = document.getElementById('about-modal');
    const closeArchiveBtn = document.getElementById('close-archive-btn');
    const closeAboutBtn = document.getElementById('close-about-btn');
    const archiveForm = document.getElementById('archive-form');
    const datePicker = document.getElementById('archive-date-picker');
    const retryBtn = document.getElementById('retry-btn');

    if (datePicker) {
        datePicker.max = new Date().toISOString().split('T')[0];
        datePicker.value = new Date().toISOString().split('T')[0];
    }

    function setActiveNav(btn) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (btn) btn.classList.add('active');
    }

    if (navHome) {
        navHome.addEventListener('click', () => {
            setActiveNav(navHome);
            if (loadingState) loadingState.classList.add('hidden');
            if (errorState) errorState.classList.add('hidden');
            if (apodContent) apodContent.classList.add('hidden');
            if (solarContent) solarContent.classList.add('hidden');
            if (homeContent) homeContent.classList.remove('hidden');
        });
    }

    if (navToday) {
        navToday.addEventListener('click', () => {
            setActiveNav(navToday);
            if (homeContent) homeContent.classList.add('hidden');
            if (solarContent) solarContent.classList.add('hidden');
            loadAPOD();
        });
    }

    if (viewTodayBtn && navToday) {
        viewTodayBtn.addEventListener('click', () => {
            navToday.click();
        });
    }

    if (navSolar) {
        navSolar.addEventListener('click', () => {
            setActiveNav(navSolar);
            if (loadingState) loadingState.classList.add('hidden');
            if (errorState) errorState.classList.add('hidden');
            if (homeContent) homeContent.classList.add('hidden');
            if (apodContent) apodContent.classList.add('hidden');
            if (solarContent) solarContent.classList.remove('hidden');
        });
    }

    if (navArchive) {
        navArchive.addEventListener('click', () => {
            if (archiveModal) {
                archiveModal.classList.remove('hidden');
                if (datePicker) datePicker.focus();
            }
        });
    }

    if (navAbout) {
        navAbout.addEventListener('click', () => {
            if (aboutModal) aboutModal.classList.remove('hidden');
        });
    }

    if (closeArchiveBtn) {
        closeArchiveBtn.addEventListener('click', () => {
            if (archiveModal) archiveModal.classList.add('hidden');
        });
    }

    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            if (aboutModal) aboutModal.classList.add('hidden');
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => loadAPOD());
    }

    if (archiveForm) {
        archiveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDate = datePicker.value;
            if (selectedDate) {
                if (archiveModal) archiveModal.classList.add('hidden');
                setActiveNav(navArchive);
                loadAPOD(selectedDate);
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}
