/* ============================================================
   animations.js  – Meraki Studios Animation Manager
   Simplified logic with floating animations removed.
   ============================================================ */
(function () {
  "use strict";
  
  // This check now runs only ONCE when the script is first loaded.
  const IS_LOW_END_DEVICE = (() => {
    const mobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 768;
    const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    return mobileBrowser || prefersReducedMotion || isSmallScreen || lowCPU;
  })();

  // Optimized utility functions
  const rand = (min, max) => Math.random() * (max - min) + min;
  
  // Animation presets for reuse
  const ANIMATION_PRESETS = {
    bounce: (t) => {
      const b = 4;
      return 1 - Math.pow(Math.abs(Math.cos(t * Math.PI * b)), 2);
    },
    elastic: (t) => {
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    smooth: (t) => t * t * (3 - 2 * t)
  };

  // Animation configuration (one place to tune durations/behavior)
  const ANIM_CONFIG = {
    oneTimeDuration: 700, // ms - shorter, snappier one-time entrance
    mutationBatchMs: 80 // debounce window for batched mutations
  };

  class GlobalAnimator {
    constructor() {
      this.elements = new Map(); 
      this.time = 0;
      this.rafId = null;
      this.lastFrameTime = 0;
      this.fps = IS_LOW_END_DEVICE ? 24 : 60; 
      this.fpsInterval = 1000 / this.fps;
      this.deviceScale = (window.innerWidth < 700 || /Mobi|Android/i.test(navigator.userAgent)) ? 0.5 : 1.0;
      this.maxActiveElements = IS_LOW_END_DEVICE ? 24 : 300;
      this.update = this.update.bind(this);
      
      this.frameCount = 0;
      this.lastFPSUpdate = 0;
      this.monitorPerformance();
    }
    
    add(element, effectType, options = {}) {
      if (!this.elements.has(element)) {
        const baseData = {
          effects: new Set(),
          phase: rand(0, Math.PI * 2),
          dir: Math.random() > 0.5 ? 1 : -1,
          duration: rand(6, 10), 
          delay: rand(-6, 0),
          amplitude: (options.amplitude || 1) * this.deviceScale,
          easing: ANIMATION_PRESETS[options.easing || 'smooth'],
          lastUpdate: performance.now()
        };
        
        this.elements.set(element, baseData);
      }
      
      const data = this.elements.get(element);
      data.effects.add(effectType);
      
      if (!this.rafId) this.start();
      return this;
    }
    remove(element, effectType) {
      const data = this.elements.get(element);
      if (!data) return;
      
      data.effects.delete(effectType);
      if (data.effects.size === 0) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'none';
        setTimeout(() => {
          element.style.transition = '';
          this.elements.delete(element);
        }, 300);
      }
      if (this.elements.size === 0) this.stop();
    }

    monitorPerformance() {
      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFPSUpdate > 1000) {
        const fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
        this.fps = Math.min(60, Math.max(IS_LOW_END_DEVICE ? 20 : 30, fps));
        this.fpsInterval = 1000 / this.fps;

        this.frameCount = 0;
        this.lastFPSUpdate = now;
      }
    }
    
    update(timestamp) {
      if (timestamp - this.lastFrameTime < this.fpsInterval) {
        this.rafId = requestAnimationFrame(this.update);
        return;
      }

      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      this.time += deltaTime / 1000;
      
      this.monitorPerformance();

      const transforms = new Map();

      let activeCount = 0;
      for (const [el, data] of this.elements) {
        if (!el.isConnected) {
          this.elements.delete(el);
          continue;
        }
        if (activeCount >= this.maxActiveElements) break;
        let transformY = 0, transformRotate = 0, transformScale = 1;
        const time = (this.time + data.delay) * (Math.PI * 2 / data.duration);

        // --- FIX 1: All floating animation logic has been removed from the update loop ---
        
        if (data.effects.has('pulse')) {
          const pulseScale = 1 + Math.sin(time * 2) * 0.03 * data.amplitude;
          transformScale *= pulseScale;
        }
        
        if (data.effects.has('hover')) {
          const hoverY = Math.sin(time * 1.5) * 8 * data.amplitude;
          transformY += data.easing(Math.abs(Math.sin(time * 1.5))) * hoverY;
        }
        
        transforms.set(el, {
          y: Math.round(transformY * 100) / 100,
          rotate: Math.round(transformRotate * 100) / 100,
          scale: Math.round(transformScale * 1000) / 1000
        });
        activeCount++;
      }
      
      transforms.forEach((transform, el) => {
        el.style.transform = `translateY(${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale})`;
        el.style.willChange = 'transform';
      });
      
      this.rafId = requestAnimationFrame(this.update);
    }
    
    start() {
      if (!this.rafId) {
        this.lastFrameTime = performance.now();
        this.rafId = requestAnimationFrame(this.update);
      }
    }
    
    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }
  
  const globalAnimator = new GlobalAnimator();

  class ScrollAnimationManager {
    constructor() {
      if (!('IntersectionObserver' in window)) return;
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = (Math.random() * 200) + (Array.from(el.parentNode.children).indexOf(el) * 100);
            el.style.setProperty("--delay", `${delay}ms`);
            el.classList.add("is-visible");
            this.observer.unobserve(el);
          }
        }
      }, { threshold: 0.1 });
    }
    observe(selector = ".animate-on-scroll") { if (this.observer) document.querySelectorAll(selector).forEach(el => this.observer.observe(el)); }
  }
  
  class EffectManager {
    constructor(effectType, options = {}) {
      this.effectType = effectType;
      this.options = options;
    }
    
    apply(selector, options = {}) {
      const merged = Object.assign({}, this.options, options || {});
      if (IS_LOW_END_DEVICE) merged.amplitude = (merged.amplitude || 1) * 0.55;

      try {
        window.MerakiAnimations = window.MerakiAnimations || {};
        window.MerakiAnimations._applied = window.MerakiAnimations._applied || [];
        const exists = window.MerakiAnimations._applied.some(a => a.type === this.effectType && a.selector === selector);
        if (!exists) window.MerakiAnimations._applied.push({ type: this.effectType, selector, options: merged });
      } catch (e) {}

      if (window.MerakiAnimations && window.MerakiAnimations.enabled === false) return;
      if (IS_LOW_END_DEVICE) return; 

      document.querySelectorAll(selector).forEach(el => {
        try {
          globalAnimator.add(el, this.effectType, merged);
        } catch (e) {}
      });
    }

    applyToElement(element, options = {}) {
      if (!element || !(element instanceof Element)) return;
      const merged = Object.assign({}, this.options, options || {});
      if (IS_LOW_END_DEVICE) merged.amplitude = (merged.amplitude || 1) * 0.55;

      try {
        window.MerakiAnimations = window.MerakiAnimations || {};
        window.MerakiAnimations._applied = window.MerakiAnimations._applied || [];
        if (!element.dataset.animId) element.dataset.animId = `anim-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}`;
        const id = element.dataset.animId;
        const exists = window.MerakiAnimations._applied.some(a => a.type === this.effectType && a.elementId === id);
        if (!exists) window.MerakiAnimations._applied.push({ type: this.effectType, elementId: id, options: merged });
      } catch (e) {}

      if (window.MerakiAnimations && window.MerakiAnimations.enabled === false) return;
      if (IS_LOW_END_DEVICE) return;

      try {
        globalAnimator.add(element, this.effectType, merged);
      } catch (e) {}
    }
  }

  // Enhanced animation system with new effects
  window.MerakiAnimations = {
    scroll: new ScrollAnimationManager(),
    // --- FIX 2: Commented out the floating effect managers ---
    // subtleFloat: new EffectManager('subtle-float', { 
    //   easing: 'smooth', 
    //   amplitude: 0.75 
    // }),
    // float: new EffectManager('float', { 
    //   easing: 'elastic', 
    //   amplitude: 0.95 
    // }),
    hover: new EffectManager('hover', { 
      easing: 'bounce', 
      amplitude: 0.7 
    }),
    pulse: new EffectManager('pulse', { 
      easing: 'smooth', 
      amplitude: 1 
    }),
    isLowEnd: IS_LOW_END_DEVICE,
    enabled: (() => {
      try {
        const persisted = localStorage.getItem('meraki:animations_disabled');
        if (persisted === 'true') return false;
      } catch (e) {}
      return true;
    })(),
    _applied: [],
    
    animate: (element, type, options = {}) => {
      if (!IS_LOW_END_DEVICE) {
        return globalAnimator.add(element, type, options);
      }
      return null;
    },
    
    removeAnimation: (element, type) => {
      globalAnimator.remove(element, type);
    },
    disable: (opts = { persist: false }) => {
      try {
        window.MerakiAnimations.enabled = false;
        globalAnimator.stop();

        for (const [el] of Array.from(globalAnimator.elements)) {
          try {
            el.style.transform = '';
            el.style.willChange = '';
          } catch (e) {}
          globalAnimator.elements.delete(el);
        }

        if (opts.persist) {
          try { localStorage.setItem('meraki:animations_disabled', 'true'); } catch (e) {}
        }
        
        document.documentElement.classList.add('no-animations');
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('is-visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
        
        const criticalSelectors = [
          'header', 'header *', '.main-logo', '#main p',
          '.detail-card', '.detail-card *', '.project-card', '.project-card *',
          '.service-card', '.service-card *', '.team-member-card', '.team-member-card *',
          '.nav-btn-special'
        ];
        
        criticalSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
            el.style.willChange = 'auto';
          });
        });
      } catch (e) {}
    },
    enable: (opts = { persist: false }) => {
      try {
        window.MerakiAnimations.enabled = true;
        document.documentElement.classList.remove('no-animations');
        
        const criticalSelectors = [
          'header', 'header *', '.main-logo', '#main p', '.detail-card', '.detail-card *',
          '.project-card', '.project-card *', '.service-card', '.service-card *',
          '.team-member-card', '.team-member-card *', '.nav-btn-special', '.animate-on-scroll'
        ];
        
        criticalSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
            el.style.willChange = '';
          });
        });
        
        (window.MerakiAnimations._applied || []).forEach(entry => {
          const map = {
            'hover': 'hover', 'pulse': 'pulse'
          };
          const managerName = map[entry.type];
          try {
            const mgr = window.MerakiAnimations[managerName];
            if (mgr && typeof mgr.apply === 'function') mgr.apply(entry.selector, entry.options);
          } catch (e) {}
        });
        
        globalAnimator.start();
        
        if (opts.persist) {
          try { localStorage.removeItem('meraki:animations_disabled'); } catch (e) {}
        }
      } catch (e) {}
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    try {
      if (window.MerakiAnimations?.enabled === false || window.MerakiAnimations.isLowEnd) {
        document.documentElement.classList.add('no-animations');
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.add('is-visible');
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
        
        const criticalSelectors = [
          'header', 'header *', '.main-logo', '#main p', '.detail-card', '.detail-card *',
          '.project-card', '.project-card *', '.service-card', '.service-card *',
          '.team-member-card', '.team-member-card *', '.nav-btn-special'
        ];
        
        criticalSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
            el.style.willChange = 'auto';
          });
        });
        
        return;
      }

      const small = window.innerWidth < 700 || /Mobi|Android/i.test(navigator.userAgent);

      // --- FIX 3: Removed all calls that apply the 'float' and 'subtleFloat' effects ---
      if (window.MerakiAnimations?.pulse) {
        window.MerakiAnimations.pulse.apply('.nav-btn-special', { amplitude: small ? 0.15 : 0.22 });
      }

      if (window.MerakiAnimations?.scroll && typeof window.MerakiAnimations.scroll.observe === 'function') {
        window.MerakiAnimations.scroll.observe('.animate-on-scroll');
      }
    } catch (e) {}
  });

  try {
    window.ANIM_CONFIG = ANIM_CONFIG;
    window.MerakiAnimations = window.MerakiAnimations || {};
    window.MerakiAnimations.ANIM_CONFIG = ANIM_CONFIG;
  } catch (e) {}

})();

