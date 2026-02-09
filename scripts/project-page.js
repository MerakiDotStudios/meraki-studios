// project-page.js - Populates project detail pages from SITE_CONFIG
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const projectId = document.body.dataset.projectId;
    if (!projectId || typeof SITE_CONFIG === "undefined" || !SITE_CONFIG?.projects) return;

    const project = SITE_CONFIG.projects.find((p) => p.id === projectId);
    if (!project) return;

    // Set CSS custom properties for theme colors
    const root = document.documentElement;
    root.style.setProperty("--project-color", project.theme.titleColor);
    root.style.setProperty("--project-color-secondary", project.theme.borderColor);
    root.style.setProperty("--project-color-alpha", project.theme.background);

    // Populate hero
    populateHero(project);

    // Populate features
    populateFeatures(project);

    // Populate video
    populateVideo(project);

    // Populate screenshots/gallery
    populateScreenshots(project);

    // Populate downloads/links
    populateDownloads(project);

    // Populate next/previous project navigation
    populateProjectNav(projectId);

    // Initialize scroll reveal
    initProjectScrollReveal();

    // Initialize header scroll effect
    initHeaderScroll();

    // Update meta description
    updateMetaDescription(project);
  });

  function populateHero(project) {
    // Title
    const titleEl = document.getElementById("project-title");
    if (titleEl) titleEl.textContent = project.title;

    // Page title
    document.title = `${project.title} — Meraki Studios`;

    // Description
    const descEl = document.getElementById("project-description");
    if (descEl) descEl.textContent = project.fullDescription;

    // Image
    const imageContainer = document.getElementById("project-hero-img");
    if (imageContainer) {
      if (project.image) {
        imageContainer.innerHTML = `<img src="../${project.image}" alt="${project.title}">`;
      } else if (project.icon) {
        imageContainer.innerHTML = `<i class="${project.icon}"></i>`;
        if (project.iconBackground) {
          imageContainer.style.backgroundColor = project.iconBackground;
        }
      }
    }

    // Tags
    const tagsContainer = document.getElementById("project-tags");
    if (tagsContainer && project.tags) {
      tagsContainer.innerHTML = project.tags
        .map((t) => `<span class="project-tag">${t}</span>`)
        .join("");
    }

    // Action buttons
    const actionsContainer = document.getElementById("project-actions");
    if (actionsContainer && project.links) {
      actionsContainer.innerHTML = project.links
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank" class="project-btn" style="${l.style}">${l.text}</a>`
        )
        .join("");
    }
  }

  function populateFeatures(project) {
    const grid = document.getElementById("features-grid");
    const section = document.getElementById("features-section");
    if (!grid || !project.features?.length) {
      if (section) section.style.display = "none";
      return;
    }

    grid.innerHTML = project.features
      .map(
        (f, i) => `
        <div class="feature-card scroll-reveal" style="--reveal-delay: ${i * 100}ms;">
          <div class="feature-icon">
            <i class="${f.icon}"></i>
          </div>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `
      )
      .join("");
  }

  function populateVideo(project) {
    const section = document.getElementById("video-section");
    const container = document.getElementById("video-container");
    if (!section || !container) return;

    if (project.youtubeId) {
      container.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${project.youtubeId}"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy"></iframe>
      `;
    } else {
      section.style.display = "none";
    }
  }

  function populateScreenshots(project) {
    const grid = document.getElementById("screenshots-grid");
    const section = document.getElementById("screenshots-section");
    if (!grid || !section) return;

    if (project.galleryImages?.length) {
      grid.innerHTML = project.galleryImages
        .map(
          (src) => `
          <div class="screenshot-card scroll-reveal">
            <img src="../${src}" alt="Screenshot" loading="lazy">
          </div>
        `
        )
        .join("");
    } else {
      // Show placeholder cards
      grid.innerHTML = `
        <div class="screenshot-card scroll-reveal">
          <div class="screenshot-placeholder">
            <i class="fa-solid fa-image"></i>
            <span>Screenshots coming soon</span>
          </div>
        </div>
        <div class="screenshot-card scroll-reveal" style="--reveal-delay: 100ms;">
          <div class="screenshot-placeholder">
            <i class="fa-solid fa-image"></i>
            <span>Screenshots coming soon</span>
          </div>
        </div>
      `;
    }
  }

  function populateDownloads(project) {
    const grid = document.getElementById("downloads-grid");
    const section = document.getElementById("downloads-section");
    if (!grid || !section) return;

    if (project.links?.length) {
      grid.innerHTML = project.links
        .map(
          (l) => `
          <a href="${l.url}" target="_blank" class="download-card scroll-reveal">
            <div class="download-icon">
              <i class="fa-solid fa-download"></i>
            </div>
            <div class="download-info">
              <h3>${l.text}</h3>
              <p>Get ${project.title}</p>
            </div>
          </a>
        `
        )
        .join("");
    } else {
      section.style.display = "none";
    }
  }

  function populateProjectNav(currentId) {
    const navContainer = document.getElementById("project-nav");
    if (!navContainer) return;

    const projects = SITE_CONFIG.projects;
    const currentIndex = projects.findIndex((p) => p.id === currentId);
    if (currentIndex === -1) return;

    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

    navContainer.innerHTML = `
      <div class="project-nav-inner">
        <a href="${prevProject.id === prevProject.id ? prevProject.pageUrl?.replace('projects/', '') || prevProject.id + '.html' : '#'}" class="project-nav-link prev">
          <span class="project-nav-label">\u2190 Previous Project</span>
          <span class="project-nav-title">${prevProject.title}</span>
        </a>
        <a href="${nextProject.pageUrl?.replace('projects/', '') || nextProject.id + '.html'}" class="project-nav-link next">
          <span class="project-nav-label">Next Project \u2192</span>
          <span class="project-nav-title">${nextProject.title}</span>
        </a>
      </div>
    `;
  }

  function initProjectScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");

    revealElements.forEach((el) => {
      const delay = el.style.getPropertyValue("--reveal-delay") || "0ms";
      el.style.setProperty("--reveal-delay", delay);
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
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function initHeaderScroll() {
    const header = document.querySelector(".glass-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  function updateMetaDescription(project) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = project.fullDescription;
  }
})();
