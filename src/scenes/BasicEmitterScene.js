// BasicEmitterScene - Demonstrates basic emitter properties

class BasicEmitterScene extends Phaser.Scene {
    constructor() {
        super('BasicEmitterScene');
    }

    create() {
        // Create particle texture
        this.createParticleTexture();

        // Initialize parameters
        this.params = {
            frequency: 100,
            lifespan: 2000,
            quantity: 1,
            speed: 200,
            emitting: true
        };

        // Create emitter at center
        this.emitter = this.add.particles(
            this.scale.width / 2,
            this.scale.height / 2,
            'basic-particle',
            {
                speed: { min: this.params.speed * 0.5, max: this.params.speed },
                scale: { start: 0.5, end: 0.1 },
                alpha: { start: 1, end: 0 },
                lifespan: this.params.lifespan,
                frequency: this.params.frequency,
                quantity: this.params.quantity,
                blendMode: 'ADD',
                tint: 0x4ecdc4
            }
        );

        // Create UI
        this.ui = new ControlsUI(this, {
            title: 'Basic Emitter Properties',
            description: 'Adjust spawn rate, lifespan, quantity, and speed',
            controls: [
                'Q/A - Spawn Rate (frequency)',
                'W/S - Lifespan',
                'E/D - Quantity per emission',
                'R/F - Speed',
                'SPACE - Toggle emitter on/off'
            ],
            parameters: {
                'Frequency': `${this.params.frequency}ms`,
                'Lifespan': `${this.params.lifespan}ms`,
                'Quantity': this.params.quantity,
                'Speed': this.params.speed,
                'Emitting': this.params.emitting ? 'ON' : 'OFF'
            }
        });

        // Setup keyboard input
        this.setupInput();

        // Emitter follows mouse
        this.input.on('pointerdown', (pointer) => {
            this.emitter.setPosition(pointer.x, pointer.y);
        });
    }

    createParticleTexture() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(16, 16, 12);
        graphics.generateTexture('basic-particle', 32, 32);
        graphics.destroy();
    }

    setupInput() {
        // ESC - Return to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Q/A - Frequency (spawn rate)
        this.input.keyboard.on('keydown-Q', () => {
            this.params.frequency = Math.max(10, this.params.frequency - 20);
            this.updateEmitter();
            this.ui.updateParameter('Frequency', `${this.params.frequency}ms`);
        });

        this.input.keyboard.on('keydown-A', () => {
            this.params.frequency = Math.min(1000, this.params.frequency + 20);
            this.updateEmitter();
            this.ui.updateParameter('Frequency', `${this.params.frequency}ms`);
        });

        // W/S - Lifespan
        this.input.keyboard.on('keydown-W', () => {
            this.params.lifespan = Math.min(10000, this.params.lifespan + 200);
            this.updateEmitter();
            this.ui.updateParameter('Lifespan', `${this.params.lifespan}ms`);
        });

        this.input.keyboard.on('keydown-S', () => {
            this.params.lifespan = Math.max(200, this.params.lifespan - 200);
            this.updateEmitter();
            this.ui.updateParameter('Lifespan', `${this.params.lifespan}ms`);
        });

        // E/D - Quantity
        this.input.keyboard.on('keydown-E', () => {
            this.params.quantity = Math.min(100, this.params.quantity + 1);
            this.updateEmitter();
            this.ui.updateParameter('Quantity', this.params.quantity);
        });

        this.input.keyboard.on('keydown-D', () => {
            this.params.quantity = Math.max(1, this.params.quantity - 1);
            this.updateEmitter();
            this.ui.updateParameter('Quantity', this.params.quantity);
        });

        // R/F - Speed
        this.input.keyboard.on('keydown-R', () => {
            this.params.speed = Math.min(600, this.params.speed + 25);
            this.updateEmitter();
            this.ui.updateParameter('Speed', this.params.speed);
        });

        this.input.keyboard.on('keydown-F', () => {
            this.params.speed = Math.max(25, this.params.speed - 25);
            this.updateEmitter();
            this.ui.updateParameter('Speed', this.params.speed);
        });

        // SPACE - Toggle emitter
        this.input.keyboard.on('keydown-SPACE', () => {
            this.params.emitting = !this.params.emitting;
            if (this.params.emitting) {
                this.emitter.start();
            } else {
                this.emitter.stop();
            }
            this.ui.updateParameter('Emitting', this.params.emitting ? 'ON' : 'OFF');
            this.ui.showFeedback(
                this.params.emitting ? 'Emitter ON' : 'Emitter OFF',
                this.params.emitting ? '#88ff88' : '#ff8888'
            );
        });
    }

    updateEmitter() {
        // Update emitter configuration - must include ALL properties
        this.emitter.setConfig({
            speed: { min: this.params.speed * 0.5, max: this.params.speed },
            scale: { start: 0.5, end: 0.1 },
            alpha: { start: 1, end: 0 },
            lifespan: this.params.lifespan,
            frequency: this.params.frequency,
            quantity: this.params.quantity,
            blendMode: 'ADD',
            tint: 0x4ecdc4
        });
    }
}
