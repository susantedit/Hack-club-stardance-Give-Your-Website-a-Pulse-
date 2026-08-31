export function initBackground() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let stars = [];
    let shootingStars = [];
    let animationFrameId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        stars = [];
        shootingStars = [];
        const count = window.innerWidth < 768 ? 200 : 450;

        for (let i = 0; i < count; i++) {
            const isFar = Math.random() > 0.3;
            const isFlare = !isFar && Math.random() < 0.12;

            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: isFlare ? Math.random() * 1.5 + 1.2 : (isFar ? Math.random() * 0.6 + 0.3 : Math.random() * 1.0 + 0.5),
                alpha: Math.random() * 0.7 + 0.2,
                twinkleSpeed: Math.random() * 0.015 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                driftX: isFar ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 0.1,
                driftY: isFar ? -(Math.random() * 0.12 + 0.04) : -(Math.random() * 0.24 + 0.08),
                isFar,
                isFlare
            });
        }
    }

    function spawnShootingStar() {
        if (Math.random() < 0.015 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.35,
                length: Math.random() * 70 + 40,
                speed: Math.random() * 9 + 5,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    function drawCrossStar(x, y, size, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = `rgba(180, 210, 255, ${alpha * 0.7})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, -size * 3);
        ctx.lineTo(0, size * 3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-size * 3, 0);
        ctx.lineTo(size * 3, 0);
        ctx.stroke();

        ctx.restore();
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];

            s.x += s.driftX;
            s.y += s.driftY;

            if (s.x < -10) s.x = canvas.width + 10;
            if (s.x > canvas.width + 10) s.x = -10;
            if (s.y < -10) s.y = canvas.height + 10;
            if (s.y > canvas.height + 10) s.y = -10;

            const alpha = Math.max(0.15, Math.min(0.95, s.alpha + Math.sin(now * s.twinkleSpeed + s.twinklePhase) * 0.35));

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);

            if (s.isFlare) {
                ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
                ctx.fill();
                drawCrossStar(s.x, s.y, s.radius, alpha);
            } else if (!s.isFar) {
                ctx.fillStyle = `rgba(185, 210, 255, ${alpha})`;
                ctx.fill();
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            }
        }

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
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        if (!document.hidden) {
            animationFrameId = requestAnimationFrame(render);
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(render);
        }
    });

    window.addEventListener('resize', resize);
    resize();
    render();

    // Mouse parallax for desktop
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (window.innerWidth > 768 && !isTouch) {
        const nebula = document.querySelector('.layer-nebula');
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
            targetX += (mouseX - targetX) * 0.035;
            targetY += (mouseY - targetY) * 0.035;

            if (canvas) canvas.style.transform = `translate3d(${targetX * 8}px, ${targetY * 8}px, 0)`;
            if (nebula) nebula.style.transform = `translate3d(${targetX * -14}px, ${targetY * -14}px, 0)`;
            if (planet1) planet1.style.transform = `translate3d(${targetX * -25}px, ${targetY * -25}px, 0)`;
            if (planet2) planet2.style.transform = `translate3d(${targetX * 12}px, ${targetY * 12}px, 0)`;

            if (!document.hidden) {
                requestAnimationFrame(animateParallax);
            }
        }

        animateParallax();
    }
}
