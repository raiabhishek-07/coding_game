import { LevelConfig } from './types';

export const WORLD5_LEVELS: LevelConfig[] = [
    {
        id: '5-1',
        world: 5,
        level: 22,
        title: 'Forging the Warrior Class',
        worldName: 'The Inferno Keep',
        concept: 'Classes & Constructor',
        story: 'The Inferno Keep\'s blacksmith teaches you the ultimate skill — forging warriors from a CLASS blueprint! Every warrior is an instance, built with a constructor and equipped with methods.',
        objective: 'Create a Warrior class with constructor, describe() method, and takeDamage() method. Create an instance.',
        starterCode: `class Warrior {
  constructor(name, health, attack) {
    this.name = name;
    this.health = health;
    this.attack = attack;
  }
  
  describe() {
    return this.name + " — HP: " + this.health + ", ATK: " + this.attack;
  }
  
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      console.log(this.name + " has fallen!");
    } else {
      console.log(this.name + " took " + amount + " damage. HP left: " + this.health);
    }
  }
}

// Create a warrior instance:
const hero = new Warrior("Kael", 100, 75);
console.log(hero.describe());

hero.takeDamage(30);
hero.takeDamage(80);
console.log("Final HP:", hero.health);
`,
        hints: [
            '💡 class defines a blueprint. new ClassName() creates an instance from that blueprint.',
            '💡 constructor() runs automatically when you use new. Use this.prop to set properties.',
            '💡 Methods inside a class are functions that can use this to access the instance\'s properties.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Kael')) && logs.some(l => l.includes('fallen') || l.includes('damage')),
        winMessage: 'The forge roars! Your warrior class is forged in fire!',
        xpReward: 180,
        gemReward: 3,
        warriorAnimation: 'fight',
        worldTheme: 'inferno',
        enemies: [{ name: 'Lava Troll', sprite: '🧌', health: 100 }],
    },
    {
        id: '5-2',
        world: 5,
        level: 23,
        title: 'The Bloodline',
        worldName: 'The Inferno Keep',
        concept: 'Class Inheritance & super',
        story: 'A Mage is a special kind of Warrior with magical powers. Instead of rewriting everything, EXTEND the Warrior class! Use super() to inherit powers and override methods.',
        objective: 'Create a Mage class extending Warrior. Use super(), add mana property, override describe(), add castSpell().',
        starterCode: `class Warrior {
  constructor(name, health, attack) {
    this.name = name;
    this.health = health;
    this.attack = attack;
  }
  describe() {
    return this.name + " ATK:" + this.attack + " HP:" + this.health;
  }
}

class Mage extends Warrior {
  constructor(name, health, attack, mana) {
    super(name, health, attack); // call parent constructor!
    this.mana = mana;
  }
  
  castSpell(spell) {
    if (this.mana >= 20) {
      this.mana -= 20;
      console.log(this.name + " casts " + spell + "! Mana left: " + this.mana);
    } else {
      console.log("Not enough mana!");
    }
  }
  
  // Override parent's describe:
  describe() {
    return super.describe() + " Mana:" + this.mana;
  }
}

const mage = new Mage("Lyra", 80, 40, 100);
mage.castSpell("Fireball");
mage.castSpell("Ice Storm");
console.log(mage.describe());
console.log("Is Warrior?", mage instanceof Warrior);
`,
        hints: [
            '💡 extends makes a class inherit everything from another class.',
            '💡 super() inside constructor calls the parent class constructor — MUST be first.',
            '💡 super.methodName() calls the parent\'s version of a method.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Fireball')) && logs.some(l => l.includes('Lyra')) && logs.some(l => l.includes('true')),
        winMessage: 'Magic flows through the bloodline! Inheritance mastered!',
        xpReward: 190,
        gemReward: 3,
        warriorAnimation: 'magic',
        worldTheme: 'inferno',
        enemies: [{ name: 'Fire Drake', sprite: '🐲', health: 110 }],
    },
    {
        id: '5-3',
        world: 5,
        level: 24,
        title: 'The Cursed Code',
        worldName: 'The Inferno Keep',
        concept: 'Error Handling — try/catch/finally/throw',
        story: 'A cursed door crashes the whole system if opened wrongly. Wrap your code in try/catch to catch errors before they kill the warrior. throw your own errors for invalid input!',
        objective: 'Use try/catch/finally and throw to handle errors gracefully.',
        starterCode: `function openDoor(code) {
  if (typeof code !== "number") {
    throw new TypeError("Code must be a number!");
  }
  if (code !== 1234) {
    throw new Error("Wrong code! Door sealed.");
  }
  return "Door opened!";
}

// Test with wrong TYPE:
try {
  let result = openDoor("abc");
  console.log(result);
} catch (error) {
  console.log("Caught TypeError:", error.message);
} finally {
  console.log("Attempt 1 logged."); // ALWAYS runs
}

// Test with wrong code:
try {
  let result = openDoor(9999);
  console.log(result);
} catch (error) {
  console.log("Caught Error:", error.message);
}

// Test with correct code:
try {
  let result = openDoor(1234);
  console.log(result);
} catch (error) {
  console.log("Error:", error.message);
}
`,
        hints: [
            '💡 try { } wraps code that might throw. catch(e) { } handles the error if one occurs.',
            '💡 finally { } always runs — use it for cleanup like closing files or logging.',
            '💡 throw new Error("message") creates and throws an error manually.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Caught') || l.includes('caught')) && logs.some(l => l.includes('Door opened')),
        winMessage: 'The curse is contained! Error handling saves the day!',
        xpReward: 190,
        gemReward: 3,
        warriorAnimation: 'magic',
        worldTheme: 'inferno',
        enemies: [{ name: 'Cursed Knight', sprite: '⚔️', health: 100 }],
    },
    {
        id: '5-4',
        world: 5,
        level: 25,
        title: 'The Crystal Oracle',
        worldName: 'The Inferno Keep',
        concept: 'Promises — new Promise, .then(), .catch()',
        story: 'The Crystal Oracle takes 2 seconds to answer. She doesn\'t freeze time — she gives you a PROMISE that an answer is coming. Chain .then() calls to react when she\'s ready!',
        objective: 'Create a Promise, resolve/reject it, and chain .then() and .catch().',
        starterCode: `function consultOracle(question) {
  return new Promise((resolve, reject) => {
    if (question.length > 0) {
      // Simulate async delay with setTimeout:
      setTimeout(() => {
        resolve("The path lies East");
      }, 500); // 500ms for demo (normally 2000ms)
    } else {
      reject("Empty question — oracle is insulted!");
    }
  });
}

// Chain .then() and .catch():
consultOracle("Which way to the boss?")
  .then(answer => {
    console.log("Oracle says:", answer);
    return "Warrior heads East!";
  })
  .then(action => {
    console.log(action);
  })
  .catch(err => {
    console.log("Error:", err);
  });

// Test the reject path:
consultOracle("")
  .then(answer => console.log(answer))
  .catch(err => console.log("Caught rejection:", err));
`,
        hints: [
            '💡 new Promise((resolve, reject) => {}) creates a promise. Call resolve(value) for success.',
            '💡 .then(fn) runs when the promise resolves. .catch(fn) runs when it rejects.',
            '💡 .then() returns a new promise, so you can chain multiple .then() calls!',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('East') || l.includes('oracle')),
        winMessage: 'The Oracle\'s crystal ball shines with answers!',
        xpReward: 200,
        gemReward: 3,
        warriorAnimation: 'magic',
        worldTheme: 'inferno',
        enemies: [],
    },
    {
        id: '5-5',
        world: 5,
        level: 26,
        title: 'The Drawbridge of Time',
        worldName: 'The Inferno Keep',
        concept: 'Async / Await',
        story: 'Two giant drawbridges must lower in order — not at the same time! await makes code WAIT for a Promise before continuing. Write async functions that move sequentially.',
        objective: 'Write an async function using await to sequence two bridge lowerings before crossing.',
        starterCode: `async function crossMoat() {
  console.log("Starting crossing sequence...");
  
  // await pauses until lowerBridge resolves:
  await lowerBridge("Bridge 1", 500);
  console.log("Crossing Bridge 1...");
  
  await lowerBridge("Bridge 2", 300);
  console.log("Crossing Bridge 2...");
  
  console.log("Moat crossed! Boss arena ahead.");
  return "success";
}

// async functions always return a Promise:
crossMoat()
  .then(result => console.log("Result:", result))
  .catch(err => console.log("Failed:", err));

// Async + try/catch (cleaner error handling):
async function safeAction() {
  try {
    await lowerBridge("Secret Bridge", 200);
    console.log("Secret crossing complete!");
  } catch(error) {
    console.log("Bridge failed:", error.message);
  }
}

safeAction();
`,
        hints: [
            '💡 async before a function makes it return a Promise automatically.',
            '💡 await pauses the function until the Promise resolves, then resumes with the value.',
            '💡 Use try/catch inside async functions to handle errors — same as .catch() on Promises.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Bridge 1')) && logs.some(l => l.includes('Bridge 2')),
        winMessage: 'Both bridges lower in perfect sequence! Async mastery achieved!',
        xpReward: 210,
        gemReward: 4,
        warriorAnimation: 'walk',
        worldTheme: 'inferno',
        enemies: [{ name: 'Lava Colossus', sprite: '🌋', health: 130 }],
    },
];

