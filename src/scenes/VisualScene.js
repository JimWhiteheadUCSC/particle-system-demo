// VisualScene - Demonstrates visual properties (color, alpha, scale, rotation, blend modes)

class VisualScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VisualScene' });
    }

    create() {
        // Create particle texture
        this.createParticleTexture();

        // Blend modes available
        this.blendModes = ['NORMAL', 'ADD', 'MULTIPLY', 'SCREEN'];
        this.blendModeIndex = 1; // Start with ADD

        // Color presets
        this.colorPresets = [
            { name: 'Cyan', tint: [0x4ecdc4] },
            { name: 'Fire', tint: [0xff0000, 0xff6600, 0xffff00] },
            { name: 'Ice', tint: [0x00ffff, 0x0088ff, 0xffffff] },
            { name: 'Rainbow', tint: [0xff0000, 0xff7700, 0xffff00, 0x00ff00, 0x0000ff, 0x8800ff] },
            { name: 'Purple Magic', tint: [0xff00ff, 0x8800ff, 0xff88ff] }
        ];
        this.currentPreset = 0;

        // Initialize parameters
        this.params = {
            colorPreset: this.colorPresets[0].name,
            startAlpha: 1.0,
            endAlpha: 0.0,
            startScale: 0.8,
            endScale: 0.1,
            rotation: 0,
            blendMode: this.blendModes[this.blendModeIndex]
        };

        // Create emitter at center
        this.emitter = this.add.particles(
            this.scale.width / 2,
            this.scale.height / 2,
            'visual-particle',
            {
                speed: { min: 50, max: 150 },
                scale: { start: this.params.startScale, end: this.params.endScale },
                alpha: { start: this.params.startAlpha, end: this.params.endAlpha },
                rotate: { min: 0, max: this.params.rotation },
                lifespan: 2000,
                frequency: 50,
                blendMode: this.params.blendMode,
                color: this.colorPresets[this.currentPreset].tint
            }
        );

        // Create UI
        this.ui = new ControlsUI(this, {
            title: 'Visual Properties',
            description: 'Adjust colors, transparency, scale, rotation, and blend modes',
            controls: [
                '1-5 - Color presets',
                'Q/A - Start Alpha',
                'W/S - End Alpha',
                'E/D - Start Scale',
                'R/F - End Scale',
                'T/G - Rotation',
                'B - Cycle Blend Modes'
            ],
            parameters: {
                'Color Preset': this.params.colorPreset,
                'Start Alpha': this.params.startAlpha.toFixed(2),
                'End Alpha': this.params.endAlpha.toFixed(2),
                'Start Scale': this.params.startScale.toFixed(2),
                'End Scale': this.params.endScale.toFixed(2),
                'Rotation': `${this.params.rotation}°`,
                'Blend Mode': this.params.blendMode
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

        // Draw a 4-pointed star shape so rotation is visible
        const cx = 16, cy = 16;
        const outerRadius = 12;
        const innerRadius = 5;
        const points = 4;

        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI / points) - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        }
        graphics.closePath();
        graphics.fillPath();

        graphics.generateTexture('visual-particle', 32, 32);
        graphics.destroy();
    }

    setupInput() {
        // ESC - Return to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // 1-5 - Color presets (Phaser uses spelled-out key names)
        const keyNames = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
        keyNames.forEach((keyName, index) => {
            this.input.keyboard.on(`keydown-${keyName}`, () => {
                this.currentPreset = index;
                this.params.colorPreset = this.colorPresets[this.currentPreset].name;
                this.updateEmitter();
                this.ui.updateParameter('Color Preset', this.params.colorPreset);
                this.ui.showFeedback(`Color: ${this.params.colorPreset}`, '#ffcc00');
            });
        });

        // Q/A - Start Alpha
        this.input.keyboard.on('keydown-Q', () => {
            this.params.startAlpha = Math.min(1.0, this.params.startAlpha + 0.1);
            this.updateEmitter();
            this.ui.updateParameter('Start Alpha', this.params.startAlpha.toFixed(2));
        });

        this.input.keyboard.on('keydown-A', () => {
            this.params.startAlpha = Math.max(0.1, this.params.startAlpha - 0.1);
            this.updateEmitter();
            this.ui.updateParameter('Start Alpha', this.params.startAlpha.toFixed(2));
        });

        // W/S - End Alpha
        this.input.keyboard.on('keydown-W', () => {
            this.params.endAlpha = Math.min(1.0, this.params.endAlpha + 0.1);
            this.updateEmitter();
            this.ui.updateParameter('End Alpha', this.params.endAlpha.toFixed(2));
        });

        this.input.keyboard.on('keydown-S', () => {
            this.params.endAlpha = Math.max(0.0, this.params.endAlpha - 0.1);
            this.updateEmitter();
            this.ui.updateParameter('End Alpha', this.params.endAlpha.toFixed(2));
        });

        // E/D - Start Scale
        this.input.keyboard.on('keydown-E', () => {
            this.params.startScale = Math.min(2.0, this.params.startScale + 0.1);
            this.updateEmitter();
            this.ui.updateParameter('Start Scale', this.params.startScale.toFixed(2));
        });

        this.input.keyboard.on('keydown-D', () => {
            this.params.startScale = Math.max(0.1, this.params.startScale - 0.1);
            this.updateEmitter();
            this.ui.updateParameter('Start Scale', this.params.startScale.toFixed(2));
        });

        // R/F - End Scale
        this.input.keyboard.on('keydown-R', () => {
            this.params.endScale = Math.min(2.0, this.params.endScale + 0.1);
            this.updateEmitter();
            this.ui.updateParameter('End Scale', this.params.endScale.toFixed(2));
        });

        this.input.keyboard.on('keydown-F', () => {
            this.params.endScale = Math.max(0.0, this.params.endScale - 0.1);
            this.updateEmitter();
            this.ui.updateParameter('End Scale', this.params.endScale.toFixed(2));
        });

        // T/G - Rotation
        this.input.keyboard.on('keydown-T', () => {
            this.params.rotation = Math.min(360, this.params.rotation + 30);
            this.updateEmitter();
            this.ui.updateParameter('Rotation', `${this.params.rotation}°`);
        });

        this.input.keyboard.on('keydown-G', () => {
            this.params.rotation = Math.max(0, this.params.rotation - 30);
            this.updateEmitter();
            this.ui.updateParameter('Rotation', `${this.params.rotation}°`);
        });

        // B - Cycle Blend Modes
        this.input.keyboard.on('keydown-B', () => {
            this.blendModeIndex = (this.blendModeIndex + 1) % this.blendModes.length;
            this.params.blendMode = this.blendModes[this.blendModeIndex];
            this.updateEmitter();
            this.ui.updateParameter('Blend Mode', this.params.blendMode);
            this.ui.showFeedback(`Blend: ${this.params.blendMode}`, '#ffcc00');
        });
    }

    updateEmitter() {
        const x = this.emitter.x;
        const y = this.emitter.y;
        this.emitter.destroy();
        this.emitter = this.add.particles(x, y, 'visual-particle', {
            speed: { min: 50, max: 150 },
            scale: { start: this.params.startScale, end: this.params.endScale },
            alpha: { start: this.params.startAlpha, end: this.params.endAlpha },
            rotate: { min: 0, max: this.params.rotation },
            lifespan: 2000,
            frequency: 50,
            blendMode: this.params.blendMode,
            color: this.colorPresets[this.currentPreset].tint
        });
    }
}
