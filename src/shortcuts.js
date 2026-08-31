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

function getShortcutIcon(name) {
    const key = (name || '').toLowerCase();
    if (key.includes('github')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';
    }
    if (key.includes('linkedin')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>';
    }
    if (key.includes('donate') || key.includes('coffee')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>';
    }
    if (key.includes('apod') || key.includes('nasa')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>';
    }
    if (key.includes('hack')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"/></svg>';
    }
    if (key.includes('chatgpt') || key.includes('ai')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>';
    }
    if (key.includes('youtube') || key.includes('video')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
    }
    if (key.includes('twitter') || key.includes('x')) {
        return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
    }
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
}

export function initShortcuts() {
    const grid = document.getElementById('shortcuts-grid');
    const addBtn = document.getElementById('add-shortcut-btn');
    const modal = document.getElementById('shortcut-modal');
    const closeBtn = document.getElementById('close-shortcut-btn');
    const form = document.getElementById('shortcut-form');
    const nameInput = document.getElementById('shortcut-name');
    const urlInput = document.getElementById('shortcut-url');

    function getShortcuts() {
        const saved = localStorage.getItem('cosmora_shortcuts_v1');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        localStorage.setItem('cosmora_shortcuts_v1', JSON.stringify(DEFAULT_SHORTCUTS));
        return DEFAULT_SHORTCUTS;
    }

    function saveShortcuts(list) {
        localStorage.setItem('cosmora_shortcuts_v1', JSON.stringify(list));
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

            el.innerHTML = `<button type="button" class="shortcut-delete" data-id="${item.id}" title="Remove Shortcut">×</button>
                <div class="shortcut-icon-frame">${getShortcutIcon(item.name)}</div>
                <span class="shortcut-label">${item.name}</span>`;

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
                list.push({ id: Date.now().toString(), name, url });
                saveShortcuts(list);
                nameInput.value = '';
                urlInput.value = '';
                if (modal) modal.classList.add('hidden');
            }
        });
    }

    render();
}
