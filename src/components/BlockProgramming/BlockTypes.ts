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
  movement: { label: 'Movement', color: '#38bdf8', icon: '🚀' },
  action: { label: 'Actions', color: '#fbbf24', icon: '⚡' },
  control: { label: 'Control', color: '#f472b6', icon: '🔄' },
  logic: { label: 'Logic', color: '#a78bfa', icon: '🧠' },
  algorithm: { label: 'Algorithms', color: '#4ade80', icon: '🧬' }
};

// All Available Blocks
export const BLOCK_LIBRARY: Record<string, BlockDefinition> = {
  // Movement Blocks
  moveUp: {
    id: 'moveUp',
    category: 'movement',
    label: 'Forward Advance',
    icon: '⬆️',
    color: '#0ea5e9',
    borderColor: '#0284c7',
    connectable: 'both',
    canNest: true,
    description: 'Advance forward in the current vector'
  },
  moveDown: {
    id: 'moveDown',
    category: 'movement',
    label: 'Reverse Thrust',
    icon: '⬇️',
    color: '#0ea5e9',
    borderColor: '#0284c7',
    connectable: 'both',
    canNest: true,
    description: 'Reverse movement along current axis'
  },
  moveLeft: {
    id: 'moveLeft',
    category: 'movement',
    label: 'Port Pivot',
    icon: '⬅️',
    color: '#0ea5e9',
    borderColor: '#0284c7',
    connectable: 'both',
    canNest: true,
    description: 'Lateral shift to port side'
  },
  moveRight: {
    id: 'moveRight',
    category: 'movement',
    label: 'Starboard Pivot',
    icon: '➡️',
    color: '#0ea5e9',
    borderColor: '#0284c7',
    connectable: 'both',
    canNest: true,
    description: 'Lateral shift to starboard side'
  },

  // Control Blocks
  repeat: {
    id: 'repeat',
    category: 'control',
    label: 'Iteration Loop',
    icon: '🔄',
    color: '#ec4899',
    borderColor: '#db2777',
    params: [{ name: 'times', type: 'number', default: 2, options: undefined }],
    connectable: 'both',
    canNest: true,
    description: 'Execute nested modules repeatedly'
  },
  wait: {
    id: 'wait',
    category: 'control',
    label: 'Temporal Buffer',
    icon: '⏱️',
    color: '#f43f5e',
    borderColor: '#e11d48',
    params: [{ name: 'ms', type: 'number', default: 1000 }],
    connectable: 'both',
    canNest: true,
    description: 'Pause execution for duration'
  },

  // Logic Blocks
  ifThen: {
    id: 'ifThen',
    category: 'logic',
    label: 'Conditional Branch',
    icon: '❓',
    color: '#8b5cf6',
    borderColor: '#7c3aed',
    params: [
      {
        name: 'sensor', type: 'select', default: 'gemAhead', options: [
          { label: 'Gem Detected', value: 'gemAhead' },
          { label: 'Obstacle Detected', value: 'wallAhead' },
          { label: 'Clear Path', value: 'canMove' }
        ]
      }
    ],
    connectable: 'both',
    canNest: true,
    description: 'Branch execution based on sensor telemetry'
  },

  // Algorithm Blocks
  runBFS: {
    id: 'runBFS',
    category: 'algorithm',
    label: 'Breadth Search',
    icon: '📡',
    color: '#10b981',
    borderColor: '#059669',
    params: [
      {
        name: 'target', type: 'select', default: 'nearestGem', options: [
          { label: 'Nearest Artifact', value: 'nearestGem' }
        ]
      }
    ],
    connectable: 'both',
    canNest: false,
    description: 'Execute optimal breadth-first discovery'
  },

  // Action Blocks
  collectManual: {
    id: 'collectManual',
    category: 'action',
    label: 'Acquire Artifact',
    icon: '💎',
    color: '#f59e0b',
    borderColor: '#d97706',
    connectable: 'both',
    canNest: false,
    description: 'Initiate collection sequence'
  },
  scan: {
    id: 'scan',
    category: 'action',
    label: 'Terrain Scan',
    icon: '🔍',
    color: '#06b6d4',
    borderColor: '#0891b2',
    connectable: 'both',
    canNest: false,
    description: 'Update local environment telemetry'
  }
};
