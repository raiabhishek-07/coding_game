'use client';
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BlockLevel } from '@/data/blockLevelTypes';
import { bfs, dfs, aStar, pathToCommands } from '@/lib/algorithms';

const GRID_SIZE = 64;

class MainScene extends Phaser.Scene {
    level!: BlockLevel;
    player!: Phaser.GameObjects.Sprite;
    pathGraphics!: Phaser.GameObjects.Graphics;
    gemObjects: Map<number, Phaser.GameObjects.Image> = new Map();
    enemyObjects: Map<number, Phaser.GameObjects.Container> = new Map();
    blocks: any[] = [];
    isExecuting = false;
    currentStep = 0;
    playerTween?: Phaser.Tweens.Tween;
    collectEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
    onGemsUpdate?: (count: number) => void;
    onFinishSequence?: (success: boolean) => void;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.spritesheet('hero', '/assets/hero_walk.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('gem', '/assets/gem.png');
        this.load.image('beach_bg', '/assets/scenery/beach_bg.png');
        this.load.image('forest_bg', '/assets/scenery/forest_bg.png');
        this.load.image('abyss_bg', '/assets/scenery/abyss_bg.png');
    }

    init(data: { level: BlockLevel }) {
        this.level = data.level;
        this.gemObjects.clear();
        this.enemyObjects.clear();
        this.blocks = [];
        this.isExecuting = false;
        this.currentStep = 0;
    }

    create() {
        const width = this.level.width || 10;
        const height = this.level.height || 10;
        const { start, gems, obstacles, enemies, theme = 'beach' } = this.level;

        const themeConfig = {
            beach: { bg: '#5a9bd4', bgNum: 0x5a9bd4, land: 0xe5c994, water: 0x4fc3f7, particles: 0xffffff, props: ['🌴', '🐚', '🦀', '🏖️', '🍍'], bgKey: 'beach_bg' },
            forest: { bg: '#2d5a27', bgNum: 0x2d5a27, land: 0x81c784, water: 0x2e7d32, particles: 0xa8e6cf, props: ['🌲', '🌸', '🍄', '🌳', '🦌', '🧚'], bgKey: 'forest_bg' },
            abyss: { bg: '#050510', bgNum: 0x050510, land: 0x2e004d, water: 0x4a148c, particles: 0xff00ff, props: ['🪸', '🫧', '🐚', '🕯️', '👾', '✨'], bgKey: 'abyss_bg' }
        };

        const config = themeConfig[theme] || themeConfig.beach;
        this.cameras.main.setBackgroundColor(config.bg);

        // 1. ADVANCED BACKGROUND SYSTEM (Triple Parallax)
        const bgFar = this.add.tileSprite(0, 0, width * GRID_SIZE, height * GRID_SIZE, config.bgKey).setOrigin(0).setDepth(-30).setAlpha(0.2).setScrollFactor(0.1);
        const bgMid = this.add.tileSprite(0, 0, width * GRID_SIZE, height * GRID_SIZE, config.bgKey).setOrigin(0).setDepth(-25).setAlpha(0.3).setScrollFactor(0.3).setScale(1.5).setTint(0x000000);
        const bgNear = this.add.tileSprite(0, 0, width * GRID_SIZE, height * GRID_SIZE, config.bgKey).setOrigin(0).setDepth(-20).setAlpha(0.15).setScrollFactor(0.6).setScale(2);

        this.tweens.add({ targets: [bgFar, bgMid, bgNear], tilePositionX: 1000, tilePositionY: 500, duration: 60000, repeat: -1 });

        // 2. TERRAIN SYSTEM
        const land = this.add.graphics({ x: 0, y: 0 }).setDepth(-10);
        land.fillStyle(config.land, 0.9);
        land.fillRoundedRect(GRID_SIZE, GRID_SIZE, width * GRID_SIZE - (2 * GRID_SIZE), height * GRID_SIZE - (2 * GRID_SIZE), 32);

        // Subtle Grid
        const grid = this.add.graphics({ x: 0, y: 0 }).setDepth(-5);
        grid.lineStyle(1, 0xffffff, 0.05);
        for (let i = 1; i < width; i++) { grid.moveTo(i * GRID_SIZE, GRID_SIZE); grid.lineTo(i * GRID_SIZE, (height - 1) * GRID_SIZE); }
        for (let j = 1; j < height; j++) { grid.moveTo(GRID_SIZE, j * GRID_SIZE); grid.lineTo((width - 1) * GRID_SIZE, j * GRID_SIZE); }
        grid.strokePath();

        // 3. WATER SHORELINE SYSTEM
        const waterTex = this.add.tileSprite(0, 0, width * GRID_SIZE, height * GRID_SIZE, config.bgKey).setOrigin(0).setDepth(-15).setAlpha(0.3).setTint(config.water);
        this.tweens.add({ targets: waterTex, tilePositionX: 50, tilePositionY: 50, duration: 5000, yoyo: true, repeat: -1 });

        // 4. SCENERY & AMBIENCE
        this.addScenery(config.props, width, height, start);
        this.addAmbientParticles(config.particles, theme);
        this.pathGraphics = this.add.graphics().setDepth(100);

        // 5. ASSET LAYER
        obstacles.forEach(obs => this.createObstacle(obs, config.land, theme === 'abyss'));
        gems.forEach(gem => this.createGem(gem));
        if (enemies) enemies.forEach(enemy => this.createEnemy(enemy));

        // 6. CHARACTER
        this.setupAnimations();
        this.initParticleSystems();

        // 7. ATMOSPHERIC OVERLAY (Vignette)
        const vWidth = width * GRID_SIZE;
        const vHeight = height * GRID_SIZE;
        const vignette = this.add.graphics().setDepth(200);
        vignette.fillStyle(0x000000, theme === 'abyss' ? 0.7 : 0.3);

        // Use a semi-transparent overlay since radial gradients can be tricky in some Phaser builds
        vignette.fillRect(0, 0, vWidth, vHeight);

        // Add mystical clouds/fog
        this.addAtmosphericFog(config.particles, vWidth, vHeight);
    }

