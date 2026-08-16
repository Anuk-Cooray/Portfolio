/**
 * ============================================================================
 * ANUK COORAY - PORTFOLIO INTERACTIVITY SCRIPT
 * Features:
 * - Dynamic Interactive Canvas Background (Constellation / Mesh Nodes)
 * - Scroll-Driven Reveal Animations (IntersectionObserver)
 * - Active Section Highlighting & Smooth Navigation
 * - Project Case Study Modal Engine
 * - Interactive Resume / CV Viewer & PDF Print Controller
 * - Contact Form Validation with Animated Toast Feedback
 * - Back to Top Button Controller
 * - 3D Card Hover Micro-Interactions
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasBackground();
  initScrollAnimations();
  initNavigation();
  initProjectModals();
  initCVModal();
  initContactForm();
  initBackToTop();
  initCardTiltEffects();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Dynamic Interactive Particle / Constellation Canvas
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const connectionDistance = window.innerWidth < 768 ? 100 : 140;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(99, 102, 241,';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion / attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor} ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles with distance lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Handle visibility to save battery when inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  animate();
}

/* --------------------------------------------------------------------------
   2. Scroll-Driven Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. Sticky Navbar & Active Section Tracking
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Navbar scrolled class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  }, { passive: true });

  // Active section highlighting
  function highlightActiveSection() {
    const scrollY = window.pageYOffset + 150;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Close on click outside or escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* --------------------------------------------------------------------------
   4. Project Case Study Data & Interactive Modal
   -------------------------------------------------------------------------- */
