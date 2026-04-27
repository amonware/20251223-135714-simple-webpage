document.addEventListener('DOMContentLoaded', function () {
    // ----- Smooth scroll for nav links -----
    const headerEl = document.querySelector('header');
    const headerH = () => (headerEl ? headerEl.offsetHeight : 0);

    const scrollToTarget = (selector) => {
        const target = document.querySelector(selector);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH() + 1;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    document.querySelectorAll('.nav-menu a[href^="#"]').forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToTarget(this.getAttribute('href'));
        });
    });

    // ----- CTA -> services -----
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => scrollToTarget('#services'));
    }

    // ----- Wrap service-card images for zoom-on-hover -----
    document.querySelectorAll('.service-card').forEach((card) => {
        const img = card.querySelector('img');
        if (img && !img.parentElement.classList.contains('img-wrap')) {
            const wrap = document.createElement('div');
            wrap.className = 'img-wrap';
            img.parentNode.insertBefore(wrap, img);
            wrap.appendChild(img);
        }
    });

    // ----- Reveal on scroll -----
    const revealTargets = [
        ['.about', 'reveal'],
        ['.about-image', 'reveal'],
        ['.services-grid', 'reveal-stagger'],
        ['.contact-info', 'reveal'],
        ['.contact-form', 'reveal'],
    ];
    revealTargets.forEach(([sel, cls]) => {
        document.querySelectorAll(sel).forEach((el) => el.classList.add(cls));
    });

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
    } else {
        // Fallback: just show everything
        document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.classList.add('is-visible'));
    }

    // ----- Header scroll state + active nav highlight -----
    const sections = ['home', 'about', 'services', 'contact']
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    const navLinkMap = new Map();
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach((a) => {
        navLinkMap.set(a.getAttribute('href').slice(1), a);
    });

    const onScroll = () => {
        if (!headerEl) return;
        if (window.scrollY > 80) headerEl.classList.add('scrolled');
        else headerEl.classList.remove('scrolled');

        // Active nav
        const offset = headerH() + 40;
        let current = sections[0] && sections[0].id;
        for (const sec of sections) {
            const top = sec.getBoundingClientRect().top;
            if (top - offset <= 0) current = sec.id;
        }
        navLinkMap.forEach((a, id) => {
            if (id === current) a.classList.add('active');
            else a.classList.remove('active');
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ----- Contact form: animated submit -----
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            if (!name || !email || !message) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            btn.classList.add('is-loading');
            btn.textContent = '전송 중';
            setTimeout(() => {
                btn.classList.remove('is-loading');
                btn.textContent = '✓ 전송 완료';
                this.reset();
                setTimeout(() => { btn.textContent = originalText; }, 1800);
            }, 900);
        });
    }
});
