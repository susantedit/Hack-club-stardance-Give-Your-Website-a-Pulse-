const API_BASE = 'https://api.nasa.gov/planetary/apod';
const apodCache = new Map();

let currentAPOD = null;
let lastRequestedDate = '';
let isFetching = false;

export async function fetchAPOD(dateStr = '') {
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
        throw new Error(errorData.msg || errorData.error?.message || `NASA API error (${response.status})`);
    }

    const raw = await response.json();

    let mediaType = 'image';
    if (raw.media_type === 'video') {
        if (raw.url && (raw.url.includes('youtube.com') || raw.url.includes('youtu.be'))) {
            mediaType = 'youtube';
        } else {
            mediaType = 'video';
        }
    }

    const record = {
        title: raw.title || 'Untitled Discovery',
        date: raw.date || new Date().toISOString().split('T')[0],
        explanation: raw.explanation || 'No explanation provided for this image.',
        mediaType,
        url: raw.url || '',
        hdUrl: raw.hdurl || raw.url || '',
        copyright: raw.copyright ? `© ${raw.copyright.trim()}` : ''
    };

    apodCache.set(cacheKey, record);
    return record;
}

export async function loadAPOD(dateStr = '') {
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

    if (isTodayActive || dateStr) {
        if (loadingStatus) {
            loadingStatus.textContent = dateStr
                ? `Loading archive record for ${dateStr}...`
                : 'Loading NASA Astronomy Picture of the Day...';
        }
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (homeContent) homeContent.classList.add('hidden');
        if (apodContent) apodContent.classList.add('hidden');
        if (solarContent) solarContent.classList.add('hidden');
    }

    try {
        const data = await fetchAPOD(dateStr);
        currentAPOD = data;
        renderAPOD(data);

        if (isTodayActive || dateStr) {
            if (loadingState) loadingState.classList.add('hidden');
            if (apodContent) apodContent.classList.remove('hidden');
        }
    } catch (err) {
        console.error('APOD fetch error:', err);
        if (isTodayActive || dateStr) {
            showError(err.message || 'Unable to connect to NASA APOD service.');
        }
    } finally {
        isFetching = false;
    }
}

function renderAPOD(data) {
    const titleEl = document.getElementById('apod-main-title');
    const dateEl = document.getElementById('apod-main-date');
    const explanationEl = document.getElementById('apod-explanation');

    if (titleEl) titleEl.textContent = data.title;
    if (dateEl) dateEl.textContent = data.date;
    if (explanationEl) explanationEl.textContent = data.explanation;

    // Home widget update
    const newsTitle = document.getElementById('widget-news-title');
    const newsExcerpt = document.getElementById('widget-news-excerpt');
    const newsImg = document.getElementById('widget-news-img');
    if (newsTitle) newsTitle.textContent = data.title;
    if (newsExcerpt) newsExcerpt.textContent = data.explanation;
    if (newsImg && data.url && data.mediaType === 'image') {
        newsImg.src = data.url;
    }

    // Header copyright
    const copyrightBadge = document.getElementById('apod-copyright-badge');
    if (copyrightBadge) {
        if (data.copyright) {
            copyrightBadge.textContent = data.copyright;
            copyrightBadge.classList.remove('hidden');
        } else {
            copyrightBadge.classList.add('hidden');
        }
    }

    // Log panel details
    const logTitle = document.getElementById('log-apod-title');
    const logDate = document.getElementById('log-apod-date');
    const logCopyright = document.getElementById('log-apod-copyright');
    if (logTitle) logTitle.textContent = data.title;
    if (logDate) logDate.textContent = data.date;
    if (logCopyright) {
        if (data.copyright) {
            logCopyright.textContent = data.copyright;
            logCopyright.classList.remove('hidden');
        } else {
            logCopyright.classList.add('hidden');
        }
    }

    const hudMediaType = document.getElementById('hud-media-type');
    const hudDate = document.getElementById('hud-date');
    if (hudMediaType) hudMediaType.textContent = data.mediaType.toUpperCase();
    if (hudDate) hudDate.textContent = data.date;

    renderMedia(data);
}

function renderMedia(data) {
    const imageBox = document.getElementById('media-image-box');
    const youtubeBox = document.getElementById('media-youtube-box');
    const videoBox = document.getElementById('media-video-box');
    const unsupportedBox = document.getElementById('media-unsupported-box');

    imageBox.classList.add('hidden');
    youtubeBox.classList.add('hidden');
    videoBox.classList.add('hidden');
    unsupportedBox.classList.add('hidden');

    if (!data.url) {
        unsupportedBox.classList.remove('hidden');
        return;
    }

    if (data.mediaType === 'image') {
        const img = document.getElementById('apod-image');
        const hdLink = document.getElementById('hd-link');

        img.onerror = () => {
            unsupportedBox.classList.remove('hidden');
        };

        img.src = data.url;
        img.alt = data.title;

        if (hdLink) {
            hdLink.href = data.hdUrl || data.url;
            hdLink.classList.remove('hidden');
        }

        imageBox.classList.remove('hidden');
    } else if (data.mediaType === 'youtube') {
        const iframe = document.getElementById('apod-youtube');
        let embedUrl = data.url;

        const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`;
        }

        iframe.src = embedUrl;
        youtubeBox.classList.remove('hidden');
    } else if (data.mediaType === 'video') {
        const video = document.getElementById('apod-video');
        const videoSrc = document.getElementById('apod-video-src');

        video.onerror = () => {
            unsupportedBox.classList.remove('hidden');
        };

        videoSrc.src = data.url;
        video.load();
        videoBox.classList.remove('hidden');
    } else {
        const unsupportedLink = document.getElementById('unsupported-link');
        if (unsupportedLink) unsupportedLink.href = data.url;
        unsupportedBox.classList.remove('hidden');
    }
}

function showError(msg) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const apodContent = document.getElementById('apod-content');
    const errorMsg = document.getElementById('error-message');

    if (loadingState) loadingState.classList.add('hidden');
    if (apodContent) apodContent.classList.add('hidden');
    if (errorMsg) errorMsg.textContent = msg;
    if (errorState) errorState.classList.remove('hidden');
}
