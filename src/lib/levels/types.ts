export interface Enemy {
    name: string;
    sprite: string;
    health: number;
}

export interface LevelConfig {
    id: string;
    world: number;
    level: number;
    title: string;
    worldName: string;
    concept: string;
    story: string;
    objective: string;
    starterCode: string;
    hints: string[];
    validate: (logs: string[], returnValue?: unknown) => boolean;
    winMessage: string;
    xpReward: number;
    gemReward: number;
    warriorAnimation: 'wake' | 'walk' | 'fight' | 'collect' | 'celebrate' | 'magic' | 'idle';
    worldTheme: 'forest' | 'village' | 'tower' | 'vault' | 'inferno' | 'shadow';
    enemies: Enemy[];
}
