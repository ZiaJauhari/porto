// ════════════════════════════════════════════════════════════════
//  ZIA JAUHARI JUANDA PORTFOLIO — CORE SCRIPT
//  Senior UI/UX & Frontend Performance & Interactivity Architecture
// ════════════════════════════════════════════════════════════════

(() => {
  'use strict';

  // ── THEME SWITCHER SYSTEM ──
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  function getInitialTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialize theme immediately
  setTheme(getInitialTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Listen to OS theme changes if user has no saved preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ── PRELOADER ──
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
      }, 500);
    });
    document.body.style.overflow = 'hidden';
  }

  // ── CUSTOM CURSOR (DESKTOP ONLY) ──
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && dot && ring) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .featured-card, .compact-card, .skill-pill, .pillar-card, .edu-card');
    interactiveEls.forEach(el => {
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
  if (typingEl) {
    const roles = [
      'Software Engineer',
      'Web Developer',
      'Full-Stack Developer',
      'IoT Integration Specialist'
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
        typingSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next title
      }

      setTimeout(typeRole, typingSpeed);
    }

    setTimeout(typeRole, 600);
  }

  // ── NAVIGATION & SCROLL OBSERVER ──
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background shift on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active state tracker for navigation links
    let currentSectionId = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 160;
      const sectionHeight = sec.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ── MOBILE HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any nav link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        navLinksContainer.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── SCROLL REVEAL OBSERVER ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ── BACK TO TOP BUTTON ──
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── CONTACT MODAL CONTROL ──
  const contactModal = document.getElementById('contact-modal');
  const btnHubungi = document.getElementById('btn-hubungi');
  const btnNavContact = document.getElementById('btn-nav-contact');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (contactModal) {
      contactModal.classList.add('active');
      contactModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContactModal() {
    if (contactModal) {
      contactModal.classList.remove('active');
      contactModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (btnHubungi) btnHubungi.addEventListener('click', openContactModal);
  if (btnNavContact) btnNavContact.addEventListener('click', openContactModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeContactModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  // ── SMART EMAIL REDIRECT (GMAIL DESKTOP WEB vs NATIVE MAILTO) ──
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

  // ── PORTFOLIO PROJECT DETAIL MODAL DATA & CONTROLLER ──
  const projectsData = {
    aksepta: {
      title: "Aksepta.com — Startup Website",
      category: "Web · Startup",
      date: "Januari – Mei 2026",
      desc: "Aksepta.com adalah platform startup inovatif yang dirancang untuk menjembatani kebutuhan bisnis modern. Website ini dikembangkan dari awal dengan fokus utama pada perancangan UI/UX yang modern, responsif, dan interaktif menggunakan standar web modern. Dilengkapi dengan navigasi yang halus, tata letak yang bersih, serta performa tinggi guna memaksimalkan kenyamanan pengguna.",
      link: "https://aksepta.com/",
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
      date: "Januari – Mei 2026",
      desc: "Fisheries merupakan platform web katalog dan pemesanan produk perikanan yang dikembangkan menggunakan framework Laravel dan basis data MySQL. Proyek ini memfasilitasi nelayan serta distributor perikanan untuk mengelola katalog komoditas hasil laut secara terstruktur, menyediakan sistem pemesanan online yang efisien, serta menyajikan antarmuka modern yang responsif dan mudah digunakan.",
      images: [
        "gambar/img-fisheries.png"
      ]
    },
    batuahlines: {
      title: "Batuahlines.com — Ekspor Internasional",
      category: "Web · Ekspor Internasional",
      date: "Januari – Mei 2026",
      desc: "Batuahlines.com adalah website profil perusahaan berskala internasional yang berfokus pada layanan ekspor komoditas unggulan. Dikembangkan menggunakan framework Laravel, situs ini dirancang dengan estetika profesional, struktur SEO yang teroptimasi, katalog produk ekspor interaktif, serta formulir penawaran kerja sama mitra global.",
      images: [
        "gambar/img-batuahlines.png",
        "gambar/batuahlines (17).jpeg",
        "gambar/batuahlines (16).jpeg",
        "gambar/batuahlines (15).jpeg",
        "gambar/batuahlines (14).jpeg",
        "gambar/batuahlines (13).jpeg",
        "gambar/batuahlines (12).jpeg",
        "gambar/batuahlines (11).jpeg",
        "gambar/batuahlines (10).jpeg",
        "gambar/batuahlines (9).jpeg",
        "gambar/batuahlines (8).jpeg",
        "gambar/batuahlines (7).jpeg",
        "gambar/batuahlines (6).jpeg",
        "gambar/batuahlines (5).jpeg",
        "gambar/batuahlines (4).jpeg",
        "gambar/batuahlines (3).jpeg",
        "gambar/batuahlines (2).jpeg",
        "gambar/batuahlines (1).jpeg",
        "gambar/batuahlines (18).jpeg"
      ]
    },
    lawfirm: {
      title: "MVP Lawfirm — Portal Firma Hukum",
      category: "Web · Law Firm",
      date: "Januari – Mei 2026",
      desc: "MVP Lawfirm adalah situs web profesional untuk firma hukum modern. Dikembangkan dengan arsitektur Laravel, sistem ini memuat profil pengacara, bidang spesialisasi hukum, artikel edukasi hukum, serta formulir konsultasi online bagi calon klien.",
      link: "https://lime-ibis-885634.hostingersite.com/",
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
      category: "IoT · Hardware Integration",
      date: "Oktober 2025",
      desc: "Sistem pemantauan dan kontrol kualitas udara pada smoking room berbasis Internet of Things (IoT). Mengintegrasikan sensor perangkat keras dengan dashboard pemantauan digital real-time untuk pemantauan kualitas udara secara otomatis.",
      images: [
        "gambar/img-monitoring.png"
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalCloseBtn = document.getElementById('project-modal-close-btn');
  const projectModalSecondaryCloseBtn = document.getElementById('project-modal-close-secondary-btn');
  const projectCards = document.querySelectorAll('[data-project]');

  const modalMainImg = document.getElementById('project-modal-main-img');
  const modalThumbnailsContainer = document.getElementById('project-modal-thumbnails');
  const modalBadge = document.getElementById('project-modal-badge');
  const modalTitle = document.getElementById('project-modal-title');
  const modalDate = document.getElementById('project-modal-date');
  const modalDesc = document.getElementById('project-modal-desc');
  const prevBtn = document.getElementById('project-gallery-prev');
  const nextBtn = document.getElementById('project-gallery-next');
  const modalLinkContainer = document.getElementById('project-modal-link-container');
  const modalLink = document.getElementById('project-modal-link');

  let currentProjectImages = [];
  let currentImageIndex = 0;

  function updateMainImage(index) {
    if (!currentProjectImages || currentProjectImages.length === 0) return;
    currentImageIndex = (index + currentProjectImages.length) % currentProjectImages.length;

    modalMainImg.style.opacity = '0';
    setTimeout(() => {
      modalMainImg.src = currentProjectImages[currentImageIndex];
      modalMainImg.style.opacity = '1';
    }, 150);

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
    if (!data || !projectModal) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.category;
    modalDate.textContent = data.date;
    modalDesc.textContent = data.desc;

    if (data.link) {
      modalLink.href = data.link;
      modalLinkContainer.style.display = 'block';
    } else {
      modalLinkContainer.style.display = 'none';
    }

    currentProjectImages = data.images || [];
    currentImageIndex = 0;

    if (currentProjectImages.length > 1) {
      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    } else {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    modalThumbnailsContainer.innerHTML = '';
    if (currentProjectImages.length > 1) {
      currentProjectImages.forEach((imgSrc, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `${data.title} thumb ${idx + 1}`;
        thumb.className = 'project-thumbnail';
        if (idx === 0) thumb.classList.add('active');

        thumb.addEventListener('click', () => updateMainImage(idx));
        modalThumbnailsContainer.appendChild(thumb);
      });
    }

    if (currentProjectImages.length > 0) {
      modalMainImg.src = currentProjectImages[0];
      modalMainImg.style.opacity = '1';
    }

    const modalContainer = projectModal.querySelector('.modal-container');
    if (modalContainer) modalContainer.scrollTop = 0;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  projectCards.forEach(card => {
    const projectKey = card.dataset.project;
    if (projectKey) {
      card.addEventListener('click', () => openProjectModal(projectKey));
    }
  });

  if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModalSecondaryCloseBtn) projectModalSecondaryCloseBtn.addEventListener('click', closeProjectModal);

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

  // Touch swipe gesture support for mobile gallery
  const modalMainImgContainer = document.querySelector('.project-modal-main-img-container');
  if (modalMainImgContainer) {
    let touchStartX = 0;
    let touchStartY = 0;

    modalMainImgContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    modalMainImgContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          updateMainImage(currentImageIndex + 1);
        } else {
          updateMainImage(currentImageIndex - 1);
        }
      }
    }, { passive: true });
  }

  // ── KEYBOARD NAVIGATION & ESCAPE HANDLER FOR ALL MODALS ──
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('active')) closeContactModal();
      if (projectModal && projectModal.classList.contains('active')) closeProjectModal();
    }

    if (projectModal && projectModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') updateMainImage(currentImageIndex - 1);
      if (e.key === 'ArrowRight') updateMainImage(currentImageIndex + 1);
    }
  });

})();
