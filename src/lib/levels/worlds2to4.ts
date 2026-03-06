import { LevelConfig } from './types';

export const WORLD2_LEVELS: LevelConfig[] = [
    {
        id: '2-1',
        world: 2,
        level: 6,
        title: 'The Gatekeeper',
        worldName: 'Village of Logic',
        concept: 'Comparison & Logical Operators',
        story: 'A stern gatekeeper blocks the village entrance. The gate opens ONLY if the warrior meets ALL three entry conditions. Use comparison and logical operators to check!',
        objective: 'Use &&, ||, >=, <, ===, !== to evaluate canEnter and log it. Also demonstrate == vs ===.',
        starterCode: `let age = 18;
let hasPass = true;
let threatLevel = 2;

// Check if warrior can enter (ALL must be true):
// age must be >= 18, hasPass must be true, threatLevel < 5
let canEnter = age >= 18 && hasPass && threatLevel < 5;
console.log("Can enter:", canEnter); // true

// Comparison operators demo:
console.log(5 == "5");    // true  (loose — avoid!)
console.log(5 === "5");   // false (strict — always use this)
console.log(5 !== 3);     // true
console.log(10 > 5);      // true

// Open the gate if canEnter is true:
if (canEnter) {
  console.log("Gate opens! Welcome, warrior.");
} else {
  console.log("Access denied!");
}
`,
        hints: [
            '💡 && means AND — all conditions must be true. || means OR — at least one must be true.',
            '💡 Use >= for "greater than or equal". Use < for "less than". These return true or false.',
            '💡 Always prefer === (strict equality) over == (loose). 5 === "5" is false because types differ.',
        ],
        validate: (logs: string[]) => logs.some(l => l.includes('true')) && logs.some(l => l.includes('Gate opens')),
        winMessage: 'The gate clangs open! The village welcomes you!',
        xpReward: 100,
        gemReward: 2,
        warriorAnimation: 'walk',
        worldTheme: 'village',
        enemies: [{ name: 'Gatekeeper', sprite: '💂', health: 50 }],
    },
    {
        id: '2-2',
        world: 2,
        level: 7,
        title: 'Fork in the Road',
        worldName: 'Village of Logic',
        concept: 'If / Else If / Else',
        story: 'Three roads ahead! The warrior\'s strength determines which path he takes. Write if/else if/else logic to pick the right road based on the hidden strength value.',
        objective: 'Use if / else if / else to call takePath() with the correct road based on warrior strength.',
        starterCode: `// The warrior's strength determines the path
let strength = 75; // try different values!

// Northern road: strength >= 80 (shortcut)
// Middle road:   strength >= 50 (safe path)
// Southern road: anything else (long route)

if (strength >= 80) {
  takePath("northern road");
  console.log("Taking the shortcut!");
} else if (strength >= 50) {
  takePath("middle road");
  console.log("Taking the safe path.");
} else {
  takePath("southern road");
  console.log("The long way around...");
}

console.log("Strength was:", strength);
`,
        hints: [
            '💡 if runs only when the condition is true. else if checks another condition. else is the fallback.',
            '💡 Order matters! Check the highest condition first (>= 80), then the next (>= 50).',
            '💡 Try changing strength to 90, 60, and 30 to see all three paths!',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('northern') || l.includes('safe') || l.includes('long')),
        winMessage: 'The warrior strides confidently down the chosen road!',
        xpReward: 100,
        gemReward: 2,
        warriorAnimation: 'walk',
        worldTheme: 'village',
        enemies: [],
    },
    {
        id: '2-3',
        world: 2,
        level: 8,
        title: 'The Market Merchant',
        worldName: 'Village of Logic',
        concept: 'Switch Statement',
        story: 'The village merchant sells items but needs specific instructions. Use a switch statement to buy the right item — and watch out for "break" or you\'ll buy everything!',
        objective: 'Use switch/case/break/default to buy the correct item based on the item variable.',
        starterCode: `let item = "shield"; // try: "sword", "potion", "map"

switch (item) {
  case "sword":
    buy("Iron Sword", 30);
    console.log("Bought a sword!");
    break;
  case "shield":
    buy("Oak Shield", 20);
    console.log("Bought a shield!");
    break;
  case "potion":
    buy("Health Potion", 10);
    console.log("Bought a potion!");
    break;
  default:
    console.log("Item not found: " + item);
}

// Without break, code "falls through" to the next case!
// That's why break is important.
console.log("Shopping done!");
`,
        hints: [
            '💡 switch(value) matches the value against each case. When it matches, that block runs.',
            '💡 break stops execution — without it, code falls into the next case (fallthrough).',
            '💡 default runs when no case matches — like an else for switch.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Bought') || l.includes('not found')) && logs.some(l => l.includes('Shopping done')),
        winMessage: 'The merchant hands over the goods. Smart shopping!',
        xpReward: 100,
        gemReward: 2,
        warriorAnimation: 'collect',
        worldTheme: 'village',
        enemies: [],
    },
    {
        id: '2-4',
        world: 2,
        level: 9,
        title: 'The Haunted Staircase',
        worldName: 'Village of Logic',
        concept: 'While Loop & Do-While',
        story: 'The haunted inn has 8 floors. The warrior must climb one stair at a time using a while loop. The lights flicker with each step — can he make it to the top?',
        objective: 'Use while to climb from floor 0 to floor 8, logging each floor. Then use do-while to knock at least once.',
        starterCode: `let floor = 0;

// Climb until reaching floor 8
while (floor < 8) {
  climbStair();
  floor++;
  console.log("Reached floor: " + floor);
}
console.log("Made it to the top!");

// do-while always runs at least ONCE
// even if condition is already false
let knocked = 0;
do {
  console.log("Knock knock...");
  knocked++;
} while (knocked < 2);
`,
        hints: [
            '💡 while(condition) keeps looping as long as condition is true. Make sure it eventually becomes false!',
            '💡 floor++ is short for floor = floor + 1. It increments by 1 each loop.',
            '💡 do { } while(condition) always runs the body at least once, then checks the condition.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('floor: 8') || l.includes('top')) && logs.some(l => l.includes('Knock')),
        winMessage: 'The warrior reaches the top floor! The ghost flees!',
        xpReward: 120,
        gemReward: 2,
        warriorAnimation: 'walk',
        worldTheme: 'village',
        enemies: [{ name: 'Ghost', sprite: '👻', health: 40 }],
    },
    {
        id: '2-5',
        world: 2,
        level: 10,
        title: 'The Training Gauntlet',
        worldName: 'Village of Logic',
        concept: 'For Loop, For..of, Break & Continue',
        story: 'The royal training gauntlet! 10 stations await. Station 4 is broken (skip it). Stop at station 8 when the warrior gets hurt. Then practice with each weapon in the arsenal.',
        objective: 'Use for loop with break and continue correctly, then use for...of on a weapons array.',
        starterCode: `// Train at stations 1-10, skip 4, stop at 8
for (let i = 1; i <= 10; i++) {
  if (i === 4) {
    console.log("Station 4 broken, skipping...");
    continue; // skip to next iteration
  }
  if (i === 8) {
    console.log("Injured at station 8! Stopping.");
    break; // exit the loop entirely
  }
  train(i);
  console.log("Completed station " + i);
}

// for...of loops over each item in an array
const weapons = ["sword", "bow", "spear", "dagger"];
console.log("--- Weapon Practice ---");
for (let weapon of weapons) {
  console.log("Practicing: " + weapon);
}
`,
        hints: [
            '💡 continue skips the rest of the current iteration and goes to the next one.',
            '💡 break exits the entire loop immediately.',
            '💡 for...of is the cleanest way to loop over arrays — no index needed!',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('skip')) &&
            logs.some(l => l.includes('Injured')) &&
            logs.some(l => l.includes('sword')),
        winMessage: 'Training complete! The warrior\'s skills sharpen!',
        xpReward: 150,
        gemReward: 3,
        warriorAnimation: 'fight',
        worldTheme: 'village',
        enemies: [{ name: 'Training Dummy', sprite: '🪆', health: 60 }],
    },
];

