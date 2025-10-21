// main.js - Main application logic for Meraki Studios website

(function() {
    "use strict";

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize the site with configuration
        initializeSite();
        setupEventListeners();
        setupAnimations();
        setupConsole();
    });

    function initializeSite() {
        // Render studio details
        renderStudioDetails();
        
        // Render projects
        renderProjects();
        
        // Render team members
        renderTeamMembers();
        
        // Render filter buttons
        renderFilterButtons();
        
        // Render footer
        renderFooter();
        
        // Render header social links
        renderHeaderSocial();
    }

    function renderStudioDetails() {
        const container = document.querySelector('.main-details-container');
        if (!container) return;
        
        container.innerHTML = SITE_CONFIG.studioDetails.map(detail => `
            <div class="detail-card">
                <h3>${detail.title}</h3>
                <p>${detail.description}</p>
            </div>
        `).join('');
    }

    function renderProjects() {
        const container = document.querySelector('.projects-container');
        if (!container) return;
        
        container.innerHTML = SITE_CONFIG.projects.map(project => {
            const imageHtml = project.image 
                ? `<div class="project-image" style="background-image: url('${project.image}');"></div>`
                : `<div class="project-image" style="background-color: ${project.iconBackground}; font-size: 6rem; display: flex; align-items: center; justify-content: center;">
                     <i class="${project.icon}"></i>
                   </div>`;
            
            const linksHtml = project.links.map(link => 
                `<a href="${link.url}" target="_blank" class="project-btn" style="${link.style}">${link.text}</a>`
            ).join('');
            
            const galleryImages = project.galleryImages.join(',');
            
            return `
                <div id="${project.id}" 
                     class="project-card animate-on-scroll" 
                     data-tags="${project.tags.join(', ')}"
                     data-title="${project.title}"
                     data-youtube-id="${project.youtubeId || ''}"
                     data-description="${project.fullDescription}"
                     data-images="${galleryImages}"
                     data-links-html="${linksHtml.replace(/"/g, '&quot;')}"
                     style="background: ${project.theme.background}; border-color: ${project.theme.borderColor};">
                    ${imageHtml}
                    <div class="project-content">
                        <h3 style="color: ${project.theme.titleColor};">${project.title}</h3>
                        <p>${project.shortDescription}</p>
                        ${project.links[0] ? `<a href="${project.links[0].url}" target="_blank" class="project-btn" style="background: ${project.theme.buttonBg}; color: ${project.theme.buttonColor};">${project.links[0].text}</a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Apply dynamic hover effects for project buttons
        document.querySelectorAll('.project-card').forEach(card => {
            const projectConfig = SITE_CONFIG.projects.find(p => p.id === card.id);
            if (projectConfig) {
                const btn = card.querySelector('.project-btn');
                if (btn) {
                    btn.addEventListener('mouseenter', () => {
                        btn.style.boxShadow = `0 0 20px -5px ${projectConfig.theme.buttonHoverShadow}`;
                    });
                    btn.addEventListener('mouseleave', () => {
                        btn.style.boxShadow = '';
                    });
                }
            }
        });
    }

    function renderTeamMembers() {
        const container = document.querySelector('.team-grid');
        if (!container) return;
        
        container.innerHTML = SITE_CONFIG.team.map(member => {
            const socialLinks = member.social.length > 0 
                ? `<div class="team-social-links">
                     ${member.social.map(social => 
                         `<a href="${social.url}" target="_blank" title="${social.platform}">
                            <i class="${social.icon}"></i>
                          </a>`
                     ).join('')}
                   </div>`
                : '';
            
            return `
                <div class="team-member-card animate-on-scroll">
                    <div class="member-details">
                        <img src="${member.image}" alt="${member.name}" />
                        <div class="card-content">
                            <h3>${member.name}</h3>
                            <p class="role">${member.role}</p>
                            <p class="bio">${member.bio}</p>
                        </div>
                    </div>
                    ${socialLinks}
                </div>
            `;
        }).join('');
    }

    function renderFilterButtons() {
        const container = document.querySelector('.filter-buttons');
        if (!container) return;
        
        container.innerHTML = SITE_CONFIG.filterCategories.map(category => `
            <button class="filter-btn ${category.id === 'all' ? 'active' : ''}" 
                    data-filter="${category.id}">
                ${category.label}
            </button>
        `).join('');
    }

    function renderFooter() {
        const platformShowcase = document.querySelector('.platform-showcase');
        if (platformShowcase) {
            const linksHtml = SITE_CONFIG.footer.platforms.map(platform => `
                <a href="${platform.url}" target="_blank" title="${platform.name}">
                    <img src="${platform.logo}" alt="${platform.name} Logo" />
                </a>
            `).join('');
            platformShowcase.innerHTML = `
                <p class="section-title">Find Our Projects On</p>
                ${linksHtml}
            `;
        }
        
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            contactInfo.innerHTML = `
                <p class="section-title">Get in Touch</p>
                <p class="contact-intro">${SITE_CONFIG.footer.contact.intro}</p>
                <a href="mailto:${SITE_CONFIG.footer.contact.email}" class="email-link">
                    ${SITE_CONFIG.footer.contact.email}
                </a>
            `;
        }
        
        const copyright = document.querySelector('.footer-copyright');
        if (copyright) {
            copyright.textContent = SITE_CONFIG.footer.copyright;
        }
    }

    function renderHeaderSocial() {
        const socialGroup = document.querySelector('header .social-group');
        if (!socialGroup) return;
        
        socialGroup.innerHTML = SITE_CONFIG.headerSocial.map(social => `
            <a href="${social.url}" target="_blank" title="${social.platform}">
                <i class="${social.icon}"></i>
            </a>
        `).join('');
    }

    function setupEventListeners() {
        const loader = document.getElementById('loader-overlay');
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const primaryNav = document.querySelector('nav');
        const allNavLinks = document.querySelectorAll('nav a');
        const sections = document.querySelectorAll('section');
        const desktopNavLinks = document.querySelectorAll('header nav .nav-links a');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = Array.from(document.querySelectorAll('.project-card'));
        
        // Loader
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.classList.add('loaded');
            }, 500);
        });
        
        // Mobile navigation
        const closeMenu = () => {
            primaryNav.setAttribute('data-visible', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavToggle.querySelector('i').className = "fa-solid fa-bars";
            document.body.style.overflow = '';
        };
        
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            if (isVisible) {
                closeMenu();
            } else {
                primaryNav.setAttribute('data-visible', 'true');
                mobileNavToggle.setAttribute('aria-expanded', 'true');
                mobileNavToggle.querySelector('i').className = "fa-solid fa-xmark";
                document.body.style.overflow = 'hidden';
            }
        });
        
        allNavLinks.forEach(link => link.addEventListener('click', closeMenu));
        
        // Scroll-based navigation highlighting
        window.addEventListener('scroll', () => {
            let currentSectionId = '';
            sections.forEach(section => {
                if (window.pageYOffset >= section.offsetTop - 70) {
                    currentSectionId = section.id;
                }
            });
            desktopNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Project filtering
        const applyFilter = () => {
            const projectsContainer = document.querySelector('.projects-container');
            const activeFilters = Array.from(filterButtons)
                .filter(btn => btn.classList.contains('active') && btn.dataset.filter !== 'all')
                .map(btn => btn.dataset.filter);
            
            const firstRects = new Map();
            projectCards.forEach(card => {
                card.dataset.wasVisible = !card.classList.contains('hiding');
                firstRects.set(card, card.getBoundingClientRect());
            });
            
            const matches = [];
            const nonMatches = [];
            projectCards.forEach(card => {
                const tags = (card.dataset.tags || '').split(',').map(t => t.trim());
                const isMatch = activeFilters.length === 0 || activeFilters.some(filter => tags.includes(filter));
                if (isMatch) matches.push(card);
                else nonMatches.push(card);
            });
            
            matches.concat(nonMatches).forEach(card => projectsContainer.appendChild(card));
            
            projectCards.forEach(card => {
                const firstRect = firstRects.get(card);
                const lastRect = card.getBoundingClientRect();
                const isNowVisible = matches.includes(card);
                const wasVisible = card.dataset.wasVisible === 'true';
                const dx = firstRect.left - lastRect.left;
                const dy = firstRect.top - lastRect.top;
                
                if (dx === 0 && dy === 0 && isNowVisible === wasVisible) return;
                
                const appearing = isNowVisible && !wasVisible;
                const disappearing = !isNowVisible && wasVisible;
                let startTransform = `translate(${dx}px, ${dy}px)`;
                if (appearing) startTransform += ' scale(0.9)';
                let endTransform = 'translate(0, 0)';
                if (disappearing) endTransform += ' scale(0.9)';
                
                card.style.transform = startTransform;
                card.style.opacity = wasVisible ? '1' : '0';
                card.style.transition = 'none';
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out';
                        card.style.transform = endTransform;
                        card.style.opacity = isNowVisible ? '1' : '0';
                    });
                });
                
                card.classList.toggle('hiding', !isNowVisible);
            });
        };
        
        filterButtons.forEach(btn => btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            if (filter === 'all') {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                btn.classList.toggle('active');
                document.querySelector('.filter-btn[data-filter="all"]').classList.remove('active');
                if (!document.querySelector('.filter-btn.active')) {
                    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
                }
            }
            applyFilter();
        }));
        
        // Project modal
        setupProjectModal(projectCards);
    }

    function setupProjectModal(projectCards) {
        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-project-title');
        const modalVideo = document.getElementById('modal-project-video');
        const modalGallery = document.getElementById('modal-project-gallery');
        const modalDescription = document.getElementById('modal-project-description');
        const modalLinks = document.getElementById('modal-project-links');
        const modalClose = modal.querySelector('.modal-close-btn');
        
        const openModalFromCard = (card) => {
            modalTitle.textContent = card.dataset.title || '';
            modalDescription.textContent = card.dataset.description || '';
            modalLinks.innerHTML = card.dataset.linksHtml || '';
            modalVideo.innerHTML = '';
            modalGallery.innerHTML = '';
            modalVideo.style.display = 'none';
            modalGallery.classList.add('hidden');
            
            const youtubeId = (card.dataset.youtubeId || '').trim();
            const images = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
            
            if (youtubeId) {
                modalVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                modalVideo.style.display = 'block';
            } else if (images.length) {
                modalGallery.innerHTML = images.map(src => `<img src="${src}" alt="Project image">`).join('');
                modalGallery.classList.remove('hidden');
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };
        
        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            modalVideo.innerHTML = '';
            modalGallery.innerHTML = '';
        };
        
        projectCards.forEach(card => {
            card.addEventListener('click', e => {
                if (!e.target.closest('a.project-btn')) {
                    openModalFromCard(card);
                }
            });
        });
        
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });
    }

    function setupAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = (Math.random() * 200) + 
                                (Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100);
                    entry.target.style.setProperty('--delay', `${delay}ms`);
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Animation randomization for cards
        const animatedCards = document.querySelectorAll('.detail-card, .team-member-card');
        animatedCards.forEach(card => {
            const direction = Math.random() > 0.5 ? 1 : -1;
            card.style.setProperty('--rotation-direction', direction);
            const duration = Math.random() * 5 + 10;
            const delay = Math.random() * -15;
            card.style.setProperty('--anim-duration', `${duration}s`);
            card.style.setProperty('--anim-delay', `${delay}s`);
        });
        
        const socialIcons = document.querySelectorAll('.social-group a, .team-social-links a');
        socialIcons.forEach(icon => {
            icon.style.setProperty('--rotation-direction', Math.random() > 0.5 ? 1 : -1);
            icon.style.willChange = 'transform';
            icon.style.backfaceVisibility = 'hidden';
        });
        
        const logoContainer = document.querySelector('#main .logo-container');
        if (logoContainer) {
            logoContainer.style.setProperty('--rotation-direction', Math.random() > 0.5 ? 1 : -1);
        }
        
        // Start alternating tilt animation
        const startAlternatingTilt = (el, fallbackMs = 800) => {
            const cs = window.getComputedStyle(el);
            let dur = 0;
            try {
                const raw = cs.animationDuration || cs.getPropertyValue('animation-duration') || '';
                if (raw) {
                    const first = raw.split(',')[0].trim();
                    if (first.endsWith('ms')) dur = parseFloat(first);
                    else if (first.endsWith('s')) dur = parseFloat(first) * 1000;
                }
            } catch (e) { dur = 0; }
            
            const interval = Math.max(200, Math.round(dur || fallbackMs) + Math.round(Math.random() * 200 - 100));
            
            if (!el.style.getPropertyValue('--rotation-direction')) {
                el.style.setProperty('--rotation-direction', '1');
            }
            
            const timer = setInterval(() => {
                const current = parseFloat(getComputedStyle(el).getPropertyValue('--rotation-direction')) || 1;
                el.style.setProperty('--rotation-direction', current > 0 ? -1 : 1);
            }, interval);
            
            el._tiltToggleTimer = timer;
        };
        
        try {
            document.querySelectorAll('.logo-container, .detail-card, .team-member-card, .main-logo').forEach(el => {
                startAlternatingTilt(el, 1200);
            });
        } catch (e) {
            console.warn('Tilt alternation init failed', e);
        }
        
        socialIcons.forEach(icon => startAlternatingTilt(icon, 500));
    }

    function setupConsole() {
        const consoleInput = document.getElementById("console-input");
        const consoleOutput = document.getElementById("console-output");
        const consoleBox = document.getElementById("console-logo");
        
        if (!consoleInput || !consoleOutput || !consoleBox) return;
        
        const focusConsole = () => {
            consoleInput.focus();
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(consoleInput);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        };
        
        focusConsole();
        consoleBox.addEventListener("click", focusConsole);
        
        consoleInput.addEventListener("input", () => {
            if (consoleInput.textContent.length > 40) {
                consoleInput.textContent = consoleInput.textContent.slice(0, 40);
                focusConsole();
            }
        });
        
        consoleInput.addEventListener("paste", e => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData("text/plain");
            document.execCommand("insertText", false, text);
        });
        
        const handleCommand = (cmd) => {
            if (!cmd) return;
            const [command, ...args] = cmd.split(" ");
            const argString = args.join(" ");
            
            switch (command.toLowerCase()) {
                case "version":
                    consoleOutput.textContent = "Meraki Studios: Website | Update 2.0";
                    break;
                case "echo":
                    consoleOutput.textContent = argString;
                    break;
                case "seed":
                    const seed = parseInt(args[0]);
                    if (!isNaN(seed)) {
                        const url = new URL(window.location);
                        url.searchParams.set("seed", seed);
                        window.location.href = url.toString();
                    } else {
                        consoleOutput.textContent = "Invalid seed value.";
                    }
                    break;
                default:
                    consoleOutput.textContent = `'${command}' is not recognized as an internal or external command.`;
            }
        };
        
        consoleInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleCommand(consoleInput.textContent.trim());
                consoleInput.textContent = "";
            }
        });
    }
})();