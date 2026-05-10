# Phaser 3 Particle System Guide

This guide explains how each scene in the demo controls particle behavior through Phaser 3's particle emitter API.

## Table of Contents
- [Core Concepts](#core-concepts)
- [BasicEmitterScene](#basicemitterscene)
- [VisualScene](#visualscene)
- [PhysicsScene](#physicsscene)
- [ZoneScene](#zonescene)
- [ShowcaseScene](#showcasescene)
- [Quick Reference](#quick-reference)

---

## Core Concepts

### Creating a Particle Emitter

Particles are created using `this.add.particles()`:

```javascript
this.emitter = this.add.particles(x, y, 'textureKey', {
    // configuration options
});
```

- **x, y**: The emitter's position (where particles spawn)
- **textureKey**: The texture particles will use
- **config**: An object containing all particle behavior settings

### Updating Configuration at Runtime

To change particle behavior after creation, use `setConfig()`:

```javascript
this.emitter.setConfig({
    // new configuration - replaces ALL settings
});
```

**Important**: `setConfig()` replaces the entire configuration. Any properties you omit will reset to defaults. Always include all properties you want to maintain.

**Caveat with `color` arrays**: `setConfig()` has a known issue where successive calls append to the internal color interpolation arrays rather than replacing them. This causes color palettes to bleed into each other and cycle incorrectly. If your emitter uses the `color` property, destroy and recreate the emitter instead:

```javascript
updateEmitter() {
    const x = this.emitter.x;
    const y = this.emitter.y;
    this.emitter.destroy();
    this.emitter = this.add.particles(x, y, 'textureKey', {
        // full configuration
    });
}
```

### Generating Textures Programmatically

Instead of loading image files, you can create textures with Graphics:

```javascript
const graphics = this.add.graphics();
graphics.fillStyle(0xffffff);
graphics.fillCircle(16, 16, 12);
graphics.generateTexture('my-particle', 32, 32);
graphics.destroy();
```

**Important**: Phaser's texture cache is global across all scenes. If two scenes generate different textures under the same key, whichever scene runs first wins — the second scene's `generateTexture()` call is silently ignored and it ends up using the wrong shape. Always use a unique key per scene (e.g. `'basic-particle'`, `'visual-particle'`) to avoid this.

---

## BasicEmitterScene

**File**: `src/scenes/BasicEmitterScene.js`

**Purpose**: Demonstrates fundamental emitter properties that control *when* and *how many* particles spawn.

### Key Properties

| Property | Description | Example |
|----------|-------------|---------|
| `frequency` | Milliseconds between emissions | `100` (10 times/second) |
| `lifespan` | How long each particle lives (ms) | `2000` (2 seconds) |
| `quantity` | Particles emitted per emission | `1` to `20` |
| `speed` | Particle movement speed | `{ min: 100, max: 200 }` |

### Configuration Example

```javascript
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
```

### Emitter Control Methods

```javascript
this.emitter.stop();   // Stop emitting new particles
this.emitter.start();  // Resume emitting particles
```

### Dynamic Positioning

The emitter is repositioned when the mouse button is pressed:

```javascript
this.input.on('pointerdown', (pointer) => {
    this.emitter.setPosition(pointer.x, pointer.y);
});
```

---

## VisualScene

**File**: `src/scenes/VisualScene.js`

**Purpose**: Demonstrates visual properties that control *how particles look* over their lifetime.

### Key Properties

| Property | Description | Example |
|----------|-------------|---------|
| `color` | Color interpolation over lifetime | `[0xff0000, 0xffff00]` |
| `alpha` | Transparency over lifetime | `{ start: 1, end: 0 }` |
| `scale` | Size over lifetime | `{ start: 0.8, end: 0.1 }` |
| `rotate` | Rotation range | `{ min: 0, max: 360 }` |
| `blendMode` | How particles blend with background | `'ADD'`, `'NORMAL'` |

### Color Interpolation

The `color` property accepts an array of colors. Particles will interpolate through these colors over their lifetime:

```javascript
color: [0xff0000, 0xff6600, 0xffff00]  // Red -> Orange -> Yellow
```

**Note**: Use `color` (not `tint`) for color arrays. The `tint` property applies a single color tint to all particles.

### Scale and Alpha Over Lifetime

Use `start` and `end` values to animate properties:

```javascript
scale: { start: 0.8, end: 0.1 },  // Shrink over lifetime
alpha: { start: 1.0, end: 0.0 }   // Fade out
```

### Blend Modes

Blend modes control how particle colors combine with the background:

- `'NORMAL'` - Standard rendering
- `'ADD'` - Additive blending (glowing effect)
- `'MULTIPLY'` - Darkening effect
- `'SCREEN'` - Lightening effect

### Rotation Visibility

To make rotation visible, use a non-circular shape:

```javascript
// Draw a 4-pointed star
graphics.beginPath();
for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI / points) - Math.PI / 2;
    // ... draw star points
}
graphics.fillPath();
```

---

## PhysicsScene

**File**: `src/scenes/PhysicsScene.js`

**Purpose**: Demonstrates physics properties that control *how particles move* through space.

### Key Properties

| Property | Description | Example |
|----------|-------------|---------|
| `gravityX` | Horizontal gravity | `-500` to `500` |
| `gravityY` | Vertical gravity | `100` (falls down) |
| `angle` | Emission direction (degrees) | `{ min: -120, max: -60 }` |
| `speed` | Initial velocity | `{ min: 100, max: 200 }` |
| `accelerationX/Y` | Acceleration over time | `0` to `200` |

### Angle and Speed

Particles emit in a direction based on `angle` (in degrees, 0 = right, -90 = up):

```javascript
// Emit upward in a 60-degree cone
angle: { min: -120, max: -60 }
```

### Calculating Angle from Velocity

Convert velocity components to angle:

```javascript
const baseAngle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
config.angle = { min: baseAngle - 30, max: baseAngle + 30 };
```

### Particle Bounds

Bounds create an invisible box that particles bounce off. Use `addParticleBounds()` for proper control:

```javascript
// Create bounds processor (do this once)
this.boundsProcessor = this.emitter.addParticleBounds(
    x, y, width, height
);

// Toggle bounds on/off
this.boundsProcessor.active = true;   // Enable collision
this.boundsProcessor.active = false;  // Disable collision
```

**Why not use setConfig?** The `bounds` property in `setConfig()` creates a processor that persists even when removed from config. Using `addParticleBounds()` gives you direct control via the `active` property.

---

## ZoneScene

**File**: `src/scenes/ZoneScene.js`

**Purpose**: Demonstrates emit zones (control *where* particles spawn) and death zones (control *where* particles are destroyed).

### Emit Zones

An emit zone overrides the emitter's default spawn point. Instead of all particles starting at the emitter's x/y, they start at positions drawn from a shape. Two zone types are available:

| Type | Behavior |
|------|----------|
| `'edge'` | Particles spawn sequentially along the perimeter of the shape |
| `'random'` | Particles spawn at random positions within the shape's area |

```javascript
// Edge zone — particles trace the outline of a triangle
emitZone: {
    type: 'edge',
    source: new Phaser.Geom.Triangle(0, -165, -190, 120, 190, 120),
    quantity: 90  // steps around the perimeter before cycling
}

// Random zone — particles spawn anywhere inside a circle
emitZone: {
    type: 'random',
    source: new Phaser.Geom.Circle(0, 0, 165)
}
```

**Coordinate system**: Emit zone shape coordinates are relative to the emitter's position. A circle centered at `(0, 0)` with an emitter at `(512, 384)` places particles in a ring around the screen center.

**Compatible shapes**: `Phaser.Geom.Circle`, `Phaser.Geom.Ellipse`, `Phaser.Geom.Rectangle`, `Phaser.Geom.Triangle`, `Phaser.Geom.Line`.

### Edge Zone — `quantity` vs `stepRate`

For edge zones, `quantity` sets how many evenly-spaced steps exist around the perimeter. Each particle emission advances one step, so the zone cycles smoothly through all positions:

```javascript
emitZone: {
    type: 'edge',
    source: myShape,
    quantity: 90    // 90 steps around the perimeter
    // alternatively: stepRate: 5  (advance 5 pixels per emission)
}
```

### Death Zones

A death zone destroys particles the moment they enter (or leave) a shape:

```javascript
deathZone: {
    type: 'onEnter',   // kill particles that enter the shape
    source: new Phaser.Geom.Circle(centerX, centerY, 65)
}

// type: 'onLeave' kills particles that exit the shape instead
```

**Coordinate system**: Death zone shapes use **world coordinates**, not emitter-relative coordinates. Define the shape at the actual screen position where you want the zone to be.

### Combining Zones

Emit and death zones can be combined in the same emitter config. In ZoneScene, enabling the death zone while in random mode turns a filled disc into a ring — particles spawn throughout the circle but are destroyed when they drift into the inner circle:

```javascript
this.emitter = this.add.particles(centerX, centerY, 'zone-particle', {
    emitZone: {
        type: 'random',
        source: new Phaser.Geom.Circle(0, 0, 165)       // relative to emitter
    },
    deathZone: {
        type: 'onEnter',
        source: new Phaser.Geom.Circle(centerX, centerY, 65)  // world coords
    }
});
```

---

## ShowcaseScene

**File**: `src/scenes/ShowcaseScene.js`

**Purpose**: Artistic demonstration combining multiple particle systems and advanced techniques.

### Multiple Particle Systems

Create layered effects by adding multiple emitters (order matters for z-depth):

```javascript
this.createStarfield();    // Background layer
this.createNebula();       // Mid layer
this.createPortalCore();   // Foreground layer
```

### Custom Textures

Create various shapes for different effects:

```javascript
// Soft glow with multiple circles
graphics.fillStyle(0xffffff, 1);
graphics.fillCircle(32, 32, 8);      // Bright core
graphics.fillStyle(0xffffff, 0.5);
graphics.fillCircle(32, 32, 16);     // Medium glow
graphics.fillStyle(0xffffff, 0.2);
graphics.fillCircle(32, 32, 28);     // Soft outer glow
graphics.generateTexture('glow', 64, 64);
```

### Emit Callback

Position particles programmatically when they spawn:

```javascript
this.add.particles(x, y, 'star', {
    emitCallback: (particle) => {
        // Position in a ring formation
        const angle = Math.random() * Math.PI * 2;
        const radius = 120;
        particle.x = centerX + Math.cos(angle) * radius;
        particle.y = centerY + Math.sin(angle) * radius;
    }
});
```

### One-Shot Explosions

Use `explode()` for burst effects:

```javascript
const burst = this.add.particles(x, y, 'texture', {
    speed: { min: 100, max: 300 },
    quantity: 30,
    // ... other config
});

burst.explode();  // Emit all particles once, then stop
```

### Animated Emitter Properties

Update emitter properties in the `update()` loop:

```javascript
update(time, delta) {
    this.elapsed += delta;

    // Pulsing scale
    const pulseScale = 1 + Math.sin(this.elapsed * 0.003) * 0.2;
    this.portalCore.setScale(pulseScale);

    // Drifting position
    const x = centerX + Math.sin(this.elapsed * 0.0005) * 30;
    this.nebula.setPosition(x, y);
}
```

### Cleanup

Destroy temporary emitters to prevent memory leaks:

```javascript
this.time.delayedCall(1500, () => {
    burst.destroy();
});
```

---

## Quick Reference

### Common Configuration Properties

```javascript
{
    // Emission
    frequency: 100,              // ms between emissions
    quantity: 1,                 // particles per emission
    lifespan: 2000,              // particle lifetime in ms

    // Movement
    speed: { min: 50, max: 150 },
    angle: { min: 0, max: 360 },
    gravityX: 0,
    gravityY: 100,
    accelerationX: 0,
    accelerationY: 0,

    // Appearance
    scale: { start: 1, end: 0 },
    alpha: { start: 1, end: 0 },
    rotate: { min: 0, max: 360 },
    color: [0xff0000, 0x00ff00],
    tint: 0xffffff,
    blendMode: 'ADD',

    // Position variation
    x: { min: -50, max: 50 },    // Offset from emitter x
    y: { min: -50, max: 50 },    // Offset from emitter y

    // Zones
    emitZone: { type: 'edge', source: shape, quantity: 60 },
    deathZone: { type: 'onEnter', source: shape },
}
```

### Key Methods

| Method | Purpose |
|--------|---------|
| `setConfig(config)` | Replace all emitter settings |
| `setPosition(x, y)` | Move the emitter |
| `start()` | Begin emitting particles |
| `stop()` | Stop emitting (existing particles continue) |
| `explode()` | Emit `quantity` particles once |
| `addParticleBounds(x, y, w, h)` | Add collision bounds |
| `destroy()` | Remove emitter completely |
| `killAll()` | Immediately destroy all active particles |

### Value Formats

```javascript
// Single value
speed: 100

// Random range
speed: { min: 50, max: 150 }

// Interpolated over lifetime
scale: { start: 1, end: 0 }

// Array (random selection or interpolation)
color: [0xff0000, 0x00ff00, 0x0000ff]
tint: [0xff0000, 0x00ff00]  // Random selection
```

---

## Further Reading

- [Phaser 3 Particle Examples](https://labs.phaser.io/?path=game+objects%2Fparticle+emitter)
- [Phaser 3 API Documentation](https://docs.phaser.io/api-documentation/class/gameobjects-particles-particleemitter)
