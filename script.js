/**
 * NASA APOD — Cosmic Universe Experience
 * Main Application Engine & Interactive System
 */

document.addEventListener('DOMContentLoaded', () => {
    initCosmicBackground();
    initClock();
    initNavigation();
    initKeyboardShortcuts();
    
    // Load Today's Astronomical Transmission
    loadAPOD();
});

// --- API Service Engine ---
const API_BASE = 'https://api.nasa.gov/planetary/apod';

/**
 * Normalized APOD API Data Fetcher
 * @param {string} [dateStr] - Optional YYYY-MM-DD date string
 */
async function getAPOD(dateStr = '') {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NASA_API_KEY)
        ? import.meta.env.VITE_NASA_API_KEY
        : 'DEMO_KEY';

    let url = `${API_BASE}?api_key=${apiKey}`;
    if (dateStr) {
        url += `&date=${dateStr}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.error?.message || `NASA API returned status ${response.status}`);
    }

    const raw = await response.json();

    // Determine normalized media type (Image, YouTube Video, Direct Video)
    let normalizedMediaType = 'image';
    if (raw.media_type === 'video') {
        if (raw.url && (raw.url.includes('youtube.com') || raw.url.includes('youtu.be'))) {
            normalizedMediaType = 'youtube';
        } else {
            normalizedMediaType = 'video';
        }
    }

    return {
        title: raw.title || 'Untitled Cosmic Discovery',
        date: raw.date || new Date().toISOString().split('T')[0],
        explanation: raw.explanation || 'No scientific explanation provided for this record.',
        mediaType: normalizedMediaType,
        rawMediaType: raw.media_type,
        url: raw.url || '',
        hdUrl: raw.hdurl || raw.url || '',
        copyright: raw.copyright ? `© ${raw.copyright.trim()}` : ''
    };
}

// --- APOD Renderer & Controller ---
let currentAPOD = null;

async function loadAPOD(dateStr = '') {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const loadingStatus = document.getElementById('loading-status');

    // UI Loading Transition
    if (loadingStatus) loadingStatus.textContent = dateStr ? `RETRACTING ARCHIVE: ${dateStr}...` : 'RECEIVING NASA TRANSMISSION...';
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    apodContent.classList.add('hidden');

    try {
        const data = await getAPOD(dateStr);
        currentAPOD = data;
        renderAPOD(data);

        // Transition Content In
        loadingState.classList.add('hidden');
        apodContent.classList.remove('hidden');
    } catch (err) {
        console.error('NASA APOD Transmission Failure:', err);
        showError(err.message || 'Unable to establish orbital connection with NASA APOD.');
    }
}

function renderAPOD(data) {
    // Header & Titles
    document.getElementById('apod-main-title').textContent = data.title;
    document.getElementById('apod-main-date').textContent = formatDate(data.date);
    document.getElementById('apod-explanation').textContent = data.explanation;
    
    // Copyright Badge
    const copyrightBadge = document.getElementById('apod-copyright-badge');
    if (data.copyright) {
        copyrightBadge.textContent = data.copyright;
        copyrightBadge.classList.remove('hidden');
    } else {
        copyrightBadge.classList.add('hidden');
    }

    // Telemetry HUD Grid
    document.getElementById('hud-media-type').textContent = data.mediaType.toUpperCase();
    document.getElementById('hud-date').textContent = data.date;
    document.getElementById('log-entry-id').textContent = `ENTRY #${data.date.replace(/-/g, '')}`;

    // Reset Media Frames
    const imageBox = document.getElementById('media-image-box');
    const youtubeBox = document.getElementById('media-youtube-box');
    const videoBox = document.getElementById('media-video-box');

    imageBox.classList.add('hidden');
    youtubeBox.classList.add('hidden');
    videoBox.classList.add('hidden');

    // Render Triple Media States
    if (data.mediaType === 'image') {
        const img = document.getElementById('apod-image');
        const hdLink = document.getElementById('hd-link');
        
        img.src = data.url;
        img.alt = data.title;
        hdLink.href = data.hdUrl;
        
        imageBox.classList.remove('hidden');
    } else if (data.mediaType === 'youtube') {
        const iframe = document.getElementById('apod-youtube');
        
        // Ensure YouTube embed format
        let embedUrl = data.url;
        if (!embedUrl.includes('embed')) {
            const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (ytMatch && ytMatch[1]) {
                embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`;
            }
        }
        
        iframe.src = embedUrl;
        youtubeBox.classList.remove('hidden');
    } else if (data.mediaType === 'video') {
        const video = document.getElementById('apod-video');
        const videoSrc = document.getElementById('apod-video-src');
        
        videoSrc.src = data.url;
        video.load();
        videoBox.classList.remove('hidden');
    }
}

function showError(msg) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const errorMsg = document.getElementById('error-message');

    loadingState.classList.add('hidden');
    apodContent.classList.add('hidden');
    if (errorMsg) errorMsg.textContent = msg;
    errorState.classList.remove('hidden');
}

// --- Cosmic Background, Starfield Canvas & Parallax Engine ---
function initCosmicBackground() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Check Reduced Motion Preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let stars = [];
    const starCount = window.innerWidth < 768 ? 120 : 260;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.3 + 0.3,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.008 + 0.003
            });
        }
    }

    function renderStarfield() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.alpha += Math.sin(Date.now() * star.speed) * 0.008;
            const alpha = Math.max(0.15, Math.min(0.95, star.alpha));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(renderStarfield);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderStarfield();

    // 3D Parallax Mouse Shift Engine
    if (window.innerWidth > 768) {
        const nebula = document.querySelector('.layer-nebula');
        const planet1 = document.querySelector('.layer-planet-1');
        const planet2 = document.querySelector('.layer-planet-2');

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        });

        function animateParallax() {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            if (canvas) canvas.style.transform = `translate3d(${targetX * 12}px, ${targetY * 12}px, 0)`;
            if (nebula) nebula.style.transform = `translate3d(${targetX * -25}px, ${targetY * -25}px, 0)`;
            if (planet1) planet1.style.transform = `translate3d(${targetX * -40}px, ${targetY * -40}px, 0)`;
            if (planet2) planet2.style.transform = `translate3d(${targetX * 20}px, ${targetY * 20}px, 0)`;

            requestAnimationFrame(animateParallax);
        }

        animateParallax();
    }
}

// --- Live Clock & Format Toggle ---
let is24Hour = localStorage.getItem('cosmic_clock_24h') === 'true';

function initClock() {
    const clockBtn = document.getElementById('clock-btn');
    const clockText = document.getElementById('hud-time');

    function updateClock() {
        const now = new Date();
        let hours = now.getUTCHours();
        let minutes = now.getUTCMinutes();
        let seconds = now.getUTCSeconds();

        if (!is24Hour) {
            hours = hours % 12 || 12;
        }

        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        if (clockText) clockText.textContent = `${hStr}:${mStr}:${sStr}`;
    }

    if (clockBtn) {
        clockBtn.addEventListener('click', () => {
            is24Hour = !is24Hour;
            localStorage.setItem('cosmic_clock_24h', is24Hour);
            updateClock();
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// --- Navigation & Modals ---
function initNavigation() {
    // Nav Buttons
    const navToday = document.getElementById('nav-today');
    const navArchive = document.getElementById('nav-archive');
    const navAbout = document.getElementById('nav-about');

    // Modals
    const archiveModal = document.getElementById('archive-modal');
    const aboutModal = document.getElementById('about-modal');
    const closeArchiveBtn = document.getElementById('close-archive-btn');
    const closeAboutBtn = document.getElementById('close-about-btn');
    const archiveForm = document.getElementById('archive-form');
    const datePicker = document.getElementById('archive-date-picker');
    const retryBtn = document.getElementById('retry-btn');

    // Set Max Date Picker to Today
    if (datePicker) {
        datePicker.max = new Date().toISOString().split('T')[0];
        datePicker.value = new Date().toISOString().split('T')[0];
    }

    if (navToday) {
        navToday.addEventListener('click', () => {
            setActiveNav(navToday);
            loadAPOD();
        });
    }

    if (navArchive) {
        navArchive.addEventListener('click', () => {
            archiveModal.classList.remove('hidden');
            if (datePicker) datePicker.focus();
        });
    }

    if (navAbout) {
        navAbout.addEventListener('click', () => {
            aboutModal.classList.remove('hidden');
        });
    }

    if (closeArchiveBtn) {
        closeArchiveBtn.addEventListener('click', () => archiveModal.classList.add('hidden'));
    }

    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => aboutModal.classList.add('hidden'));
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => loadAPOD());
    }

    if (archiveForm) {
        archiveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDate = datePicker.value;
            if (selectedDate) {
                archiveModal.classList.add('hidden');
                setActiveNav(navArchive);
                loadAPOD(selectedDate);
            }
        });
    }

    // Modal Background Click Dismiss
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}

function setActiveNav(targetBtn) {
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
    if (targetBtn) targetBtn.classList.add('active');
}

// --- Keyboard Shortcuts ---
function initKeyboardShortcuts() {
    const searchInput = document.getElementById('search-input');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }

        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });
}

// --- Helpers ---
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });
}