export const WORLD3_LEVELS: LevelConfig[] = [
    {
        id: '3-1',
        world: 3,
        level: 11,
        title: 'The First Spell',
        worldName: 'The Mage Tower',
        concept: 'Function Declaration & Calling',
        story: 'You reach the Mage Tower. The head mage reveals the secret: "Spells only work if properly declared first!" Learn to define and call functions to cast your first magic.',
        objective: 'Declare a castSpell function with a parameter and call it twice with different spells.',
        starterCode: `// Declare a function that casts a spell
function castSpell(spellName) {
  console.log("Casting: " + spellName + "!");
  dealDamage(30);
}

// Call the function with different spells:
castSpell("Fireball");
castSpell("Ice Shard");

// Functions can call other functions:
function attackCombo() {
  castSpell("Lightning");
  castSpell("Thunder");
  console.log("Combo unleashed!");
}

attackCombo();
`,
        hints: [
            '💡 function name(param) { } defines the function. You must CALL it to run it.',
            '💡 Parameters are like variables inside the function — they get the value you pass in.',
            '💡 You can call the same function multiple times with different arguments!',
        ],
        validate: (logs: string[]) =>
            logs.filter(l => l.includes('Casting')).length >= 2,
        winMessage: 'Magical flames erupt! The mage nods with approval!',
        xpReward: 120,
        gemReward: 2,
        warriorAnimation: 'magic',
        worldTheme: 'tower',
        enemies: [{ name: 'Stone Golem', sprite: '🗿', health: 70 }],
    },
    {
        id: '3-2',
        world: 3,
        level: 12,
        title: 'The Return Scroll',
        worldName: 'The Mage Tower',
        concept: 'Return Values',
        story: 'The tower\'s magic orb only responds to functions that RETURN an answer. Void spells that return nothing are useless here — master the "return" keyword!',
        objective: 'Write functions that return values, store them in variables, and use them.',
        starterCode: `// A function that RETURNS a value
function calculateDamage(baseAttack, multiplier) {
  let damage = baseAttack * multiplier;
  return damage; // sends result back to caller
}

// Store the returned value:
let result = calculateDamage(20, 3);
console.log("Damage dealt: " + result);  // 60
applyDamage(result);

// Functions that return true/false are useful too:
function isStrongEnough(power) {
  return power >= 50;
}

let canFight = isStrongEnough(75);
console.log("Can fight:", canFight);  // true

if (isStrongEnough(30)) {
  console.log("Strong enough!");
} else {
  console.log("Need to train more!");
}
`,
        hints: [
            '💡 return sends a value back from the function to wherever it was called.',
            '💡 Without return, a function returns undefined by default.',
            '💡 Store the returned value: let result = myFunction();',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('60')) && logs.some(l => l.includes('true')),
        winMessage: 'The orb glows! Numbers float through the air!',
        xpReward: 120,
        gemReward: 2,
        warriorAnimation: 'magic',
        worldTheme: 'tower',
        enemies: [],
    },
    {
        id: '3-3',
        world: 3,
        level: 13,
        title: 'Shadow Functions',
        worldName: 'The Mage Tower',
        concept: 'Function Expressions & Arrow Functions',
        story: 'Three ancient mages each cast the same fireball — but in different ways! They prove that in JavaScript, there are three ways to write a function. All work the same!',
        objective: 'Write the same function as a declaration, function expression, and arrow function. Call all three.',
        starterCode: `// 1. Function Declaration (classic)
function greet1(name) {
  return "Hello, " + name + "!";
}

// 2. Function Expression (stored in a variable)
const greet2 = function(name) {
  return "Hello, " + name + "!";
};

// 3. Arrow Function (modern, shorter)
const greet3 = (name) => "Hello, " + name + "!";
// Arrow with one expression: no {} or return needed!

// Call all three:
console.log(greet1("Warrior"));
console.log(greet2("Warrior"));
console.log(greet3("Warrior"));

// Arrow functions with multiple lines:
const multiply = (a, b) => {
  let result = a * b;
  return result;
};
console.log("5 x 4 =", multiply(5, 4));
`,
        hints: [
            '💡 Arrow functions use => instead of function keyword.',
            '💡 Single expression arrows: (x) => x * 2 — no braces or return needed.',
            '💡 Multi-line arrows still need {} and an explicit return statement.',
        ],
        validate: (logs: string[]) =>
            logs.filter(l => l.includes('Hello')).length >= 3 && logs.some(l => l.includes('20')),
        winMessage: 'Three fireballs streak through the sky in perfect sync!',
        xpReward: 130,
        gemReward: 2,
        warriorAnimation: 'magic',
        worldTheme: 'tower',
        enemies: [{ name: 'Shadow Mage', sprite: '🧙', health: 65 }],
    },
    {
        id: '3-4',
        world: 3,
        level: 14,
        title: 'The Scope Maze',
        worldName: 'The Mage Tower',
        concept: 'Variable Scope — Global, Function, Block',
        story: 'The mage tower is a maze of rooms. Some variables can travel anywhere. Others are trapped in the room they were born in. Learn scope to navigate without crashing!',
        objective: 'Demonstrate global, function, and block scope. Show which variables are accessible where.',
        starterCode: `let globalPower = "Fire";  // accessible EVERYWHERE

function castMagic() {
  let localMana = 50;  // only inside this function
  console.log("Global:", globalPower);   // ✅ works
  console.log("Local mana:", localMana); // ✅ works
  
  // Block scope with let:
  if (true) {
    let blockGem = "Ruby";
    console.log("Block gem:", blockGem); // ✅ works inside block
  }
  // blockGem is gone here!
}

castMagic();
console.log("Outside - global:", globalPower); // ✅ works

// var is function-scoped (not block-scoped):
function varDemo() {
  if (true) {
    var oldStyle = "I leak out of blocks!";
  }
  console.log(oldStyle); // var leaks: prints the value
}
varDemo();

console.log("Scope demo complete!");
`,
        hints: [
            '💡 Variables declared outside functions are "global" — accessible everywhere.',
            '💡 let and const are block-scoped: they only live inside the {} they were declared in.',
            '💡 var is function-scoped — it leaks out of if/for blocks (that\'s why prefer let/const).',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Fire')) && logs.some(l => l.includes('50')) && logs.some(l => l.includes('complete')),
        winMessage: 'The scope maze is conquered! No crashes, no undefined errors!',
        xpReward: 140,
        gemReward: 2,
        warriorAnimation: 'walk',
        worldTheme: 'tower',
        enemies: [],
    },
    {
        id: '3-5',
        world: 3,
        level: 15,
        title: 'The Echo Chamber',
        worldName: 'The Mage Tower',
        concept: 'Closures & Default Parameters',
        story: 'The tower\'s echo chamber remembers every sound. It holds state between calls — this is a closure! Also learn to set default values so functions work even without all arguments.',
        objective: 'Use default parameters correctly. Create a closure counter that remembers its count between calls.',
        starterCode: `// DEFAULT PARAMETERS
function attack(target, damage = 10, element = "physical") {
  console.log("Attacking " + target + " with " + damage + " " + element + " damage!");
}

attack("Goblin");                       // uses defaults
attack("Dragon", 50, "fire");           // overrides defaults
attack("Troll", 25);                    // partial override

// CLOSURES: a function that remembers its outer scope
function createComboCounter() {
  let count = 0; // this stays alive in memory!
  
  return function() {
    count++;
    console.log("Combo x" + count + "!");
    return count;
  };
}

const combo = createComboCounter();
combo(); // Combo x1!
combo(); // Combo x2!
combo(); // Combo x3!

console.log("Closure demo complete!");
`,
        hints: [
            '💡 Default parameters: function foo(x = 10) means x is 10 if not passed.',
            '💡 A closure is created when an inner function "remembers" variables from its outer function.',
            '💡 count persists across combo() calls because the inner function closes over it.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Combo x3')) && logs.some(l => l.includes('Goblin')),
        winMessage: 'COMBO x3! The echo chamber rings with power!',
        xpReward: 160,
        gemReward: 3,
        warriorAnimation: 'fight',
        worldTheme: 'tower',
        enemies: [{ name: 'Mirror Mage', sprite: '🌀', health: 80 }],
    },
];

