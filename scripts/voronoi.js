// stars.js - Animated Starry Night Background
(function () {
  "use strict";

  const control = {
    rafId: null,
    isRunning: false,
  };

  window.addEventListener("load", initStars);

  function initStars() {
    const canvas = document.getElementById("voronoi-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let stars = [];
    let mouseX = 0.5;
    let mouseY = 0.5;

    // Configuration
    const config = {
      starCount: 200,
      minSize: 0.5,
      maxSize: 2.5,
      twinkleSpeed: 0.02,
      parallaxStrength: 30,
      nebulaOpacity: 0.15,
    };

    // Star class
    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random();
        this.y = Math.random();
        this.baseSize = config.minSize + Math.random() * (config.maxSize - config.minSize);
        this.size = this.baseSize;
        this.opacity = 0.3 + Math.random() * 0.7;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.twinkleSpeed = config.twinkleSpeed * (0.5 + Math.random());
        this.depth = 0.3 + Math.random() * 0.7; // For parallax
      }
    }

    // Initialize stars
    function createStars() {
      stars = [];
      for (let i = 0; i < config.starCount; i++) {
        stars.push(new Star());
      }
    }

    // Resize handler
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    }

    // Draw nebula gradient
    function drawNebula() {
      const gradient = ctx.createRadialGradient(
        width * 0.7, height * 0.3, 0,
        width * 0.7, height * 0.3, width * 0.6
      );
      gradient.addColorStop(0, `rgba(77, 163, 255, ${config.nebulaOpacity})`);
      gradient.addColorStop(0.5, `rgba(26, 39, 68, ${config.nebulaOpacity * 0.5})`);
      gradient.addColorStop(1, "rgba(13, 17, 23, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Second nebula cluster
      const gradient2 = ctx.createRadialGradient(
        width * 0.2, height * 0.7, 0,
        width * 0.2, height * 0.7, width * 0.4
      );
      gradient2.addColorStop(0, `rgba(138, 100, 200, ${config.nebulaOpacity * 0.5})`);
      gradient2.addColorStop(1, "rgba(13, 17, 23, 0)");

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
    }

    // Render loop
    let lastTime = 0;
    function render(now) {
      if (!control.isRunning) return;

      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw subtle nebula
      drawNebula();

      // Draw stars
      const centerX = 0.5;
      const centerY = 0.5;
      const offsetX = (mouseX - centerX) * config.parallaxStrength;
      const offsetY = (mouseY - centerY) * config.parallaxStrength;

      for (const star of stars) {
        // Update twinkle
        const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const currentOpacity = star.opacity * (0.7 + twinkle * 0.3);
        const currentSize = star.baseSize * (0.8 + twinkle * 0.2);

        // Calculate position with parallax
        const px = star.x * width + offsetX * star.depth;
        const py = star.y * height + offsetY * star.depth;

        // Draw star glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, currentSize * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(px, py, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(px, py, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      }

      control.rafId = requestAnimationFrame(render);
    }

    // Mouse move handler for parallax
    function handleMouseMove(e) {
      mouseX = e.clientX / width;
      mouseY = e.clientY / height;
    }

    // Start animation
    function start() {
      if (control.isRunning) return;
      control.isRunning = true;
      control.rafId = requestAnimationFrame(render);
    }

    // Stop animation
    function stop() {
      control.isRunning = false;
      if (control.rafId) {
        cancelAnimationFrame(control.rafId);
        control.rafId = null;
      }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    function handleReducedMotion() {
      if (prefersReducedMotion.matches) {
        stop();
        // Draw static stars
        ctx.clearRect(0, 0, width, height);
        drawNebula();
        for (const star of stars) {
          const px = star.x * width;
          const py = star.y * height;
          ctx.beginPath();
          ctx.arc(px, py, star.baseSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        }
      } else {
        start();
      }
    }

    // Initialize
    resize();
    createStars();
    
    // Event listeners
    window.addEventListener("resize", () => {
      resize();
    });
    
    document.addEventListener("mousemove", handleMouseMove);
    
    prefersReducedMotion.addEventListener("change", handleReducedMotion);

    // Animation toggle support
    const animToggle = document.getElementById("anim-toggle-checkbox");
    if (animToggle) {
      animToggle.addEventListener("change", () => {
        if (animToggle.checked) {
          start();
        } else {
          stop();
        }
      });
      // Set initial state
      animToggle.checked = true;
    }

    // Start the animation
    handleReducedMotion();
  }
})();