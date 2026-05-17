// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// ── CONTACT MODAL CONTROL ──
const btnHubungi = document.getElementById('btn-hubungi');
const contactModal = document.getElementById('contact-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

function openModal(e) {
  if (e) e.preventDefault();
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Open modal on click
if (btnHubungi && contactModal) {
  btnHubungi.addEventListener('click', openModal);
}

// Close modal on close button click
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside the container
if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeModal();
    }
  });
}

// Close modal when pressing Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
    closeModal();
  }
});

// ── SMART EMAIL REDIRECT (GMAIL WEB FOR DESKTOP, MAILTO FOR MOBILE) ──
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
