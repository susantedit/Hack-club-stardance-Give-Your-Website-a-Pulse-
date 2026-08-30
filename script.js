/**
 * NASA APOD — Cosmic Universe Experience
 * Main Application Engine & Interactive System
 */

function initSolarSystem() {
    const toggle3DBtn = document.getElementById('toggle-3d-btn');
    const toggleZoomBtn = document.getElementById('toggle-zoom-btn');
    const viewport = document.getElementById('universe-viewport');
    const planetBtns = document.querySelectorAll('.planet-btn');

    if (toggle3DBtn && viewport) {
        toggle3DBtn.addEventListener('click', () => {
            if (viewport.classList.contains('view-3D')) {
                viewport.classList.remove('view-3D');
                viewport.classList.add('view-2D');
                toggle3DBtn.textContent = '2D VIEW';
                toggle3DBtn.classList.remove('active');
            } else {
                viewport.classList.remove('view-2D');
                viewport.classList.add('view-3D');
                toggle3DBtn.textContent = '3D VIEW';
                toggle3DBtn.classList.add('active');
            }
        });
    }

    if (toggleZoomBtn && viewport) {
        toggleZoomBtn.addEventListener('click', () => {
            if (viewport.classList.contains('zoom-large')) {
                viewport.classList.remove('zoom-large');
                viewport.classList.add('zoom-close');
                toggleZoomBtn.textContent = 'ZOOM FAR';
                toggleZoomBtn.classList.add('active');
            } else {
                viewport.classList.remove('zoom-close');
                viewport.classList.add('zoom-large');
                toggleZoomBtn.textContent = 'ZOOM CLOSE';
                toggleZoomBtn.classList.remove('active');
            }
        });
    }

    planetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            planetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCosmicBackground();
    initClock();
    initCosmicAudio();
    initNavigation();
    initSolarSystem();
    initKeyboardShortcuts();
    
    // Load Today's Astronomical Transmission
    loadAPOD();
});

// --- API Service Engine & In-Memory Transmission Cache ---
const API_BASE = 'https://api.nasa.gov/planetary/apod';
const apodCache = new Map();

/**
 * Normalized APOD API Data Fetcher with In-Memory Caching
 * @param {string} [dateStr] - Optional YYYY-MM-DD date string
 */
async function getAPOD(dateStr = '') {
    const cacheKey = dateStr || 'today';
    if (apodCache.has(cacheKey)) {
        return apodCache.get(cacheKey);
    }

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

    const normalizedData = {
        title: raw.title || 'Untitled Cosmic Discovery',
        date: raw.date || new Date().toISOString().split('T')[0],
        explanation: raw.explanation || 'No scientific explanation provided for this record.',
        mediaType: normalizedMediaType,
        rawMediaType: raw.media_type,
        url: raw.url || '',
        hdUrl: raw.hdurl || raw.url || '',
        copyright: raw.copyright ? `© ${raw.copyright.trim()}` : ''
    };

    apodCache.set(cacheKey, normalizedData);
    return normalizedData;
}

// --- APOD Renderer & Controller ---
let currentAPOD = null;
let lastRequestedDate = '';
let isFetching = false;

async function loadAPOD(dateStr = '') {
    // Request Deduplication Lock (Prevent duplicate concurrent requests)
    if (isFetching && lastRequestedDate === dateStr) return;
    
    isFetching = true;
    lastRequestedDate = dateStr;
    
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const loadingStatus = document.getElementById('loading-status');

    // UI Loading Transition while keeping cosmic background intact
    if (loadingStatus) {
        loadingStatus.textContent = dateStr 
            ? `RETRACTING ARCHIVE ENTRY: ${dateStr}...` 
            : 'ESTABLISHING ORBITAL TRANSMISSION...';
    }

    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    apodContent.classList.add('hidden');

    try {
        const data = await getAPOD(dateStr);
        currentAPOD = data;
        renderAPOD(data);

        // Transition Content In with Staggered Reveal Sequence
        loadingState.classList.add('hidden');
        apodContent.classList.remove('hidden');

        // Reset and trigger reveal sequence
        document.querySelectorAll('.reveal-element').forEach(el => el.classList.remove('active'));
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.querySelectorAll('.reveal-element').forEach(el => el.classList.add('active'));
            }, 30);
        });
    } catch (err) {
        console.error('NASA APOD Transmission Failure:', err);
        showError(err.message || 'Unable to establish orbital connection with NASA APOD.');
    } finally {
        isFetching = false;
    }
}

