let is24Hour = localStorage.getItem('cosmora_clock_24h') === 'true';

export function initClock() {
    const clockBtn = document.getElementById('clock-btn');
    const clockText = document.getElementById('hud-time');

    function updateTopClock() {
        const now = new Date();
        let hours = now.getUTCHours();
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        let suffix = ' UTC';

        if (!is24Hour) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            suffix = ` ${ampm} UTC`;
        }

        const hStr = String(hours).padStart(2, '0');
        if (clockText) {
            clockText.textContent = `${hStr}:${minutes}:${seconds}${suffix}`;
        }
    }

    if (clockBtn) {
        clockBtn.addEventListener('click', () => {
            is24Hour = !is24Hour;
            localStorage.setItem('cosmora_clock_24h', is24Hour);
            updateTopClock();
        });
    }

    updateTopClock();
    setInterval(updateTopClock, 1000);
}

export function initDashboardClock() {
    const clockTime = document.getElementById('home-clock-time');
    const clockDate = document.getElementById('home-clock-date');

    function updateHomeClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        if (clockTime) clockTime.textContent = `${hours}:${minutes} ${ampm}`;
        if (clockDate) clockDate.textContent = dateStr;
    }

    updateHomeClock();
    setInterval(updateHomeClock, 1000);
}
