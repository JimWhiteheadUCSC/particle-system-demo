// ControlsUI - Reusable UI overlay for displaying controls and parameter values

class ControlsUI {
    constructor(scene, config) {
        this.scene = scene;
        this.title = config.title || 'Demo Scene';
        this.description = config.description || '';
        this.controls = config.controls || [];
        this.parameters = config.parameters || {};

        this.textObjects = {};
        this.parameterTexts = {};

        this.createUI();
    }

    createUI() {
        const padding = 20;
        const lineHeight = 24;

        // Title
        this.textObjects.title = this.scene.add.text(padding, padding, this.title, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // Description
        this.textObjects.description = this.scene.add.text(padding, padding + 40, this.description, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaaa'
        });

        // Parameters panel (right side)
        const paramX = this.scene.scale.width - 280;
        let paramY = padding;

        this.textObjects.paramHeader = this.scene.add.text(paramX, paramY, 'Current Values:', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffcc00',
            fontStyle: 'bold'
        });

        paramY += 30;

        // Create text for each parameter
        for (const [key, value] of Object.entries(this.parameters)) {
            this.parameterTexts[key] = this.scene.add.text(paramX, paramY, `${key}: ${value}`, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#88ff88'
            });
            paramY += lineHeight;
        }

        // Controls panel (bottom left)
        const controlY = this.scene.scale.height - (this.controls.length * lineHeight) - 60;

        this.textObjects.controlHeader = this.scene.add.text(padding, controlY - 30, 'Controls:', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffcc00',
            fontStyle: 'bold'
        });

        this.controlTexts = [];
        this.controls.forEach((control, index) => {
            const text = this.scene.add.text(padding, controlY + (index * lineHeight), control, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#cccccc'
            });
            this.controlTexts.push(text);
        });

        // Navigation hint (bottom)
        this.textObjects.navHint = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height - 20,
            'ESC - Return to Menu',
            {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#ff6666'
            }
        ).setOrigin(0.5);
    }

    updateParameter(key, value) {
        if (this.parameterTexts[key]) {
            this.parameterTexts[key].setText(`${key}: ${value}`);
        }
        this.parameters[key] = value;
    }

    showFeedback(message, color = '#ffff00') {
        // Show temporary feedback message
        const feedback = this.scene.add.text(
            this.scene.scale.width / 2,
            100,
            message,
            {
                fontSize: '20px',
                fontFamily: 'Arial, sans-serif',
                color: color,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: feedback,
            alpha: 0,
            y: 80,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    destroy() {
        Object.values(this.textObjects).forEach(text => text.destroy());
        Object.values(this.parameterTexts).forEach(text => text.destroy());
        this.controlTexts.forEach(text => text.destroy());
    }
}
