import { LevelConfig } from './types';

export const WORLD1_LEVELS: LevelConfig[] = [
    {
        id: '1-1',
        world: 1,
        level: 1,
        title: 'The Sleeping Warrior',
        worldName: 'The Awakening Forest',
        concept: 'console.log & Output',
        story: 'The warrior sleeps deep in the forest. Only a voice — your code — can wake him. Call out to him using console.log!',
        objective: 'Print two wake-up messages to the console.',
        starterCode: `// Wake up the warrior!
// Use console.log to print messages

console.log("Wake up, warrior!");
// Now print a second message below:
`,
        hints: [
            '💡 Use console.log("your message here") to print text.',
            '💡 You need TWO console.log calls — one already exists. Add another below it.',
            '💡 Solution: console.log("Wake up, warrior!"); console.log("Your quest begins now.");',
        ],
        validate: (logs: string[]) => {
            return logs.length >= 2;
        },
        winMessage: '⚔️ The warrior awakens! Your journey begins!',
        xpReward: 50,
        gemReward: 1,
        warriorAnimation: 'wake',
        worldTheme: 'forest',
        enemies: [],
    },
    {
        id: '1-2',
        world: 1,
        level: 2,
        title: 'Name Your Warrior',
        worldName: 'The Awakening Forest',
        concept: 'Variables — let, const, var',
        story: 'The village elder stands before you, quill in hand. "What is your name, warrior? What is your health? What gold do you carry?" Declare your identity!',
        objective: 'Declare 3 variables (let, const, var) and log them all.',
        starterCode: `// Declare your warrior's identity!
// Use let for things that can change
// Use const for fixed values
// Use var for old-style declaration

let warriorName = "Your Name Here";
const MAX_HEALTH = 100;
var startingGold = 50;

// Log all three below:
console.log("Warrior: " + warriorName);
`,
        hints: [
            '💡 You need 3 console.log calls — one for each variable.',
            '💡 Use: console.log("Health: " + MAX_HEALTH); and console.log("Gold: " + startingGold);',
            '💡 Full solution: log warriorName, MAX_HEALTH, and startingGold each on their own line.',
        ],
        validate: (logs: string[]) => logs.length >= 3,
        winMessage: '📜 The elder engraves your name on the stone tablet!',
        xpReward: 75,
        gemReward: 1,
        warriorAnimation: 'celebrate',
        worldTheme: 'forest',
        enemies: [],
    },
    {
        id: '1-3',
        world: 1,
        level: 3,
        title: 'The Type Riddle',
        worldName: 'The Awakening Forest',
        concept: 'Data Types — string, number, boolean, null, undefined',
        story: 'A magical chest poses 5 riddles! Each answer must be the correct JavaScript type. Use typeof to reveal the type of each variable.',
        objective: 'Use typeof on 5 different variables and log each result.',
        starterCode: `// Declare each type and reveal it using typeof

let playerName = "Hero";         // string
let playerLevel = 1;             // number
let isAlive = true;              // boolean
let emptySlot = null;            // null
let unknownPower;                // undefined

// Log typeof each variable below:
console.log(typeof playerName);   // "string"
console.log(typeof playerLevel);  // "number"
console.log(typeof isAlive);      // "boolean"
console.log(typeof emptySlot);    // "object" (JS quirk!)
console.log(typeof unknownPower); // "undefined"
`,
        hints: [
            '💡 Use typeof on each variable: typeof playerLevel, typeof isAlive, etc.',
            '💡 You need 5 console.log(typeof ...) calls total.',
            '💡 Watch out: typeof null returns "object" — that\'s a famous JS quirk!',
        ],
        validate: (logs: string[]) => logs.length >= 5,
        winMessage: '🗝️ All 5 gems light up! The chest swings open!',
        xpReward: 100,
        gemReward: 2,
        warriorAnimation: 'collect',
        worldTheme: 'forest',
        enemies: [],
    },
    {
        id: '1-4',
        world: 1,
        level: 4,
        title: 'Gold Calculator',
        worldName: 'The Awakening Forest',
        concept: 'Arithmetic & Assignment Operators',
        story: 'Three treasure chests! Calculate your total gold, split it with your partner, check the remainder. Master the operators to claim your share!',
        objective: 'Use +, /, % operators and log: total, myShare, remainder, and bonus share.',
        starterCode: `let chest1 = 120;
let chest2 = 85;
let chest3 = 45;

// Calculate total gold
let total = chest1 + chest2 + chest3;

// Split it equally (use /)
let myShare = total / 2;

// Find the remainder (use %)
let remainder = total % 2;

// Log the results:
console.log("Total gold: " + total);

// Add a bonus of 10 to myShare using +=
// Then log: "With bonus: " + myShare
`,
        hints: [
            '💡 Use += to add 10 to myShare: myShare += 10;',
            '💡 Log "With bonus: " + myShare after the += line.',
            '💡 Also log "My share: " + myShare and "Leftover: " + remainder.',
        ],
        validate: (logs: string[]) => logs.length >= 4,
        winMessage: '💰 Gold clinked! Your share is secured!',
        xpReward: 100,
        gemReward: 2,
        warriorAnimation: 'collect',
        worldTheme: 'forest',
        enemies: [],
    },
    {
        id: '1-5',
        world: 1,
        level: 5,
        title: 'The Elder\'s Scroll',
        worldName: 'The Awakening Forest',
        concept: 'Template Literals & String Methods',
        story: 'The Elder\'s scroll is sealed with a magic word. Decode it using string methods, then open the door with the exact spell!',
        objective: 'Use template literals, .trim(), .toUpperCase(), and unlockDoor() with the correct string.',
        starterCode: `let title = "Dark";
let enemy = "Goblin";
let count = 3;

// Old way (concatenation):
console.log("Beware the " + count + " " + title + " " + enemy + "s!");

// Modern way (template literal):
console.log(\`Beware the \${count} \${title} \${enemy}s!\`);

// Now decode the door spell:
let spell = "  open sesame  ";
console.log(spell.trim());               // remove spaces
console.log(spell.trim().length);        // character count
console.log(spell.trim().toUpperCase()); // uppercase

// Unlock the door (must be trimmed + uppercased):
// unlockDoor(spell.trim().toUpperCase());
`,
        hints: [
            '💡 Template literals use backticks ` ` and ${variable} for embedding values.',
            '💡 .trim() removes whitespace. .toUpperCase() converts to caps.',
            '💡 Uncomment the unlockDoor() line at the bottom to open the door!',
        ],
        validate: (logs: string[]) => logs.some(l => l.includes('OPEN SESAME')),
        winMessage: '🔮 The runes glow! The Elder\'s door swings open!',
        xpReward: 150,
        gemReward: 3,
        warriorAnimation: 'magic',
        worldTheme: 'forest',
        enemies: [{ name: 'Forest Sprite', sprite: '🧚', health: 30 }],
    },
];

export const ALL_LEVELS: LevelConfig[] = [
    ...WORLD1_LEVELS,
];
