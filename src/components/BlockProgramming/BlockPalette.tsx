/**
 * Block Palette Component
 * Shows all available blocks organized by category with a premium game UI
 */

import React, { useState } from 'react';
import { BLOCK_CATEGORIES, BLOCK_LIBRARY, BlockCategory } from './BlockTypes';

interface BlockPaletteProps {
  onBlockAdd: (blockType: string) => void;
  allowedCategories?: BlockCategory[];
}

export function BlockPalette({ onBlockAdd, allowedCategories }: BlockPaletteProps) {
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
        width: '300px',
        background: 'rgba(5, 5, 8, 0.98)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        backdropFilter: 'blur(40px)',
        zIndex: 5
      }}
    >
      {/* Left Column: Category Selectors */}
      <div style={{
        width: '70px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        gap: '12px',
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
                gap: '10px',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.4,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                width: '100%',
                padding: '8px 0'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: categoryInfo.color,
                boxShadow: isActive ? `0 0 15px ${categoryInfo.color}88` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
                border: isActive ? '1.5px solid #fff' : 'none'
              }}>
                {categoryKey === 'movement' ? '🚀' : categoryKey === 'action' ? '⚔️' : categoryKey === 'control' ? '🔄' : categoryKey === 'logic' ? '🧠' : '📜'}
              </div>
              <div style={{
                fontSize: '8px',
                fontWeight: 900,
                color: isActive ? '#fff' : '#666',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                userSelect: 'none'
              }}>
                {categoryInfo.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Active Category Blocks */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'transparent' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <div style={{ background: BLOCK_CATEGORIES[activeCategory].color, width: '8px', height: '8px', borderRadius: '2px' }} />
          {BLOCK_CATEGORIES[activeCategory].label} MODULES
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  background: `linear-gradient(135deg, ${block.color}cc, ${block.borderColor}cc)`,
                  border: `1px solid rgba(255,255,255,0.15)`,
                  color: '#fff',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 24px ${block.color}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                }}
              >
                {/* Shine effect */}
                <div style={{
                  position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                  background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
                  transform: 'rotate(25deg)', pointerEvents: 'none'
                }} />

                <div style={{ flex: 1, letterSpacing: '0.5px' }}>{block.label}</div>
                <div style={{ fontSize: '18px', opacity: 0.8 }}>+</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
