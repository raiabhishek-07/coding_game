/**
 * Block Programming System - Main Export
 * Scratch-like visual block programming interface
 */

export { BlockProgrammingEditor } from './BlockProgrammingEditor';
export { Block, BlockPlaceholder } from './Block';
export { BlockPalette } from './BlockPalette';
export { BlockWorkspace } from './BlockWorkspace';
export {
  compileBlocks,
  flattenCompiledBlocks,
  validateBlocks,
  estimateExecutionTime,
  serializeBlocks,
  deserializeBlocks,
  type CompiledBlock,
  type ValidationIssue
} from './BlockCompiler';
export {
  BLOCK_LIBRARY,
  BLOCK_CATEGORIES,
  type BlockDefinition,
  type BlockInstance,
  type BlockCategory,
  type BlockParam
} from './BlockTypes';
