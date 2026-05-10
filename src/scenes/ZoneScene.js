// ZoneScene - Demonstrates emit zones (edge and random) and death zones

class ZoneScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ZoneScene' });
    }

    create() {
        this.createParticleTexture();

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        this.zoneMode = 'edge';
        this.deathZoneEnabled = false;

        // Edge zone: equilateral triangle, coords relative to emitter
        this.edgeTriangle = new Phaser.Geom.Triangle(0, -165, -190, 120, 190, 120);

        // Random zone: circle, coords relative to emitter
        this.randomCircle = new Phaser.Geom.Circle(0, 0, 165);

        // Death zone: inner circle in world coords (tested against particle world position)
        this.deathCircle = new Phaser.Geom.Circle(this.centerX, this.centerY, 65);

        this.zoneGraphics = this.add.graphics();

        this.emitter = null;
        this.createEmitter();
        this.drawZones();

        this.ui = new ControlsUI(this, {
            title: 'Emit & Death Zones',
            description: 'Control where particles spawn and where they die',
            controls: [
                'Z - Toggle Zone Mode',
                'D - Toggle Death Zone (Random mode)'
            ],
            parameters: {
                'Zone Mode': 'Edge (Triangle)',
                'Death Zone': 'N/A'
            }
        });

        this.setupInput();
    }

    createParticleTexture() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 6);
        graphics.generateTexture('zone-particle', 16, 16);
        graphics.destroy();
    }

    createEmitter() {
        if (this.emitter) {
            this.emitter.destroy();
        }

        if (this.zoneMode === 'edge') {
            this.emitter = this.add.particles(this.centerX, this.centerY, 'zone-particle', {
                color: [0x00ccff, 0x8844ff, 0xffffff],
                speed: { min: 30, max: 110 },
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 2000,
                frequency: 20,
                quantity: 2,
                blendMode: 'ADD',
                emitZone: {
                    type: 'edge',
                    source: this.edgeTriangle,
                    quantity: 90
                }
            });
        } else {
            const config = {
                color: [0xff4488, 0xff8844, 0xffff88],
                speed: { min: 15, max: 60 },
                scale: { start: 0.4, end: 0 },
                alpha: { start: 0.8, end: 0 },
                lifespan: 2500,
                frequency: 25,
                blendMode: 'ADD',
                emitZone: {
                    type: 'random',
                    source: this.randomCircle
                }
            };

            if (this.deathZoneEnabled) {
                config.deathZone = {
                    type: 'onEnter',
                    source: this.deathCircle
                };
            }

            this.emitter = this.add.particles(this.centerX, this.centerY, 'zone-particle', config);
        }
    }

    drawZones() {
        this.zoneGraphics.clear();

        if (this.zoneMode === 'edge') {
            const cx = this.centerX;
            const cy = this.centerY;
            const t = this.edgeTriangle;
            this.zoneGraphics.lineStyle(2, 0x00ccff, 0.5);
            this.zoneGraphics.strokeTriangle(
                cx + t.x1, cy + t.y1,
                cx + t.x2, cy + t.y2,
                cx + t.x3, cy + t.y3
            );
        } else {
            this.zoneGraphics.lineStyle(2, 0xff4488, 0.5);
            this.zoneGraphics.strokeCircle(this.centerX, this.centerY, this.randomCircle.radius);

            if (this.deathZoneEnabled) {
                this.zoneGraphics.lineStyle(2, 0xff3333, 0.9);
                this.zoneGraphics.strokeCircle(this.deathCircle.x, this.deathCircle.y, this.deathCircle.radius);
            }
        }
    }

    setupInput() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        this.input.keyboard.on('keydown-Z', () => {
            this.zoneMode = this.zoneMode === 'edge' ? 'random' : 'edge';
            if (this.zoneMode === 'edge') {
                this.deathZoneEnabled = false;
            }
            this.createEmitter();
            this.drawZones();
            const modeName = this.zoneMode === 'edge' ? 'Edge (Triangle)' : 'Random (Circle)';
            this.ui.updateParameter('Zone Mode', modeName);
            this.ui.updateParameter('Death Zone', this.zoneMode === 'edge' ? 'N/A' : 'OFF');
            this.ui.showFeedback(`Zone: ${modeName}`, '#ffcc00');
        });

        this.input.keyboard.on('keydown-D', () => {
            if (this.zoneMode !== 'random') {
                this.ui.showFeedback('Switch to Random mode first (Z)', '#ff8888');
                return;
            }
            this.deathZoneEnabled = !this.deathZoneEnabled;
            this.createEmitter();
            this.drawZones();
            this.ui.updateParameter('Death Zone', this.deathZoneEnabled ? 'ON' : 'OFF');
            this.ui.showFeedback(
                `Death Zone: ${this.deathZoneEnabled ? 'ON' : 'OFF'}`,
                this.deathZoneEnabled ? '#ff8888' : '#88ff88'
            );
        });
    }
}
