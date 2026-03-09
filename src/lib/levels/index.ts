import { LevelConfig } from './types';
import { WORLD1_LEVELS } from './world1';
import { WORLD2_LEVELS, WORLD3_LEVELS, WORLD4_LEVELS } from './worlds2to4';
import { WORLD5_LEVELS, WORLD6_LEVELS } from './worlds5to6';
import { LEVEL21, LEVEL27 } from './extra_levels';
import { ALL_DSA_LEVELS } from './dsa_foundations';

// Insert level 21 after world 4 levels, and level 27 after world 5 levels
const WORLD4_FULL = [...WORLD4_LEVELS, LEVEL21];

const WORLD5_FULL = [...WORLD5_LEVELS, LEVEL27];

export const ALL_LEVELS: LevelConfig[] = [
    ...WORLD1_LEVELS,
    ...WORLD2_LEVELS,
    ...WORLD3_LEVELS,
    ...WORLD4_FULL,
    ...WORLD5_FULL,
    ...WORLD6_LEVELS,
    ...ALL_DSA_LEVELS,
];

// Sort so that level numbers stay in order
ALL_LEVELS.sort((a, b) => {
    if (a.world !== b.world) return a.world - b.world;
    return a.level - b.level;
});

export {
    WORLD1_LEVELS,
    WORLD2_LEVELS,
    WORLD3_LEVELS,
    WORLD4_LEVELS,
    WORLD5_LEVELS,
    WORLD6_LEVELS,
    ALL_DSA_LEVELS,
};
