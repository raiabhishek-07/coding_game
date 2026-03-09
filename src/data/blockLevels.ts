export interface Position { x: number; y: number; }
export interface Gem extends Position { id: number; collected: boolean; }

export interface BlockLevel {
    id: number;
    title: string;
    width: number;
    height: number;
    start: Position;
    gems: Gem[];
    obstacles: Position[];
}

export const LEVELS: BlockLevel[] = [
    {
        id: 1,
        title: "ISLAND ESCAPE",
        width: 12,
        height: 9,
        start: { x: 2, y: 5 },
        gems: [
            { id: 1, x: 5, y: 2, collected: false },
            { id: 2, x: 9, y: 3, collected: false },
            { id: 3, x: 2, y: 7, collected: false }
        ],
        obstacles: [
            { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 7, y: 2 },
            { x: 7, y: 3 }, { x: 8, y: 6 }, { x: 9, y: 6 }
        ]
    },
    {
        id: 2,
        title: "RIVER CROSSING",
        width: 12,
        height: 9,
        start: { x: 1, y: 4 },
        gems: [
            { id: 1, x: 5, y: 1, collected: false },
            { id: 2, x: 5, y: 7, collected: false },
            { id: 3, x: 10, y: 4, collected: false }
        ],
        obstacles: [
            { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 },
            { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
            { x: 8, y: 2 }, { x: 9, y: 2 }
        ]
    },
    {
        id: 3,
        title: "THE MAZE",
        width: 12,
        height: 9,
        start: { x: 1, y: 2 },
        gems: [
            { id: 1, x: 2, y: 7, collected: false },
            { id: 2, x: 8, y: 1, collected: false },
            { id: 3, x: 10, y: 7, collected: false }
        ],
        obstacles: [
            { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 },
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
            { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 9, y: 7 }, { x: 9, y: 6 },
            { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }
        ]
    }
];
