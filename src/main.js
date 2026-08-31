import { initBackground } from './background.js';
import { initClock, initDashboardClock } from './clock.js';
import { loadAPOD } from './apod.js';
import { initShortcuts } from './shortcuts.js';
import { initTasks } from './tasks.js';
import { initNotes } from './notes.js';
import { initLunar } from './lunar.js';
import { initISS } from './iss.js';
import { initAudio } from './audio.js';
import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initClock();
    initDashboardClock();
    initShortcuts();
    initTasks();
    initNotes();
    initLunar();
    initISS();
    initAudio();
    initNavigation();

    // Load today's APOD record in background for preview card
    loadAPOD();

    // Keyboard shortcuts: '/' focuses search input, 'Escape' closes modals
    const searchInput = document.getElementById('search-input');
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }

        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });
});
