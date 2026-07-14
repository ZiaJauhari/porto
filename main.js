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

  // ── PORTFOLIO PROJECT DETAIL MODAL ──
  const projectsData = {
    aksepta: {
      title: "Aksepta.com — Startup Website",
      category: "Web · Startup",
      date: "Jan – Mei 2026",
      desc: "Aksepta.com adalah platform startup inovatif yang dirancang untuk menjembatani kebutuhan bisnis modern. Kami membangun website ini dari awal, berfokus pada desain UI/UX yang futuristik, responsif, dan interaktif menggunakan standar web modern. Dilengkapi dengan navigasi yang halus, skema warna yang elegan, serta tata letak yang ramah pengguna guna memaksimalkan tingkat konversi pengunjung.",
      images: [
        "gambar/img-aksepta.png",
        "gambar/aksepta (1).png",
        "gambar/aksepta (2).png",
        "gambar/aksepta (3).png",
        "gambar/aksepta (4).png",
        "gambar/aksepta (5).png",
        "gambar/aksepta (6).png",
        "gambar/aksepta (7).png",
        "gambar/aksepta (8).png"
      ]
    },
    fisheries: {
      title: "Fisheries — Katalog & Pemesanan",
      category: "Web · Perikanan",
      date: "Jan – Mei 2026",
      desc: "Fisheries merupakan sebuah solusi platform web katalog produk perikanan yang terintegrasi dengan sistem pemesanan online sederhana. Dikembangkan menggunakan PHP dan MySQL, proyek ini memudahkan para nelayan dan distributor perikanan untuk memamerkan produk tangkapan segar mereka secara real-time dan mengelola pemesanan secara efisien langsung dari web.",
      images: [
        "gambar/img-fisheries.png"
      ]
    },
    batuahlines: {
      title: "Batuahlines.com — Ekspor Internasional",
      category: "Web · Ekspor Internasional",
      date: "Jan – Mei 2026",
      desc: "Batuahlines.com adalah website profil perusahaan berskala internasional yang berfokus pada layanan ekspor komoditas unggulan. Situs ini dirancang dengan gaya profesional, performa tinggi, dan struktur SEO yang solid untuk menjangkau klien luar negeri. Menyediakan katalog produk ekspor yang lengkap serta formulir penawaran kerja sama interaktif bagi calon mitra bisnis global.",
      images: [
        "gambar/img-batuahlines.png"
      ]
    },
    lawfirm: {
      title: "MVP Lawfirm — Firma Hukum",
      category: "Web · Law Firm",
      date: "Jan – Mei 2026",
      desc: "MVP Lawfirm adalah situs web profesional kelas premium untuk firma hukum modern. Website ini dirancang dengan estetika formal yang tepercaya dan dilengkapi dengan sistem manajemen konten (CMS) berbasis Laravel. Memuat profil pengacara, spesialisasi hukum, publikasi artikel hukum, serta portal konsultasi online yang aman dan terenkripsi untuk memudahkan interaksi dengan klien.",
      images: [
        "gambar/img-mvp-lawfirm.png",
        "gambar/law firm (1).png",
        "gambar/law firm (2).png",
        "gambar/law firm (3).png",
        "gambar/law firm (4).png",
        "gambar/law firm (5).png",
        "gambar/law firm (6).png",
        "gambar/law firm (7).png",
        "gambar/law firm (8).png"
      ]
    },
    monitoring: {
      title: "Air Quality Monitoring System",
      category: "IoT · Hardware",
      date: "Oktober 2025",
      desc: "Sistem pemantauan dan kontrol kualitas udara pada smoking room berbasis Internet of Things. Mengintegrasikan sensor hardware dengan dashboard monitoring real-time untuk pengawasan kualitas udara secara otomatis.",
      images: [
        "gambar/img-monitoring.png"
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalCloseBtn = document.getElementById('project-modal-close-btn');
  const projectCardElements = document.querySelectorAll('.project-card');

  const modalMainImg = document.getElementById('project-modal-main-img');
  const modalThumbnailsContainer = document.getElementById('project-modal-thumbnails');
  const modalBadge = document.getElementById('project-modal-badge');
  const modalTitle = document.getElementById('project-modal-title');
  const modalDate = document.getElementById('project-modal-date');
  const modalDesc = document.getElementById('project-modal-desc');
  const prevBtn = document.getElementById('project-gallery-prev');
  const nextBtn = document.getElementById('project-gallery-next');

  let currentProjectImages = [];
  let currentImageIndex = 0;

  function updateMainImage(index) {
    if (currentProjectImages.length === 0) return;
    currentImageIndex = (index + currentProjectImages.length) % currentProjectImages.length;
    
    modalMainImg.style.opacity = '0';
    modalMainImg.style.transform = 'scale(0.98)';
    setTimeout(() => {
      modalMainImg.src = currentProjectImages[currentImageIndex];
      modalMainImg.style.opacity = '1';
      modalMainImg.style.transform = 'scale(1)';
    }, 200);

    const thumbnails = modalThumbnailsContainer.querySelectorAll('.project-thumbnail');
    thumbnails.forEach((thumb, idx) => {
      if (idx === currentImageIndex) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  function openProjectModal(projectKey) {
    const data = projectsData[projectKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.category;
    modalDate.textContent = data.date;
    modalDesc.textContent = data.desc;

    currentProjectImages = data.images;
    currentImageIndex = 0;

    if (currentProjectImages.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }

    modalThumbnailsContainer.innerHTML = '';
    if (currentProjectImages.length > 1) {
      currentProjectImages.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `${data.title} thumb ${idx + 1}`;
        thumb.className = 'project-thumbnail';
        if (idx === 0) thumb.className += ' active';
        
        if (!isTouchDevice && dot && ring) {
          thumb.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
          });
          thumb.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
          });
        }

        thumb.addEventListener('click', () => {
          updateMainImage(idx);
        });
        modalThumbnailsContainer.appendChild(thumb);
      });
    }

    modalMainImg.src = currentProjectImages[0];
    modalMainImg.style.opacity = '1';
    modalMainImg.style.transform = 'scale(1)';

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  projectCardElements.forEach(card => {
    const projectKey = card.dataset.project;
    if (projectKey) {
      card.addEventListener('click', () => {
        openProjectModal(projectKey);
      });
    }
  });

  if (projectModalCloseBtn) {
    projectModalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateMainImage(currentImageIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateMainImage(currentImageIndex + 1);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (projectModal && projectModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeProjectModal();
      } else if (e.key === 'ArrowLeft') {
        updateMainImage(currentImageIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateMainImage(currentImageIndex + 1);
      }
    }
  });

})();
