/**
 * Sound system using Web Audio API — no external libraries needed.
 * Generates all SFX programmatically and manages Background Music.
 */

class GameAudioSystem {
    private ctx: AudioContext | null = null;
    public isMuted: boolean = true; // Default muted until interaction
    private bgmInterval: NodeJS.Timeout | null = null;
    private initialized: boolean = false;
    private drone: OscillatorNode | null = null;

    public init() {
        if (!this.initialized && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.initialized = true;

                // Read saved preference
                const saved = localStorage.getItem('codequest-muted');
                if (saved === 'false') {
                    this.isMuted = false;
                }
            }

            // Interaction hook to resume context
            window.addEventListener('click', () => {
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                if (!this.isMuted && !this.bgmInterval) {
                    this.startBGM();
                }
            }, { once: true });
        }
    }

    public toggleMute(): boolean {
        this.init();
        this.isMuted = !this.isMuted;
        localStorage.setItem('codequest-muted', String(this.isMuted));

        if (this.isMuted) {
            this.stopBGM();
        } else {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.startBGM();
        }
        return this.isMuted;
    }

    public syncMuteState(muted: boolean) {
        this.isMuted = muted;
        if (muted) this.stopBGM();
        else {
            this.init();
            this.startBGM();
        }
    }

    public playTone(
        frequency: number,
        duration: number,
        type: OscillatorType = 'sine',
        gainValue = 0.3,
        delay = 0,
        slideFreq?: number
    ) {
        if (!this.initialized) this.init();
        if (this.isMuted || !this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = type;
            const now = this.ctx.currentTime + delay;
            osc.frequency.setValueAtTime(frequency, now);

            if (slideFreq) {
                osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
            }

            // Envelope
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(gainValue, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.01);

            osc.start(now);
            osc.stop(now + duration);
        } catch { /* Suppress blocks */ }
    }

    public playNoise(duration: number, vol: number = 0.1) {
        if (!this.initialized) this.init();
        if (this.isMuted || !this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch { }
    }

    public startBGM() {
        if (!this.initialized) this.init();
        if (!this.ctx || this.isMuted || this.bgmInterval) return;

        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Sub-bass drone
        this.drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        this.drone.type = 'sine';
        this.drone.frequency.value = 55; // A1
        this.drone.connect(droneGain);
        droneGain.connect(this.ctx.destination);
        droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
        droneGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 2); // Fade in
        this.drone.start();

        const notes = [220, 329.63, 440, 493.88, 587.33, 493.88, 440, 329.63];
        let noteIdx = 0;

        this.bgmInterval = setInterval(() => {
            if (this.isMuted) {
                this.stopBGM();
                return;
            }
            this.playTone(notes[noteIdx], 0.15, 'sine', 0.015);
            noteIdx = (noteIdx + 1) % notes.length;
        }, 400); // 150 BPM
    }

    public stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        if (this.drone) {
            try { this.drone.stop(); } catch { }
            this.drone = null;
        }
    }
}

export const GameAudio = new GameAudioSystem();

// Legacy / Existing Wrappers used by the app

export function sfxHover() { GameAudio.playTone(400, 0.05, 'sine', 0.02); }
export function sfxClick() { GameAudio.playTone(600, 0.08, 'square', 0.03, 0, 800); }

export function sfxRun() {
    GameAudio.playTone(440, 0.1, 'square', 0.05);
    GameAudio.playTone(660, 0.1, 'square', 0.05, 0.1);
}

export function sfxSuccess() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => GameAudio.playTone(freq, 0.3, 'sine', 0.1, i * 0.12));
}

export function sfxError() {
    GameAudio.playTone(200, 0.15, 'sawtooth', 0.1);
    GameAudio.playTone(150, 0.2, 'sawtooth', 0.08, 0.15);
}

export function sfxLevelComplete() {
    const melody = [392, 523, 659, 784, 1047, 784, 1047];
    melody.forEach((freq, i) => GameAudio.playTone(freq, 0.25, 'sine', 0.15, i * 0.1));
}

export function sfxHint() {
    GameAudio.playTone(880, 0.1, 'sine', 0.1);
    GameAudio.playTone(1100, 0.15, 'sine', 0.08, 0.12);
}

export function sfxFight() {
    GameAudio.playTone(880, 0.15, 'square', 0.04, 0, 110);
}

export function sfxHit() {
    GameAudio.playNoise(0.2, 0.1);
    GameAudio.playTone(100, 0.2, 'sawtooth', 0.05, 0, 50);
}

export function sfxWalk() {
    GameAudio.playTone(200, 0.05, 'square', 0.02);
    GameAudio.playTone(180, 0.05, 'square', 0.02, 0.1);
}

export function sfxCollect() {
    GameAudio.playTone(1200, 0.08, 'sine', 0.05);
    GameAudio.playTone(1600, 0.1, 'sine', 0.04, 0.08);
}

export function sfxLocked() {
    GameAudio.playTone(220, 0.1, 'square', 0.05);
}

export function sfxStars(n: number) {
    for (let i = 0; i < n; i++) {
        GameAudio.playTone(880 + i * 220, 0.12, 'sine', 0.1, i * 0.2);
    }
}

export function sfxStreak() {
    [440, 550, 660, 880, 1100].forEach((f, i) => GameAudio.playTone(f, 0.15, 'triangle', 0.08, i * 0.08));
}