export const WORLD6_LEVELS: LevelConfig[] = [
    {
        id: '6-1',
        world: 6,
        level: 28,
        title: 'The Labyrinth of Logic',
        worldName: 'The Shadow Realm',
        concept: 'Algorithms — Loops, Arrays, Objects Combined',
        story: 'The Shadow Realm\'s labyrinth is a 2D grid. Navigate it using nested loops and arrays. Find the treasure hidden in the grid by checking each cell!',
        objective: 'Use nested for loops to search a 2D grid array. Find the treasure position and report it.',
        starterCode: `const labyrinth = [
  ["wall",  "path", "wall",  "wall"],
  ["path",  "path", "path",  "wall"],
  ["wall",  "wall", "path",  "wall"],
  ["wall",  "path", "path", "treasure"],
];

let found = false;
let treasureRow = -1;
let treasureCol = -1;

// Search each row and column:
for (let row = 0; row < labyrinth.length; row++) {
  for (let col = 0; col < labyrinth[row].length; col++) {
    if (labyrinth[row][col] === "treasure") {
      found = true;
      treasureRow = row;
      treasureCol = col;
    }
  }
}

if (found) {
  console.log("Treasure found at row " + treasureRow + ", col " + treasureCol);
  console.log("Navigating to treasure...");
} else {
  console.log("No treasure found!");
}

console.log("Labyrinth explored!");
`,
        hints: [
            '💡 A 2D array is an array of arrays. Access with array[row][col].',
            '💡 Nested for loops: outer loop for rows, inner loop for columns.',
            '💡 Use flag variables (found = false) to track if you found something.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Treasure found') || l.includes('treasure found')) && logs.some(l => l.includes('explored')),
        winMessage: 'The labyrinth is cracked! The warrior finds the hidden passage!',
        xpReward: 220,
        gemReward: 4,
        warriorAnimation: 'walk',
        worldTheme: 'shadow',
        enemies: [{ name: 'Shadow Spider', sprite: '🕷️', health: 100 }],
    },
    {
        id: '6-2',
        world: 6,
        level: 29,
        title: 'The Mirror Mage',
        worldName: 'The Shadow Realm',
        concept: 'Classes + Async + Error Handling Combined',
        story: 'The Mirror Mage fights using your own skills against you! Build a BattleSystem class with async combat rounds and error handling. Defeat three rounds to win!',
        objective: 'Create a BattleSystem class with async fight() method. Handle thrown errors mid-battle.',
        starterCode: `class BattleSystem {
  constructor(playerHP, enemyHP) {
    this.playerHP = playerHP;
    this.enemyHP = enemyHP;
    this.round = 0;
  }
  
  async fight(playerAttack, enemyAttack) {
    this.round++;
    if (playerAttack <= 0) {
      throw new Error("Invalid attack value!");
    }
    
    this.enemyHP -= playerAttack;
    this.playerHP -= enemyAttack;
    
    await new Promise(r => setTimeout(r, 100));
    
    console.log("Round " + this.round + ": Enemy HP=" + this.enemyHP + " Player HP=" + this.playerHP);
    
    if (this.enemyHP <= 0) return "player wins";
    if (this.playerHP <= 0) return "enemy wins";
    return "ongoing";
  }
}

async function runBattle() {
  const battle = new BattleSystem(100, 120);
  
  try {
    let result = await battle.fight(45, 20);
    console.log("After round 1:", result);
    
    result = await battle.fight(50, 15);
    console.log("After round 2:", result);
    
    result = await battle.fight(40, 10);
    console.log("After round 3:", result);
    
    console.log("Battle complete!");
  } catch(error) {
    console.log("Battle error:", error.message);
  }
}

runBattle();
`,
        hints: [
            '💡 Combine class, async/await, and try/catch — they all work together naturally.',
            '💡 async methods in a class work just like regular async functions.',
            '💡 throw inside an async function causes the returned Promise to reject.',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Round')) && logs.some(l => l.includes('complete') || l.includes('wins')),
        winMessage: 'The Mirror Mage shatters! Your skills surpass his reflection!',
        xpReward: 240,
        gemReward: 4,
        warriorAnimation: 'fight',
        worldTheme: 'shadow',
        enemies: [{ name: 'Mirror Mage', sprite: '🪞', health: 120 }],
    },
    {
        id: '6-3',
        world: 6,
        level: 30,
        title: 'The Shadow King',
        worldName: 'The Shadow Realm',
        concept: 'FINAL BOSS — All Concepts Combined',
        story: 'The Shadow King awaits! He has 3 phases. Use EVERYTHING you know: objects, array methods, async/await, classes, error handling. This is your moment!',
        objective: 'Complete all 3 phases: set up warrior object, filter the shadow army, then defeat the king async.',
        starterCode: `// ⚔️ PHASE 1: Build your warrior (Objects)
const hero = {
  name: "CodeHero",
  attack: 100,
  health: 200,
  ultimate: "Code Storm"
};
console.log("Phase 1: " + hero.name + " ready!");

// 🧟 PHASE 2: Filter the shadow army (Array Methods)
const army = [
  { name: "Wraith",  type: "vulnerable", power: 30 },
  { name: "Knight",  type: "armored",    power: 80 },
  { name: "Specter", type: "vulnerable", power: 25 },
  { name: "Titan",   type: "armored",    power: 95 },
];

const weaklings = army.filter(e => e.type === "vulnerable");
const powerTotal = weaklings.map(e => e.power).reduce((a, b) => a + b, 0);
console.log("Phase 2: Defeated " + weaklings.length + " weaklings, " + powerTotal + " power absorbed!");

// 👁️ PHASE 3: Defeat the Shadow King (Async + Error handling)
async function defeat() {
  try {
    console.log("Phase 3: Charging ultimate - " + hero.ultimate + "!");
    await chargeUltimate(300);
    
    if (hero.attack > shadowKing.defense) {
      ultimateStrike();
      console.log("THE SHADOW KING IS DEFEATED!");
      console.log("🏆 CONGRATULATIONS! JavaScript Mastery Achieved!");
    } else {
      throw new Error("Not strong enough!");
    }
  } catch(e) {
    console.log("Error:", e.message);
  }
}

defeat();
`,
        hints: [
            '💡 Phase 1: Make sure the hero object has all 4 properties and log it.',
            '💡 Phase 2: Use .filter() for "vulnerable" type, .map() for powers, .reduce() for sum.',
            '💡 Phase 3: The async defeat() function awaits chargeUltimate and calls ultimateStrike().',
        ],
        validate: (logs: string[]) =>
            logs.some(l => l.includes('Phase 1')) &&
            logs.some(l => l.includes('Phase 2')) &&
            logs.some(l => l.includes('DEFEATED') || l.includes('Mastery')),
        winMessage: '🏆 THE SHADOW KING FALLS! You have mastered JavaScript!',
        xpReward: 500,
        gemReward: 10,
        warriorAnimation: 'celebrate',
        worldTheme: 'shadow',
        enemies: [{ name: 'The Shadow King', sprite: '👁️', health: 200 }],
    },
];
