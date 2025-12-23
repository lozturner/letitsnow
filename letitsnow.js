/**
 * LetItSnow.js - Free snow widget for any website
 * https://github.com/lozturner/letitsnow
 * MIT License
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        density: { low: 50, medium: 200, high: 150 },
        speed: { slow: 0.5, medium: 1, fast: 2 },
        size: { small: { min: 2, max: 4 }, medium: { min: 3, max: 6 }, large: { min: 4, max: 8 } }
    };
    
    // Get configuration from data attributes
    const snowContainer = document.getElementById('letitsnow') || document.getElementById('letitsnow-area') || document.body;
    const density = config.density[snowContainer.dataset?.density || 'medium'];
    const speedMultiplier = config.speed[snowContainer.dataset?.speed || 'medium'];
    const sizeConfig = config.size[snowContainer.dataset?.size || 'medium'];
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = snowContainer === document.body ? 'fixed' : 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    if (snowContainer === document.body || snowContainer.id === 'letitsnow-area') {
        snowContainer.appendChild(canvas);
    } else {
        snowContainer.style.position = snowContainer.style.position || 'relative';
        snowContainer.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    let snowflakes = [];
    let animationId;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = snowContainer === document.body ? window.innerWidth : snowContainer.offsetWidth;
        canvas.height = snowContainer === document.body ? window.innerHeight : snowContainer.offsetHeight;
    }
    
    // Snowflake class
    class Snowflake {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * (sizeConfig.max - sizeConfig.min) + sizeConfig.min;
            this.speed = Math.random() * 1 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.y += this.speed * speedMultiplier;
            this.x += this.wind * speedMultiplier;
            
            // Reset if out of bounds
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            
            if (this.x > canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvas.width;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize snowflakes
    function initSnowflakes() {
        snowflakes = [];
        for (let i = 0; i < density; i++) {
            snowflakes.push(new Snowflake());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    function init() {
        resizeCanvas();
        initSnowflakes();
        animate();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initSnowflakes();
    });
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
})();
