/**
 * Visual Block Component
 * Displays a draggable, connectable block with premium puzzle aesthetics
 */

import React, { useState } from 'react';
import { BlockDefinition, BlockInstance, BLOCK_LIBRARY } from './BlockTypes';

interface BlockProps {
  block: BlockInstance;
  definition: BlockDefinition;
  onDragStart: (e: React.DragEvent, blockId: string) => void;
  onRemove: (blockId: string) => void;
  onParamChange: (blockId: string, paramName: string, value: string | number) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  isNested?: boolean;
}

export function Block({
  block,
  definition,
  onDragStart,
  onRemove,
  onParamChange,
  isDragging,
  isDropTarget,
  isNested = false
}: BlockProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Puzzle Notch SVG Component
  const PuzzleNotch = ({ type, color }: { type: 'top' | 'bottom', color: string }) => (
    <svg
      width="60" height="12" viewBox="0 0 100 20"
      style={{
        position: 'absolute',
        [type]: '-6px',
        left: '16px',
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      <path
        d={type === 'top'
          ? "M 0 10 L 10 10 C 10 0, 30 0, 30 10 L 100 10"
          : "M 0 0 L 10 0 C 10 10, 30 10, 30 0 L 100 0"
        }
        fill={color}
      />
    </svg>
  );

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, block.id)}
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${definition.color}, ${definition.borderColor})`,
        borderRadius: '12px',
        padding: '10px 14px',
        marginBottom: '6px',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDropTarget
          ? `0 0 0 3px #f1c40f, 0 8px 16px rgba(0,0,0,0.5)`
          : `0 4px 8px rgba(0,0,0,0.3)`,
        transform: isDragging ? 'scale(0.95) rotate(-1deg)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        marginLeft: isNested ? '24px' : '0',
        minWidth: '200px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'visible'
      }}
    >
      {/* Top Notch */}
      <PuzzleNotch type="top" color={definition.color} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: (definition.params?.length || (block.children?.length && isExpanded)) ? '10px' : '0',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '18px', height: '18px', background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px'
        }}>
          {definition.category === 'movement' ? '🚀' : definition.category === 'control' ? '🔄' : '📜'}
        </div>

        <span style={{ flex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{definition.label}</span>

        {/* Expand/Collapse */}
        {block.children && block.children.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              borderRadius: '6px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '10px',
              transition: 'all 0.2s'
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}

        {/* Remove Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}
          style={{
            background: 'rgba(231, 76, 60, 0.2)',
            border: 'none',
            color: '#ff7675',
            borderRadius: '6px',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231, 76, 60, 0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)')}
        >
          ✕
        </button>
      </div>

      {/* Parameters */}
      {definition.params && definition.params.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {definition.params.map((param) => (
            <div key={param.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', minWidth: '60px' }}>
                {param.name}
              </label>
              {param.type === 'number' ? (
                <input
                  type="number"
                  value={block.params[param.name] || param.default}
                  onChange={(e) => onParamChange(block.id, param.name, parseInt(e.target.value))}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    width: '70px',
                    fontSize: '12px',
                    fontWeight: 900,
                    textAlign: 'center'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <select
                  value={block.params[param.name] || param.default}
                  onChange={(e) => onParamChange(block.id, param.name, e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 900,
                    flex: 1,
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {param.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#1a1a24' }}>
                      {opt.label}
                    </option>
                  )) || <option value={param.default as string}>{param.default as string}</option>}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Child Blocks Injection Point */}
      {block.children && block.children.length > 0 && isExpanded && (
        <div style={{
          marginTop: '16px',
          padding: '12px 0 4px 12px',
          background: 'rgba(0,0,0,0.2)',
          borderLeft: `4px solid ${definition.color}`,
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          {block.children.map((child) => (
            <Block
              key={child.id}
              block={child}
              definition={BLOCK_LIBRARY[child.blockType]}
              onDragStart={onDragStart}
              onRemove={onRemove}
              onParamChange={onParamChange}
              isDragging={isDragging}
              isDropTarget={false} // Child drop handling is complex, keeping simple for now
              isNested={true}
            />
          ))}
        </div>
      )}

      {/* Bottom Notch */}
      <PuzzleNotch type="bottom" color={definition.borderColor} />
    </div>
  );
}

export function BlockPlaceholder() {
  return (
    <div
      style={{
        border: '2px dashed rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.01)',
        borderRadius: '16px',
        padding: '32px 20px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.15)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.5px'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '12px', filter: 'grayscale(1) opacity(0.2)' }}>🧩</div>
      <div style={{ textTransform: 'uppercase' }}>Initialize System</div>
      <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.4 }}>Drop command modules here to begin</div>
    </div>
  );
}
