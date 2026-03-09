/**
 * Enhanced block types supporting loops, conditionals, and functions
 */

export interface Position { x: number; y: number }
export interface Gem extends Position { id: number; collected: boolean }

export interface Enemy extends Position {
  id: number;
  type: 'robot' | 'guardian' | 'golem' | 'dragon';
  health: number;
  isBoss?: boolean;
}

export type ActionBlockType = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ATTACK' | 'SCAN' | 'COLLECT';

// Enhanced block system supporting nested structures
export type CodeBlock = ActionBlock | LoopBlock | ConditionBlock | FunctionBlock;

export interface ActionBlock {
  type: 'action';
  action: ActionBlockType;
  id: string;
}

export interface LoopBlock {
  type: 'loop';
  count: number;
  blocks: CodeBlock[];
  id: string;
}

export interface ConditionBlock {
  type: 'condition';
  condition: 'canMoveForward' | 'gemAhead' | 'obstacleAhead' | 'enemyAhead';
  blocks: CodeBlock[];
  id: string;
}

export interface FunctionBlock {
  type: 'function';
  name: string;
  blocks: CodeBlock[];
  id: string;
}

export interface BlockLevel {
  id: number;
  title: string;
  width: number;
  height: number;
  start: Position;
  gems: Gem[];
  obstacles: Position[];
  enemies?: Enemy[];
  algorithm?: 'bfs' | 'dfs' | 'astar'; // Suggested algorithm for this level
  theme?: 'beach' | 'forest' | 'abyss';
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
  mission?: string;
  constraints?: {
    maxBlocks?: number;
    requiredBlockTypes?: string[];
    forbiddenBlockTypes?: string[];
  };
}

// Helper functions
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function flattenBlocks(blocks: CodeBlock[]): ActionBlockType[] {
  const result: ActionBlockType[] = [];

  function traverse(block: CodeBlock) {
    if (block.type === 'action') {
      result.push(block.action);
    } else if (block.type === 'loop') {
      for (let i = 0; i < block.count; i++) {
        block.blocks.forEach(traverse);
      }
    } else if (block.type === 'condition') {
      block.blocks.forEach(traverse);
    } else if (block.type === 'function') {
      block.blocks.forEach(traverse);
    }
  }

  blocks.forEach(traverse);
  return result;
}

export function countBlocks(blocks: CodeBlock[]): number {
  let count = 0;

  function traverse(block: CodeBlock) {
    count++;
    if (block.type === 'loop') {
      block.blocks.forEach(traverse);
    } else if (block.type === 'condition') {
      block.blocks.forEach(traverse);
    } else if (block.type === 'function') {
      block.blocks.forEach(traverse);
    }
  }

  blocks.forEach(traverse);
  return count;
}
