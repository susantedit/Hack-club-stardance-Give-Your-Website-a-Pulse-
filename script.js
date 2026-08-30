/**
 * NASA APOD — Cosmic Universe Experience
 * Main Application Engine & Interactive System
 */

function initSolarSystem() {
    const solarExperience = document.getElementById('solar-content');
    const universe = document.getElementById('universe');
    const solarSystem = document.getElementById('solar-system');
    const dataLinks = document.querySelectorAll('#data a');
    const toggleDataBtn = document.getElementById('toggle-data-btn');
    const toggleControlsBtn = document.getElementById('toggle-controls-btn');
    
    const ctrlViewCheck = document.getElementById('ctrl-view-check');
    const ctrlZoomCheck = document.getElementById('ctrl-zoom-check');
    
    const setSpeedRadio = document.querySelector('.set-speed');
    const setSizeRadio = document.querySelector('.set-size');
    const setDistanceRadio = document.querySelector('.set-distance');

    if (!solarExperience) return;

    // Toggle Data Panel
    if (toggleDataBtn) {
        toggleDataBtn.addEventListener('click', () => {
            solarExperience.classList.toggle('data-open');
            solarExperience.classList.toggle('data-close');
            toggleDataBtn.classList.toggle('active');
        });
    }

    // Toggle Controls Panel
    if (toggleControlsBtn) {
        toggleControlsBtn.addEventListener('click', () => {
            solarExperience.classList.toggle('controls-open');
            solarExperience.classList.toggle('controls-close');
            toggleControlsBtn.classList.toggle('active');
        });
    }

    // Planet Selection Link Clicks
    dataLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const planetClass = link.getAttribute('class').replace(' active', '');
            if (solarSystem) {
                solarSystem.className = planetClass;
            }
            dataLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // View 2D / 3D Toggle
    if (ctrlViewCheck) {
        ctrlViewCheck.addEventListener('change', () => {
            if (solarExperience.classList.contains('view-3D')) {
                solarExperience.classList.remove('view-3D');
                solarExperience.classList.add('view-2D');
            } else {
                solarExperience.classList.remove('view-2D');
                solarExperience.classList.add('view-3D');
            }
        });
    }

    // Zoom Large / Close Toggle
    if (ctrlZoomCheck) {
        ctrlZoomCheck.addEventListener('change', () => {
            if (solarExperience.classList.contains('zoom-large')) {
                solarExperience.classList.remove('zoom-large');
                solarExperience.classList.add('zoom-close');
            } else {
                solarExperience.classList.remove('zoom-close');
                solarExperience.classList.add('zoom-large');
            }
        });
    }

    // Scale Controls (Speed, Size, Distance)
    const setScale = (scaleClass) => {
        if (universe) {
            universe.className = scaleClass;
        }
    };

    if (setSpeedRadio) {
        setSpeedRadio.addEventListener('change', () => setScale('scale-stretched set-speed'));
    }
    if (setSizeRadio) {
        setSizeRadio.addEventListener('change', () => setScale('scale-s set-size'));
    }
    if (setDistanceRadio) {
        setDistanceRadio.addEventListener('change', () => setScale('scale-d set-distance'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initCosmicBackground();
    initClock();
    initDashboardClock();
    initShortcutsManager();
    initTasksManager();
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
    const homeContent = document.getElementById('home-content');
    const apodContent = document.getElementById('apod-content');
    const solarContent = document.getElementById('solar-content');
    const loadingStatus = document.getElementById('loading-status');
    const navToday = document.getElementById('nav-today');

    const isTodayActive = navToday && navToday.classList.contains('active');

    // UI Loading Transition if Today tab is active or specific archive date selected
    if (isTodayActive || dateStr) {
        if (loadingStatus) {
            loadingStatus.textContent = dateStr 
                ? `RETRACTING ARCHIVE ENTRY: ${dateStr}...` 
                : 'ESTABLISHING ORBITAL TRANSMISSION...';
        }
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (homeContent) homeContent.classList.add('hidden');
        if (apodContent) apodContent.classList.add('hidden');
        if (solarContent) solarContent.classList.add('hidden');
    }

    try {
        const data = await getAPOD(dateStr);
        currentAPOD = data;
        renderAPOD(data);

        // Transition Content In with Staggered Reveal Sequence if on Today tab or archive
        if (isTodayActive || dateStr) {
            if (loadingState) loadingState.classList.add('hidden');
            if (apodContent) apodContent.classList.remove('hidden');
        }
    } catch (err) {
        console.error('NASA APOD Transmission Failure:', err);
        if (isTodayActive || dateStr) {
            showError(err.message || 'Unable to establish orbital connection with NASA APOD.');
        }
    } finally {
        isFetching = false;
    }
}

function renderAPOD(data) {
    // Header & Titles
    document.getElementById('apod-main-title').textContent = data.title;
    document.getElementById('apod-main-date').textContent = formatDate(data.date);
    document.getElementById('apod-explanation').textContent = data.explanation;
    
    // Update Dashboard News Widget Card
    const newsTitle = document.getElementById('widget-news-title');
    const newsExcerpt = document.getElementById('widget-news-excerpt');
    const newsImg = document.getElementById('widget-news-img');
    if (newsTitle) newsTitle.textContent = data.title;
    if (newsExcerpt) newsExcerpt.textContent = data.explanation;
    if (newsImg && data.url && data.mediaType === 'image') {
        newsImg.src = data.url;
    }
    
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

function initAudioSynth() {
    const audioBtn = document.getElementById('audio-synth-btn');
    const audioText = document.getElementById('audio-status-text');

    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                
                // Deep Space Dual Oscillator Synthesizer Drone
                osc1 = audioCtx.createOscillator();
                osc2 = audioCtx.createOscillator();
                gainNode = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A1 deep space rumble
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 harmonic chime

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(220, audioCtx.currentTime);

                gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                osc1.start();
                osc2.start();
            } catch (e) {
                console.warn('AudioContext failed:', e);
                return;
            }
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isAudioPlaying) {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value || 0.0001, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
            isAudioPlaying = true;
            if (audioText) audioText.textContent = 'AUDIO ON';
            audioBtn.classList.add('active-audio');
        } else {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
            isAudioPlaying = false;
            if (audioText) audioText.textContent = 'AUDIO OFF';
            audioBtn.classList.remove('active-audio');
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
        let ampmSuffix = ' UTC';

        if (!is24Hour) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            ampmSuffix = ` ${ampm} UTC`;
        }

        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        if (clockText) clockText.textContent = `${hStr}:${mStr}:${sStr}${ampmSuffix}`;
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


// --- MINIMAL NEW TAB DASHBOARD ENGINE ---

function initDashboardClock() {
    const clockTime = document.getElementById('home-clock-time');
    const clockDate = document.getElementById('home-clock-date');

    function updateHomeClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeStr = hours + ':' + minutes + ' ' + ampm;

        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        if (clockTime) clockTime.textContent = timeStr;
        if (clockDate) clockDate.textContent = dateStr;
    }

    updateHomeClock();
    setInterval(updateHomeClock, 1000);
}

// SVG Vector Icon Generator (No Emojis)
function getShortcutSvg(name) {
    const key = (name || '').toLowerCase();
    if (key.includes('github')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
    }
    if (key.includes('linkedin')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`;
    }
    if (key.includes('donate') || key.includes('coffee')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
    }
    if (key.includes('apod') || key.includes('nasa')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`;
    }
    if (key.includes('hack')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>`;
    }
    if (key.includes('chatgpt') || key.includes('ai') || key.includes('bot')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>`;
    }
    if (key.includes('youtube') || key.includes('video')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    }
    if (key.includes('twitter') || key.includes('x')) {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
}

// Shortcuts Manager
const DEFAULT_SHORTCUTS = [
    { id: '1', name: 'GitHub', url: 'https://github.com/susantedit' },
    { id: '2', name: 'LinkedIn', url: 'https://linkedin.com/in/kantaraj-luitel' },
    { id: '3', name: 'Donate', url: 'https://buymeacoffee.com/Susantedit' },
    { id: '4', name: 'APOD', url: 'https://apod.nasa.gov/apod/' },
    { id: '5', name: 'Hack Club', url: 'https://stardance.hackclub.com/' },
    { id: '6', name: 'ChatGPT', url: 'https://chatgpt.com' },
    { id: '7', name: 'YouTube', url: 'https://youtube.com' },
    { id: '8', name: 'X / Twitter', url: 'https://x.com/Susantedit' }
];

function initShortcutsManager() {
    const grid = document.getElementById('shortcuts-grid');
    const addBtn = document.getElementById('add-shortcut-btn');
    const modal = document.getElementById('shortcut-modal');
    const closeBtn = document.getElementById('close-shortcut-btn');
    const form = document.getElementById('shortcut-form');
    const nameInput = document.getElementById('shortcut-name');
    const urlInput = document.getElementById('shortcut-url');

    function getShortcuts() {
        const saved = localStorage.getItem('cosmic_shortcuts_v1');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        localStorage.setItem('cosmic_shortcuts_v1', JSON.stringify(DEFAULT_SHORTCUTS));
        return DEFAULT_SHORTCUTS;
    }

    function saveShortcuts(list) {
        localStorage.setItem('cosmic_shortcuts_v1', JSON.stringify(list));
        render();
    }

    function render() {
        if (!grid) return;
        const list = getShortcuts();
        grid.innerHTML = '';

        list.forEach(item => {
            const el = document.createElement('a');
            el.className = 'shortcut-item';
            el.href = item.url;
            el.target = '_blank';
            el.rel = 'noopener noreferrer';

            el.innerHTML = '<button type="button" class="shortcut-delete" data-id="' + item.id + '" title="Remove Shortcut">×</button>' +
                '<div class="shortcut-icon-frame">' + getShortcutSvg(item.name) + '</div>' +
                '<span class="shortcut-label">' + item.name + '</span>';

            const delBtn = el.querySelector('.shortcut-delete');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newList = getShortcuts().filter(s => s.id !== item.id);
                    saveShortcuts(newList);
                });
            }

            grid.appendChild(el);
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (modal) modal.classList.remove('hidden');
            if (nameInput) nameInput.focus();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            if (name && url) {
                const list = getShortcuts();
                list.push({ id: Date.now().toString(), name, url, icon: '🔗' });
                saveShortcuts(list);
                nameInput.value = '';
                urlInput.value = '';
                if (modal) modal.classList.add('hidden');
            }
        });
    }

    render();
}