export const WORLD4_LEVELS: LevelConfig[] = [
    {
        id: '4-1',
        world: 4,
        level: 16,
        title: 'The Treasure Inventory',
        worldName: 'The Ancient Vault',
        concept: 'Arrays — Create, Access, Mutate',
        story: 'The vault keeper hands you a worn scroll listing 5 treasures. But the inventory is alive — items are added, removed, and rearranged. Master arrays to manage your loot!',
        objective: 'Create an array, access elements by index, use push/pop/shift/unshift and log the final result.',
        starterCode: `let inventory = ["sword", "shield", "potion", "rope", "torch"];

// Access by index (starts at 0):
console.log("First item:", inventory[0]);     // sword
console.log("Third item:", inventory[2]);     // potion
console.log("Total items:", inventory.length); // 5

// Add to end:
inventory.push("key");
console.log("After push:", inventory);

// Remove from end:
let removed = inventory.pop();
console.log("Removed:", removed);

// Add to front:
inventory.unshift("map");
console.log("After unshift:", inventory);

// Remove from front:
let first = inventory.shift();
console.log("Shifted out:", first);

console.log("Final inventory:", inventory);
`,
        hints: [
            '💡 Arrays are zero-indexed — first element is at index 0, last is at index length-1.',
            '💡 push() adds to end, pop() removes from end. unshift() adds to front, shift() removes from front.',
            '💡 .length gives you the number of elements in the array.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('sword')) && logs.some(l => l.includes('Final')),
        winMessage: 'The vault inventory is under control! Items gleam in the torchlight!',
        xpReward: 140,
        gemReward: 2,
        warriorAnimation: 'collect',
        worldTheme: 'vault',
        enemies: [],
    },
    {
        id: '4-2',
        world: 4,
        level: 17,
        title: 'Sorting the Army',
        worldName: 'The Ancient Vault',
        concept: 'Array Methods — filter, map, reduce, find',
        story: 'Six soldiers report for duty! Filter the elite (power >= 70), extract their names, calculate total power, and find the captain with highest power. Use array methods!',
        objective: 'Use .filter(), .map(), .reduce(), and .find() on an array of objects.',
        starterCode: `const soldiers = [
  { name: "Aria",  power: 85 },
  { name: "Brom",  power: 40 },
  { name: "Cara",  power: 92 },
  { name: "Dax",   power: 55 },
  { name: "Eli",   power: 78 },
  { name: "Fin",   power: 30 },
];

// Filter: only soldiers with power >= 70
const elite = soldiers.filter(s => s.power >= 70);
console.log("Elite count:", elite.length); // 3

// Map: extract just the names
const names = elite.map(s => s.name);
console.log("Elite warriors:", names.join(", "));

// Reduce: sum up total power
const totalPower = elite.reduce((sum, s) => sum + s.power, 0);
console.log("Total power:", totalPower);

// Find: first soldier with power === 92
const captain = soldiers.find(s => s.power === 92);
console.log("Captain:", captain.name);
`,
        hints: [
            '💡 .filter(fn) returns a NEW array with only elements where fn returns true.',
            '💡 .map(fn) transforms each element and returns a new array of the same length.',
            '💡 .reduce(fn, start) accumulates all elements into a single value. Start with 0 for sums.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('3')) && logs.some(l => l.includes('Cara')) && logs.some(l => l.includes('Cara')),
        winMessage: 'The elite squad assembled! Strategic mastery unlocked!',
        xpReward: 160,
        gemReward: 3,
        warriorAnimation: 'fight',
        worldTheme: 'vault',
        enemies: [{ name: 'Vault Guardian', sprite: '🐉', health: 90 }],
    },
    {
        id: '4-3',
        world: 4,
        level: 18,
        title: "The Warrior's Profile",
        worldName: 'The Ancient Vault',
        concept: 'Objects — Create, Access, Modify, Methods',
        story: 'The vault has a magical profile stone for every warrior. You must create your complete warrior object — stats, equipment, and even a greeting method that uses "this".',
        objective: 'Create an object with properties and a method using "this". Access with dot and bracket notation.',
        starterCode: `const warrior = {
  name: "Kael",
  health: 100,
  attack: 75,
  weapon: "Greatsword",
  // Method (function inside an object):
  greet: function() {
    return "I am " + this.name + ", wielding a " + this.weapon + "!";
  }
};

// Dot notation:
console.log(warrior.name);        // Kael
console.log(warrior.attack);      // 75

// Bracket notation (useful for dynamic keys):
let stat = "health";
console.log(warrior[stat]);       // 100

// Call the method:
console.log(warrior.greet());

// Modify a property:
warrior.health -= 20;
console.log("Health after hit:", warrior.health); // 80

// Add a new property dynamically:
warrior.shield = "Iron Shield";
console.log("Shield:", warrior.shield);
`,
        hints: [
            '💡 Objects store key-value pairs. Access with dot: obj.key or bracket: obj["key"].',
            '💡 Methods are functions stored as object properties. Use this.propertyName inside them.',
            '💡 You can add new properties to an object anytime: obj.newProp = value.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Kael')) && logs.some(l => l.includes('Greatsword')) && logs.some(l => l.includes('80')),
        winMessage: 'The profile stone glows! Your warrior identity is carved in stone!',
        xpReward: 150,
        gemReward: 2,
        warriorAnimation: 'celebrate',
        worldTheme: 'vault',
        enemies: [],
    },
    {
        id: '4-4',
        world: 4,
        level: 19,
        title: 'Unpacking the Vault',
        worldName: 'The Ancient Vault',
        concept: 'Destructuring — Array & Object',
        story: 'The ancient vault can only open when items are unpacked in the exact right order. Use destructuring to elegantly extract values from arrays and objects in one line!',
        objective: 'Use array destructuring (with skipping) and object destructuring (with defaults and rename).',
        starterCode: `// ARRAY DESTRUCTURING
const [gold, silver, bronze] = [500, 250, 100];
console.log("Gold:", gold);    // 500
console.log("Silver:", silver); // 250

// Skip values with commas:
const [first, , third] = ["sword", "bow", "dagger"];
console.log("First:", first, "Third:", third);

// OBJECT DESTRUCTURING
const warrior = { name: "Kael", attack: 75, health: 100 };

const { name, attack, health } = warrior;
console.log(name, attack, health);

// With default value (if property is missing):
const { shield = "No shield" } = warrior;
console.log("Shield:", shield); // No shield

// Rename while destructuring:
const { name: heroName } = warrior;
console.log("Hero:", heroName);
`,
        hints: [
            '💡 Array destructuring: const [a, b, c] = array — assigns by position.',
            '💡 Skip array elements with empty commas: const [a, , c] = array.',
            '💡 Object destructuring: const { key } = obj — assigns by name. Rename with key: newName.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('500')) && logs.some(l => l.includes('Kael')) && logs.some(l => l.includes('shield') || l.includes('Shield')),
        winMessage: 'The vault drawers fly open! Everything perfectly unpacked!',
        xpReward: 160,
        gemReward: 3,
        warriorAnimation: 'collect',
        worldTheme: 'vault',
        enemies: [],
    },
    {
        id: '4-5',
        world: 4,
        level: 20,
        title: 'The Clone Army',
        worldName: 'The Ancient Vault',
        concept: 'Spread Operator & Rest Parameters',
        story: 'The vault blacksmith can duplicate shields and merge squads with a magical clone rune (...). This is the spread operator! Rest parameters let a function accept any number of arguments.',
        objective: 'Use ... to spread arrays/objects, and rest parameters (...args) in a function.',
        starterCode: `// SPREAD: copy and merge arrays
const squad1 = ["Aria", "Brom"];
const squad2 = ["Cara", "Dax"];
const fullArmy = [...squad1, ...squad2, "Eli"];
console.log("Full army:", fullArmy.join(", "));

// SPREAD: copy object without mutation
const baseStats = { health: 100, attack: 50 };
const upgraded = { ...baseStats, attack: 80, speed: 60 };
console.log("Upgraded attack:", upgraded.attack); // 80
console.log("Base still:", baseStats.attack);      // 50 (unchanged!)

// REST PARAMETERS: accept any number of args
function sumDamage(first, second, ...rest) {
  let total = first + second;
  rest.forEach(d => { total += d; });
  return total;
}

console.log("Total damage:", sumDamage(10, 20, 30, 40)); // 100
console.log("Quick total:", sumDamage(5, 15));            // 20
`,
        hints: [
            '💡 ...arr spreads an array into individual elements. [...a, ...b] merges arrays.',
            '💡 {...obj} copies an object. {...obj, key: newVal} copies and overrides a property.',
            '💡 Rest params (...args) collects remaining arguments into an array.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Aria')) && logs.some(l => l.includes('100')) && logs.some(l => l.includes('50')),
        winMessage: 'The clone army stands ready! Spread power mastered!',
        xpReward: 170,
        gemReward: 3,
        warriorAnimation: 'celebrate',
        worldTheme: 'vault',
        enemies: [{ name: 'Clone Golem', sprite: '🪆', health: 85 }],
    },
];