    addAtmosphericFog(color: number, vWidth: number, vHeight: number) {
        for (let i = 0; i < 6; i++) {
            const fog = this.add.circle(Phaser.Math.Between(0, vWidth), Phaser.Math.Between(0, vHeight), Phaser.Math.Between(200, 400), color, 0.05)
                .setDepth(150).setScrollFactor(1.2).setBlendMode(Phaser.BlendModes.SCREEN);

            this.tweens.add({
                targets: fog,
                x: fog.x + Phaser.Math.Between(-100, 100),
                y: fog.y + Phaser.Math.Between(-100, 100),
                alpha: { from: 0.05, to: 0.02 },
                duration: 5000 + Phaser.Math.Between(0, 5000),
                yoyo: true, repeat: -1
            });
        }
    }

    addAmbientParticles(color: number, theme: string) {
        const delays = { beach: 800, forest: 1500, abyss: 600 };
        const delay = (delays as any)[theme] || 1000;

        this.time.addEvent({
            delay,
            callback: () => {
                const rx = Phaser.Math.Between(0, this.level.width * GRID_SIZE);
                const ry = Phaser.Math.Between(0, this.level.height * GRID_SIZE);
                const dot = this.add.circle(rx, ry, Phaser.Math.Between(1, 4), color, 0.4);
                dot.setDepth(160).setBlendMode(Phaser.BlendModes.ADD);

                this.tweens.add({
                    targets: dot,
                    y: ry - 100,
                    x: rx + Phaser.Math.Between(-40, 40),
                    alpha: 0,
                    scale: 0,
                    duration: 3000 + Phaser.Math.Between(0, 2000),
                    onComplete: () => dot.destroy()
                });
            },
            loop: true
        });
    }