function renderAPOD(data) {
    // Header & Titles
    document.getElementById('apod-main-title').textContent = data.title;
    document.getElementById('apod-main-date').textContent = formatDate(data.date);
    document.getElementById('apod-explanation').textContent = data.explanation;
    
    // Mission Log Header Elements
    const logTitle = document.getElementById('log-apod-title');
    const logDate = document.getElementById('log-apod-date');
    const logCopyright = document.getElementById('log-apod-copyright');
    if (logTitle) logTitle.textContent = data.title;
    if (logDate) logDate.textContent = formatDate(data.date);
    if (logCopyright) {
        if (data.copyright) {
            logCopyright.textContent = `© ${data.copyright}`;
            logCopyright.classList.remove('hidden');
        } else {
            logCopyright.classList.add('hidden');
        }
    }

    // Copyright Badge in Hero Header
    const copyrightBadge = document.getElementById('apod-copyright-badge');
    if (data.copyright) {
        copyrightBadge.textContent = `© ${data.copyright}`;
        copyrightBadge.classList.remove('hidden');
    } else {
        copyrightBadge.classList.add('hidden');
    }

    // Telemetry HUD Grid
    document.getElementById('hud-media-type').textContent = (data.mediaType || 'UNKNOWN').toUpperCase();
    document.getElementById('hud-date').textContent = data.date;
    document.getElementById('log-entry-id').textContent = `ENTRY #${data.date.replace(/-/g, '')}`;

    const statusVal = document.getElementById('hud-status-val');
    if (statusVal) {
        const todayStr = new Date().toISOString().split('T')[0];
        statusVal.textContent = (data.date === todayStr) ? '● TRANSMISSION RECEIVED' : '● ARCHIVE RECORD RETRIEVED';
    }

    // Render Media Stage Frame using Centralized Media Renderer
    renderMedia(data);
}

/**
 * Centralized Normalized Media Renderer
 * Explicitly handles: IMAGE, YOUTUBE VIDEO, DIRECT MP4 VIDEO, and UNSUPPORTED MEDIA
 */
