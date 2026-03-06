import { LevelConfig } from './types';

/** Level 21 — fills the gap between World 4 and World 5 */
export const LEVEL21: LevelConfig = {
    id: '4-6',
    world: 4,
    level: 21,
    title: 'The String Sorcerer',
    worldName: 'The Ancient Vault',
    concept: 'String Methods',
    story: 'Deep in the vault lies an ancient spell scroll encoded in strings. The String Sorcerer guards it — she only releases the treasures to those who master .toUpperCase(), .includes(), .split(), .slice(), and .replace()!',
    objective: 'Use string methods to decode, format, and transform a spell scroll. Log the final decoded message.',
    starterCode: `const scroll = "  fireball spell: summon flames and strike  ";

// trim() removes leading/trailing whitespace
let trimmed = scroll.trim();
console.log("Trimmed:", trimmed);

// toUpperCase() and toLowerCase()
console.log("UPPER:", trimmed.toUpperCase());
console.log("lower:", trimmed.toLowerCase());

// includes() — check if substring exists
console.log("Has 'flames':", trimmed.includes("flames")); // true

// split() — break string into array
let words = trimmed.split(" ");
console.log("Word count:", words.length);

// slice(start, end) — extract part of a string
let firstWord = trimmed.slice(0, 8);
console.log("First 8 chars:", firstWord);

// replace() — swap text
let updated = trimmed.replace("fireball", "LIGHTNING");
console.log("Updated spell:", updated);

// indexOf() — find position of substring
let pos = trimmed.indexOf("spell");
console.log("'spell' found at index:", pos);
`,
    hints: [
        '💡 .trim() removes spaces from both ends. .toUpperCase() / .toLowerCase() change case.',
        '💡 .includes("text") returns true/false. .split(" ") splits at spaces into an array.',
        '💡 .slice(start, end) extracts chars. .replace("old", "new") swaps the first match.',
    ],
    validate: (logs: string[]) =>
        logs.some(l => l.toUpperCase().includes('UPPER') || l.includes('LIGHTNING')) &&
        logs.some(l => l.includes('Word count')),
    winMessage: 'The scroll deciphered! String mastery unlocked the vault!',
    xpReward: 160,
    gemReward: 3,
    warriorAnimation: 'magic',
    worldTheme: 'vault',
    enemies: [{ name: 'String Sorcerer', sprite: '📜', health: 70 }],
};

/** Level 27 — fills the gap between World 5 and World 6 */
export const LEVEL27: LevelConfig = {
    id: '5-6',
    world: 5,
    level: 27,
    title: 'The Data Vault',
    worldName: 'The Inferno Keep',
    concept: 'JSON, Set & Map',
    story: 'The final chamber of the Inferno Keep holds three ancient artifacts: the JSON crystal (for data transport), the Set orb (no duplicates!), and the Map rune (key-value pairs with any key type). Master all three to open the final door.',
    objective: 'Use JSON.stringify/parse, create a Set to remove duplicates, and use a Map for key-value storage.',
    starterCode: `// JSON — serialize/deserialize data
const hero = { name: "Kael", level: 10, skills: ["slash", "dodge"] };
const json = JSON.stringify(hero);
console.log("JSON:", json);
const parsed = JSON.parse(json);
console.log("Parsed name:", parsed.name);
console.log("Parsed skills:", parsed.skills.join(", "));

// SET — unique values only (no duplicates)
const drops = ["gold", "gem", "gold", "gem", "potion", "gem"];
const uniqueDrops = new Set(drops);
console.log("Unique drops:", [...uniqueDrops].join(", "));
console.log("Unique count:", uniqueDrops.size);
uniqueDrops.add("rune");
console.log("Has gem:", uniqueDrops.has("gem")); // true

// MAP — key-value store (any key type, unlike plain objects)
const stats = new Map();
stats.set("strength", 85);
stats.set("agility", 70);
stats.set("magic", 95);

console.log("Strength:", stats.get("strength")); // 85
console.log("Has magic:", stats.has("magic"));   // true

// Loop over a map:
stats.forEach((value, key) => {
  console.log(key + ":", value);
});
`,
    hints: [
        '💡 JSON.stringify(obj) converts object to string. JSON.parse(str) converts back.',
        '💡 new Set(array) removes duplicates. Use [...set] to convert back to an array.',
        '💡 new Map() is like an object but with .set(key, val), .get(key), .has(key).',
    ],
    validate: (logs: string[]) =>
        logs.some(l => l.includes('JSON:')) &&
        logs.some(l => l.includes('Unique drops') || l.includes('unique')) &&
        logs.some(l => l.includes('Strength:') || l.includes('strength')),
    winMessage: 'The three artifacts glow! Data mastery opens the final door!',
    xpReward: 200,
    gemReward: 4,
    warriorAnimation: 'collect',
    worldTheme: 'inferno',
    enemies: [{ name: 'Data Sentinel', sprite: '🔮', health: 95 }],
};
