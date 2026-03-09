/**
 * Block Palette Component
 * Shows all available blocks organized by category with a premium game UI
 */

import React, { useState } from 'react';
import { BLOCK_CATEGORIES, BLOCK_LIBRARY, BlockCategory } from './BlockTypes';

interface BlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
  allowedCategories?: BlockCategory[];
  width?: number;
}

export function BlockPalette({ onBlockAdd, allowedCategories, width = 320 }: BlockPaletteProps) {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('movement');

  const categories = (Object.entries(BLOCK_CATEGORIES) as Array<[BlockCategory, typeof BLOCK_CATEGORIES[BlockCategory]]>)
    .filter(([key]) => !allowedCategories || allowedCategories.includes(key));

  React.useEffect(() => {
    if (allowedCategories && !allowedCategories.includes(activeCategory) && categories.length > 0) {
      setActiveCategory(categories[0][0]);
    }
  }, [allowedCategories, activeCategory, categories]);

  return (
    <div
      style={{
        width: `${width}px`,
        background: 'rgba(5, 5, 8, 0.4)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        zIndex: 5,
        transition: 'width 0.1s linear'
      }}
    >
      {/* Left Column: Category Selectors */}
      <div style={{
        width: '64px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRight: '1px solid rgba(255, 255, 255, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {categories.map(([categoryKey, categoryInfo]) => {
          const isActive = activeCategory === categoryKey;
          return (
            <div
              key={categoryKey}
              onClick={() => setActiveCategory(categoryKey)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: isActive ? categoryInfo.color : 'rgba(255,255,255,0.05)',
                boxShadow: isActive ? `0 0 20px ${categoryInfo.color}66` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
              }}>
                {categoryInfo.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Active Category Blocks */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 16px',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          fontSize: '9px',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {BLOCK_CATEGORIES[activeCategory].label} MODULES
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {Object.values(BLOCK_LIBRARY)
            .filter((block) => block.category === activeCategory)
            .map((block) => (
              <div
                key={block.id}
                onClick={() => onBlockAdd(block.id)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('blockType', block.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="palette-block"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid rgba(255,255,255,0.05)`,
                  borderLeft: `3px solid ${block.color}`,
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '11px',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: '140px',
                  flex: '1 1 140px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{block.icon}</span>
                <div style={{ flex: 1, letterSpacing: '0.4px', opacity: 0.9 }}>{block.label}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
