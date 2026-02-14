(function() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let dpr = 1;

    const stars = [];
    const config = {
        spawnRate: 26,
        speedMin: 40,
        speedMax: 80,
        maxStars: 120,
        spawnRadiusFactor: 0.5,
        margin: 0
    };

    let lastTime = performance.now();
    let rafId = null;
    let scrollRaf = null;

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth || 0;
        height = window.innerHeight || 0;
        centerX = width / 2;
        centerY = height / 2;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnStar() {
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
        const maxRadius = Math.min(width, height) * config.spawnRadiusFactor;
        const radius = Math.sqrt(Math.random()) * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = 0.5 + Math.random() * 0.9;
        stars.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size,
            alpha: 0.3 + Math.random() * 0.45
        });
    }

    function update(dt) {
        const spawnTotal = config.spawnRate * dt;
        const spawnCount = Math.floor(spawnTotal);
        for (let i = 0; i < spawnCount; i++) {
            spawnStar();
        }
        if (Math.random() < spawnTotal - spawnCount) {
            spawnStar();
        }

        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];
            star.x += star.vx * dt;
            star.y += star.vy * dt;

            if (
                star.x < -config.margin ||
                star.x > width + config.margin ||
                star.y < -config.margin ||
                star.y > height + config.margin
            ) {
                stars.splice(i, 1);
            }
        }

        if (stars.length > config.maxStars) {
            stars.splice(0, stars.length - config.maxStars);
        }
    }

    function drawHeart(x, y, size, alpha) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        const s = size;

        // 绘制心形：从顶部开始，左上圆弧、左下、尖端、右下、右上圆弧
        const topY = y - s * 0.6;
        const leftControlX = x - s * 0.8;
        const rightControlX = x + s * 0.8;
        const pointY = y + s * 0.6;

        // 起点：上顶部
        ctx.moveTo(x, topY);

        // 左上圆弧（左叶）
        ctx.bezierCurveTo(
            leftControlX - s * 0.5, topY - s * 0.3,
            leftControlX - s * 0.3, y,
            x - s * 0.3, y + s * 0.3
        );

        // 左下到尖端
        ctx.lineTo(x, pointY);

        // 尖端到右下
        ctx.lineTo(x + s * 0.3, y + s * 0.3);

        // 右下圆弧（右叶）
        ctx.bezierCurveTo(
            rightControlX + s * 0.3, y,
            rightControlX + s * 0.5, topY - s * 0.3,
            x, topY
        );

        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const particleType = (window.particleConfig && window.particleConfig.type) || 'heart';

        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];

            if (particleType === 'heart') {
                drawHeart(star.x, star.y, star.size, star.alpha);
            } else if (particleType === 'star') {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function animate(now) {
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        update(dt);
        draw();
        rafId = requestAnimationFrame(animate);
    }

    function getHeroFadeProgress() {
        const hero = document.querySelector('.hero');
        if (!hero) return 1;
        const heroHeight = hero.offsetHeight || window.innerHeight || 1;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        return Math.max(0, Math.min(1, scrollY / heroHeight));
    }

    function updateOpacity() {
        const progress = getHeroFadeProgress();
        canvas.style.opacity = String(progress);
    }

    function onScroll() {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            scrollRaf = null;
            updateOpacity();
        });
    }

    function onVisibilityChange() {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(animate);
        }
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        updateOpacity();
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    resizeCanvas();
    updateOpacity();
    rafId = requestAnimationFrame(animate);
})();