(function () {
  try {
    const checkbox = document.getElementById('anim-toggle-checkbox');
    if (!checkbox) return;

    // --- FIX: Set toggle state based on device capability AND user preference ---
    // Safely check properties on the global animation object.
    const isLowEnd = window.MerakiAnimations ? window.MerakiAnimations.isLowEnd : false;
    const isEnabledBySystem = window.MerakiAnimations ? window.MerakiAnimations.enabled : true;

    // The final state: animations must be enabled by the system AND not be on a low-end device.
    const finalEnabledState = isEnabledBySystem && !isLowEnd;
    checkbox.checked = finalEnabledState;

    const live = document.getElementById('anim-toggle-live');
    const updateAria = (state) => {
      try {
        checkbox.setAttribute('aria-checked', state ? 'true' : 'false');
        const switchEl = checkbox.nextElementSibling;
        if (switchEl && switchEl.classList.contains('anim-toggle-switch')) {
          switchEl.setAttribute('aria-checked', state ? 'true' : 'false');
        }
        if (live) live.textContent = state ? 'Animations enabled' : 'Animations disabled';
      } catch (e) {}
    };

    checkbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
      updateAria(checked);
      if (checked) {
        try { window.MerakiAnimations.enable({ persist: true }); } catch (err) {}
      } else {
        try { window.MerakiAnimations.disable({ persist: true }); } catch (err) {}
      }
    });

    if (!finalEnabledState) {
      document.documentElement.classList.add('no-animations');
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
      
      document.querySelectorAll('.detail-card *, .project-card *, .service-card *, .team-member-card *').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
    }
    updateAria(finalEnabledState);
  } catch (e) {}
})();

(function () {
  try {
    const pending = new Set();
    let timer = null;

    const processPending = () => {
      const items = Array.from(pending);
      pending.clear();
      timer = null;

    const cfg = (window.ANIM_CONFIG || { oneTimeDuration: 700 });
    const staggerMs = Math.min(80, Math.max(20, Math.floor(cfg.oneTimeDuration / 8)));
      items.forEach((el, idx) => {
        setTimeout(() => {
          try {
            el.classList.add('animate-once', 'popIn', 'is-visible');
            // --- FIX 4: This check for 'subtleFloat' is no longer needed as it doesn't exist ---
            setTimeout(() => {
              try { el.classList.remove('animate-once', 'popIn'); } catch (e) {}
            }, cfg.oneTimeDuration);
          } catch (e) {}
        }, idx * staggerMs);
      });
    };

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches('.detail-card')) pending.add(node);
          else if (node.querySelectorAll) {
            node.querySelectorAll('.detail-card').forEach(c => pending.add(c));
          }
        }
      }

      if (pending.size && !timer) {
        timer = setTimeout(processPending, (window.ANIM_CONFIG && window.ANIM_CONFIG.mutationBatchMs) || 80);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
})();