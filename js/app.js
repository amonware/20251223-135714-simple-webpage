(function () {
    'use strict';

    // ===== Header scroll state =====
    const header = document.querySelector('header');
    const onScroll = () => {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== Smooth scroll for nav links =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== Scroll-triggered animations (IntersectionObserver) =====
    const animEls = document.querySelectorAll('[data-animate]');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => el.classList.add('in-view'), delay);
            animObserver.unobserve(el);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    animEls.forEach(el => animObserver.observe(el));

    // ===== Counter animation for stats =====
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(tick);
    };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));

    // ===== Mouse parallax for hero shapes =====
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.hero .shape');
    if (hero && shapes.length) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            shapes.forEach((s, i) => {
                const factor = (i + 1) * 12;
                s.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
        hero.addEventListener('mouseleave', () => {
            shapes.forEach(s => s.style.transform = '');
        });
    }

    // ===== CTA button ripple =====
    document.querySelectorAll('.cta-button, .ghost-button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleAnim 0.6s ease-out;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Inject ripple keyframes once
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);

    // ===== Contact form (demo handler) =====
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = '✓ 전송 완료!';
            btn.disabled = true;
            form.reset();
            setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2400);
        });
    }
})();
