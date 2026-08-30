document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initGreeting();
    fetchNasaData();
    initQuickLinks();
    initModals();
});

// --- Clock & Date ---
function initClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        
        // Format time
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        clockEl.textContent = `${hours}:${minutes}`;

        // Format date
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// --- Greeting ---
function initGreeting() {
    const greetingEl = document.getElementById('greeting');
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
    const nasaInfoEl = document.getElementById('nasa-info');
    const bgContainer = document.getElementById('bg-container');
    const apodTitleEl = document.getElementById('apod-title');
    const apodDescEl = document.getElementById('apod-desc');
    
    try {
        // We use DEMO_KEY for simplicity, but rate limits apply.
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await response.json();

        if (data.media_type === 'image') {
            // Set background
            bgContainer.style.backgroundImage = `url('${data.hdurl || data.url}')`;
            
            // Set info
            nasaInfoEl.innerHTML = `
                <strong>NASA APOD</strong>
                <p>${data.title}</p>
            `;
            
            // Set modal info
            apodTitleEl.textContent = data.title;
            apodDescEl.textContent = data.explanation;
        } else {
            // Fallback for video or other media
            fallbackBackground();
        }
    } catch (error) {
        console.error('Failed to fetch NASA APOD:', error);
        fallbackBackground();
    }
}

function fallbackBackground() {
    const bgContainer = document.getElementById('bg-container');
    const nasaInfoEl = document.getElementById('nasa-info');
    bgContainer.style.backgroundImage = `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`;
    nasaInfoEl.innerHTML = `
        <strong>Space View</strong>
        <p>Earth from orbit (Fallback)</p>
    `;
}

// --- Quick Links (LocalStorage) ---
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
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'link-item';
        a.title = link.title;
        
        // Extract domain for favicon if icon is not provided
        let iconUrl = link.icon;
        if (!iconUrl) {
            try {
                const domain = new URL(link.url).hostname;
                iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch(e) {
                iconUrl = ''; // fallback
            }
        }

        if (iconUrl) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = link.title;
            a.appendChild(img);
        } else {
            a.textContent = link.title.charAt(0).toUpperCase();
        }

        container.appendChild(a);
    });
}

function addLink(title, url) {
    let savedLinks = JSON.parse(localStorage.getItem('nasaTabLinks')) || [];
    savedLinks.push({ title, url });
    localStorage.setItem('nasaTabLinks', JSON.stringify(savedLinks));
    initQuickLinks(); // Re-render
}

// --- Modals and Interactions ---
function initModals() {
    // Add Link Modal
    const addLinkBtn = document.getElementById('add-link-btn');
    const linkModal = document.getElementById('link-modal');
    const cancelLinkBtn = document.getElementById('cancel-link');
    const addLinkForm = document.getElementById('add-link-form');

    addLinkBtn.addEventListener('click', () => {
        linkModal.classList.remove('hidden');
        document.getElementById('link-title').focus();
    });

    cancelLinkBtn.addEventListener('click', () => {
        linkModal.classList.add('hidden');
        addLinkForm.reset();
    });

    addLinkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('link-title').value;
        const url = document.getElementById('link-url').value;
        
        // Basic URL formatting
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        
        addLink(title, formattedUrl);
        linkModal.classList.add('hidden');
        addLinkForm.reset();
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });

    // APOD Info Modal
    const nasaInfo = document.getElementById('nasa-info');
    const apodModal = document.getElementById('apod-modal');
    const closeApodBtn = document.getElementById('close-apod');

    nasaInfo.addEventListener('click', () => {
        apodModal.classList.remove('hidden');
    });

    closeApodBtn.addEventListener('click', () => {
        apodModal.classList.add('hidden');
    });
}
