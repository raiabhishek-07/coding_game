const fs = require('fs');
const path = require('path');
const dir = path.join('c:/Users/Abhi/Desktop/s0_project/game1/src/data/block-levels');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function getLevel(id) {
    let t = 'LEVEL ' + id;
    let g = [];
    let o = [];

    if (id <= 3) {
        t = id === 1 ? 'STEP FORWARD' : id === 2 ? 'DOUBLE STEP' : 'WALKWAY';
        g = [{ id: 1, x: 2 + id, y: 5, collected: false }];
    }
    else if (id <= 7) {
        t = 'ROUTING ' + id;
        g = [{ id: 1, x: 5, y: id % 2 === 0 ? 3 : 7, collected: false }];
        o = [{ x: 4, y: 5 }, { x: 4, y: 4 }, { x: 4, y: 6 }];
    }
    else if (id <= 12) {
        t = 'MAZE A ' + id;
        g = [{ id: 1, x: 8, y: 2, collected: false }, { id: 2, x: 8, y: 7, collected: false }];
        o = [{ x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 7, y: 3 }, { x: 7, y: 5 }];
    }
    else if (id <= 17) {
        t = 'ZIG ZAG ' + id;
        g = [{ id: 1, x: 10, y: 2, collected: false }, { id: 2, x: 10, y: 8, collected: false }];
        for (let i = 3; i < 10; i += 2) {
            o.push({ x: i, y: 3 });
            o.push({ x: i, y: 5 });
            o.push({ x: i, y: 7 });
        }
    }
    else {
        t = 'EXPERT ' + id;
        g = [{ id: 1, x: 2, y: 2, collected: false }, { id: 2, x: 10, y: 2, collected: false }, { id: 3, x: 10, y: 8, collected: false }];
        o = [{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 5, y: 6 }];
    }

    return "import { BlockLevel } from '../blockLevelTypes';\n\n" +
        "export const level" + id + ": BlockLevel = {\n" +
        "    id: " + id + ",\n" +
        "    title: \"" + t + "\",\n" +
        "    width: 12,\n" +
        "    height: 9,\n" +
        "    start: { x: 2, y: 5 },\n" +
        "    gems: " + JSON.stringify(g, null, 4) + ",\n" +
        "    obstacles: " + JSON.stringify(o, null, 4) + "\n" +
        "};\n";
}

let idx = '';
let arr = 'export const ALL_BLOCK_LEVELS: BlockLevel[] = [\n';

for (let i = 1; i <= 21; i++) {
    fs.writeFileSync(path.join(dir, 'level' + i + '.ts'), getLevel(i));
    idx += "import { level" + i + " } from './level" + i + "';\n";
    arr += "    level" + i + ",\n";
}
arr += '];\n';

fs.writeFileSync(path.join(dir, 'index.ts'), idx + '\n' + arr);

const types = "export interface Position { x: number; y: number; }\n" +
    "export interface Gem extends Position { id: number; collected: boolean; }\n" +
    "export interface BlockLevel {\n" +
    "    id: number;\n" +
    "    title: string;\n" +
    "    width: number;\n" +
    "    height: number;\n" +
    "    start: Position;\n" +
    "    gems: Gem[];\n" +
    "    obstacles: Position[];\n" +
    "}\n";

fs.writeFileSync(path.join('c:/Users/Abhi/Desktop/s0_project/game1/src/data/blockLevelTypes.ts'), types);
console.log('Successfully generated 21 levels!');
