// voronoi.js - Optimized Animated Voronoi diagram background

(function () {
  "use strict";

  // Wait for DOM to be fully loaded and rendered
  window.addEventListener('load', initVoronoi);

  function initVoronoi() {
    const canvas = document.getElementById("voronoi-canvas");
    const gridContainer = document.getElementById("shape-grid");

    if (!canvas || !gridContainer) {
      console.error("Voronoi canvas or grid container not found");
      return;
    }

    // Pre-allocate reusable objects to reduce GC
    const tempPoint = { x: 0, y: 0 };
    const tempColor = { r: 0, g: 0, b: 0 };

    const ctx = canvas.getContext("2d", { alpha: false });
    const urlParams = new URLSearchParams(window.location.search);
    const userSeed = parseInt(urlParams.get("seed"), 10);
    const SEED = isNaN(userSeed)
      ? Math.floor(Math.random() * 999999)
      : userSeed;

    console.log("Voronoi Seed:", SEED);

    // Configuration
    const DARK_TEAL = { r: 4, g: 45, b: 55 };
    const BRIGHT_CYAN = { r: 46, g: 255, b: 255 };
    const VISUAL_FADE_MS = 800;
    const TRAIL_FADE_MS = 1500;
    const EFFECT_RADIUS = 200;
    const EFFECT_RADIUS_SQ = EFFECT_RADIUS * EFFECT_RADIUS; // Pre-calculate for distance checks
    const SITE_DENSITY = 6;
    const STROKE_ALPHA = 0.05;
    const BASE_INTENSITY = 0.03;
    const RANDOM_GRADIENT = false;
    const TARGET_FPS = 30;
    const FRAME_TIME = 1000 / TARGET_FPS;

    // Spatial grid for optimized mouse interaction
    const GRID_CELL_SIZE = EFFECT_RADIUS;
    const spatialGrid = new Map();

    let sites = [];
    let polygons = [];
    let widthPx = 0;
    let heightPx = 0;
    let lastTime = performance.now();
    let lastDPR = window.devicePixelRatio || 1;
    let resizeTimeout;

    const mouse = { x: -9999, y: -9999, inside: false };

    // Utility functions
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    const rng = (seed) => () => {
      seed = (seed + 0x6d2b79f5) | 0;
      seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      seed = (seed + Math.imul(seed ^ (seed >>> 7), 61 | seed)) ^ seed;
      return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
    };

    const rand = rng(SEED);
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

    const colorLerp = (c1, c2, t, out = tempColor) => {
      out.r = Math.round(lerp(c1.r, c2.r, t));
      out.g = Math.round(lerp(c1.g, c2.g, t));
      out.b = Math.round(lerp(c1.b, c2.b, t));
      return out;
    };

    const rgbToCss = (c, a = 1) => `rgba(${c.r},${c.g},${c.b},${a})`;

    // Generate random sites for Voronoi diagram
    const generateSites = () => {
      sites = [];
      spatialGrid.clear();
      const smaller = Math.min(widthPx, heightPx);
      const cellSize = Math.max(
        60,
        Math.round(smaller / Math.max(6, SITE_DENSITY))
      );

      for (let y = 0; y < heightPx; y += cellSize) {
        for (let x = 0; x < widthPx; x += cellSize) {
          const site = {
            x: clamp(
              x + cellSize / 2 + (rand() - 0.5) * cellSize * 0.6,
              0,
              widthPx
            ),
            y: clamp(
              y + cellSize / 2 + (rand() - 0.5) * cellSize * 0.6,
              0,
              heightPx
            ),
            intensity: BASE_INTENSITY,
            target: BASE_INTENSITY,
            brightness: 0.5 + rand() * 0.5,
            gradAngle: rand() * Math.PI * 2,
          };

          // Add to spatial grid
          const gridX = Math.floor(site.x / GRID_CELL_SIZE);
          const gridY = Math.floor(site.y / GRID_CELL_SIZE);
          const key = `${gridX},${gridY}`;

          if (!spatialGrid.has(key)) {
            spatialGrid.set(key, []);
          }
          spatialGrid.get(key).push(site);

          sites.push(site);
        }
      }
    };

    // Compute Voronoi polygons
    const computePolygons = () => {
      const bounds = [
        { x: -widthPx * 2, y: -heightPx * 2 },
        { x: widthPx * 3, y: -heightPx * 2 },
        { x: widthPx * 3, y: heightPx * 3 },
        { x: -widthPx * 2, y: heightPx * 3 },
      ];

      polygons = sites.map((site, i) => {
        let polygon = [...bounds];

        for (let j = 0; j < sites.length; j++) {
          if (i === j) continue;

          const other = sites[j];
          const normal = { x: other.x - site.x, y: other.y - site.y };
          const midpoint = {
            x: (other.x + site.x) / 2,
            y: (other.y + site.y) / 2,
          };

          const distanceFromLine = (pt) =>
            (pt.x - midpoint.x) * normal.x + (pt.y - midpoint.y) * normal.y;

          const inputPolygon = [...polygon];
          polygon = [];

          for (let k = 0; k < inputPolygon.length; k++) {
            const a = inputPolygon[k];
            const b = inputPolygon[(k + 1) % inputPolygon.length];
            const distA = distanceFromLine(a);
            const distB = distanceFromLine(b);

            if (distA < 0) polygon.push(a);

            if ((distA < 0 && distB >= 0) || (distA >= 0 && distB < 0)) {
              polygon.push({
                x: a.x + (b.x - a.x) * (distA / (distA - distB)),
                y: a.y + (b.y - a.y) * (distA / (distA - distB)),
              });
            }
          }
        }

        return polygon;
      });
    };

    const generateSitesAndPolygons = () => {
      generateSites();
      computePolygons();
    };

    // --- REVISED RESIZE LOGIC ---
    const resize = () => {
      // Use document.body.scrollHeight to get the true height of all rendered content.
      // This prevents the canvas from infinitely expanding the page.
      const newHeight = document.body.scrollHeight;
      const newWidth = document.body.clientWidth; // Use clientWidth to avoid including scrollbar width
      const newDPR = window.devicePixelRatio || 1;

      // Only perform a resize if the dimensions have actually changed
      if (
        Math.abs(newWidth - widthPx) < 2 &&
        Math.abs(newHeight - heightPx) < 2 &&
        Math.abs(newDPR - lastDPR) < 0.05
      ) {
        return;
      }
      
      widthPx = newWidth;
      heightPx = newHeight;
      lastDPR = newDPR;

      // Set container and canvas dimensions
      gridContainer.style.height = `${heightPx}px`;
      gridContainer.style.width = `${widthPx}px`;
      gridContainer.style.overflow = 'hidden'; // Ensure it doesn't create scrollbars

      canvas.width = widthPx * newDPR;
      canvas.height = heightPx * newDPR;
      canvas.style.width = `${widthPx}px`;
      canvas.style.height = `${heightPx}px`;

      ctx.setTransform(newDPR, 0, 0, newDPR, 0, 0);
      generateSitesAndPolygons();
      
      console.log(`[Voronoi] Resized: ${widthPx}x${heightPx} @ DPR ${newDPR}`);
    };

    // Main render loop
    const render = (now) => {
      // Optional debug: enable by setting window.__VORONOI_DEBUG__ = true
      const VDEBUG = window.__VORONOI_DEBUG__ ?? false;
      if (VDEBUG && now) {
        if (!render._lastLog || now - render._lastLog > 1000) {
          console.debug(
            `[Voronoi] frame @ ${Math.round(now)}ms, sites=${
              sites.length
            }, polys=${polygons.length}, size=${widthPx}x${heightPx}`
          );
          render._lastLog = now;
        }
      }
      // Frame rate control
      if (now - lastTime < FRAME_TIME) {
        requestAnimationFrame(render);
        return;
      }

      const deltaTime = now - lastTime;
      lastTime = now;

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const fadeFactor = clamp(deltaTime / VISUAL_FADE_MS);
      const decayFactor = clamp(deltaTime / TRAIL_FADE_MS);

      // Update site intensities based on mouse proximity using spatial grid
      if (mouse.inside) {
        const mouseGridX = Math.floor((mouse.x + scrollX) / GRID_CELL_SIZE);
        const mouseGridY = Math.floor((mouse.y + scrollY) / GRID_CELL_SIZE);

        // Check only neighboring grid cells
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const key = `${mouseGridX + dx},${mouseGridY + dy}`;
            const cellSites = spatialGrid.get(key);

            if (cellSites) {
              for (let i = 0; i < cellSites.length; i++) {
                const site = cellSites[i];
                const dx = site.x - (mouse.x + scrollX);
                const dy = site.y - (mouse.y + scrollY);
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq <= EFFECT_RADIUS_SQ) {
                  const distance = Math.sqrt(distanceSq);
                  const targetIntensity = clamp(
                    BASE_INTENSITY + (1 - distance / EFFECT_RADIUS)
                  );
                  if (targetIntensity > site.target) {
                    site.target = targetIntensity;
                  }
                }
              }
            }
          }
        }
      }

      // Update all sites' intensities
      const sitesLen = sites.length;
      for (let i = 0; i < sitesLen; i++) {
        const site = sites[i];
        site.intensity += (site.target - site.intensity) * fadeFactor;
        site.target -= (site.target - BASE_INTENSITY) * decayFactor;

        if (site.target < BASE_INTENSITY) {
          site.target = BASE_INTENSITY;
        }
      }

      // Clear canvas
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, widthPx, heightPx);

      // Draw polygons with optimized rendering
      const polygonsLen = polygons.length;
      for (let i = 0; i < polygonsLen; i++) {
        const poly = polygons[i];
        if (!poly || poly.length < 3) continue;

        const site = sites[i];
        const transitionColor = clamp(
          (site.intensity - BASE_INTENSITY) / (1 - BASE_INTENSITY)
        );

        // Reuse temp color object
        colorLerp(DARK_TEAL, BRIGHT_CYAN, transitionColor, tempColor);

        tempColor.r = Math.min(255, tempColor.r * site.brightness);
        tempColor.g = Math.min(255, tempColor.g * site.brightness);
        tempColor.b = Math.min(255, tempColor.b * site.brightness);

        if (RANDOM_GRADIENT) {
          const cosAngle = Math.cos(site.gradAngle) * 80;
          const sinAngle = Math.sin(site.gradAngle) * 80;

          const gradient = ctx.createLinearGradient(
            site.x + cosAngle,
            site.y + sinAngle,
            site.x - cosAngle,
            site.y - sinAngle
          );
          gradient.addColorStop(0, rgbToCss(tempColor));

          // Reuse temp color for gradient end
          colorLerp(tempColor, DARK_TEAL, 0.7, tempColor);
          gradient.addColorStop(1, rgbToCss(tempColor));
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = rgbToCss(tempColor);
        }

        // Optimized path drawing
        const polyLen = poly.length;
        ctx.beginPath();
        ctx.moveTo(poly[0].x, poly[0].y);

        // Unrolled loop for better performance
        for (let p = 1; p < polyLen; p++) {
          const point = poly[p];
          ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();

        if (STROKE_ALPHA > 0) {
          ctx.strokeStyle = `rgba(0,0,0,${STROKE_ALPHA})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(render);
    };

    // Event listeners
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    });

    document.documentElement.addEventListener("mouseleave", () => {
      mouse.inside = false;
    });
    
    // --- REVISED EVENT LISTENERS ---
    
    // Use ResizeObserver to reliably detect changes to the body's content size.
    // This is the most efficient and accurate way to keep the canvas synced.
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        // Debounce resize calls to prevent layout thrashing from rapid-fire changes.
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 50);
      });
      observer.observe(document.body);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 100);
      });
      // Periodically check for content changes as a less efficient fallback
      setInterval(resize, 1000);
    }

    // A simple window resize listener is still useful for orientation changes.
    window.addEventListener("orientationchange", () => {
      setTimeout(resize, 200); // Give orientation change time to settle
    });
    
    // Cleanup function to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        clearTimeout(resizeTimeout);
    });
    
    // Initialize
    setTimeout(() => {
      resize();
      gridContainer.style.opacity = "1";
    }, 100); 

    requestAnimationFrame(render);
  }
})();
