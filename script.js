// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const navCta = document.getElementById('navCta');
const scrollTopBtn = document.getElementById('scrollTop');

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // Add/remove scrolled class
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Show/hide scroll-to-top button
  if (currentScroll > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  navCta.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

function closeMenu() {
  mobileToggle.classList.remove('active');
  navLinks.classList.remove('active');
  navCta.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== SCROLL TO TOP =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');

function highlightActiveNav() {
  const scrollPos = window.pageYOffset + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightActiveNav);

// ===== SCROLL ANIMATION (Intersection Observer) =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});

// ===== STAGGERED ANIMATION FOR CARDS =====
function staggerCards(selector) {
  const cards = document.querySelectorAll(selector);
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => cardObserver.observe(card));
}

staggerCards('.service-card');
staggerCards('.why-us-card');
staggerCards('.testimonial-card');

// ===== FORM HANDLING =====
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.querySelector('#name').value;
  const phone = form.querySelector('#phone').value;
  const service = form.querySelector('#service').value;
  const message = form.querySelector('#message').value;

  // Create WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to book a consultation.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Service: ${service}\n` +
    `Message: ${message || 'N/A'}`
  );

  // Show success feedback
  const submitBtn = form.querySelector('.form-submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
    Request Sent!
  `;
  submitBtn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';

  setTimeout(() => {
    // Redirect to WhatsApp
    window.open(`https://wa.me/918292686377?text=${whatsappMessage}`, '_blank');

    // Reset form and button
    form.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.style.background = '';
  }, 1500);
}

// ===== COUNTER ANIMATION FOR HERO STATS =====
function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat .number');

  counters.forEach(counter => {
    const text = counter.textContent;
    const hasPlus = text.includes('+');
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      counter.textContent = current.toLocaleString() + (hasPlus ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  heroObserver.observe(heroStats);
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector('.hero-bg img');

  if (heroBackground && scrolled < window.innerHeight) {
    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ===== ADD ACTIVE CLASS TO NAV STYLE =====
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--green-700);
  }
  .nav-links a.active::after {
    width: 100%;
  }
`;
document.head.appendChild(style);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';

  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
