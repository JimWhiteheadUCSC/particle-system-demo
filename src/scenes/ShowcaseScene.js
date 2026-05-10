// ShowcaseScene - Artistic particle showcase demonstrating the wow factor

class ShowcaseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShowcaseScene' });
    }

    create() {
        // Create particle textures
        this.createTextures();

        // Track time for animations
        this.elapsed = 0;

        // Center of the scene
        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        // Create all the particle systems (order matters for layering)
        this.createStarfield();
        this.createNebula();
        this.createShootingStars();
        this.createPortalCore();
        this.createPortalRing();
        this.createSparkles();
        this.createAurora();

        // Setup click-to-burst interaction
        this.input.on('pointerdown', (pointer) => {
            this.createBurst(pointer.x, pointer.y);
        });

        // ESC to return
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Title overlay
        this.add.text(this.scale.width / 2, 30, 'Cosmic Portal', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.8);

        this.add.text(this.scale.width / 2, 65, 'Click anywhere to create bursts', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaff'
        }).setOrigin(0.5).setAlpha(0.7);

        this.add.text(this.scale.width / 2, this.scale.height - 25, 'ESC - Return to Menu', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff6666'
        }).setOrigin(0.5);
    }

    createTextures() {
        const graphics = this.add.graphics();

        // Soft circle for general particles
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(16, 16, 12);
        graphics.generateTexture('softCircle', 32, 32);
        graphics.clear();

        // Tiny dot for stars
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 3);
        graphics.generateTexture('dot', 8, 8);
        graphics.clear();

        // Glowing orb with gradient effect (larger, softer)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(32, 32, 8);
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillCircle(32, 32, 16);
        graphics.fillStyle(0xffffff, 0.2);
        graphics.fillCircle(32, 32, 28);
        graphics.generateTexture('glow', 64, 64);
        graphics.clear();

        // Star shape for sparkles
        const cx = 16, cy = 16;
        graphics.fillStyle(0xffffff);
        graphics.beginPath();
        for (let i = 0; i < 8; i++) {
            const radius = i % 2 === 0 ? 12 : 5;
            const angle = (i * Math.PI / 4) - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) graphics.moveTo(x, y);
            else graphics.lineTo(x, y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('star', 32, 32);
        graphics.clear();

        // Streak for shooting stars
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 14, 48, 4);
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillRect(0, 12, 32, 8);
        graphics.generateTexture('streak', 48, 32);
        graphics.clear();

        graphics.destroy();
    }

    createStarfield() {
        // Background twinkling stars
        this.starfield = this.add.particles(0, 0, 'dot', {
            x: { min: 0, max: this.scale.width },
            y: { min: 0, max: this.scale.height },
            scale: { min: 0.3, max: 1 },
            alpha: { start: 0, end: 1, yoyo: true },
            lifespan: { min: 2000, max: 5000 },
            frequency: 50,
            blendMode: 'ADD',
            tint: [0xffffff, 0xaaaaff, 0xffffaa]
        });
    }

    createNebula() {
        // Slow-moving colorful nebula clouds
        this.nebula = this.add.particles(this.centerX, this.centerY, 'glow', {
            x: { min: -200, max: 200 },
            y: { min: -150, max: 150 },
            scale: { start: 0.5, end: 2 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 8000,
            frequency: 300,
            speed: { min: 5, max: 20 },
            blendMode: 'ADD',
            color: [0x4400ff, 0xff00aa, 0x00ffff, 0xff4400]
        });
    }

    createShootingStars() {
        // Occasional shooting stars streaking across
        this.shootingStars = this.add.particles(0, 0, 'streak', {
            x: { min: 0, max: this.scale.width },
            y: { min: 0, max: this.scale.height / 2 },
            angle: { min: 20, max: 40 },
            speed: { min: 400, max: 700 },
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            frequency: 2000,
            blendMode: 'ADD',
            tint: [0xffffff, 0xaaffff]
        });
    }

    createPortalCore() {
        // Central swirling vortex
        this.portalCore = this.add.particles(this.centerX, this.centerY, 'glow', {
            speed: { min: 20, max: 80 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0.1 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 2000,
            frequency: 30,
            blendMode: 'ADD',
            color: [0x00ffff, 0x0088ff, 0xff00ff, 0x8800ff],
            rotate: { min: 0, max: 360 }
        });

        // Inner bright core
        this.portalInner = this.add.particles(this.centerX, this.centerY, 'softCircle', {
            speed: { min: 5, max: 30 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0.1 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            frequency: 50,
            blendMode: 'ADD',
            color: [0xffffff, 0xaaffff]
        });
    }

    createPortalRing() {
        // Orbiting ring of particles around the portal
        // We'll update positions in the update loop
        this.ringParticles = this.add.particles(this.centerX, this.centerY, 'star', {
            speed: 0,
            scale: { start: 0.5, end: 0.1 },
            alpha: { start: 1, end: 0 },
            lifespan: 1500,
            frequency: 80,
            blendMode: 'ADD',
            color: [0xffff00, 0xff8800, 0xff0088],
            rotate: { min: 0, max: 360 },
            emitCallback: (particle) => {
                // Position particles in a ring
                const angle = Math.random() * Math.PI * 2;
                const radius = 120 + Math.random() * 30;
                particle.x = this.centerX + Math.cos(angle) * radius;
                particle.y = this.centerY + Math.sin(angle) * radius;
            }
        });
    }

    createSparkles() {
        // Random sparkles floating upward from the portal
        this.sparkles = this.add.particles(this.centerX, this.centerY + 50, 'star', {
            x: { min: -100, max: 100 },
            speedY: { min: -100, max: -200 },
            speedX: { min: -30, max: 30 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2500,
            frequency: 100,
            gravityY: -50,
            blendMode: 'ADD',
            color: [0xffffff, 0xffff88, 0x88ffff],
            rotate: { min: 0, max: 360 }
        });
    }

    createAurora() {
        // Aurora-like waves at the top of the screen
        this.aurora = this.add.particles(this.scale.width / 2, 80, 'glow', {
            x: { min: -this.scale.width / 2, max: this.scale.width / 2 },
            y: { min: -30, max: 30 },
            speedX: { min: -20, max: 20 },
            speedY: { min: 10, max: 30 },
            scale: { start: 1.5, end: 0.5 },
            alpha: { start: 0.4, end: 0 },
            lifespan: 4000,
            frequency: 100,
            blendMode: 'ADD',
            color: [0x00ff88, 0x00ffcc, 0x0088ff, 0x00ff44]
        });
    }

    createBurst(x, y) {
        // Create an explosive burst where the user clicks
        const burstColors = [
            [0xff0000, 0xff6600, 0xffff00], // Fire
            [0x00ffff, 0x0088ff, 0xffffff], // Ice
            [0xff00ff, 0x8800ff, 0xff88ff], // Magic
            [0x00ff00, 0x88ff00, 0xffff00], // Nature
            [0xffffff, 0xffff88, 0xff88ff]  // Prismatic
        ];

        const colors = Phaser.Utils.Array.GetRandom(burstColors);

        // Main burst
        const burst = this.add.particles(x, y, 'softCircle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            color: colors,
            quantity: 30
        });

        // Secondary sparkle burst
        const sparkBurst = this.add.particles(x, y, 'star', {
            speed: { min: 50, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1200,
            gravityY: 100,
            blendMode: 'ADD',
            color: colors,
            rotate: { min: 0, max: 360 },
            quantity: 20
        });

        // Stop emitting and clean up after the burst
        burst.explode();
        sparkBurst.explode();

        this.time.delayedCall(1500, () => {
            burst.destroy();
            sparkBurst.destroy();
        });
    }

    update(time, delta) {
        this.elapsed += delta;

        // Slowly rotate the portal ring emission point
        const ringAngle = this.elapsed * 0.001;
        const pulseScale = 1 + Math.sin(this.elapsed * 0.003) * 0.2;

        // Pulse the portal core
        if (this.portalCore) {
            this.portalCore.setScale(pulseScale);
        }

        // Subtle movement of nebula center
        if (this.nebula) {
            const nebulaX = this.centerX + Math.sin(this.elapsed * 0.0005) * 30;
            const nebulaY = this.centerY + Math.cos(this.elapsed * 0.0007) * 20;
            this.nebula.setPosition(nebulaX, nebulaY);
        }
    }
}
