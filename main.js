// ════════════════════════════════════════════
//  ZIA JAUHARI PORTFOLIO — PREMIUM ANIMATIONS
// ════════════════════════════════════════════

(() => {
  'use strict';

  // ── PRELOADER ──
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 2000);
  });
  document.body.style.overflow = 'hidden';

  // ── CUSTOM CURSOR ──
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && dot && ring) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .skill-tag, .btn-primary, .btn-secondary, .project-card, .skill-card, .edu-card, .hamburger');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  // ── TYPING ANIMATION ──
  const typingEl = document.querySelector('.typing-text');
  const roles = [
    'Software Engineer',
    'Web Developer',
    'Frontend Developer',
    'IoT Developer',
    'Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start typing after preloader
  setTimeout(typeRole, 2200);

  // ── HERO PARTICLES ──
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let canvasMouseX = 0;
    let canvasMouseY = 0;

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repulsion
        const dx = this.x - canvasMouseX;
        const dy = this.y - canvasMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 242, 90, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles
    const numParticles = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      canvasMouseX = e.clientX - rect.left;
      canvasMouseY = e.clientY - rect.top;
    });

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 242, 90, ${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ── SCROLL REVEAL WITH STAGGER ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children if it's a grid
        const parent = entry.target;
        const isGrid = parent.classList.contains('skills-grid') ||
                       parent.classList.contains('edu-grid');

        if (isGrid) {
          const children = parent.children;
          Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = `opacity 0.6s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`;
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, 50);
          });
        }

        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── ACTIVE NAV LINK ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  // ── NAV SCROLL BEHAVIOR ──
  const nav = document.getElementById('main-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav shrink on scroll
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (scrollY >= s.offsetTop - 150) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.setProperty('--after-width', '100%');
      }
    });

    lastScroll = scrollY;
  });

  // ── BACK TO TOP ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── MAGNETIC BUTTON EFFECT ──
  const magneticBtns = document.querySelectorAll('.magnetic');

  if (!isTouchDevice) {
    magneticBtns.forEach(btn => {
      const strength = parseInt(btn.dataset.strength) || 20;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

        const text = btn.querySelector('.btn-text');
        if (text) {
          text.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        const text = btn.querySelector('.btn-text');
        if (text) text.style.transform = '';
      });
    });
  }

  // ── 3D TILT ON CARDS ──
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (!isTouchDevice) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 600);
      });
    });
  }

  // ── PARALLAX ON HERO ──
  const heroSection = document.getElementById('hero');
  const heroGlow = document.querySelector('.hero-glow');
  const heroGlow2 = document.querySelector('.hero-glow-2');
  const heroGridBg = document.querySelector('.hero-grid-bg');

  if (!isTouchDevice) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroH = heroSection.offsetHeight;

      if (scrollY < heroH) {
        const factor = scrollY / heroH;
        if (heroGlow) heroGlow.style.transform = `scale(${1 + factor * 0.2}) translateY(${scrollY * 0.15}px)`;
        if (heroGlow2) heroGlow2.style.transform = `scale(${1 + factor * 0.15}) translateY(${scrollY * -0.1}px)`;
        if (heroGridBg) heroGridBg.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    });
  }

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
    });

    // Close on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
      }
    });
  }

  // ── CONTACT MODAL CONTROL ──
  const btnHubungi = document.getElementById('btn-hubungi');
  const contactModal = document.getElementById('contact-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal(e) {
    if (e) e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnHubungi && contactModal) {
    btnHubungi.addEventListener('click', openModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ── SMART EMAIL REDIRECT ──
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        const email = link.getAttribute('href').replace('mailto:', '');
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
        window.open(gmailUrl, '_blank');
      }
    });
  });

  // ── SMOOTH ANCHOR SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target && this.getAttribute('href') !== '#') {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