function renderMedia(data) {
    const imageBox = document.getElementById('media-image-box');
    const youtubeBox = document.getElementById('media-youtube-box');
    const videoBox = document.getElementById('media-video-box');
    const unsupportedBox = document.getElementById('media-unsupported-box');

    // Reset visibility across all boxes
    imageBox.classList.add('hidden');
    youtubeBox.classList.add('hidden');
    videoBox.classList.add('hidden');
    unsupportedBox.classList.add('hidden');

    if (!data.url) {
        showMediaFallback(data.url, 'MISSING MEDIA URL');
        return;
    }

    // State 1: IMAGE
    if (data.mediaType === 'image') {
        const img = document.getElementById('apod-image');
        const hdLink = document.getElementById('hd-link');
        
        img.onerror = () => {
            showMediaFallback(data.url, 'IMAGE LOAD FAILURE');
        };

        img.src = data.url;
        img.alt = data.title;
        
        if (hdLink) {
            hdLink.href = data.hdUrl || data.url;
            hdLink.classList.remove('hidden');
        }

        imageBox.classList.remove('hidden');
    } 
    // State 2: YOUTUBE VIDEO (iframe embed)
    else if (data.mediaType === 'youtube') {
        const iframe = document.getElementById('apod-youtube');
        let embedUrl = data.url;

        // Extract YouTube ID using regex pattern
        const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&enablejsapi=1`;
        }

        iframe.src = embedUrl;
        youtubeBox.classList.remove('hidden');
    } 
    // State 3: DIRECT MP4 / HTML5 VIDEO PLAYER
    else if (data.mediaType === 'video') {
        const video = document.getElementById('apod-video');
        const videoSrc = document.getElementById('apod-video-src');

        video.onerror = () => {
            showMediaFallback(data.url, 'VIDEO PLAYER FAILURE');
        };

        videoSrc.src = data.url;
        video.load();
        videoBox.classList.remove('hidden');
    } 
    // State 4: UNSUPPORTED / EXTERNAL EMBEDS
    else {
        showMediaFallback(data.url, 'EXTERNAL MEDIA EMBED');
    }
}

function showMediaFallback(url, reason) {
    const unsupportedBox = document.getElementById('media-unsupported-box');
    const unsupportedLink = document.getElementById('unsupported-link');
    
    if (unsupportedLink) {
        unsupportedLink.href = url || 'https://apod.nasa.gov/apod/';
    }
    
    unsupportedBox.classList.remove('hidden');
}

function showError(err) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const errorMsg = document.getElementById('error-message');

    // Technical Exception Log for Developers
    console.error('[NASA APOD TECHNICAL EXCEPTION LOG]:', err);

    let userFriendlyMsg = 'Unable to establish orbital data link with NASA APOD service.';

    if (!navigator.onLine) {
        userFriendlyMsg = 'Network connection offline. Please check your internet link and click Retry Transmission.';
    } else if (typeof err === 'string') {
        userFriendlyMsg = err;
    } else if (err && err.message) {
        const msg = err.message.toLowerCase();
        if (msg.includes('rate limit') || msg.includes('403') || msg.includes('key')) {
            userFriendlyMsg = 'NASA API key rate limit reached or authorization failed. Please try again shortly or configure a custom API key.';
        } else if (msg.includes('404') || msg.includes('date') || msg.includes('range')) {
            userFriendlyMsg = 'No astronomical transmission record exists for the specified observation date.';
        } else if (msg.includes('500') || msg.includes('503') || msg.includes('server')) {
            userFriendlyMsg = 'NASA APOD deep space server is currently undergoing telemetry maintenance.';
        } else {
            userFriendlyMsg = err.message;
        }
    }

    loadingState.classList.add('hidden');
    apodContent.classList.add('hidden');
    if (errorMsg) errorMsg.textContent = userFriendlyMsg;
    errorState.classList.remove('hidden');
}

// --- Cosmic Background, Procedural Multi-Depth Starfield & Parallax Engine ---
function initCosmicBackground() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Check Reduced Motion Preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let stars = [];
    let shootingStars = [];
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        stars = [];
        shootingStars = [];
        // Adaptive star density based on resolution (600 stars on desktop)
        const baseDensity = Math.floor((canvas.width * canvas.height) / 2000);
        const starCount = Math.min(window.innerWidth < 768 ? 250 : 600, baseDensity);

        for (let i = 0; i < starCount; i++) {
            const isFarLayer = Math.random() > 0.3;
            const isFlareStar = !isFarLayer && Math.random() < 0.15; // 15% prominent floating stars
            
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: isFlareStar ? Math.random() * 1.6 + 1.2 : (isFarLayer ? Math.random() * 0.6 + 0.3 : Math.random() * 1.1 + 0.6),
                alpha: Math.random() * 0.75 + 0.25,
                twinkleSpeed: Math.random() * 0.015 + 0.004,
                twinklePhase: Math.random() * Math.PI * 2,
                driftX: isFarLayer ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 0.12,
                driftY: isFarLayer ? (Math.random() - 0.55) * 0.15 : (Math.random() - 0.6) * 0.28, // Upward floating motion
                swayFreq: Math.random() * 0.002 + 0.001,
                swayAmp: Math.random() * 0.4 + 0.1,
                isFar: isFarLayer,
                isFlare: isFlareStar
            });
        }
    }

    function spawnShootingStar() {
        if (Math.random() < 0.018 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.4,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 10 + 6,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // 45 degree angle
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    function draw4PointStar(x, y, size, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = `rgba(180, 210, 255, ${alpha * 0.7})`;
        ctx.lineWidth = 1;
        
        // Vertical flare line
        ctx.beginPath();
        ctx.moveTo(0, -size * 3.5);
        ctx.lineTo(0, size * 3.5);
        ctx.stroke();

        // Horizontal flare line
        ctx.beginPath();
        ctx.moveTo(-size * 3.5, 0);
        ctx.lineTo(size * 3.5, 0);
        ctx.stroke();

        ctx.restore();
    }

    function renderStarfield() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();
        
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            
            // Upward & Swaying Floating Movement
            star.x += star.driftX + Math.sin(now * star.swayFreq) * star.swayAmp;
            star.y += star.driftY;

            // Wrap around canvas edges continuously
            if (star.x < -10) star.x = canvas.width + 10;
            if (star.x > canvas.width + 10) star.x = -10;
            if (star.y < -10) star.y = canvas.height + 10;
            if (star.y > canvas.height + 10) star.y = -10;

            // Individual Twinkle Phase
            const currentAlpha = Math.max(0.15, Math.min(0.98, star.alpha + Math.sin(now * star.twinkleSpeed + star.twinklePhase) * 0.4));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            
            if (star.isFlare) {
                ctx.fillStyle = `rgba(220, 235, 255, ${currentAlpha})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(121, 160, 255, 0.75)';
                ctx.fill();

                // Draw 4-point starlight lens flare
                draw4PointStar(star.x, star.y, star.radius, currentAlpha);
            } else if (!star.isFar && star.radius > 1.0) {
                ctx.fillStyle = `rgba(185, 210, 255, ${currentAlpha})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(107, 140, 255, 0.45)';
                ctx.fill();
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
                ctx.shadowBlur = 0;
                ctx.fill();
            }
        }

        // Render Floating Shooting Star Meteors
        spawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.alpha -= ss.decay;

            if (ss.alpha <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
                shootingStars.splice(i, 1);
                continue;
            }

            const tailX = ss.x - Math.cos(ss.angle) * ss.length;
            const tailY = ss.y - Math.sin(ss.angle) * ss.length;

            const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
            grad.addColorStop(0.3, `rgba(140, 180, 255, ${ss.alpha * 0.6})`);
            grad.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.stroke();
        }

        if (!document.hidden) {
            animationFrameId = requestAnimationFrame(renderStarfield);
        }
    }

    // Pause rendering when tab is hidden to conserve battery/CPU
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(renderStarfield);
        }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderStarfield();

    // 3D Parallax Mouse Shift Engine (Desktop only, touch-gated & prefers-reduced-motion respected)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (window.innerWidth > 768 && !isTouchDevice && !prefersReducedMotion) {
        const nebula = document.querySelector('.layer-nebula');
        const midground = document.querySelector('.layer-midground');
        const planet1 = document.querySelector('.layer-planet-1');
        const planet2 = document.querySelector('.layer-planet-2');

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        }, { passive: true });

        function animateParallax() {
            // Smooth linear interpolation (lerp) for fluid motion
            targetX += (mouseX - targetX) * 0.035;
            targetY += (mouseY - targetY) * 0.035;

            if (canvas) canvas.style.transform = `translate3d(${targetX * 8}px, ${targetY * 8}px, 0)`;
            if (nebula) nebula.style.transform = `translate3d(${targetX * -16}px, ${targetY * -16}px, 0)`;
            if (midground) midground.style.transform = `translate3d(${targetX * -24}px, ${targetY * -24}px, 0)`;
            if (planet1) planet1.style.transform = `translate3d(${targetX * -32}px, ${targetY * -32}px, 0)`;
            if (planet2) planet2.style.transform = `translate3d(${targetX * 14}px, ${targetY * 14}px, 0)`;

            if (!document.hidden) {
                requestAnimationFrame(animateParallax);
            }
        }

        animateParallax();
    }
}

// --- Live Clock & Format Toggle ---
let is24Hour = localStorage.getItem('cosmic_clock_24h') === 'true';

// --- Web Audio API Cosmic Space Synth Drone Engine ---
let audioCtx = null;
let osc1 = null;
let osc2 = null;
let gainNode = null;
let isAudioPlaying = false;

function initCosmicAudio() {
    const audioBtn = document.getElementById('audio-synth-btn');
    const audioText = document.getElementById('audio-status-text');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            audioCtx = new AudioContext();

            // Sub-bass drone oscillator (55Hz - Low A note)
            osc1 = audioCtx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

            // Warm resonant harmonic oscillator (110Hz)
            osc2 = audioCtx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(110, audioCtx.currentTime);

            // Master Gain Node for smooth fade
            gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isAudioPlaying) {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.5);
            isAudioPlaying = true;
            if (audioText) audioText.textContent = 'AUDIO ON';
            audioBtn.classList.add('audio-active');
        } else {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
            isAudioPlaying = false;
            if (audioText) audioText.textContent = 'AUDIO OFF';
            audioBtn.classList.remove('audio-active');
        }
    });
}

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
    const navSolar = document.getElementById('nav-solar');
    const navAbout = document.getElementById('nav-about');

    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const solarContent = document.getElementById('solar-content');

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
            if (solarContent) solarContent.classList.add('hidden');
            loadAPOD();
        });
    }

    if (navSolar) {
        navSolar.addEventListener('click', () => {
            setActiveNav(navSolar);
            if (loadingState) loadingState.classList.add('hidden');
            if (errorState) errorState.classList.add('hidden');
            if (apodContent) apodContent.classList.add('hidden');
            if (solarContent) solarContent.classList.remove('hidden');
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
        retryBtn.addEventListener('click', () => loadAPOD(lastRequestedDate));
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
