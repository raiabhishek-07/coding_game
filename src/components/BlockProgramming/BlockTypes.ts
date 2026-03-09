/**
 * Block Programming System Types
 * Defines all block categories and their visual properties
 */

// Re-export core action types for compatibility
export type ActionBlockType = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'WAIT' | 'PLAY_SOUND' | 'CHANGE_CHARACTER' | 'ATTACK' | 'SCAN' | 'COLLECT';

export type BlockCategory = 'movement' | 'control' | 'logic' | 'algorithm' | 'action';

export interface BlockDefinition {
  id: string;
  category: BlockCategory;
  label: string;
  icon: string;
  color: string;
  borderColor: string;
  params?: BlockParam[];
  connectable: 'top' | 'both' | 'bottom' | 'none';
  canNest: boolean;
  description: string;
}

export interface BlockParam {
  name: string;
  type: 'number' | 'string' | 'select' | 'enum';
  default: string | number;
  options?: Array<{ label: string; value: string | number }>;
}

export interface BlockInstance {
  id: string; // Unique instance ID
  blockType: string; // Reference to BlockDefinition
  params: Record<string, string | number>;
  children: BlockInstance[];
  parentId: string | null;
  x: number; // Position for serialization
  y: number;
}

// Block Category Definitions
export const BLOCK_CATEGORIES: Record<BlockCategory, { label: string; color: string; icon: string }> = {
  movement: { label: 'Movement', color: '#3498db', icon: '🎯' },
  control: { label: 'Control', color: '#f39c12', icon: '🔄' },
  logic: { label: 'Logic', color: '#9b59b6', icon: '🧠' },
  algorithm: { label: 'Algorithms', color: '#e74c3c', icon: '⚡' },
  action: { label: 'Actions', color: '#2ecc71', icon: '⭐' }
};

