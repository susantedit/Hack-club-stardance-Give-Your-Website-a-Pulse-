export function initNotes() {
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

    const saved = localStorage.getItem('cosmora_notes_v1');
    if (saved) {
        textarea.value = saved;
        updateCounts(saved);
    }

    let saveTimeout = null;
    textarea.addEventListener('input', () => {
        const val = textarea.value;
        updateCounts(val);
        if (statusEl) statusEl.textContent = 'Saving...';

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('cosmora_notes_v1', val);
            if (statusEl) statusEl.textContent = 'Saved';
        }, 400);
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const val = textarea.value;
            if (val) {
                navigator.clipboard.writeText(val).then(() => {
                    if (statusEl) {
                        const prev = statusEl.textContent;
                        statusEl.textContent = 'Copied to clipboard';
                        setTimeout(() => { statusEl.textContent = prev; }, 1800);
                    }
                }).catch(() => {});
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (textarea.value && confirm('Clear all scratchpad notes?')) {
                textarea.value = '';
                localStorage.removeItem('cosmora_notes_v1');
                updateCounts('');
                if (statusEl) statusEl.textContent = 'Cleared';
            }
        });
    }
}
