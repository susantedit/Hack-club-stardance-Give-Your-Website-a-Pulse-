export function initLunar() {
    const badge = document.getElementById('moon-phase-badge');
    const illuminationEl = document.getElementById('moon-illumination');
    const ageEl = document.getElementById('moon-age');
    const nextFullEl = document.getElementById('next-full-moon');
    const shadowPath = document.getElementById('moon-phase-shadow');

    function calculateMoonPhase(date = new Date()) {
        // Reference new moon: Jan 6, 2000, 18:14 UTC
        const refDate = new Date('2000-01-06T18:14:00Z');
        const synodicMonth = 29.53058770576;
        const diffDays = (date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
        const phase = (diffDays % synodicMonth) / synodicMonth;
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
    if (nextFullEl) nextFullEl.textContent = moonData.daysToFull === 0 ? 'TONIGHT' : `IN ${moonData.daysToFull} DAYS`;

    if (shadowPath) {
        const p = moonData.phase;
        if (p >= 0.5) {
            const offset = (p - 0.5) * 2;
            const rx = 46 * (1 - offset * 2);
            shadowPath.setAttribute('d', `M 50 4 A 46 46 0 0 0 50 96 A ${Math.abs(rx)} 46 0 0 ${rx >= 0 ? 0 : 1} 50 4`);
        } else {
            const offset = p * 2;
            const rx = 46 * (1 - offset * 2);
            shadowPath.setAttribute('d', `M 50 4 A 46 46 0 0 1 50 96 A ${Math.abs(rx)} 46 0 0 ${rx >= 0 ? 1 : 0} 50 4`);
        }
    }
}
