/**
 * Block Workspace Component
 * Main area where blocks are assembled and edited
 */

import React, { useState } from 'react';
import { BlockInstance, BlockDefinition, BLOCK_LIBRARY, BlockCategory } from './BlockTypes';
import { Block, BlockPlaceholder } from './Block';

interface BlockWorkspaceProps {
  blocks: BlockInstance[];
  onBlocksChange: (blocks: BlockInstance[]) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export function BlockWorkspace({
  blocks,
  onBlocksChange,
  onExecute,
  isExecuting
}: BlockWorkspaceProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const generateBlockId = () => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, blockId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (blockId) setDropTargetId(blockId);
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    setDropTargetId(null);

    const blockType = e.dataTransfer.getData('blockType');

    if (blockType) {
      // Logic for adding a NEW block from the palette via drag-and-drop
      const definition = BLOCK_LIBRARY[blockType];
      if (!definition) return;

      const newBlock: BlockInstance = {
        id: generateBlockId(),
        blockType,
        params: {},
        children: [],
        parentId: null,
        x: 0,
        y: 0
      };

      if (definition.params) {
        definition.params.forEach(p => newBlock.params[p.name] = p.default);
      }

      const currentBlocks = JSON.parse(JSON.stringify(blocks));
      if (targetIndex !== undefined) {
        currentBlocks.splice(targetIndex, 0, newBlock);
      } else {
        currentBlocks.push(newBlock);
      }
      onBlocksChange(currentBlocks);
      return;
    }

    if (!draggedBlockId) return;

    // Correct deep clone to avoid mutation
    const currentBlocks = JSON.parse(JSON.stringify(blocks));

    // Deep recursive find and remove
    const removeFromTree = (tree: BlockInstance[]): BlockInstance | null => {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === draggedBlockId) {
          return tree.splice(i, 1)[0];
        }
        const found = removeFromTree(tree[i].children);
        if (found) return found;
      }
      return null;
    };

    const draggedBlock = removeFromTree(currentBlocks);

    if (draggedBlock) {
      if (targetIndex !== undefined) {
        currentBlocks.splice(targetIndex, 0, draggedBlock);
      } else {
        currentBlocks.push(draggedBlock);
      }
      onBlocksChange(currentBlocks);
    }

    setDraggedBlockId(null);
  };

  const handleRemoveBlock = (blockId: string) => {
    const removeRecursive = (arr: BlockInstance[]): BlockInstance[] => {
      return arr
        .filter((b) => b.id !== blockId)
        .map((b) => ({
          ...b,
          children: removeRecursive(b.children)
        }));
    };

    onBlocksChange(removeRecursive(blocks));
  };

  const handleParamChange = (blockId: string, paramName: string, value: string | number) => {
    const updateRecursive = (arr: BlockInstance[]): BlockInstance[] => {
      return arr.map((b) => {
        if (b.id === blockId) {
          return { ...b, params: { ...b.params, [paramName]: value } };
        }
        return { ...b, children: updateRecursive(b.children) };
      });
    };

    onBlocksChange(updateRecursive(blocks));
  };

  const handleUndo = () => {
    // TODO: Implement undo/redo
    console.log('Undo');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all blocks?')) {
      onBlocksChange([]);
    }
  };

  const renderBlock = (block: BlockInstance, index: number) => {
    const definition = BLOCK_LIBRARY[block.blockType];
    if (!definition) return null;

    return (
      <div
        key={block.id}
        onDragOver={(e) => handleDragOver(e, block.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        style={{
          position: 'relative'
        }}
      >
        <Block
          block={block}
          definition={definition}
          onDragStart={handleDragStart}
          onRemove={handleRemoveBlock}
          onParamChange={handleParamChange}
          isDragging={draggedBlockId === block.id}
          isDropTarget={dropTargetId === block.id}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0a0f',
        position: 'relative',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '40px 40px'
      }}
    >
      {/* Workspace Status Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {blocks.length} MODULES LOADED
        </div>
      </div>

      {/* Script Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px' // Connecting blocks look
        }}
      >
        {blocks.length === 0 ? (
          <div
            onDragOver={(e) => handleDragOver(e, 'workspace_root')}
            onDrop={(e) => handleDrop(e)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: dropTargetId === 'workspace_root' ? '2px solid #f1c40f' : 'none',
              borderRadius: '24px', transition: 'all 0.2s'
            }}
          >
            <BlockPlaceholder />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {blocks.map((block, index) => renderBlock(block, index))}

            {/* End-of-script drop target */}
            <div
              onDragOver={(e) => handleDragOver(e, 'end_zone')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e)}
              style={{
                height: '100px',
                width: '100%',
                border: dropTargetId === 'end_zone' ? '2px dashed #f1c40f' : 'none',
                borderRadius: '16px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f1c40f',
                fontSize: '11px',
                fontWeight: 700,
                opacity: dropTargetId === 'end_zone' ? 1 : 0
              }}
            >
              ➕ APPEND MODULE HERE
            </div>
          </div>
        )}
      </div>

      {/* Execute Button Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          zIndex: 10
        }}
      >
        <button
          onClick={onExecute}
          disabled={blocks.length === 0}
          className="execute-btn"
          style={{
            background: isExecuting ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #2ecc71, #27ae60)',
            border: 'none',
            color: '#fff',
            padding: '16px 36px',
            borderRadius: '16px',
            cursor: blocks.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 900,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            opacity: blocks.length === 0 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: isExecuting ? '0 0 30px rgba(231, 76, 60, 0.4)' : '0 10px 30px rgba(46, 204, 113, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {isExecuting ? '⏹ STOP SYSTEM' : '▶ RUN SCRIPT'}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .execute-btn {
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .execute-btn:hover:not(:disabled) {
            transform: scale(1.1) translateY(-12px) !important;
            filter: brightness(1.2);
            box-shadow: 0 15px 40px rgba(46, 204, 113, 0.5);
        }
        .execute-btn:active:not(:disabled) {
            transform: scale(0.95) translateY(0);
        }
      `}} />
    </div>
  );
}