const projectData = {
  'campus-connect': {
    title: 'Campus Connect',
    subtitle: 'Project Management & System Analysis',
    role: 'Lead Business Analyst & Associate Project Manager',
    tag: 'Management & BA',
    overview: 'Campus Connect was initiated to solve widespread fragmentation across university student clubs, event scheduling, and administrative resource allocation. Prior to the project, over 12+ student bodies relied on ad-hoc spreadsheets and disjointed chat channels, leading to booking conflicts and low participation transparency.',
    problem: 'University departments lacked a unified digital channel to review event proposals, verify safety regulations, and allocate physical auditoriums and labs, resulting in delayed approvals and frequent scheduling clashes.',
    deliverables: [
      'Authored a comprehensive 45+ page Software Requirements Specification (SRS) detailing functional and non-functional requirements.',
      'Constructed complete BPMN 2.0 workflow diagrams mapping the end-to-end event approval hierarchy across department heads.',
      'Created structured Agile epics, user stories, and acceptance criteria in Trello and Confluence using Gherkin syntax (Given-When-Then).',
      'Designed high-fidelity interactive wireframes and UI component libraries in Figma.',
      'Designed the normalized relational database architecture (SQL) ensuring integrity between student profiles, events, and venue bookings.'
    ],
    techStack: ['Agile / Scrum', 'Trello', 'Confluence', 'MS Teams', 'BPMN 2.0', 'Figma', 'PostgreSQL', 'Draw.io'],
    outcomes: 'Reduced administrative event review cycles by 40%, eliminated double-booking incidents, and achieved 100% on-time milestone delivery across 4 Agile development sprints.'
  },
  'swift-translator': {
    title: 'SwiftTranslator Automation Suite',
    subtitle: 'Playwright Test Automation & QA Framework',
    role: 'QA Automation Engineer & Analyst',
    tag: 'Test Automation & QA',
    overview: 'SwiftTranslator is an enterprise multi-language translation and localization web tool. As new linguistic translation models were iteratively deployed, manual regression testing struggled to keep pace with rapid releases, causing release bottlenecks and UI breakage on non-Latin scripts.',
    problem: 'Manual verification of 60+ language pairs across responsive desktop and mobile viewports took over 4 hours per release cycle, with high risk of missing character encoding and layout clipping issues.',
    deliverables: [
      'Architected a modular end-to-end test automation framework using Playwright and TypeScript with the Page Object Model (POM) pattern.',
      'Configured parallel test workers across Chromium, Firefox, and WebKit to maximize test throughput.',
      'Automated dynamic input translation assertions, special character set stress tests, and boundary value scenarios.',
      'Configured GitHub Actions CI/CD workflow executing test suites on every pull request with automated Slack notifications.',
      'Built rich HTML test reporting with embedded execution traces, network request logs, and failure video captures.'
    ],
    techStack: ['Playwright', 'TypeScript', 'Node.js', 'GitHub Actions', 'CI/CD Pipelines', 'Jest / Expect', 'Git'],
    outcomes: 'Slashed regression test run duration from 4 hours to just 3.5 minutes with 98% scenario coverage, catching 15+ UI clipping regressions before reaching staging.'
  },
  'fashion-fiesta': {
    title: 'Fashion Fiesta Web Platform',
    subtitle: 'Full-Stack E-Commerce Web Application',
    role: 'Full-Stack Developer & Analyst',
    tag: 'Full-Stack Web Platform',
    overview: 'Fashion Fiesta was designed to deliver a modern, high-converting digital storefront for boutique apparel. The project combined business requirement gathering with technical full-stack implementation to optimize the online customer journey.',
    problem: 'The client required a snappy, responsive web catalog with real-time stock availability, secure authentication, user cart persistence, and an intuitive administrative portal for sales analytics.',
    deliverables: [
      'Formulated user journey maps and conversion funnel specifications before sprint execution.',
      'Engineered a responsive single-page frontend using React.js and Tailwind CSS with smooth filter transitions.',
      'Built RESTful API micro-endpoints using Node.js and Express.js with JWT authentication and role-based permissions.',
      'Designed MongoDB schemas for dynamic product variants, stock tracking, and user order histories.',
      'Implemented an administrative sales dashboard with real-time order status management.'
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'RESTful APIs', 'JWT', 'Postman'],
    outcomes: 'Delivered sub-1.2s page load speeds with Lighthouse scores of 95+, providing a frictionless checkout experience and a responsive administrative dashboard.'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalRole = document.getElementById('modal-role');
  const modalBody = document.getElementById('modal-content-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-btn-dismiss');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal) return;

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalRole.textContent = `${data.role} • ${data.tag}`;

    modalBody.innerHTML = `
      <div>
        <h4 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Project Overview & Background
        </h4>
        <p class="modal-text">${data.overview}</p>
      </div>

      <div>
        <h4 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Problem Statement & Challenge
        </h4>
        <p class="modal-text">${data.problem}</p>
      </div>

      <div>
        <h4 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          Key Solutions & Delivered Artifacts
        </h4>
        <ul class="modal-list">
          ${data.deliverables.map(item => `<li class="modal-list-item">${item}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Business Impact & Outcomes
        </h4>
        <p class="modal-text">${data.outcomes}</p>
      </div>

      <div>
        <h4 class="modal-section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          Tech & Toolset
        </h4>
        <div class="modal-tech-pills">
          ${data.techStack.map(tech => `<span class="mini-badge" style="color: var(--accent-cyan); border-color: rgba(56,189,248,0.3);">${tech}</span>`).join('')}
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Interactive CV / Resume Viewer & Print Engine
   -------------------------------------------------------------------------- */
function initCVModal() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalRole = document.getElementById('modal-role');
  const modalBody = document.getElementById('modal-content-body');
  const btnNav = document.getElementById('btn-open-cv-nav');
  const btnHero = document.getElementById('btn-open-cv-hero');
  const btnMobile = document.getElementById('btn-open-cv-mobile');

  function openCVModal() {
    if (!modal) return;

    modalTitle.textContent = 'Curriculum Vitae';
    modalRole.textContent = 'Anuk Cooray • Business Analyst & Associate Project Manager';

    modalBody.innerHTML = `
      <div class="cv-preview-body">
        <div class="cv-header-block" style="display: flex; gap: 1.25rem; align-items: center;">
          <img src="assets/profile.jpg" alt="Anuk Cooray" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; object-position: center 20%; border: 2px solid var(--accent-cyan); flex-shrink: 0;" />
          <div>
            <div class="cv-name">Anuk Cooray</div>
            <div class="cv-title">Business Analyst & Associate Project Manager | IT Undergraduate</div>
            <div class="cv-contact-row">
              <span>📍 Colombo, Sri Lanka</span>
              <span>✉️ indeepac@gmail.com</span>
              <span>🔗 linkedin.com/in/anuk-cooray</span>
              <span>💻 github.com/Anuk-Cooray</span>
            </div>
          </div>
        </div>

        <div class="cv-section">
          <div class="cv-section-heading">Professional Summary</div>
          <p class="modal-text">
            Results-oriented IT undergraduate and Business Analysis & Project Management Trainee at Arimac Digital with proven ability in bridging business vision and technical execution. Experienced in Agile/Scrum ceremonies, requirements engineering (SRS, BPMN 2.0, User Stories), test automation using Playwright, and cross-functional team coordination.
          </p>
        </div>

        <div class="cv-section">
          <div class="cv-section-heading">Work Experience</div>
          
          <div class="cv-item">
            <div class="cv-item-title-row">
              <span>Trainee – Business Analysis & Project Management</span>
              <span>Nov 2023 – Present</span>
            </div>
            <div class="cv-item-sub">Arimac Digital • Colombo, Sri Lanka</div>
            <ul class="modal-list" style="margin-top: 0.5rem;">
              <li class="modal-list-item">Elicited business and functional requirements from key stakeholders, creating detailed Software Requirements Specifications (SRS).</li>
              <li class="modal-list-item">Authored comprehensive Agile user stories with Gherkin acceptance criteria and managed sprint backlogs in Trello and Confluence.</li>
              <li class="modal-list-item">Modeled BPMN 2.0 business process workflows and designed low-fidelity wireframes in Figma.</li>
              <li class="modal-list-item">Facilitated daily standups, sprint reviews, and retrospective meetings with cross-functional engineering teams using Trello, Confluence, and MS Teams.</li>
            </ul>
          </div>
        </div>

        <div class="cv-section">
          <div class="cv-section-heading">Education</div>
          
          <div class="cv-item">
            <div class="cv-item-title-row">
              <span>BSc (Hons) in Information Technology</span>
              <span>2022 – Present</span>
            </div>
            <div class="cv-item-sub">Sri Lanka Institute of Information Technology (SLIIT)</div>
            <p class="modal-text" style="font-size: 0.875rem;">Specialization in Software Engineering, IT Project Management, Database Systems & QA.</p>
          </div>

          <div class="cv-item" style="margin-top: 0.5rem;">
            <div class="cv-item-title-row">
              <span>Secondary Education</span>
              <span>Completed</span>
            </div>
            <div class="cv-item-sub">Isipathana College – Colombo 05</div>
            <p class="modal-text" style="font-size: 0.875rem;">Completed G.C.E. Advanced Level examinations in Information Technology / Commerce stream.</p>
          </div>
        </div>

        <div class="cv-section">
          <div class="cv-section-heading">Key Technical & Professional Skills</div>
          <div class="modal-tech-pills">
            <span class="skill-chip">Agile / Scrum</span>
            <span class="skill-chip">Trello & Confluence</span>
            <span class="skill-chip">MS Teams</span>
            <span class="skill-chip">Requirements Elicitation (SRS)</span>
            <span class="skill-chip">BPMN 2.0 Process Mapping</span>
            <span class="skill-chip">User Stories & Acceptance Criteria</span>
            <span class="skill-chip">Figma UI Prototyping</span>
            <span class="skill-chip emerald">SQL & Relational Databases</span>
            <span class="skill-chip emerald">Playwright Test Automation</span>
            <span class="skill-chip emerald">TypeScript / JavaScript</span>
            <span class="skill-chip emerald">Git & GitHub</span>
            <span class="skill-chip emerald">MERN Stack Basics</span>
            <span class="skill-chip emerald">CI/CD Workflows</span>
          </div>
        </div>

        <div style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem;">
          <button class="btn btn-primary" id="btn-print-cv">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hook print button
    const printBtn = document.getElementById('btn-print-cv');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  if (btnNav) btnNav.addEventListener('click', openCVModal);
  if (btnHero) btnHero.addEventListener('click', openCVModal);
  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      const mobileDrawer = document.getElementById('mobile-drawer');
      const mobileToggle = document.getElementById('mobile-menu-toggle');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (mobileToggle) mobileToggle.classList.remove('active');
      openCVModal();
    });
  }
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & Toast Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');

  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');
  const groupSubject = document.getElementById('group-subject');
  const groupMessage = document.getElementById('group-message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error states
    [groupName, groupEmail, groupSubject, groupMessage].forEach((group) => {
      if (group) group.classList.remove('has-error');
    });

    // Validate Name
    if (!nameInput.value.trim()) {
      groupName.classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      groupEmail.classList.add('has-error');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      groupSubject.classList.add('has-error');
      isValid = false;
    }

    // Validate Message (min 10 characters)
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      groupMessage.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulated Successful Form Submission
    const submitBtn = document.getElementById('btn-submit-contact');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending...
      `;
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send Message
        `;
      }

      showToast('Thank you! Your message has been sent successfully to Anuk Cooray.');
    }, 900);
  });

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* --------------------------------------------------------------------------
   7. Back to Top Button Controller
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('btn-back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   8. Subtle 3D Card Hover Micro-Interactions (Desktop Only)
   -------------------------------------------------------------------------- */
function initCardTiltEffects() {
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    const cards = document.querySelectorAll('.glass-card, .project-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. Footer Dynamic Year
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
