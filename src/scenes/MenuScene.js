// MenuScene - Main menu with scene selection

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Title
        this.add.text(centerX, 80, 'Particle System Demo', {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(centerX, 130, 'Learn Phaser 3 Particle Effects', {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Menu options
        const menuItems = [
            {
                title: '1. Basic Emitter',
                description: 'Spawn rate, lifespan, quantity, and speed',
                scene: 'BasicEmitterScene',
                color: '#4ecdc4'
            },
            {
                title: '2. Visual Properties',
                description: 'Color, alpha, scale, rotation, and blend modes',
                scene: 'VisualScene',
                color: '#ff6b6b'
            },
            {
                title: '3. Physics & Motion',
                description: 'Gravity, velocity, acceleration, and bounds',
                scene: 'PhysicsScene',
                color: '#ffe66d'
            },
            {
                title: '4. Emit & Death Zones',
                description: 'Edge zones, random zones, and death zones',
                scene: 'ZoneScene',
                color: '#44ddff'
            },
            {
                title: '5. Cosmic Portal',
                description: 'Artistic showcase - click to create bursts!',
                scene: 'ShowcaseScene',
                color: '#bf5fff'
            }
        ];

        const startY = 170;
        const itemSpacing = 100;

        menuItems.forEach((item, index) => {
            const y = startY + (index * itemSpacing);

            // Background box
            const box = this.add.rectangle(centerX, y, 500, 90, 0x2a2a4a)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    box.setFillStyle(0x3a3a5a);
                    titleText.setColor('#ffffff');
                })
                .on('pointerout', () => {
                    box.setFillStyle(0x2a2a4a);
                    titleText.setColor(item.color);
                })
                .on('pointerdown', () => {
                    this.scene.start(item.scene);
                });

            // Border
            this.add.rectangle(centerX, y, 502, 92)
                .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(item.color).color);

            // Title
            const titleText = this.add.text(centerX, y - 15, item.title, {
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                color: item.color,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Description
            this.add.text(centerX, y + 15, item.description, {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#888888'
            }).setOrigin(0.5);
        });

        // Navigation hint
        this.add.text(centerX, this.scale.height - 40, 'Click a scene to begin  |  Use keyboard controls in each scene', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#666666'
        }).setOrigin(0.5);

        // Decorative particles
        this.createBackgroundParticles();
    }

    createBackgroundParticles() {
        // Create a simple particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(16, 16, 8);
        graphics.generateTexture('menuParticle', 32, 32);
        graphics.destroy();

        // Create subtle background particle effect
        const emitter = this.add.particles(0, 0, 'menuParticle', {
            x: { min: 0, max: this.scale.width },
            y: { min: 0, max: this.scale.height },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.3, end: 0 },
            speed: { min: 10, max: 30 },
            lifespan: 3000,
            frequency: 200,
            blendMode: 'ADD',
            tint: [0x4ecdc4, 0xff6b6b, 0xffe66d]
        });
    }
}
