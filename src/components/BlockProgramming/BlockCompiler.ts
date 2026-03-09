/**
 * Block Programming System - Main Compiler/Executor
 * Converts block structure into executable commands
 */

import { BlockInstance, BLOCK_LIBRARY, BlockDefinition, ActionBlockType } from './BlockTypes';

export interface CompiledBlock {
  type: 'action' | 'loop' | 'condition' | 'algorithm' | 'wait' | 'special';
  action?: ActionBlockType;
  count?: number;
  blocks?: CompiledBlock[];
  elseBlocks?: CompiledBlock[]; // For ifThenElse
  condition?: string;
  algorithm?: 'bfs' | 'dfs' | 'astar';
  target?: string;
  duration?: number;
  subAction?: string;
  params?: Record<string, any>;
}

/**
 * Compile block instances into executable format
 */
export function compileBlocks(blocks: BlockInstance[]): CompiledBlock[] {
  const functions: Record<string, CompiledBlock[]> = {};

  // First pass: Collect all function definitions
  function collectFunctions(blks: BlockInstance[]) {
    blks.forEach(block => {
      if (block.blockType === 'defineFunction') {
        const name = (block.params['name'] as string) || 'myFunction';
        functions[name] = (block.children || []).map(child => compileBlock(child, functions));
      }
      if (block.children) collectFunctions(block.children);
    });
  }
  collectFunctions(blocks);

  // Second pass: Compile main script (excluding definitions from top-level execution)
  return blocks
    .filter(block => block.blockType !== 'defineFunction')
    .map(block => compileBlock(block, functions));
}

/**
 * Flatten compiled blocks into a sequence of movement + special actions
 * Expands loops and returns flat array for GameEngine
 */
export function flattenCompiledBlocks(compiled: CompiledBlock[]): Array<ActionBlockType | { type: 'algorithm'; algorithm: 'bfs' | 'dfs' | 'astar'; target: string } | { type: 'wait'; duration: number } | { type: 'sound'; sound: string } | { type: 'character'; char: string } | { type: 'condition'; condition: string; then: any[]; else?: any[] }> {
  const result: any[] = [];

  function flatten(block: CompiledBlock) {
    if (block.type === 'action' && block.action) {
      result.push(block.action);
    } else if (block.type === 'loop' && block.blocks && block.count) {
      for (let i = 0; i < block.count; i++) {
        block.blocks.forEach(b => flatten(b));
      }
    } else if (block.type === 'condition') {
      // Dynamic conditions must be evaluated at runtime in GameEngine
      result.push({
        type: 'condition',
        condition: block.condition || 'canMoveForward',
        then: (block.blocks || []).map(b => b.type === 'action' ? b.action : b), // Simplify for engine if possible
        else: (block.elseBlocks || []).map(b => b.type === 'action' ? b.action : b)
      });
    } else if (block.type === 'algorithm') {
      result.push({
        type: 'algorithm',
        algorithm: block.algorithm || 'bfs',
        target: block.target || 'nearestGem'
      });
    } else if (block.type === 'wait') {
      result.push({ type: 'wait', duration: block.duration || 1000 });
    } else if (block.type === 'special' && block.subAction === 'playSound') {
      result.push({ type: 'sound', sound: (block.params?.sound as string) || 'collection' });
    } else if (block.type === 'special' && block.subAction === 'changeCharacter') {
      result.push({ type: 'character', char: (block.params?.character as string) || '🐕' });
    }
  }

  compiled.forEach(block => flatten(block));
  return result;
}

