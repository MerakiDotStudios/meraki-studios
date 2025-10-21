// voronoi.js - Animated Voronoi diagram background

(function() {
    "use strict";

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVoronoi);
    } else {
        initVoronoi();
    }

    function initVoronoi() {
        const canvas = document.getElementById('voronoi-canvas');
        const gridContainer = document.getElementById('shape-grid');
        
        if (!canvas || !gridContainer) {
            console.error('Voronoi canvas or grid container not found');
            return;
        }

        const ctx = canvas.getContext('2d', { alpha: false });
        const urlParams = new URLSearchParams(window.location.search);
        const userSeed = parseInt(urlParams.get('seed'), 10);
        const SEED = isNaN(userSeed) ? Math.floor(Math.random() * 999999) : userSeed;

        console.log("Voronoi Seed:", SEED);

        // Configuration
        const DARK_TEAL = { r: 4, g: 45, b: 55 };
        const BRIGHT_CYAN = { r: 46, g: 255, b: 255 };
        const VISUAL_FADE_MS = 800;
        const TRAIL_FADE_MS = 1500;
        const EFFECT_RADIUS = 200;
        const SITE_DENSITY = 12;
        const STROKE_ALPHA = 0.05;
        const BASE_INTENSITY = 0.03;
        const RANDOM_GRADIENT = true;

        let sites = [];
        let polygons = [];
        let widthPx = 0;
        let heightPx = 0;
        let lastTime = performance.now();
        let lastDPR = window.devicePixelRatio || 1;
        
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
            seed = (seed + 0x6D2B79F5) | 0;
            seed = Math.imul(seed ^ seed >>> 15, 1 | seed);
            seed = (seed + Math.imul(seed ^ seed >>> 7, 61 | seed)) ^ seed;
            return ((seed ^ seed >>> 14) >>> 0) / 4294967296;
        };

        const rand = rng(SEED);
        const lerp = (a, b, t) => a + (b - a) * t;
        const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
        
        const colorLerp = (c1, c2, t) => ({
            r: Math.round(lerp(c1.r, c2.r, t)),
            g: Math.round(lerp(c1.g, c2.g, t)),
            b: Math.round(lerp(c1.b, c2.b, t))
        });
        
        const rgbToCss = (c, a = 1) => `rgba(${c.r},${c.g},${c.b},${a})`;

        // Generate random sites for Voronoi diagram
        const generateSites = () => {
            sites = [];
            const smaller = Math.min(widthPx, heightPx);
            const cellSize = Math.max(60, Math.round(smaller / Math.max(6, SITE_DENSITY)));
            
            for (let y = 0; y < heightPx; y += cellSize) {
                for (let x = 0; x < widthPx; x += cellSize) {
                    sites.push({
                        x: clamp(x + cellSize / 2 + (rand() - 0.5) * cellSize * 0.6, 0, widthPx),
                        y: clamp(y + cellSize / 2 + (rand() - 0.5) * cellSize * 0.6, 0, heightPx),
                        intensity: BASE_INTENSITY,
                        target: BASE_INTENSITY,
                        brightness: 0.5 + rand() * 0.5,
                        gradAngle: rand() * Math.PI * 2
                    });
                }
            }
        };

        // Compute Voronoi polygons
        const computePolygons = () => {
            const bounds = [
                { x: -widthPx * 2, y: -heightPx * 2 },
                { x: widthPx * 3, y: -heightPx * 2 },
                { x: widthPx * 3, y: heightPx * 3 },
                { x: -widthPx * 2, y: heightPx * 3 }
            ];

            polygons = sites.map((site, i) => {
                let polygon = [...bounds];
                
                for (let j = 0; j < sites.length; j++) {
                    if (i === j) continue;
                    
                    const other = sites[j];
                    const normal = { x: other.x - site.x, y: other.y - site.y };
                    const midpoint = { x: (other.x + site.x) / 2, y: (other.y + site.y) / 2 };
                    
                    const distanceFromLine = pt => 
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
                                y: a.y + (b.y - a.y) * (distA / (distA - distB))
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

        // Handle canvas resize
        const resize = (force = false) => {
            const footer = document.querySelector('footer');
            const viewportHeight = window.innerHeight;
            const documentHeight = footer 
                ? (footer.offsetTop + footer.offsetHeight) 
                : document.documentElement.scrollHeight;
            
            const fullHeight = Math.max(viewportHeight, documentHeight);
            const newWidth = Math.floor(window.innerWidth);
            const newHeight = Math.floor(fullHeight);
            const newDPR = window.devicePixelRatio || 1;
            
            if (!force && 
                Math.abs(newWidth - widthPx) < 2 && 
                Math.abs(newHeight - heightPx) < 2 && 
                Math.abs(newDPR - lastDPR) < 0.05) {
                return;
            }
            
            widthPx = newWidth;
            heightPx = newHeight;
            lastDPR = newDPR;
            
            const dpr = newDPR;
            gridContainer.style.height = `${heightPx}px`;
            gridContainer.style.minHeight = `${viewportHeight}px`;
            
            canvas.width = widthPx * dpr;
            canvas.height = heightPx * dpr;
            canvas.style.width = `${widthPx}px`;
            canvas.style.height = `${heightPx}px`;
            
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            generateSitesAndPolygons();
            
            console.log(`[Voronoi] Resized: ${widthPx}x${heightPx} @ DPR ${dpr}`);
        };

        // Main render loop
        const render = (now) => {
            const deltaTime = now - lastTime;
            lastTime = now;
            
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            const fadeFactor = clamp(deltaTime / VISUAL_FADE_MS);
            const decayFactor = clamp(deltaTime / TRAIL_FADE_MS);
            
            // Update site intensities based on mouse proximity
            sites.forEach(site => {
                if (mouse.inside) {
                    const dx = site.x - (mouse.x + scrollX);
                    const dy = site.y - (mouse.y + scrollY);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance <= EFFECT_RADIUS) {
                        const targetIntensity = clamp(BASE_INTENSITY + (1 - distance / EFFECT_RADIUS));
                        if (targetIntensity > site.target) {
                            site.target = targetIntensity;
                        }
                    }
                }
                
                site.intensity += (site.target - site.intensity) * fadeFactor;
                site.target -= (site.target - BASE_INTENSITY) * decayFactor;
                
                if (site.target < BASE_INTENSITY) {
                    site.target = BASE_INTENSITY;
                }
            });
            
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, widthPx, heightPx);
            
            // Draw polygons
            polygons.forEach((poly, i) => {
                if (!poly || poly.length < 3) return;
                
                const site = sites[i];
                const transitionColor = clamp((site.intensity - BASE_INTENSITY) / (1 - BASE_INTENSITY));
                let fillColor = colorLerp(DARK_TEAL, BRIGHT_CYAN, transitionColor);
                
                fillColor.r = Math.min(255, fillColor.r * site.brightness);
                fillColor.g = Math.min(255, fillColor.g * site.brightness);
                fillColor.b = Math.min(255, fillColor.b * site.brightness);
                
                if (RANDOM_GRADIENT) {
                    const gradient = ctx.createLinearGradient(
                        site.x + Math.cos(site.gradAngle) * 80,
                        site.y + Math.sin(site.gradAngle) * 80,
                        site.x - Math.cos(site.gradAngle) * 80,
                        site.y - Math.sin(site.gradAngle) * 80
                    );
                    gradient.addColorStop(0, rgbToCss(fillColor));
                    gradient.addColorStop(1, rgbToCss(colorLerp(fillColor, DARK_TEAL, 0.7)));
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = rgbToCss(fillColor);
                }
                
                ctx.beginPath();
                ctx.moveTo(poly[0].x, poly[0].y);
                for (let p = 1; p < poly.length; p++) {
                    ctx.lineTo(poly[p].x, poly[p].y);
                }
                ctx.closePath();
                ctx.fill();
                
                if (STROKE_ALPHA > 0) {
                    ctx.strokeStyle = `rgba(0,0,0,${STROKE_ALPHA})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
            
            requestAnimationFrame(render);
        };

        // Event listeners
        const debouncedResize = debounce(() => resize(true), 100);
        
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.inside = true;
        });
        
        document.documentElement.addEventListener('mouseleave', () => {
            mouse.inside = false;
        });
        
        window.addEventListener('resize', debouncedResize);
        window.addEventListener('orientationchange', debouncedResize);
        
        // Fallback resize check
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        setInterval(() => {
            if (window.innerWidth !== lastWidth || window.innerHeight !== lastHeight) {
                lastWidth = window.innerWidth;
                lastHeight = window.innerHeight;
                debouncedResize();
            }
        }, 500);

        // Initialize
        setTimeout(() => {
            resize(true);
            gridContainer.style.opacity = '1';
        }, 100); // Reduced from 1000ms to 100ms for faster display

        requestAnimationFrame(render);
    }
})();