/**
 * Sandboxed code runner using Function constructor.
 * Intercepts console.log and provides game API stubs.
 */

export interface RunResult {
  logs: string[];
  error: string | null;
  returnValue?: unknown;
}

/** Wrap any promise with a timeout — rejects after ms milliseconds */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

export function runCode(userCode: string): Promise<RunResult> {
  const execution = new Promise<RunResult>((resolve) => {
    try {
      const __logs: string[] = [];

      const __console = {
        log: (...args: unknown[]) => {
          __logs.push(
            args.map((a) => {
              if (typeof a === 'object' && a !== null) {
                try { return JSON.stringify(a, null, 2); } catch { return String(a); }
              }
              return String(a);
            }).join(' ')
          );
        },
        error: (...args: unknown[]) => __logs.push('[ERROR] ' + args.join(' ')),
        warn: (...args: unknown[]) => __logs.push('[WARN] ' + args.join(' ')),
        info: (...args: unknown[]) => __logs.push('[INFO] ' + args.join(' ')),
      };

      // Game API stubs — each logs an action to the console
      const move = (dir: string, steps: number) =>
        __console.log('🏃 Warrior moved ' + dir + ' by ' + steps + ' steps');

      const fight = (enemy: { name?: string } | string) =>
        __console.log('⚔️ Fighting ' + (typeof enemy === 'object' ? enemy?.name : enemy) + '!');

      const collect = (items: string[] | string) =>
        __console.log('💎 Collected: ' + (Array.isArray(items) ? items.join(', ') : items));

      const unlockDoor = (code: string) =>
        __console.log('🚪 Unlocking door with: ' + code);

      const buy = (item: string, cost: number) =>
        __console.log('🛒 Bought ' + item + ' for ' + cost + ' gold');

      const train = (n: number) =>
        __console.log('🏋️ Trained at station ' + n);

      const climbStair = () =>
        __console.log('🪜 Climbed a stair');

      const repairPlank = (i: number) =>
        __console.log('🪵 Plank ' + (i + 1) + ' repaired ✅');

      const strike = () => __console.log('⚔️ STRIKE! Hit the enemy!');
      const dodge = () => __console.log('💨 Dodged the attack!');

      const equip = (stats: object) =>
        __console.log('🛡️ Equipped: ' + JSON.stringify(stats));

      const fightAll = (enemies: { strength: number }[], xp: number[]) =>
        __console.log(
          '⚔️ Fighting ' + enemies.length + ' enemies for ' +
          (xp ? xp.reduce((a: number, b: number) => a + b, 0) : 0) + ' XP'
        );

      const dealDamage = (n: number) =>
        __console.log('💥 Dealt ' + n + ' damage!');

      const applyDamage = (n: number) =>
        __console.log('💢 Applied ' + n + ' damage to enemy!');

      const takePath = (p: string) =>
        __console.log('🗺️ Warrior takes the ' + p + '!');

      const fireArrow = () =>
        __console.log('🏹 Arrow fired! Enemy defeated!');

      const castSpell = (s: string) =>
        __console.log('✨ Casting: ' + s + '!');

      const knockOnDoor = () =>
        __console.log('🚪 Knocked on the door...');

      const isDoorLocked = () => false;

      const lowerBridge = (name: string, delay: number) =>
        new Promise<void>((res) => setTimeout(() => {
          __console.log(name + ' is down!');
          res();
        }, Math.min(delay, 500))); // cap at 500ms in game

      // Warrior object for object/class levels
      const warrior = {
        name: 'Kael', health: 100, attack: 75, speed: 50,
        weapon: 'Greatsword', shield: '',
        walk: (dir: string, steps: number) =>
          __console.log('🚶 Walking ' + dir + ' x' + steps),
        cross: (bridge: string) =>
          __console.log('🌉 Crossing ' + bridge),
      };

      // Goblin object
      const goblin = { name: 'Goblin', defense: 30, health: 50 };

      // Pressure plate
      const pressurePlate = { onActivate: null as (() => void) | null };
      setTimeout(() => { if (pressurePlate.onActivate) pressurePlate.onActivate(); }, 200);

      // Shadow king
      const shadowKing = { defense: 80 };
      const shadowArmy = [
        { name: 'Wraith', type: 'vulnerable', strength: 30 },
        { name: 'Shadow Knight', type: 'armored', strength: 80 },
        { name: 'Specter', type: 'vulnerable', strength: 25 },
      ];
      const ultimateStrike = () => __console.log('⚡ ULTIMATE STRIKE! Shadow King defeated!');
      const chargeUltimate = (ms: number) =>
        new Promise<void>((res) => setTimeout(() => { __console.log('⚡ Ultimate charged!'); res(); }, Math.min(ms, 500)));

      const fireGate = (name: string) =>
        new Promise<string>((res) => setTimeout(() => res(name + ' opened'), 200));
      const openGate = fireGate;

      // Override console for user code
      const console = __console;

      // Run user code via Function constructor (sandboxed scope)
      const fn = new Function(
        'console', 'move', 'fight', 'collect', 'unlockDoor', 'buy', 'train',
        'climbStair', 'repairPlank', 'strike', 'dodge', 'equip', 'fightAll',
        'dealDamage', 'applyDamage', 'takePath', 'fireArrow', 'castSpell',
        'knockOnDoor', 'isDoorLocked', 'lowerBridge', 'warrior', 'goblin',
        'pressurePlate', 'shadowKing', 'shadowArmy', 'ultimateStrike',
        'chargeUltimate', 'openGate',
        '"use strict";\n' + userCode
      );

      const returnValue = fn(
        console, move, fight, collect, unlockDoor, buy, train,
        climbStair, repairPlank, strike, dodge, equip, fightAll,
        dealDamage, applyDamage, takePath, fireArrow, castSpell,
        knockOnDoor, isDoorLocked, lowerBridge, warrior, goblin,
        pressurePlate, shadowKing, shadowArmy, ultimateStrike,
        chargeUltimate, openGate
      );

      // If result is a Promise (async code), wait for it
      if (returnValue && typeof returnValue.then === 'function') {
        returnValue
          .then(() => resolve({ logs: __logs, error: null }))
          .catch((e: Error) => {
            __logs.push('[ERROR] ' + e.message);
            resolve({ logs: __logs, error: e.message });
          });
      } else {
        resolve({ logs: __logs, error: null });
      }


    } catch (e) {
      const msg = (e as Error).message || 'Unknown error';
      resolve({ logs: [], error: msg });
    }
  });

  // Race execution against a 5-second infinite-loop timeout
  return withTimeout(
    execution,
    5000,
    '⏱️ Code timed out after 5 seconds — check for infinite loops!'
  ).catch((e: Error) => ({ logs: [], error: e.message } as RunResult));
}