    addScenery(props: string[], width: number, height: number, start: any) {
        const count = Math.floor((width * height) / 3);
        const margin = GRID_SIZE;

        for (let i = 0; i < count; i++) {
            const rx = Phaser.Math.Between(margin, (width - 1) * GRID_SIZE);
            const ry = Phaser.Math.Between(margin, (height - 1) * GRID_SIZE);

            // Avoid spawning on player start or paths roughly
            if (Math.abs(rx - (start.x * GRID_SIZE)) < 80 && Math.abs(ry - (start.y * GRID_SIZE)) < 80) continue;

            const emoji = props[Phaser.Math.Between(0, props.length - 1)];
            const size = Phaser.Math.Between(24, 48);
            const text = this.add.text(rx, ry, emoji, { fontSize: `${size}px` }).setOrigin(0.5).setAlpha(0.85).setDepth(2);

            // WIND SWAY LOGIC
            const sway = Phaser.Math.Between(5, 12);
            this.tweens.add({
                targets: text,
                angle: { from: -sway, to: sway },
                y: ry - 5,
                duration: 2000 + Phaser.Math.Between(0, 2000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });

            // Shadow
            const shadow = this.add.circle(rx, ry + 15, size / 3, 0x000000, 0.2).setDepth(1);
            this.tweens.add({ targets: shadow, scaleX: 1.2, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        }
    }

    createObstacle(obs: any, landColor: number, isAbyss: boolean) {
        const cx = obs.x * GRID_SIZE + GRID_SIZE / 2;
        const cy = obs.y * GRID_SIZE + GRID_SIZE / 2;
        const rock = this.add.graphics().setDepth(5);

        const baseColor = isAbyss ? 0x2e004d : landColor - 0x222222;
        rock.fillStyle(baseColor, 1);
        rock.fillRoundedRect(cx - 25, cy - 25, 50, 50, 10);

        if (isAbyss) {
            rock.lineStyle(2, 0x9b59b6, 0.5);
            rock.strokeRoundedRect(cx - 25, cy - 25, 50, 50, 10);
        } else {
            rock.fillStyle(landColor + 0x111111, 0.3);
            rock.fillCircle(cx - 10, cy - 10, 15);
        }
    }

    createGem(gem: any) {
        const rx = gem.x * GRID_SIZE + GRID_SIZE / 2;
        const ry = gem.y * GRID_SIZE + GRID_SIZE / 2;
        const img = this.add.image(rx, ry, 'gem').setOrigin(0.5).setDepth(10);
        this.tweens.add({ targets: img, y: ry - 10, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        const glow = this.add.circle(rx, ry, 25, 0x00ffff, 0.15).setDepth(9);
        this.tweens.add({ targets: glow, scale: 1.6, alpha: 0, duration: 2000, repeat: -1 });
        this.gemObjects.set(gem.id, img);
    }

    createEnemy(enemy: any) {
        const cx = enemy.x * GRID_SIZE + GRID_SIZE / 2;
        const cy = enemy.y * GRID_SIZE + GRID_SIZE / 2;
        const container = this.add.container(cx, cy).setDepth(15);

        let visual = '🤖';
        if (enemy.type === 'guardian') visual = '🦀';
        else if (enemy.type === 'golem') visual = '🦍';
        else if (enemy.type === 'dragon') visual = '🐲';

        const text = this.add.text(0, 0, visual, { fontSize: enemy.isBoss ? '48px' : '32px' }).setOrigin(0.5);
        container.add(text);

        // Breathing animation
        this.tweens.add({
            targets: text,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Health Bar
        const hbBg = this.add.rectangle(0, -25, 40, 5, 0x000000).setOrigin(0.5);
        const hbFg = this.add.rectangle(0, -25, 40, 5, 0xff0000).setOrigin(0.5);
        container.add([hbBg, hbFg]);
        container.setData('hbFg', hbFg);
        container.setData('maxHealth', enemy.health);
        container.setData('currentHealth', enemy.health);
        container.setData('logicalX', enemy.x);
        container.setData('logicalY', enemy.y);

        this.enemyObjects.set(enemy.id, container);
    }

    setupAnimations() {
        if (!this.anims.exists('walk_left')) {
            this.anims.create({ key: 'walk_left', frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'turn', frames: [{ key: 'hero', frame: 4 }], frameRate: 20 });
            this.anims.create({ key: 'walk_right', frames: this.anims.generateFrameNumbers('hero', { start: 5, end: 8 }), frameRate: 10, repeat: -1 });
        }
        const { start } = this.level;
        this.player = this.add.sprite(start.x * GRID_SIZE + GRID_SIZE / 2, start.y * GRID_SIZE + GRID_SIZE / 2, 'hero').setOrigin(0.5, 0.5);
        this.player.setScale(1.2).setDepth(20).setFrame(4);
        this.player.setData('logicalX', start.x).setData('logicalY', start.y);
    }

    initParticleSystems() {
        if (!this.textures.exists('gemPart')) {
            const gfx = this.make.graphics({ x: 0, y: 0 });
            gfx.fillStyle(0xffffff).fillCircle(4, 4, 4);
            gfx.generateTexture('gemPart', 8, 8);
            gfx.destroy();
        }

        this.collectEmitter = this.add.particles(0, 0, 'gemPart', {
            speed: { min: -150, max: 150 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            emitting: false,
            gravityY: 200,
            blendMode: 'ADD'
        }) as any;
    }

    updatePath(blocks: any[]) {
        if (this.isExecuting) return;
        this.blocks = blocks;
        this.drawPath();
    }

    drawPath() {
        if (!this.pathGraphics) return;
        this.pathGraphics.clear();
        if (this.blocks.length === 0) return;
        let cx = this.level.start.x;
        let cy = this.level.start.y;
        this.pathGraphics.lineStyle(4, 0xff6600, 0.5);
        this.pathGraphics.fillStyle(0xff6600, 0.8);
        this.blocks.forEach(b => {
            const cmd = typeof b === 'string' ? b : b.action;
            if (!cmd || typeof cmd !== 'string') return;
            this.pathGraphics.beginPath();
            this.pathGraphics.moveTo(cx * GRID_SIZE + GRID_SIZE / 2, cy * GRID_SIZE + GRID_SIZE / 2);
            if (cmd === 'UP') cy -= 1; else if (cmd === 'DOWN') cy += 1; else if (cmd === 'LEFT') cx -= 1; else if (cmd === 'RIGHT') cx += 1;
            this.pathGraphics.lineTo(cx * GRID_SIZE + GRID_SIZE / 2, cy * GRID_SIZE + GRID_SIZE / 2);
            this.pathGraphics.strokePath();
            this.pathGraphics.fillCircle(cx * GRID_SIZE + GRID_SIZE / 2, cy * GRID_SIZE + GRID_SIZE / 2, 6);
        });
    }

    runScript() {
        if (this.isExecuting || !this.player) return;
        this.isExecuting = true;
        this.currentStep = 0;
        const { start } = this.level;
        this.player.setPosition(start.x * GRID_SIZE + GRID_SIZE / 2, start.y * GRID_SIZE + GRID_SIZE / 2);
        this.player.setData('logicalX', start.x).setData('logicalY', start.y);
        this.player.clearTint().setAngle(0).setFrame(4);
        this.gemObjects.forEach(g => g.setVisible(true));
        this.enemyObjects.forEach(e => {
            e.setVisible(true);
            e.setData('currentHealth', e.getData('maxHealth'));
            const hbFg = e.getData('hbFg') as Phaser.GameObjects.Rectangle;
            hbFg.width = 40;
        });
        if (this.onGemsUpdate) this.onGemsUpdate(0);
        this.executeNextStep();
    }

    executeNextStep() {
        if (this.currentStep >= this.blocks.length) {
            this.isExecuting = false;
            this.player.anims.stop();
            this.player.setFrame(4);
            let collected = 0;
            this.gemObjects.forEach(g => !g.visible && collected++);
            let enemiesAlive = 0;
            this.enemyObjects.forEach(e => e.visible && enemiesAlive++);

            // Win condition: collect all gems AND defeat all boss enemies if any
            const win = collected === this.level.gems.length && enemiesAlive === 0;
            if (this.onFinishSequence) this.onFinishSequence(win);
            return;
        }

        const block = this.blocks[this.currentStep];
        const cmd = typeof block === 'string' ? block : block.action;

        if (cmd === 'ATTACK') {
            this.handleAttack();
            return;
        }

        if (cmd === 'SCAN') {
            this.handleScan();
            return;
        }

        if (cmd === 'COLLECT') {
            this.handleCollect();
            return;
        }

        if (typeof block === 'object') {
            if (block.type === 'algorithm') { this.executeAlgorithmBlock(block); return; }
            if (block.type === 'condition') { this.handleConditionBlock(block); return; }
            if (block.type !== 'action') { this.currentStep++; this.executeNextStep(); return; }
        }

        let tx = this.player.getData('logicalX');
        let ty = this.player.getData('logicalY');
        if (cmd === 'UP') ty -= 1; else if (cmd === 'DOWN') ty += 1; else if (cmd === 'LEFT') tx -= 1; else if (cmd === 'RIGHT') tx += 1;

        if (tx < 1 || tx >= this.level.width - 1 || ty < 1 || ty >= this.level.height - 1 || this.level.obstacles.some(o => o.x === tx && o.y === ty)) {
            this.isExecuting = false; this.player.setTint(0xff0000);
            if (this.onFinishSequence) this.onFinishSequence(false);
            return;
        }

        // Auto collect gems if not in manual collect level
        this.player.setData('logicalX', tx).setData('logicalY', ty);
        if (cmd === 'LEFT') this.player.anims.play('walk_left', true); else this.player.anims.play('walk_right', true);

        this.playerTween = this.tweens.add({
            targets: this.player,
            x: tx * GRID_SIZE + GRID_SIZE / 2,
            y: ty * GRID_SIZE + GRID_SIZE / 2,
            duration: 400,
            onComplete: () => {
                // Auto-collect logic (unless manual specified, but we'll allow both)
                this.checkGemCollection(tx, ty);
                this.currentStep++; this.executeNextStep();
            }
        });
    }

    handleAttack() {
        const px = this.player.getData('logicalX');
        const py = this.player.getData('logicalY');

        // Visual effect for attack
        const strike = this.add.circle(this.player.x, this.player.y, 60, 0xff0000, 0.4).setDepth(30);
        this.tweens.add({ targets: strike, scale: 1.5, alpha: 0, duration: 200, onComplete: () => strike.destroy() });

        // Shake effect
        this.tweens.add({ targets: this.player, x: this.player.x + 5, duration: 50, yoyo: true, repeat: 2 });

        this.enemyObjects.forEach((e, id) => {
            if (!e.visible) return;
            const ex = e.getData('logicalX');
            const ey = e.getData('logicalY');
            const dist = Math.abs(ex - px) + Math.abs(ey - py);

            if (dist <= 1) {
                let health = e.getData('currentHealth') - 1;
                e.setData('currentHealth', health);
                const hbFg = e.getData('hbFg') as Phaser.GameObjects.Rectangle;
                hbFg.width = (health / e.getData('maxHealth')) * 40;

                this.tweens.add({ targets: e, x: e.x + (ex > px ? 10 : -10), duration: 100, yoyo: true });

                if (health <= 0) {
                    this.time.delayedCall(200, () => {
                        if (this.collectEmitter) this.collectEmitter.explode(15, e.x, e.y);
                        e.setVisible(false);
                    });
                }
            }
        });

        this.time.delayedCall(300, () => {
            this.currentStep++;
            this.executeNextStep();
        });
    }

    handleScan() {
        const pulse = this.add.circle(this.player.x, this.player.y, 10, 0x00ffff, 0.3).setDepth(5);
        this.tweens.add({
            targets: pulse,
            radius: 300,
            alpha: 0,
            duration: 500,
            onComplete: () => pulse.destroy()
        });

        // Briefly highlight all interactables
        this.gemObjects.forEach(g => { if (g.visible) this.tweens.add({ targets: g, scale: 1.5, duration: 200, yoyo: true }); });
        this.enemyObjects.forEach(e => { if (e.visible) this.tweens.add({ targets: e, scale: 1.3, duration: 200, yoyo: true }); });

        this.time.delayedCall(600, () => {
            this.currentStep++;
            this.executeNextStep();
        });
    }

    handleCollect() {
        const tx = this.player.getData('logicalX');
        const ty = this.player.getData('logicalY');
        this.checkGemCollection(tx, ty);
        this.time.delayedCall(300, () => {
            this.currentStep++;
            this.executeNextStep();
        });
    }

    checkGemCollection(tx: number, ty: number) {
        this.level.gems.forEach(gem => {
            if (gem.x === tx && gem.y === ty) {
                const gobj = this.gemObjects.get(gem.id);
                if (gobj?.visible) {
                    gobj.setVisible(false);
                    if (this.collectEmitter) this.collectEmitter.explode(10, gobj.x, gobj.y);
                    let c = 0; this.gemObjects.forEach(g => !g.visible && c++);
                    if (this.onGemsUpdate) this.onGemsUpdate(c);
                }
            }
        });
    }

    handleConditionBlock(block: any) {
        const result = this.evaluateCondition(block.condition);
        const subBlocks = result ? (block.then || []) : (block.else || []);

        // Inject sub-blocks into current script
        this.blocks.splice(this.currentStep, 1, ...subBlocks);
        this.executeNextStep();
    }

    evaluateCondition(condition: string): boolean {
        const px = this.player.getData('logicalX');
        const py = this.player.getData('logicalY');

        const neighbors = [
            { x: px, y: py - 1 }, { x: px, y: py + 1 },
            { x: px - 1, y: py }, { x: px + 1, y: py }
        ];

        if (condition === 'gemAhead') {
            return this.level.gems.some(g => neighbors.some(n => n.x === g.x && n.y === g.y) && this.gemObjects.get(g.id)?.visible);
        }
        if (condition === 'enemyAhead') {
            return Array.from(this.enemyObjects.values()).some(e => neighbors.some(n => n.x === e.getData('logicalX') && n.y === e.getData('logicalY')) && e.visible);
        }
        if (condition === 'wallAhead') {
            return neighbors.some(n =>
                n.x < 1 || n.x >= this.level.width - 1 ||
                n.y < 1 || n.y >= this.level.height - 1 ||
                this.level.obstacles.some(o => o.x === n.x && o.y === n.y)
            );
        }
        if (condition === 'canMove') {
            return neighbors.some(n =>
                n.x >= 1 && n.x < this.level.width - 1 &&
                n.y >= 1 && n.y < this.level.height - 1 &&
                !this.level.obstacles.some(o => o.x === n.x && o.y === n.y)
            );
        }
        return false;
    }

    executeAlgorithmBlock(block: any) {
        const currentPos = { x: this.player.getData('logicalX'), y: this.player.getData('logicalY') };
        let targetPos: any = null;
        if (block.target === 'nearestGem') {
            let minDist = Infinity;
            this.level.gems.forEach(gem => {
                const gobj = this.gemObjects.get(gem.id);
                if (gobj?.visible) {
                    const d = Math.abs(gem.x - currentPos.x) + Math.abs(gem.y - currentPos.y);
                    if (d < minDist) { minDist = d; targetPos = gem; }
                }
            });
        }
        if (!targetPos) { this.currentStep++; this.executeNextStep(); return; }

        let path: any[] = [];
        try {
            if (block.algorithm === 'bfs') path = bfs(currentPos, targetPos, this.level.width, this.level.height, this.level.obstacles);
            else if (block.algorithm === 'dfs') path = dfs(currentPos, targetPos, this.level.width, this.level.height, this.level.obstacles);
            else if (block.algorithm === 'astar') path = aStar(currentPos, targetPos, this.level.width, this.level.height, this.level.obstacles);
        } catch (e) { }

        const commands = pathToCommands(path.slice(1));
        this.blocks.splice(this.currentStep, 1, ...commands);
        this.executeNextStep();
    }

    stopScript() {
        if (this.playerTween) this.playerTween.stop();
        this.isExecuting = false;
        this.player.clearTint().setAngle(0).setFrame(4).anims.stop();
        this.player.setPosition(this.level.start.x * GRID_SIZE + GRID_SIZE / 2, this.level.start.y * GRID_SIZE + GRID_SIZE / 2);
        this.player.setData('logicalX', this.level.start.x).setData('logicalY', this.level.start.y);
        this.gemObjects.forEach(g => g.setVisible(true));
    }
}

export default function GameEngine({ blocks, level, runTrigger, stopTrigger, onFinish, onGemsUpdate }: any) {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!gameContainer.current) return;

        // Safety: Ensure client-side and valid dimensions
        const container = gameContainer.current;
        // if (container.clientWidth === 0 || container.clientHeight === 0) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: (level.width || 10) * GRID_SIZE,
            height: (level.height || 10) * GRID_SIZE,
            parent: container,
            scene: MainScene,
            pixelArt: true,
            backgroundColor: '#000000',
            antialias: false,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: (level.width || 10) * GRID_SIZE,
                height: (level.height || 10) * GRID_SIZE
            }
        };
        gameRef.current = new Phaser.Game(config);
        gameRef.current.scene.start('MainScene', { level });

        return () => {
            if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
        };
    }, [level]);

    useEffect(() => {
        if (gameRef.current) {
            const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
            if (scene) { scene.onGemsUpdate = onGemsUpdate; scene.onFinishSequence = onFinish; }
        }
    }, [onFinish, onGemsUpdate, level]);

    useEffect(() => {
        if (gameRef.current) {
            const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
            if (scene && scene.sys.isActive() && scene.updatePath) { scene.updatePath(blocks); }
        }
    }, [blocks, level]);

    useEffect(() => {
        if (runTrigger > 0 && gameRef.current) {
            const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
            if (scene?.sys.isActive()) scene.runScript();
        }
    }, [runTrigger]);

    useEffect(() => {
        if (stopTrigger > 0 && gameRef.current) {
            const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
            if (scene?.sys.isActive()) scene.stopScript();
        }
    }, [stopTrigger]);

    return (
        <div ref={gameContainer} style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '24px'
        }} />
    );
}