// All Available Blocks
export const BLOCK_LIBRARY: Record<string, BlockDefinition> = {
  // Movement Blocks
  moveUp: {
    id: 'moveUp',
    category: 'movement',
    label: 'Move Up',
    icon: '⬆️',
    color: '#3498db',
    borderColor: '#2980b9',
    connectable: 'both',
    canNest: true,
    description: 'Move the character up one cell'
  },
  moveDown: {
    id: 'moveDown',
    category: 'movement',
    label: 'Move Down',
    icon: '⬇️',
    color: '#3498db',
    borderColor: '#2980b9',
    connectable: 'both',
    canNest: true,
    description: 'Move the character down one cell'
  },
  moveLeft: {
    id: 'moveLeft',
    category: 'movement',
    label: 'Move Left',
    icon: '⬅️',
    color: '#3498db',
    borderColor: '#2980b9',
    connectable: 'both',
    canNest: true,
    description: 'Move the character left one cell'
  },
  moveRight: {
    id: 'moveRight',
    category: 'movement',
    label: 'Move Right',
    icon: '➡️',
    color: '#3498db',
    borderColor: '#2980b9',
    connectable: 'both',
    canNest: true,
    description: 'Move the character right one cell'
  },

  // Control Blocks
  repeat: {
    id: 'repeat',
    category: 'control',
    label: 'Repeat',
    icon: '🔄',
    color: '#f39c12',
    borderColor: '#d68910',
    params: [{ name: 'times', type: 'number', default: 2, options: undefined }],
    connectable: 'both',
    canNest: true,
    description: 'Repeat the blocks inside N times'
  },
  repeatForever: {
    id: 'repeatForever',
    category: 'control',
    label: 'Repeat Forever',
    icon: '♾️',
    color: '#f39c12',
    borderColor: '#d68910',
    connectable: 'top',
    canNest: true,
    description: 'Repeat blocks continuously'
  },
  wait: {
    id: 'wait',
    category: 'control',
    label: 'Wait',
    icon: '⏱️',
    color: '#f39c12',
    borderColor: '#d68910',
    params: [{ name: 'seconds', type: 'number', default: 1 }],
    connectable: 'both',
    canNest: true,
    description: 'Wait for N seconds'
  },

  // Logic Blocks
  ifThen: {
    id: 'ifThen',
    category: 'logic',
    label: 'If Then',
    icon: '❓',
    color: '#9b59b6',
    borderColor: '#8e44ad',
    params: [
      {
        name: 'condition', type: 'select', default: 'gemAhead', options: [
          { label: 'Gem Ahead', value: 'gemAhead' },
          { label: 'Wall Ahead', value: 'wallAhead' },
          { label: 'Can Move', value: 'canMove' },
          { label: 'Enemy Ahead', value: 'enemyAhead' }
        ]
      }
    ],
    connectable: 'both',
    canNest: true,
    description: 'Execute blocks if condition is true'
  },
  ifThenElse: {
    id: 'ifThenElse',
    category: 'logic',
    label: 'If Then Else',
    icon: '❓❗',
    color: '#9b59b6',
    borderColor: '#8e44ad',
    params: [
      {
        name: 'condition', type: 'select', default: 'gemAhead', options: [
          { label: 'Gem Ahead', value: 'gemAhead' },
          { label: 'Wall Ahead', value: 'wallAhead' },
          { label: 'Can Move', value: 'canMove' },
          { label: 'Enemy Ahead', value: 'enemyAhead' }
        ]
      }
    ],
    connectable: 'both',
    canNest: true,
    description: 'Execute one block or another based on condition'
  },
  defineFunction: {
    id: 'defineFunction',
    category: 'logic',
    label: 'Define Function',
    icon: '📦',
    color: '#8e44ad',
    borderColor: '#7d3c98',
    params: [{ name: 'name', type: 'string', default: 'myFunction' }],
    connectable: 'none',
    canNest: true,
    description: 'Define a reusable block of code'
  },
  callFunction: {
    id: 'callFunction',
    category: 'logic',
    label: 'Call Function',
    icon: '📞',
    color: '#8e44ad',
    borderColor: '#7d3c98',
    params: [{ name: 'name', type: 'string', default: 'myFunction' }],
    connectable: 'both',
    canNest: false,
    description: 'Execute a defined function'
  },

  // Algorithm Blocks
  runBFS: {
    id: 'runBFS',
    category: 'algorithm',
    label: 'Run BFS',
    icon: '🔵',
    color: '#e74c3c',
    borderColor: '#c0392b',
    params: [
      {
        name: 'target', type: 'select', default: 'nearestGem', options: [
          { label: 'Nearest Gem', value: 'nearestGem' },
          { label: 'All Gems', value: 'allGems' }
        ]
      }
    ],
    connectable: 'both',
    canNest: false,
    description: 'Run BFS algorithm to find shortest path'
  },
  runDFS: {
    id: 'runDFS',
    category: 'algorithm',
    label: 'Run DFS',
    icon: '🟠',
    color: '#e74c3c',
    borderColor: '#c0392b',
    params: [
      {
        name: 'target', type: 'select', default: 'nearestGem', options: [
          { label: 'Nearest Gem', value: 'nearestGem' },
          { label: 'All Gems', value: 'allGems' }
        ]
      }
    ],
    connectable: 'both',
    canNest: false,
    description: 'Run DFS algorithm to explore path'
  },
  runAStar: {
    id: 'runAStar',
    category: 'algorithm',
    label: 'Run A*',
    icon: '⭐',
    color: '#e74c3c',
    borderColor: '#c0392b',
    params: [
      {
        name: 'target', type: 'select', default: 'nearestGem', options: [
          { label: 'Nearest Gem', value: 'nearestGem' },
          { label: 'All Gems', value: 'allGems' }
        ]
      }
    ],
    connectable: 'both',
    canNest: false,
    description: 'Run A* pathfinding algorithm'
  },

  // Action Blocks
  attack: {
    id: 'attack',
    category: 'action',
    label: 'Attack',
    icon: '⚔️',
    color: '#e74c3c',
    borderColor: '#c0392b',
    connectable: 'both',
    canNest: false,
    description: 'Attack adjacent enemies'
  },
  scan: {
    id: 'scan',
    category: 'action',
    label: 'Scan',
    icon: '🔍',
    color: '#3498db',
    borderColor: '#2980b9',
    connectable: 'both',
    canNest: false,
    description: 'Scan surroundings for gems and enemies'
  },
  collectManual: {
    id: 'collectManual',
    category: 'action',
    label: 'Collect',
    icon: '💎',
    color: '#f1c40f',
    borderColor: '#f39c12',
    connectable: 'both',
    canNest: false,
    description: 'Manually collect a gem on the current tile'
  },
  changeCharacter: {
    id: 'changeCharacter',
    category: 'action',
    label: 'Change Character',
    icon: '🐕',
    color: '#2ecc71',
    borderColor: '#27ae60',
    params: [
      {
        name: 'character', type: 'select', default: 'dog', options: [
          { label: 'Dog', value: 'dog' },
          { label: 'Cat', value: 'cat' },
          { label: 'Robot', value: 'robot' }
        ]
      }
    ],
    connectable: 'both',
    canNest: true,
    description: 'Change the character sprite'
  },
  playSound: {
    id: 'playSound',
    category: 'action',
    label: 'Play Sound',
    icon: '🔊',
    color: '#2ecc71',
    borderColor: '#27ae60',
    params: [
      {
        name: 'sound', type: 'select', default: 'collection', options: [
          { label: 'Collection', value: 'collection' },
          { label: 'Success', value: 'success' },
          { label: 'Error', value: 'error' }
        ]
      }
    ],
    connectable: 'both',
    canNest: true,
    description: 'Play a sound effect'
  },
  comment: {
    id: 'comment',
    category: 'action',
    label: 'Comment',
    icon: '💬',
    color: '#95a5a6',
    borderColor: '#7f8c8d',
    params: [{ name: 'text', type: 'string', default: 'Type a comment...' }],
    connectable: 'both',
    canNest: true,
    description: 'Add a comment (does not execute)'
  }
};
