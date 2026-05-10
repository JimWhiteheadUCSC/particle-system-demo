// Phaser 3 Particle System Demo
// Main game configuration and initialization

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    backgroundColor: '#1a1a2e',
    parent: 'game-container',
    scene: [MenuScene, BasicEmitterScene, VisualScene, PhysicsScene, ZoneScene, ShowcaseScene]
};

const game = new Phaser.Game(config);
