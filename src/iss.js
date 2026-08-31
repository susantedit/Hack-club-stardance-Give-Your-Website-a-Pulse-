export function initISS() {
    const speedEl = document.getElementById('iss-speed');
    const altEl = document.getElementById('iss-alt');
    const coordsEl = document.getElementById('iss-coords');

    let baseLat = 28.4;
    let baseLon = 84.1;
    let baseSpeed = 27580;
    let baseAlt = 418.6;

    function updateISS() {
        const speedDelta = (Math.random() * 4 - 2);
        const altDelta = (Math.random() * 0.4 - 0.2);

        baseSpeed = Math.round(27580 + speedDelta);
        baseAlt = +(418.6 + altDelta).toFixed(1);

        baseLat = +(baseLat + 0.15).toFixed(2);
        if (baseLat > 51.6) baseLat = -51.6;

        baseLon = +(baseLon + 0.35).toFixed(2);
        if (baseLon > 180) baseLon = -180;

        const latDir = baseLat >= 0 ? 'N' : 'S';
        const lonDir = baseLon >= 0 ? 'E' : 'W';

        if (speedEl) speedEl.textContent = baseSpeed.toLocaleString();
        if (altEl) altEl.textContent = baseAlt;
        if (coordsEl) coordsEl.textContent = `LAT: ${Math.abs(baseLat)}° ${latDir} | LON: ${Math.abs(baseLon)}° ${lonDir} • ORBIT #142,890`;
    }

    updateISS();
    setInterval(updateISS, 3500);
}
