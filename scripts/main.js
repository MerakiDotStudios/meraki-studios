// main.js - Final Optimized Version with All Original Features (modified to register detail-card floats)
(function () {
  "use strict";

  // Performance optimization flags
  const PERF_CONFIG = {
    useIntersectionObserver: "IntersectionObserver" in window,
    useIdleCallback: "requestIdleCallback" in window,
    useResizeObserver: "ResizeObserver" in window
  };

  // Initialize performance monitoring
  const perfMetrics = {
    initStart: 0,
    domReady: 0,
    fullLoad: 0,
  };

  document.addEventListener("DOMContentLoaded", () => {
    perfMetrics.initStart = performance.now();
    const domCache = cacheDOMElements();

    // Critical path initialization
    initializeCritical(domCache);

    // Add header click behavior: scroll to top and close mobile nav if open
    try {
      const headerEl = document.querySelector('header');
      if (headerEl) {
        headerEl.addEventListener('click', (e) => {
          // If the user clicked an interactive element inside header, ignore
          if (e.target.closest('button, a, input, select')) return;
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
          // close nav if open
          try {
            const nav = document.querySelector('nav');
            const toggle = document.querySelector('.mobile-nav-toggle');
            if (nav && nav.getAttribute('data-visible') === 'true') {
              nav.setAttribute('data-visible', 'false');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
              try { toggle.querySelector('i').className = 'fa-solid fa-bars'; } catch (e) { }
              try { nav.style.zIndex = ''; } catch (e) { }
              try { document.body.classList.remove('nav-open'); } catch (e) { }
              document.body.style.overflow = '';
            }
          } catch (e) { }
        });
      }
    } catch (e) { }

    // Header logo links: intercept to scroll to top instead of navigating (improves single-page UX)
    try {
      const logoLinks = document.querySelectorAll('.header-logo-link');
      logoLinks.forEach(link => {
        link.addEventListener('click', (ev) => {
          ev.preventDefault();
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
          // close nav if open
          try {
            const nav = document.querySelector('nav');
            const toggle = document.querySelector('.mobile-nav-toggle');
            if (nav && nav.getAttribute('data-visible') === 'true') {
              nav.setAttribute('data-visible', 'false');
              if (toggle) toggle.setAttribute('aria-expanded', 'false');
              try { toggle.querySelector('i').className = 'fa-solid fa-bars'; } catch (e) { }
              try { nav.style.zIndex = ''; } catch (e) { }
              try { document.body.classList.remove('nav-open'); } catch (e) { }
              document.body.style.overflow = '';
            }
          } catch (e) { }
        });
      });
    } catch (e) { }

    // Non-critical initialization with priority queuing
    if (PERF_CONFIG.useIdleCallback) {
      const tasks = [
        () => renderProjects(domCache.projectsContainer),
        () => renderTeamMembers(domCache.teamGrid),
        () => renderFilterButtons(domCache.filterButtons),
        () =>
          renderFooter(
            domCache.platformShowcase,
            domCache.contactInfo,
            domCache.copyright
          ),
        () => setupScrollHighlight(),
        () =>
          setupProjectFiltering(
            domCache.filterButtons,
            domCache.projectsContainer
          ),
        () => setupProjectModal(domCache.modal, domCache.projectsContainer),
        () => setupAnimations(),
      ];

      let taskIndex = 0;
      const executeTask = (deadline) => {
        while (taskIndex < tasks.length && deadline.timeRemaining() > 0) {
          tasks[taskIndex]();
          taskIndex++;
        }
        if (taskIndex < tasks.length) {
          requestIdleCallback(executeTask);
        } else {
          perfMetrics.fullLoad = performance.now();
          console.log(
            `[Meraki] Full initialization completed in ${(
              perfMetrics.fullLoad - perfMetrics.initStart
            ).toFixed(1)}ms`
          );
        }
      };

      requestIdleCallback(executeTask);
    } else {
      setTimeout(() => initializeNonCritical(domCache), 100);
    }
  });

  function cacheDOMElements() {
    // Using more efficient selectors where possible
    const cache = {
      root: document.documentElement,
      loader: document.getElementById("loader-overlay"),
      modal: document.getElementById("project-modal"),
      primaryNav: document.querySelector("nav"),
    };

    // Batch DOM queries for better performance
    const selectors = {
      container: ".main-details-container",
      projectsContainer: ".projects-container",
      teamGrid: ".team-grid",
      filterButtons: ".filter-buttons",
      platformShowcase: ".platform-showcase",
      contactInfo: ".contact-info",
      copyright: ".footer-copyright",
      socialGroup: "header .social-group",
      mobileNavToggle: ".mobile-nav-toggle",
    };

    // Use a single pass through the DOM for multiple selectors
    Object.entries(selectors).forEach(([key, selector]) => {
      cache[key] = document.querySelector(selector);
    });

    return cache;
  }

  function initializeCritical(dom) {
    if (navigator.hardwareConcurrency <= 2)
      document.documentElement.classList.add("no-animations");
    renderStudioDetails(dom.container);
    renderHeaderSocial(dom.socialGroup);
    setupLoader(dom.loader);
    setupMobileNav(dom.mobileNavToggle, dom.primaryNav);
  }

  function initializeNonCritical(dom) {
    renderProjects(dom.projectsContainer);
    renderTeamMembers(dom.teamGrid);
    renderFilterButtons(dom.filterButtons);
    renderFooter(dom.platformShowcase, dom.contactInfo, dom.copyright);
    setupScrollHighlight();
    setupProjectFiltering(dom.filterButtons, dom.projectsContainer);
    setupProjectModal(dom.modal, dom.projectsContainer);
    // console removed — no-op
    setupAnimations();
  }

  // Renders studio details into .main-details-container
  function renderStudioDetails(container) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    SITE_CONFIG.studioDetails.forEach((d) => {
      const div = document.createElement("div");
      div.className = "detail-card animate-on-scroll";
      div.innerHTML = `<h3>${d.title}</h3><p>${d.description}</p>`;
      frag.appendChild(div);
    });
    container.appendChild(frag);
  }

  function renderHeaderSocial(container) {
    if (!container || !SITE_CONFIG?.headerSocial) return;

    container.innerHTML = SITE_CONFIG.headerSocial
      .map(
        (social) => `
        <a href="${social.url}" target="_blank" title="${social.platform}">
          <i class="${social.icon}"></i>
        </a>
      `
      )
      .join("");
  }

  // main.js - CORRECTED renderProjects FUNCTION

  function renderProjects(container) {
    if (!container) return;

    const frag = document.createDocumentFragment();

    SITE_CONFIG.projects.forEach((p) => {
      // --- THIS IS THE FIX ---
      // This block now generates the correct HTML structure that matches your new CSS.
      let imageOrIconHTML = '';
      if (p.image) {
        // If there's an image, create a container with an <img> tag inside.
        imageOrIconHTML = `
        <div class="project-image-container">
          <img class="project-image" src="${p.image}" alt="${p.title} Logo" loading="lazy">
        </div>`;
      } else if (p.icon) {
        // If there's an icon, create a container with the 'icon-bg' class and the <i> tag inside.
        imageOrIconHTML = `
        <div class="project-image-container icon-bg" style="background-color: ${p.iconBackground || 'rgba(0,0,0,0.25)'};">
          <i class="${p.icon}"></i>
        </div>`;
      }
      // --- END OF FIX ---

      const div = document.createElement("div");
      div.className = "project-card animate-on-scroll";
      div.dataset.id = p.id;
      div.dataset.tags = p.tags.join(",");
      div.style.cssText = `--card-bg: ${p.theme.background}; --border-color: ${p.theme.borderColor};`;

      // The new imageOrIconHTML is injected here.
      div.innerHTML = `
      <div class="project-shine"></div>
      ${imageOrIconHTML}
      <div class="project-content">
        <h3 style="color: ${p.theme.titleColor};">${p.title}</h3>
        <p>${p.shortDescription}</p>
        <div class="project-links">
          ${p.links
          .map(
            (l) =>
              `<a href="${l.url}" target="_blank" class="project-btn" style="--btn-bg: ${p.theme.buttonBg}; --btn-color: ${p.theme.buttonColor}; --btn-hover-shadow: ${p.theme.buttonHoverShadow};">${l.text}</a>`
          )
          .join("")}
        </div>
      </div>`;

      frag.appendChild(div);
    });

    container.appendChild(frag);
  }

  function renderTeamMembers(grid) {
    if (!grid) return;
    const frag = document.createDocumentFragment();
    SITE_CONFIG.team.forEach((m) => {
      const socials =
        m.social.length > 0
          ? `<div class="team-social-links">${m.social
            .map(
              (s) =>
                `<a href="${s.url}" target="_blank" title="${s.platform}"><i class="${s.icon}"></i></a>`
            )
            .join("")}</div>`
          : "";
      const div = document.createElement("div");
      div.className = "team-member-card animate-on-scroll";
      div.innerHTML = `<div class="member-details"><img src="${m.image}" alt="${m.name}" loading="lazy" width="140" height="140"/><div class="card-content"><h3>${m.name}</h3><p class="role">${m.role}</p><p class="bio">${m.bio}</p></div></div>${socials}`;
      frag.appendChild(div);
    });
    grid.appendChild(frag);
  }

  function renderFilterButtons(container) {
    if (!container) return;
    container.innerHTML = SITE_CONFIG.filterCategories
      .map(
        (c) =>
          `<button class="filter-btn ${c.id === "all" ? "active" : ""
          }" data-filter="${c.id}">${c.label}</button>`
      )
      .join("");
  }

  function renderFooter(platform, contact, copyright) {
    if (platform)
      platform.innerHTML = `
  <div class="platform-showcase animate-on-scroll">
    <p class="section-title animate-on-scroll">Find Our Projects On</p>
    <div class="platform-logos">
      ${SITE_CONFIG.footer.platforms
          .map(
            (p) =>
              `<a href="${p.url}" class="platform-link animate-on-scroll" target="_blank" title="${p.name}">
               <img src="${p.logo}" alt="${p.name} Logo" loading="lazy"/>
             </a>`
          )
          .join("")}
    </div>
  </div>`;
    if (contact)
      contact.innerHTML = `<p class="section-title animate-on-scroll">Get in Touch</p><a href="mailto:${SITE_CONFIG.footer.contact.email}" class="email-link animate-on-scroll">${SITE_CONFIG.footer.contact.email}</a><p class="footer-copyright animate-on-scroll">${SITE_CONFIG.footer.copyright}</p>`;
    if (copyright) copyright.textContent = SITE_CONFIG.footer.copyright;
  }

  function setupProjectFiltering(filterContainer, projectsContainer) {
    if (!filterContainer || !projectsContainer) return;

    // The decision to use simple vs animated filtering is now made AT CLICK TIME.
    // This makes the component responsive to window resizing.

    filterContainer.addEventListener("click", (e) => {
      if (!e.target.matches(".filter-btn")) return;
      const btn = e.target;
      const filter = btn.dataset.filter;
      const showAllBtn = filterContainer.querySelector('[data-filter="all"]');
      if (filter === "all") {
        filterContainer
          .querySelectorAll(".filter-btn.active")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      } else {
        btn.classList.toggle("active");
        showAllBtn.classList.remove("active");
      }
      const activeFilters = Array.from(
        filterContainer.querySelectorAll(".filter-btn.active")
      )
        .map((b) => b.dataset.filter)
        .filter((f) => f !== "all");
      if (activeFilters.length === 0) showAllBtn.classList.add("active");
      const projectCards = Array.from(
        projectsContainer.querySelectorAll(".project-card")
      );

      applyFilterWithAnimation(activeFilters, projectCards, projectsContainer);

    });
  }

  function applyFilterWithAnimation(
    activeFilters,
    projectCards,
    projectsContainer
  ) {
    // Use a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    // Pre-calculate matches with optimized tag checking
    const matchMap = new Map();
    const tagsCache = new Map(
      projectCards.map((card) => [card, new Set(card.dataset.tags.split(","))])
    );

    projectCards.forEach((card) => {
      const tags = tagsCache.get(card);
      // Match any selected filter (OR). If no filters selected, show all.
      const isMatch =
        activeFilters.length === 0 || activeFilters.some((f) => tags.has(f));
      matchMap.set(card, isMatch);
    });

    // Batch DOM reads
    const firstRects = new Map(
      projectCards.map((card) => [card, card.getBoundingClientRect()])
    );

    // Group cards by match status for better DOM manipulation
    const matches = [];
    const nonMatches = [];
    projectCards.forEach((card) => {
      (matchMap.get(card) ? matches : nonMatches).push(card);
    });

    // Optimize animations with GPU acceleration and better timing
    const animate = (card, dx, dy) => {
      if (dx === 0 && dy === 0) return;

      card.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      card.style.transition = "none";
      card.style.willChange = "transform";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Faster, snappier rearrange animation to reduce perceived slowness
          card.style.transition =
            "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)";
          card.style.transform = "translate3d(0, 0, 0)";

          // Cleanup after animation
          card.addEventListener(
            "transitionend",
            () => {
              card.style.willChange = "auto";
            },
            { once: true }
          );
        });
      });
    };

    // Batch DOM writes
    matches.forEach((card) => {
      card.classList.remove("hiding");
      fragment.appendChild(card);
    });

    nonMatches.forEach((card) => {
      card.classList.add("hiding");
      fragment.appendChild(card);
    });

    // Single DOM write for all cards
    projectsContainer.appendChild(fragment);

    // Calculate and apply animations
    projectCards.forEach((card) => {
      const first = firstRects.get(card);
      const last = card.getBoundingClientRect();
      animate(card, first.left - last.left, first.top - last.top);
    });
  }

  function setupLoader(loader) {
    window.addEventListener("load", () =>
      setTimeout(() => {
        if (loader) {
          loader.classList.add("hidden");
          document.body.classList.add("loaded");
        }
      }, 500)
    );
  }

  function setupMobileNav(toggle, nav) {
    if (!toggle || !nav) return;
    // store original place so we can restore later
    let originalParent = null;
    let originalNextSibling = null;
    let overlayEl = null;

    const close = () => {
      nav.setAttribute("data-visible", "false");
      toggle.setAttribute("aria-expanded", "false");
      try { toggle.querySelector("i").className = "fa-solid fa-bars"; } catch (e) { }
      document.body.style.overflow = "";
      try { nav.style.zIndex = ''; nav.style.position = ''; nav.style.left = ''; nav.style.top = ''; nav.style.width = ''; nav.style.height = ''; nav.style.visibility = ''; nav.style.opacity = ''; nav.style.pointerEvents = ''; } catch (e) { }
      try { document.body.classList.remove('nav-open'); } catch (e) { }

      // restore original DOM position if we moved the nav
      try {
        if (overlayEl && overlayEl.parentNode) {
          // remove overlay and restore nav
          if (originalParent) {
            if (originalNextSibling && originalNextSibling.parentNode === originalParent) originalParent.insertBefore(nav, originalNextSibling);
            else originalParent.appendChild(nav);
          }
          overlayEl.parentNode.removeChild(overlayEl);
          overlayEl = null;
        } else if (originalParent) {
          if (originalNextSibling && originalNextSibling.parentNode === originalParent) originalParent.insertBefore(nav, originalNextSibling);
          else originalParent.appendChild(nav);
        }
      } catch (e) { }
    };

    toggle.addEventListener("click", () => {
      const visible = nav.getAttribute("data-visible") === "true";
      if (visible) {
        close();
      } else {
        // remember original position
        try { originalParent = nav.parentNode; originalNextSibling = nav.nextSibling; } catch (e) { originalParent = null; originalNextSibling = null; }
        // create a full-screen overlay and move nav into it to guarantee it's above everything
        try {
          overlayEl = document.createElement('div');
          overlayEl.id = 'ms-mobile-nav-overlay';
          overlayEl.style.position = 'fixed';
          overlayEl.style.left = '0';
          overlayEl.style.top = '0';
          overlayEl.style.width = '100vw';
          overlayEl.style.height = '100vh';
          overlayEl.style.zIndex = '2147483647';
          overlayEl.style.background = 'rgba(0,0,0,0.98)';
          overlayEl.style.display = 'flex';
          overlayEl.style.flexDirection = 'column';
          overlayEl.style.alignItems = 'stretch';
          overlayEl.style.justifyContent = 'flex-start';
          overlayEl.style.paddingTop = (window.getComputedStyle(document.documentElement).getPropertyValue('--safe-area-top') || '16px');
          overlayEl.style.overflowY = 'auto';
          // append overlay and move nav into it
          document.body.appendChild(overlayEl);
          overlayEl.appendChild(nav);
        } catch (e) {
          try { document.body.appendChild(nav); } catch (e) { }
        }

        nav.setAttribute("data-visible", "true");
        toggle.setAttribute("aria-expanded", "true");
        try { toggle.querySelector("i").className = "fa-solid fa-xmark"; } catch (e) { }
        document.body.style.overflow = "hidden";

        try { document.body.classList.add('nav-open'); } catch (e) { }
        try {
          const firstLink = nav.querySelector('.nav-links a');
          if (firstLink) firstLink.focus();
        } catch (e) { }
      }
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") close();
    });
  }

  function setupScrollHighlight() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(
      "header nav .nav-links a[href^='#']"
    );
    if (!sections.length || !navLinks.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) =>
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              )
            );
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function setupProjectModal(modal, container) {
    if (!modal) return;
    const m = {
      title: modal.querySelector("#modal-project-title"),
      video: modal.querySelector("#modal-project-video"),
      gallery: modal.querySelector("#modal-project-gallery"),
      desc: modal.querySelector("#modal-project-description"),
      links: modal.querySelector("#modal-project-links"),
    };
    const open = (card) => {
      const p = SITE_CONFIG.projects.find(
        (proj) => proj.id === card.dataset.id
      );
      if (!p) return;
      m.title.textContent = p.title;
      m.desc.textContent = p.fullDescription;
      m.links.innerHTML = p.links
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank" class="project-btn" style="${l.style}">${l.text}</a>`
        )
        .join("");
      m.video.innerHTML = "";
      m.gallery.innerHTML = "";
      if (p.youtubeId) {
        m.video.style.display = "block";
        m.video.innerHTML = `<iframe src="https://www.youtube.com/embed/${p.youtubeId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
      } else {
        m.video.style.display = "none";
      }
      if (p.galleryImages?.length > 0) {
        m.gallery.style.display = "grid";
        m.gallery.innerHTML = p.galleryImages
          .map(
            (src) => `<img src="${src}" alt="Project image" loading="lazy"/>`
          )
          .join("");
      } else {
        m.gallery.style.display = "none";
      }
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
      m.video.innerHTML = "";
      m.gallery.innerHTML = "";
    };
    container.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (card && !e.target.closest("a")) {
        e.preventDefault();
        open(card);
      }
    });
    modal.querySelector(".modal-close-btn")?.addEventListener("click", close);
  }

  // --- IMPORTANT: Setup animations and ensure detail-cards are registered ---
  function setupAnimations() {
    const anim = window.MerakiAnimations;
    if (!anim) return;

    // Observe scroll reveal animations (if available)
    if (anim.scroll && typeof anim.scroll.observe === "function") {
      anim.scroll.observe(".animate-on-scroll");
    }

    // Auto-reapply when matching elements are added dynamically
    try {
      if (typeof MutationObserver !== "undefined" && !anim.__mutationObserver) {
        const selectorsToWatch = [
          ".detail-card",
          ".team-member-card",
          ".project-card",
          ".service-card",
          ".main-logo",
          ".nav-btn-special",
        ];

        const mo = new MutationObserver((mutations) => {
          let found = false;
          for (const m of mutations) {
            if (!m.addedNodes) continue;
            for (const node of m.addedNodes) {
              if (!(node instanceof Element)) continue;
              for (const sel of selectorsToWatch) {
                if (node.matches(sel) || node.querySelector(sel)) {
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
            if (found) break;
          }
          if (found) {
            // Debounced reapply
            if (anim.__reapplyTimer) clearTimeout(anim.__reapplyTimer);
            anim.__reapplyTimer = setTimeout(() => {
              if (
                anim.subtleFloat &&
                typeof anim.subtleFloat.apply === "function"
              ) {
                anim.subtleFloat.apply(
                  ".detail-card, .team-member-card, .main-details-container .detail-card"
                );
              }
              if (anim.float && typeof anim.float.apply === "function") {
                anim.float.apply(
                  ".project-card, .service-card, .main-logo, .nav-btn-special"
                );
              }
            }, 120);
          }
        });

        mo.observe(document.body, { childList: true, subtree: true });
        anim.__mutationObserver = mo;
      }
    } catch (e) {
      if (window.__MERAKI_ANIM_DEBUG__)
        console.debug("[setupAnimations] MutationObserver setup failed", e);
    }
  }

  // Expose nothing globally
})();