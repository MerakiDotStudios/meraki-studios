// Meraki Studios - Apple-Style Scroll Animation
(function () {
  "use strict";

  // ===================================
  // CONFIGURATION
  // ===================================

  const CONFIG = {
    scrollRevealThreshold: 0.15,
    animationStagger: 100,
  };

  // ===================================
  // DOM CACHE
  // ===================================

  const DOM = {
    scrollContainer: null,
    sections: null,
    navLinks: null,
    navToggle: null,
    nav: null,
    modal: null,
    projectsGrid: null,
    teamGrid: null,
    filterButtons: null,
    navSocial: null,
    platformLinks: null,
  };

  // ===================================
  // INITIALIZATION
  // ===================================

  document.addEventListener("DOMContentLoaded", () => {
    cacheDOM();
    initScrollReveal();
    initNavigation();
    initScrollSnap();
    renderContent();
    initProjectModal();
    initFilters();
  });

  function cacheDOM() {
    DOM.scrollContainer = document.querySelector(".scroll-container");
    DOM.sections = document.querySelectorAll(".snap-section");
    DOM.navLinks = document.querySelectorAll(".nav-links a");
    DOM.navToggle = document.querySelector(".nav-toggle");
    DOM.nav = document.querySelector(".main-nav");
    DOM.modal = document.getElementById("project-modal");
    DOM.projectsGrid = document.querySelector(".projects-grid");
    DOM.teamGrid = document.querySelector(".team-grid");
    DOM.filterButtons = document.querySelector(".filter-buttons");
    DOM.navSocial = document.querySelector(".nav-social");
    DOM.platformLinks = document.querySelector(".platform-links");
  }

  // ===================================
  // SCROLL REVEAL ANIMATIONS
  // ===================================

  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal, .scroll-scale");

    // Set reveal delays from data attributes
    revealElements.forEach((el) => {
      const delay = el.dataset.delay || 0;
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: CONFIG.scrollRevealThreshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Also observe philosophy cards with stagger
    const philosophyCards = document.querySelectorAll(".philosophy-card");
    philosophyCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 150}ms`;
      observer.observe(card);
    });
  }

  // ===================================
  // NAVIGATION
  // ===================================

  function initNavigation() {
    // Mobile nav toggle
    if (DOM.navToggle && DOM.nav) {
      DOM.navToggle.addEventListener("click", () => {
        const isOpen = DOM.nav.dataset.visible === "true";
        DOM.nav.dataset.visible = isOpen ? "false" : "true";
        DOM.navToggle.classList.toggle("active", !isOpen);
        document.body.style.overflow = isOpen ? "" : "hidden";
      });

      // Close nav on link click
      DOM.nav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          DOM.nav.dataset.visible = "false";
          DOM.navToggle.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }

    // Render social links in nav
    if (DOM.navSocial && SITE_CONFIG?.headerSocial) {
      DOM.navSocial.innerHTML = SITE_CONFIG.headerSocial
        .map(
          (s) => `<a href="${s.url}" target="_blank" title="${s.platform}"><i class="${s.icon}"></i></a>`
        )
        .join("");
    }

    // Logo click - scroll to top
    const logoLink = document.querySelector(".logo-link");
    if (logoLink) {
      logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        DOM.scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // ===================================
  // SCROLL SNAP & SECTION TRACKING
  // ===================================

  function initScrollSnap() {
    if (!DOM.scrollContainer) return;

    // Track current section for nav highlighting using scroll position
    let lastActiveSection = "";

    function updateNavOnScroll() {
      const sections = document.querySelectorAll(".snap-section[id]");
      const scrollTop = DOM.scrollContainer.scrollTop;
      const viewportHeight = DOM.scrollContainer.clientHeight;
      const scrollCenter = scrollTop + viewportHeight / 2;

      let activeSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
          activeSection = section.id;
        }
      });

      if (activeSection && activeSection !== lastActiveSection) {
        lastActiveSection = activeSection;
        updateActiveNav(activeSection);
      }
    }

    DOM.scrollContainer.addEventListener("scroll", updateNavOnScroll, { passive: true });
    updateNavOnScroll(); // Initial check

    // Smooth scroll for nav links
    DOM.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Scroll hint click
    const scrollHint = document.querySelector(".scroll-hint");
    if (scrollHint) {
      scrollHint.addEventListener("click", () => {
        const philosophy = document.getElementById("philosophy");
        if (philosophy) {
          philosophy.scrollIntoView({ behavior: "smooth" });
        }
      });
      scrollHint.style.cursor = "pointer";
    }
  }

  function updateActiveNav(sectionId) {
    DOM.navLinks.forEach((link) => {
      const href = link.getAttribute("href").slice(1);
      link.classList.toggle("active", href === sectionId);
    });
  }

  // ===================================
  // CONTENT RENDERING
  // ===================================

  function renderContent() {
    renderProjects();
    renderTeam();
    renderFilters();
    renderPlatforms();
    // Re-initialize scroll reveal after all content is rendered
    setTimeout(() => initScrollReveal(), 100);
  }

  function renderProjects() {
    if (!DOM.projectsGrid || !SITE_CONFIG?.projects) return;

    const html = SITE_CONFIG.projects
      .map((p, index) => {
        const imageContent = p.image
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
          : p.icon
            ? `<i class="${p.icon}"></i>`
            : "";

        const imageClass = p.image ? "project-image" : "project-image icon-bg";
        const bgStyle = p.iconBackground ? `background-color: ${p.iconBackground};` : "";

        return `
          <div class="project-card scroll-reveal" 
               data-id="${p.id}" 
               data-tags="${p.tags.join(",")}"
               style="--reveal-delay: ${index * 100}ms;">
            <div class="${imageClass}" style="${bgStyle}">
              ${imageContent}
            </div>
            <div class="project-info">
              <h3 style="color: ${p.theme.titleColor};">${p.title}</h3>
              <p>${p.shortDescription}</p>
              <div class="project-links">
                ${p.links
            .map(
              (l) =>
                `<a href="${l.url}" target="_blank" class="project-btn" 
                          style="--btn-bg: ${p.theme.buttonBg}; --btn-color: ${p.theme.buttonColor}; --btn-hover-shadow: ${p.theme.buttonHoverShadow};"
                          onclick="event.stopPropagation();">${l.text}</a>`
            )
            .join("")}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    DOM.projectsGrid.innerHTML = html;

    // Observe new elements
    initScrollReveal();
  }

  function renderTeam() {
    if (!DOM.teamGrid || !SITE_CONFIG?.team) return;

    const html = SITE_CONFIG.team
      .map((m, index) => {
        const socials = m.social?.length
          ? `<div class="team-social">
              ${m.social
            .map(
              (s) =>
                `<a href="${s.url}" target="_blank" title="${s.platform}"><i class="${s.icon}"></i></a>`
            )
            .join("")}
             </div>`
          : "";

        return `
          <div class="team-card scroll-reveal" style="--reveal-delay: ${index * 100}ms;">
            <img src="${m.image}" alt="${m.name}" class="team-avatar" loading="lazy">
            <h3>${m.name}</h3>
            <p class="team-role">${m.role}</p>
            <p class="team-bio">${m.bio}</p>
            ${socials}
          </div>
        `;
      })
      .join("");

    DOM.teamGrid.innerHTML = html;
  }

  function renderFilters() {
    if (!DOM.filterButtons || !SITE_CONFIG?.filterCategories) return;

    DOM.filterButtons.innerHTML = SITE_CONFIG.filterCategories
      .map(
        (c) =>
          `<button class="filter-btn ${c.id === "all" ? "active" : ""}" data-filter="${c.id}">${c.label}</button>`
      )
      .join("");
  }

  function renderPlatforms() {
    if (!DOM.platformLinks || !SITE_CONFIG?.footer?.platforms) return;

    DOM.platformLinks.innerHTML = SITE_CONFIG.footer.platforms
      .map(
        (p) =>
          `<a href="${p.url}" target="_blank" title="${p.name}"><img src="${p.logo}" alt="${p.name}"></a>`
      )
      .join("");
  }

  // ===================================
  // PROJECT MODAL
  // ===================================

  function initProjectModal() {
    if (!DOM.modal || !DOM.projectsGrid) return;

    const modalElements = {
      title: DOM.modal.querySelector("#modal-title"),
      video: DOM.modal.querySelector("#modal-video"),
      gallery: DOM.modal.querySelector("#modal-gallery"),
      description: DOM.modal.querySelector("#modal-description"),
      links: DOM.modal.querySelector("#modal-links"),
    };

    // Open modal on card click
    DOM.projectsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (!card || e.target.closest("a")) return;

      const projectId = card.dataset.id;
      const project = SITE_CONFIG.projects.find((p) => p.id === projectId);
      if (!project) return;

      // Populate modal
      modalElements.title.textContent = project.title;
      modalElements.description.textContent = project.fullDescription;

      // Video
      if (project.youtubeId) {
        modalElements.video.style.display = "block";
        modalElements.video.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${project.youtubeId}" 
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen loading="lazy"></iframe>
        `;
      } else {
        modalElements.video.style.display = "none";
        modalElements.video.innerHTML = "";
      }

      // Gallery
      if (project.galleryImages?.length) {
        modalElements.gallery.style.display = "grid";
        modalElements.gallery.innerHTML = project.galleryImages
          .map((src) => `<img src="${src}" alt="Project image" loading="lazy">`)
          .join("");
      } else {
        modalElements.gallery.style.display = "none";
        modalElements.gallery.innerHTML = "";
      }

      // Links
      modalElements.links.innerHTML = project.links
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank" class="project-btn" style="${l.style}">${l.text}</a>`
        )
        .join("");

      // Show modal
      DOM.modal.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    // Close modal
    const closeModal = () => {
      DOM.modal.classList.remove("show");
      document.body.style.overflow = "";
      modalElements.video.innerHTML = "";
    };

    DOM.modal.querySelector(".modal-close")?.addEventListener("click", closeModal);
    DOM.modal.querySelector(".modal-backdrop")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  // ===================================
  // FILTERS
  // ===================================

  function initFilters() {
    if (!DOM.filterButtons || !DOM.projectsGrid) return;

    DOM.filterButtons.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      const filter = btn.dataset.filter;
      const allBtn = DOM.filterButtons.querySelector('[data-filter="all"]');

      // Update active states
      if (filter === "all") {
        DOM.filterButtons.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      } else {
        btn.classList.toggle("active");
        allBtn?.classList.remove("active");

        // If no filters active, activate "all"
        const activeFilters = DOM.filterButtons.querySelectorAll(".filter-btn.active:not([data-filter='all'])");
        if (activeFilters.length === 0) {
          allBtn?.classList.add("active");
        }
      }

      // Get active filters
      const activeFilters = Array.from(DOM.filterButtons.querySelectorAll(".filter-btn.active"))
        .map((b) => b.dataset.filter)
        .filter((f) => f !== "all");

      // FLIP Animation for filtering
      applyFilterWithFLIP(activeFilters);
    });
  }

  function applyFilterWithFLIP(activeFilters) {
    const cards = Array.from(DOM.projectsGrid.querySelectorAll(".project-card"));

    // FIRST: Record current positions
    const firstPositions = new Map();
    cards.forEach((card) => {
      firstPositions.set(card, card.getBoundingClientRect());
    });

    // Determine which cards match the filter
    const matches = [];
    const nonMatches = [];
    cards.forEach((card) => {
      const tags = new Set(card.dataset.tags.split(","));
      const isMatch = activeFilters.length === 0 || activeFilters.some((f) => tags.has(f));
      if (isMatch) {
        matches.push(card);
        card.classList.remove("hiding");
      } else {
        nonMatches.push(card);
      }
    });

    // Reorder DOM: matches first, then non-matches
    const fragment = document.createDocumentFragment();
    matches.forEach((card) => fragment.appendChild(card));
    nonMatches.forEach((card) => {
      card.classList.add("hiding");
      fragment.appendChild(card);
    });
    DOM.projectsGrid.appendChild(fragment);

    // LAST: Get new positions
    const lastPositions = new Map();
    cards.forEach((card) => {
      lastPositions.set(card, card.getBoundingClientRect());
    });

    // INVERT & PLAY: Animate from old to new position
    cards.forEach((card) => {
      const first = firstPositions.get(card);
      const last = lastPositions.get(card);

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;

      if (deltaX === 0 && deltaY === 0) return;

      // Set initial transform (inverted position)
      card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      card.style.transition = "none";

      // Force reflow
      card.offsetHeight;

      // Animate to final position
      requestAnimationFrame(() => {
        card.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease";
        card.style.transform = "";
      });
    });
  }

})();