// Tasks / To-Do Tracker Manager
const DEFAULT_TASKS = [
    { id: 't1', text: 'Explore daily NASA APOD discovery', completed: true },
    { id: 't2', text: 'Orbit through 3D Solar System', completed: false }
];

function initTasksManager() {
    const listEl = document.getElementById('tasks-list');
    const form = document.getElementById('task-input-form');
    const input = document.getElementById('task-input');
    const dateTitle = document.getElementById('widget-task-date');

    if (dateTitle) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
        dateTitle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ' + formattedDate;
    }

    function getTasks() {
        const saved = localStorage.getItem('cosmic_tasks_v1');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        localStorage.setItem('cosmic_tasks_v1', JSON.stringify(DEFAULT_TASKS));
        return DEFAULT_TASKS;
    }

    function saveTasks(list) {
        localStorage.setItem('cosmic_tasks_v1', JSON.stringify(list));
        render();
    }

    function render() {
        if (!listEl) return;
        const tasks = getTasks();
        listEl.innerHTML = '';

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = 'task-item ' + (t.completed ? 'completed' : '');
            li.innerHTML = '<label class="task-checkbox-wrap">' +
                '<input type="checkbox" class="task-checkbox" ' + (t.completed ? 'checked' : '') + '>' +
                '<span class="task-text">' + t.text + '</span>' +
                '</label>' +
                '<button type="button" class="task-delete-btn" title="Delete Task">✕</button>';

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => {
                t.completed = checkbox.checked;
                saveTasks(tasks);
            });

            const delBtn = li.querySelector('.task-delete-btn');
            delBtn.addEventListener('click', () => {
                const newList = getTasks().filter(item => item.id !== t.id);
                saveTasks(newList);
            });

            listEl.appendChild(li);
        });
    }

    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                const tasks = getTasks();
                tasks.push({ id: Date.now().toString(), text, completed: false });
                saveTasks(tasks);
                input.value = '';
            }
        });
    }

    render();
}