function compileBlock(block: BlockInstance, functions: Record<string, CompiledBlock[]> = {}): CompiledBlock {
  const definition = BLOCK_LIBRARY[block.blockType];

  if (!definition) {
    console.warn(`Unknown block type: ${block.blockType}`);
    return { type: 'action', action: 'UP' };
  }

  // Action / Movement blocks
  const actionMap: Record<string, ActionBlockType> = {
    moveUp: 'UP',
    moveDown: 'DOWN',
    moveLeft: 'LEFT',
    moveRight: 'RIGHT',
    attack: 'ATTACK',
    scan: 'SCAN',
    collectManual: 'COLLECT'
  };

  if (actionMap[block.blockType]) {
    return { type: 'action', action: actionMap[block.blockType] };
  }

  // Control blocks
  if (block.blockType === 'repeat') {
    return {
      type: 'loop',
      count: (block.params['times'] as number) || 2,
      blocks: (block.children || []).map(b => compileBlock(b, functions))
    };
  }

  if (block.blockType === 'wait') {
    return {
      type: 'wait',
      duration: ((block.params['seconds'] as number) || 1) * 1000
    };
  }

  // Logic / Functions / Conditions
  if (block.blockType === 'ifThen' || block.blockType === 'ifThenElse') {
    return {
      type: 'condition',
      condition: (block.params['condition'] as string) || 'canMoveForward',
      blocks: (block.children || []).map(b => compileBlock(b, functions)),
      elseBlocks: block.blockType === 'ifThenElse' ? [] : [] // ifThenElse needs separate children handling usually, but here children might be mixed
    };
  }

  if (block.blockType === 'callFunction') {
    const name = (block.params['name'] as string) || 'myFunction';
    return {
      type: 'loop', // Treat function call as a loop that runs once
      count: 1,
      blocks: functions[name] || []
    };
  }

  // Algorithm blocks
  if (block.blockType === 'runBFS') {
    return {
      type: 'algorithm',
      algorithm: 'bfs',
      target: (block.params['target'] as string) || 'nearestGem'
    };
  }
  if (block.blockType === 'runDFS') {
    return {
      type: 'algorithm',
      algorithm: 'dfs',
      target: (block.params['target'] as string) || 'nearestGem'
    };
  }
  if (block.blockType === 'runAStar') {
    return {
      type: 'algorithm',
      algorithm: 'astar',
      target: (block.params['target'] as string) || 'nearestGem'
    };
  }

  // Special blocks
  if (block.blockType === 'playSound') {
    return {
      type: 'special',
      subAction: 'playSound',
      params: { sound: block.params['sound'] || 'collection' }
    };
  }

  if (block.blockType === 'changeCharacter') {
    return {
      type: 'special',
      subAction: 'changeCharacter',
      params: { character: block.params['character'] || '🐕' }
    };
  }

  return { type: 'action', action: 'UP' };
}

/**
 * Validate blocks for errors and warnings
 */
export interface ValidationIssue {
  blockId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export function validateBlocks(blocks: BlockInstance[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  function checkBlock(block: BlockInstance, depth = 0) {
    const definition = BLOCK_LIBRARY[block.blockType];

    if (!definition) {
      issues.push({
        blockId: block.id,
        severity: 'error',
        message: `Unknown block type: ${block.blockType}`
      });
      return;
    }

    // Check max nesting depth
    if (depth > 5) {
      issues.push({
        blockId: block.id,
        severity: 'warning',
        message: `Block is deeply nested (depth: ${depth}). Consider refactoring.`
      });
    }

    // Check required params
    if (definition.params) {
      definition.params.forEach(param => {
        if (!(param.name in block.params)) {
          issues.push({
            blockId: block.id,
            severity: 'warning',
            message: `Missing parameter: ${param.name}`
          });
        }
      });
    }

    // Recursively check children
    block.children.forEach(child => checkBlock(child, depth + 1));
  }

  blocks.forEach(block => checkBlock(block));
  return issues;
}

/**
 * Get estimated execution time
 */
export function estimateExecutionTime(blocks: BlockInstance[], timePerStep = 0.4): number {
  let steps = 0;

  function countSteps(block: BlockInstance) {
    const definition = BLOCK_LIBRARY[block.blockType];
    if (!definition) return;

    if (block.blockType === 'repeat') {
      const count = (block.params['times'] as number) || 2;
      block.children.forEach(child => countSteps(child));
      steps += count - 1; // already counted once
      return;
    }

    steps++;

    if (block.children && block.children.length > 0) {
      block.children.forEach(countSteps);
    }
  }

  blocks.forEach(countSteps);
  return steps * timePerStep;
}

/**
 * Serialize blocks to JSON
 */
export function serializeBlocks(blocks: BlockInstance[]): string {
  return JSON.stringify(blocks, null, 2);
}

/**
 * Deserialize blocks from JSON
 */
export function deserializeBlocks(json: string): BlockInstance[] {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to deserialize blocks:', e);
    return [];
  }
}
