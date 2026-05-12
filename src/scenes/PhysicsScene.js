// PhysicsScene - Demonstrates physics & motion (gravity, velocity, acceleration, bounds)

class PhysicsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PhysicsScene' });
    }

    create() {
        // Create particle texture
        this.createParticleTexture();

        // Initialize parameters
        this.params = {
            gravityX: 0,
            gravityY: 100,
            velocityX: 0,
            velocityY: -200,
            accelerationX: 0,
            accelerationY: 0,
            boundsEnabled: false
        };

        // Create emitter at bottom center (like a fountain)
        this.emitter = this.add.particles(
            this.scale.width / 2,
            this.scale.height - 100,
            'physics-particle',
            {
                speed: { min: 100, max: 200 },
                angle: { min: -120, max: -60 },
                scale: { start: 0.6, end: 0.2 },
                alpha: { start: 1, end: 0.3 },
                lifespan: 3000,
                frequency: 30,
                gravityX: this.params.gravityX,
                gravityY: this.params.gravityY,
                blendMode: 'ADD',
                tint: 0xffe66d
            }
        );

        // Create bounds processor and store reference (starts inactive)
        this.boundsProcessor = this.emitter.addParticleBounds(
            50, 50, this.scale.width - 100, this.scale.height - 100
        );
        this.boundsProcessor.active = false;

        // Create bounds visualization (hidden initially)
        this.boundsGraphics = this.add.graphics();
        this.boundsGraphics.lineStyle(2, 0xff6666, 0.5);
        this.boundsGraphics.strokeRect(50, 50, this.scale.width - 100, this.scale.height - 100);
        this.boundsGraphics.setVisible(false);

        // Create UI
        this.ui = new ControlsUI(this, {
            title: 'Physics & Motion',
            description: 'Adjust gravity, velocity, acceleration, and bounds',
            controls: [
                'Q/A - Gravity X',
                'W/S - Gravity Y',
                'E/D - Velocity X',
                'R/F - Velocity Y',
                'T/G - Acceleration X',
                'C - Toggle Bounds'
            ],
            parameters: {
                'Gravity X': this.params.gravityX,
                'Gravity Y': this.params.gravityY,
                'Velocity X': this.params.velocityX,
                'Velocity Y': this.params.velocityY,
                'Acceleration X': this.params.accelerationX,
                'Bounds': this.params.boundsEnabled ? 'ON' : 'OFF'
            }
        });

        // Setup keyboard input
        this.setupInput();

        // Allow clicking to reposition emitter
        this.input.on('pointerdown', (pointer) => {
            this.emitter.setPosition(pointer.x, pointer.y);
        });
    }

    createParticleTexture() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(16, 16, 12);
        graphics.generateTexture('physics-particle', 32, 32);
        graphics.destroy();
    }

    setupInput() {
        // ESC - Return to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Q/A - Gravity X
        this.input.keyboard.on('keydown-Q', () => {
            this.params.gravityX = Math.min(500, this.params.gravityX + 25);
            this.updateEmitter();
            this.ui.updateParameter('Gravity X', this.params.gravityX);
        });

        this.input.keyboard.on('keydown-A', () => {
            this.params.gravityX = Math.max(-500, this.params.gravityX - 25);
            this.updateEmitter();
            this.ui.updateParameter('Gravity X', this.params.gravityX);
        });

        // W/S - Gravity Y
        this.input.keyboard.on('keydown-W', () => {
            this.params.gravityY = Math.min(500, this.params.gravityY + 25);
            this.updateEmitter();
            this.ui.updateParameter('Gravity Y', this.params.gravityY);
        });

        this.input.keyboard.on('keydown-S', () => {
            this.params.gravityY = Math.max(-500, this.params.gravityY - 25);
            this.updateEmitter();
            this.ui.updateParameter('Gravity Y', this.params.gravityY);
        });

        // E/D - Velocity X (angle adjustment)
        this.input.keyboard.on('keydown-E', () => {
            this.params.velocityX = Math.min(300, this.params.velocityX + 25);
            this.updateEmitter();
            this.ui.updateParameter('Velocity X', this.params.velocityX);
        });

        this.input.keyboard.on('keydown-D', () => {
            this.params.velocityX = Math.max(-300, this.params.velocityX - 25);
            this.updateEmitter();
            this.ui.updateParameter('Velocity X', this.params.velocityX);
        });

        // R/F - Velocity Y
        this.input.keyboard.on('keydown-R', () => {
            this.params.velocityY = Math.min(300, this.params.velocityY + 25);
            this.updateEmitter();
            this.ui.updateParameter('Velocity Y', this.params.velocityY);
        });

        this.input.keyboard.on('keydown-F', () => {
            this.params.velocityY = Math.max(-500, this.params.velocityY - 25);
            this.updateEmitter();
            this.ui.updateParameter('Velocity Y', this.params.velocityY);
        });

        // T/G - Acceleration
        this.input.keyboard.on('keydown-T', () => {
            this.params.accelerationX = Math.min(200, this.params.accelerationX + 20);
            this.updateEmitter();
            this.ui.updateParameter('Acceleration X', this.params.accelerationX);
        });

        this.input.keyboard.on('keydown-G', () => {
            this.params.accelerationX = Math.max(-200, this.params.accelerationX - 20);
            this.updateEmitter();
            this.ui.updateParameter('Acceleration X', this.params.accelerationX);
        });

        // C - Toggle Bounds
        this.input.keyboard.on('keydown-C', () => {
            this.params.boundsEnabled = !this.params.boundsEnabled;
            this.boundsGraphics.setVisible(this.params.boundsEnabled);
            // Toggle the bounds processor active state
            this.boundsProcessor.active = this.params.boundsEnabled;
            this.ui.updateParameter('Bounds', this.params.boundsEnabled ? 'ON' : 'OFF');
            this.ui.showFeedback(
                this.params.boundsEnabled ? 'Bounds ON' : 'Bounds OFF',
                this.params.boundsEnabled ? '#88ff88' : '#ff8888'
            );
        });
    }

    updateEmitter() {
        // Start with base configuration - must include ALL properties
        const config = {
            scale: { start: 0.6, end: 0.2 },
            alpha: { start: 1, end: 0.3 },
            lifespan: 3000,
            frequency: 30,
            blendMode: 'ADD',
            tint: 0xffe66d,
            gravityX: this.params.gravityX,
            gravityY: this.params.gravityY,
            accelerationX: this.params.accelerationX,
            accelerationY: this.params.accelerationY
        };

        // Calculate angle and speed based on velocity
        if (this.params.velocityX !== 0 || this.params.velocityY !== 0) {
            const baseAngle = Math.atan2(this.params.velocityY, this.params.velocityX) * (180 / Math.PI);
            config.angle = { min: baseAngle - 30, max: baseAngle + 30 };
            const speed = Math.sqrt(this.params.velocityX ** 2 + this.params.velocityY ** 2);
            config.speed = { min: speed * 0.5, max: speed * 1.5 };
        } else {
            // Default angle and speed when velocity is zero
            config.angle = { min: -120, max: -60 };
            config.speed = { min: 100, max: 200 };
        }

        this.emitter.setConfig(config);
    }
}
