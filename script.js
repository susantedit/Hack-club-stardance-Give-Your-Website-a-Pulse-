document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initClock();
    initGreeting();
    fetchNasaData();
    initQuickLinks();
    initModals();
    initKeyboardShortcuts();
});

// --- Starfield Particle Animation ---
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const starCount = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createStars();
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.5,
                alpha: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.005 + 0.002
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.alpha += Math.sin(Date.now() * star.speed) * 0.01;
            const currentAlpha = Math.max(0.1, Math.min(0.9, star.alpha));
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

// --- Clock & Date (with 12h/24h toggle) ---
let is24HourFormat = localStorage.getItem('nasaTab24h') === 'true';

function initClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    const clockBtn = document.getElementById('clock-btn');

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        if (!is24HourFormat) {
            hours = hours % 12 || 12;
        }

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        clockEl.textContent = `${hours}:${minutes}`;

        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    if (clockBtn) {
        clockBtn.addEventListener('click', () => {
            is24HourFormat = !is24HourFormat;
            localStorage.setItem('nasaTab24h', is24HourFormat);
            updateTime();
        });
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// --- Greeting ---
function initGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting = 'Good evening, Explorer.';

    if (hour >= 5 && hour < 12) {
        greeting = 'Good morning, Explorer.';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Good afternoon, Explorer.';
    }

    greetingEl.textContent = greeting;
}

// --- NASA APOD API Integration ---
async function fetchNasaData() {
    const nasaTitleEl = document.getElementById('nasa-title');
    const bgContainer = document.getElementById('bg-container');
    const apodTitleEl = document.getElementById('apod-title');
    const apodDescEl = document.getElementById('apod-desc');
    const apodDateEl = document.getElementById('apod-date');
    
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();

        if (data.media_type === 'image' && (data.hdurl || data.url)) {
            bgContainer.style.backgroundImage = `url('${data.hdurl || data.url}')`;
            if (nasaTitleEl) nasaTitleEl.textContent = data.title;
            if (apodTitleEl) apodTitleEl.textContent = data.title;
            if (apodDescEl) apodDescEl.textContent = data.explanation;
            if (apodDateEl) apodDateEl.textContent = data.date;
        } else {
            fallbackBackground();
        }
    } catch (error) {
        console.error('Failed to fetch NASA APOD:', error);
        fallbackBackground();
    }
}

function fallbackBackground() {
    const bgContainer = document.getElementById('bg-container');
    const nasaTitleEl = document.getElementById('nasa-title');
    const apodTitleEl = document.getElementById('apod-title');
    const apodDescEl = document.getElementById('apod-desc');

    bgContainer.style.backgroundImage = `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`;
    if (nasaTitleEl) nasaTitleEl.textContent = 'Earth from Orbit (Cosmic View)';
    if (apodTitleEl) apodTitleEl.textContent = 'Earth from Orbit';
    if (apodDescEl) apodDescEl.textContent = 'A vibrant satellite capture of planet Earth showing atmospheric layers and night lights.';
}

// --- Quick Links (LocalStorage + Delete) ---
const defaultLinks = [
    { title: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/favicons/favicon.svg' },
    { title: 'Hack Club', url: 'https://hackclub.com', icon: 'https://assets.hackclub.com/icon-rounded.png' },
    { title: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/s/desktop/100e4cd8/img/favicon_32x32.png' }
];

function initQuickLinks() {
    const linksContainer = document.getElementById('quick-links');
    let savedLinks = JSON.parse(localStorage.getItem('nasaTabLinks'));

    if (!savedLinks || savedLinks.length === 0) {
        savedLinks = defaultLinks;
        localStorage.setItem('nasaTabLinks', JSON.stringify(savedLinks));
    }

    renderLinks(savedLinks, linksContainer);
}

function renderLinks(links, container) {
    container.innerHTML = '';
    links.forEach((link, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'link-wrapper';

        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'link-item';
        a.title = link.title;
        a.ariaLabel = link.title;
        
        let iconUrl = link.icon;
        if (!iconUrl) {
            try {
                const domain = new URL(link.url).hostname;
                iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch(e) {
                iconUrl = '';
            }
        }

        if (iconUrl) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = link.title;
            img.onerror = () => {
                img.style.display = 'none';
                a.textContent = link.title.charAt(0).toUpperCase();
            };
            a.appendChild(img);
        } else {
            a.textContent = link.title.charAt(0).toUpperCase();
        }

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-link-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = `Remove ${link.title}`;
        delBtn.ariaLabel = `Remove ${link.title}`;
        delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeLink(index);
        });

        wrapper.appendChild(a);
        wrapper.appendChild(delBtn);
        container.appendChild(wrapper);
    });
}

function addLink(title, url) {
    let savedLinks = JSON.parse(localStorage.getItem('nasaTabLinks')) || [];
    savedLinks.push({ title, url });
    localStorage.setItem('nasaTabLinks', JSON.stringify(savedLinks));
    initQuickLinks();
}

function removeLink(index) {
    let savedLinks = JSON.parse(localStorage.getItem('nasaTabLinks')) || [];
    savedLinks.splice(index, 1);
    localStorage.setItem('nasaTabLinks', JSON.stringify(savedLinks));
    initQuickLinks();
}

// --- Keyboard Shortcuts & Modals ---
function initKeyboardShortcuts() {
    const searchInput = document.getElementById('search-input');
    
    document.addEventListener('keydown', (e) => {
        // Press '/' to focus search input if not typing in input
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
        
        // Press 'Escape' to close active modal
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });
}

function initModals() {
    const addLinkBtn = document.getElementById('add-link-btn');
    const linkModal = document.getElementById('link-modal');
    const cancelLinkBtn = document.getElementById('cancel-link');
    const addLinkForm = document.getElementById('add-link-form');

    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', () => {
            linkModal.classList.remove('hidden');
            document.getElementById('link-title').focus();
        });
    }

    if (cancelLinkBtn) {
        cancelLinkBtn.addEventListener('click', () => {
            linkModal.classList.add('hidden');
            addLinkForm.reset();
        });
    }

    if (addLinkForm) {
        addLinkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('link-title').value.trim();
            const url = document.getElementById('link-url').value.trim();
            
            if (title && url) {
                const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                addLink(title, formattedUrl);
                linkModal.classList.add('hidden');
                addLinkForm.reset();
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    const nasaInfo = document.getElementById('nasa-info');
    const apodModal = document.getElementById('apod-modal');
    const closeApodBtn = document.getElementById('close-apod');

    if (nasaInfo) {
        nasaInfo.addEventListener('click', () => {
            apodModal.classList.remove('hidden');
        });
    }

    if (closeApodBtn) {
        closeApodBtn.addEventListener('click', () => {
            apodModal.classList.add('hidden');
        });
    }
}
