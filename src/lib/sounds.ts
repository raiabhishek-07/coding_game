/**
 * Sound system using Web Audio API — no external libraries needed.
 * Generates all SFX programmatically.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue = 0.3,
    delay = 0
) {
    // Respect global mute toggle from HUD
    if (typeof window !== 'undefined' && (window as Window & { __cq_muted?: boolean }).__cq_muted) return;
    try {
        const ac = getCtx();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
        gain.gain.setValueAtTime(gainValue, ac.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + duration);
    } catch { /* audio blocked */ }
}

/** ▶ Run Code button click */
export function sfxRun() {
    playTone(440, 0.1, 'square', 0.15);
    playTone(660, 0.1, 'square', 0.1, 0.1);
}

/** ✅ Level passed */
export function sfxSuccess() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => playTone(freq, 0.3, 'sine', 0.25, i * 0.12));
}

/** ❌ Wrong answer */
export function sfxError() {
    playTone(200, 0.15, 'sawtooth', 0.2);
    playTone(150, 0.2, 'sawtooth', 0.15, 0.15);
}

/** 🏆 Level Complete fanfare */
export function sfxLevelComplete() {
    const melody = [392, 523, 659, 784, 1047, 784, 1047];
    melody.forEach((freq, i) => playTone(freq, 0.25, 'sine', 0.3, i * 0.1));
}

/** 💡 Hint reveal */
export function sfxHint() {
    playTone(880, 0.1, 'sine', 0.2);
    playTone(1100, 0.15, 'sine', 0.15, 0.12);
}

/** ⚔️ Warrior fight */
export function sfxFight() {
    playTone(120, 0.1, 'sawtooth', 0.3);
    playTone(90, 0.15, 'sawtooth', 0.2, 0.1);
}

/** 🏃 Warrior walk */
export function sfxWalk() {
    playTone(200, 0.05, 'square', 0.1);
    playTone(180, 0.05, 'square', 0.08, 0.1);
}

/** 💎 Gem collect */
export function sfxCollect() {
    playTone(1200, 0.08, 'sine', 0.2);
    playTone(1600, 0.1, 'sine', 0.18, 0.08);
}

/** 🔒 Level locked click */
export function sfxLocked() {
    playTone(220, 0.1, 'square', 0.15);
}

/** ⭐ Star earned (staggered) */
export function sfxStars(n: number) {
    for (let i = 0; i < n; i++) {
        playTone(880 + i * 220, 0.12, 'sine', 0.25, i * 0.2);
    }
}

/** 🔥 Streak milestone */
export function sfxStreak() {
    [440, 550, 660, 880, 1100].forEach((f, i) => playTone(f, 0.15, 'triangle', 0.2, i * 0.08));
}
