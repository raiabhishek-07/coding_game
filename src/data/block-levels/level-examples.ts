/**
 * Example Level Configuration with Algorithm Hints
 * Shows how to enhance levels with difficulty and suggested algorithms
 */

import { BlockLevel } from '../blockLevelTypes';

export const levelWithHints: BlockLevel = {
    id: 1,
    title: "STEP FORWARD",
    width: 12,
    height: 9,
    start: { x: 2, y: 5 },
    gems: [
        {
            id: 1,
            x: 3,
            y: 5,
            collected: false
        }
    ],
    obstacles: [],
    difficulty: 'easy',
    algorithm: 'bfs',
    description: 'Learn the basics by moving in a straight line. Try to reach the gem in one move!'
};

// More complex level example
export const levelWithMultipleGems: BlockLevel = {
    id: 5,
    title: "GEM COLLECTOR",
    width: 12,
    height: 9,
    start: { x: 2, y: 5 },
    gems: [
        { id: 1, x: 4, y: 5, collected: false },
        { id: 2, x: 6, y: 5, collected: false },
        { id: 3, x: 8, y: 5, collected: false }
    ],
    obstacles: [
        { x: 5, y: 4 },
        { x: 5, y: 6 }
    ],
    difficulty: 'medium',
    algorithm: 'bfs',
    description: 'Collect all gems by finding the optimal path around obstacles. BFS can help find the shortest route!'
};

// Hard level with complex maze
export const levelComplex: BlockLevel = {
    id: 10,
    title: "MAZE MASTER",
    width: 12,
    height: 9,
    start: { x: 2, y: 2 },
    gems: [
        { id: 1, x: 9, y: 7, collected: false },
        { id: 2, x: 4, y: 7, collected: false },
        { id: 3, x: 6, y: 4, collected: false }
    ],
    obstacles: [
        { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
        { x: 7, y: 5 }, { x: 8, y: 5 },
        { x: 4, y: 7 }, { x: 5, y: 7 }
    ],
    difficulty: 'hard',
    algorithm: 'astar',
    description: 'Complex maze with multiple gems. Use A* pathfinding or think ahead with loops to solve efficiently!'
};