// --- MAIN APPLICATION INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initStarfield === 'function') initStarfield();
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initAudioSynth === 'function') initAudioSynth();
    if (typeof initClock === 'function') initClock();
    if (typeof initKeyboardShortcuts === 'function') initKeyboardShortcuts();
    if (typeof initDashboardClock === 'function') initDashboardClock();
    if (typeof initShortcutsManager === 'function') initShortcutsManager();
    if (typeof initTasksManager === 'function') initTasksManager();
    if (typeof loadAPOD === 'function') loadAPOD();
    if (typeof initLunarEphemeris === 'function') initLunarEphemeris();
    if (typeof initISSTelemetry === 'function') initISSTelemetry();
    if (typeof initScratchpad === 'function') initScratchpad();

});


// --- LUNAR EPHEMERIS CALCULATOR ENGINE ---
function initLunarEphemeris() {
    const badge = document.getElementById('moon-phase-badge');
    const illuminationEl = document.getElementById('moon-illumination');
    const ageEl = document.getElementById('moon-age');
    const nextFullEl = document.getElementById('next-full-moon');
    const shadowPath = document.getElementById('moon-phase-shadow');

    function calculateMoonPhase(date = new Date()) {
        // Known reference new moon: Jan 6, 2000, 18:14 UTC
        const refDate = new Date('2000-01-06T18:14:00Z');
        const synodicMonth = 29.53058770576; // days
        const diffDays = (date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
        const phase = (diffDays % synodicMonth) / synodicMonth; // 0 to 1
        const normalizedPhase = phase < 0 ? phase + 1 : phase;
        const age = normalizedPhase * synodicMonth;
        const illumination = ((1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2) * 100;

        let phaseName = 'NEW MOON';
        if (normalizedPhase < 0.03 || normalizedPhase > 0.97) phaseName = 'NEW MOON';
        else if (normalizedPhase < 0.22) phaseName = 'WAXING CRESCENT';
        else if (normalizedPhase < 0.28) phaseName = 'FIRST QUARTER';
        else if (normalizedPhase < 0.47) phaseName = 'WAXING GIBBOUS';
        else if (normalizedPhase < 0.53) phaseName = 'FULL MOON';
        else if (normalizedPhase < 0.72) phaseName = 'WANING GIBBOUS';
        else if (normalizedPhase < 0.78) phaseName = 'LAST QUARTER';
        else phaseName = 'WANING CRESCENT';

        // Days to next full moon (phase 0.5)
        let daysToFull = (0.5 - normalizedPhase) * synodicMonth;
        if (daysToFull < 0) daysToFull += synodicMonth;

        return {
            phase: normalizedPhase,
            age: age.toFixed(1),
            illumination: illumination.toFixed(1),
            phaseName,
            daysToFull: Math.round(daysToFull)
        };
    }

    const moonData = calculateMoonPhase();
    if (badge) badge.textContent = moonData.phaseName;
    if (illuminationEl) illuminationEl.textContent = moonData.illumination + '%';
    if (ageEl) ageEl.textContent = moonData.age + ' DAYS';
    if (nextFullEl) nextFullEl.textContent = moonData.daysToFull === 0 ? 'TONIGHT' : 'IN ' + moonData.daysToFull + ' DAYS';

    // Update dynamic SVG moon shadow curve
    if (shadowPath) {
        const p = moonData.phase;
        if (p >= 0.5) {
            // Waning
            const offset = (p - 0.5) * 2; // 0 to 1
            const rx = 46 * (1 - offset * 2);
            shadowPath.setAttribute('d', `M 50 4 A 46 46 0 0 0 50 96 A ${Math.abs(rx)} 46 0 0 ${rx >= 0 ? 0 : 1} 50 4`);
        } else {
            // Waxing
            const offset = p * 2; // 0 to 1
            const rx = 46 * (1 - offset * 2);
            shadowPath.setAttribute('d', `M 50 4 A 46 46 0 0 1 50 96 A ${Math.abs(rx)} 46 0 0 ${rx >= 0 ? 1 : 0} 50 4`);
        }
    }
}

// --- ISS LIVE TELEMETRY SIMULATOR ENGINE ---
function initISSTelemetry() {
    const speedEl = document.getElementById('iss-speed');
    const altEl = document.getElementById('iss-alt');
    const coordsEl = document.getElementById('iss-coords');

    let baseLat = 28.4;
    let baseLon = 84.1;
    let baseSpeed = 27580;
    let baseAlt = 418.6;

    function updateISSTelemetry() {
        // Natural orbital micro-fluctuation
        const speedDelta = (Math.random() * 4 - 2);
        const altDelta = (Math.random() * 0.4 - 0.2);
        
        baseSpeed = Math.round(27580 + speedDelta);
        baseAlt = +(418.6 + altDelta).toFixed(1);
        
        baseLat = +(baseLat + 0.15).toFixed(2);
        if (baseLat > 51.6) baseLat = -51.6; // ISS orbital inclination bound
        
        baseLon = +(baseLon + 0.35).toFixed(2);
        if (baseLon > 180) baseLon = -180;

        const latDir = baseLat >= 0 ? 'N' : 'S';
        const lonDir = baseLon >= 0 ? 'E' : 'W';

        if (speedEl) speedEl.textContent = baseSpeed.toLocaleString();
        if (altEl) altEl.textContent = baseAlt;
        if (coordsEl) coordsEl.textContent = `LAT: ${Math.abs(baseLat)}° ${latDir} | LON: ${Math.abs(baseLon)}° ${lonDir} • ORBIT #142,890`;
    }

    updateISSTelemetry();
    setInterval(updateISSTelemetry, 3500);
}

// --- COSMIC SCRATCHPAD & QUICK NOTES ENGINE ---
function initScratchpad() {
    const textarea = document.getElementById('scratchpad-input');
    const countEl = document.getElementById('notes-char-count');
    const statusEl = document.getElementById('notes-save-status');
    const copyBtn = document.getElementById('copy-notes-btn');
    const clearBtn = document.getElementById('clear-notes-btn');

    if (!textarea) return;

    function updateCounts(text) {
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (countEl) countEl.textContent = `${chars} chars • ${words} words`;
    }

    // Load saved notes
    const saved = localStorage.getItem('cosmic_scratchpad_v1');
    if (saved) {
        textarea.value = saved;
        updateCounts(saved);
    }

    let saveTimeout = null;
    textarea.addEventListener('input', () => {
        const val = textarea.value;
        updateCounts(val);
        if (statusEl) statusEl.textContent = 'SAVING...';

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('cosmic_scratchpad_v1', val);
            if (statusEl) statusEl.textContent = 'AUTO-SAVED';
        }, 400);
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const val = textarea.value;
            if (val) {
                navigator.clipboard.writeText(val).then(() => {
                    if (statusEl) {
                        const prev = statusEl.textContent;
                        statusEl.textContent = 'COPIED TO CLIPBOARD!';
                        setTimeout(() => { statusEl.textContent = prev; }, 1800);
                    }
                }).catch(() => {});
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (textarea.value && confirm('Clear all cosmic scratchpad notes?')) {
                textarea.value = '';
                localStorage.removeItem('cosmic_scratchpad_v1');
                updateCounts('');
                if (statusEl) statusEl.textContent = 'CLEARED';
            }
        });
    }
}
