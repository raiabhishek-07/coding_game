/**
 * Block Programming Editor
 * Main component combining palette, workspace, and tooling with persistent save/load
 */

import React, { useState, useCallback, useEffect } from 'react';
import { BlockPalette } from './BlockPalette';
import { BlockWorkspace } from './BlockWorkspace';
import { BlockInstance, BLOCK_LIBRARY, BlockCategory } from './BlockTypes';
import { compileBlocks, flattenCompiledBlocks, validateBlocks, estimateExecutionTime, serializeBlocks, deserializeBlocks } from './BlockCompiler';
import { ALL_BLOCK_LEVELS } from '@/data/block-levels';

interface BlockProgrammingEditorProps {
  onExecute: (commands: any[]) => void;
  isExecuting: boolean;
  onStop: () => void;
  levelId?: number;
  autoSave?: boolean;
  allowedCategories?: BlockCategory[];
}

export function BlockProgrammingEditor({
  onExecute,
  isExecuting,
  onStop,
  levelId,
  autoSave = true,
  allowedCategories
}: BlockProgrammingEditorProps) {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [history, setHistory] = useState<BlockInstance[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const storageKey = `blockProgram_${levelId || 'default'}`;

  const generateBlockId = useCallback(() => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const loaded = deserializeBlocks(saved);
          setBlocks(loaded);
          setHistory([loaded]);
          setHistoryIndex(0);
        }
      } catch (e) {
        console.error('Failed to load blocks:', e);
      }
    }
  }, [storageKey]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!autoSave || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        const serialized = serializeBlocks(blocks);
        localStorage.setItem(storageKey, serialized);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Failed to save blocks:', e);
      }
    }, 1000); // Debounce saves

    return () => clearTimeout(timer);
  }, [blocks, storageKey, autoSave]);

  // Track undo/redo history
  const addToHistory = useCallback((newBlocks: BlockInstance[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setBlocks(newBlocks);
  }, [history, historyIndex]);

  const handleAddBlock = useCallback((blockType: string) => {
    const newBlock: BlockInstance = {
      id: generateBlockId(),
      blockType,
      params: {},
      children: [],
      parentId: null,
      x: 0,
      y: 0
    };

    // Initialize default params
    const definition = BLOCK_LIBRARY[blockType];
    if (definition?.params) {
      definition.params.forEach(param => {
        newBlock.params[param.name] = param.default;
      });
    }

    addToHistory([...blocks, newBlock]);
  }, [blocks, generateBlockId, addToHistory]);

  const handleExecute = useCallback(() => {
    const issues = validateBlocks(blocks);
    const errors = issues.filter(i => i.severity === 'error');
    if (errors.length > 0) {
      setShowValidation(true);
      return;
    }
    const compiled = compileBlocks(blocks);
    const flat = flattenCompiledBlocks(compiled);
    onExecute(flat);
  }, [blocks, onExecute]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleClear = useCallback(() => {
    if (blocks.length === 0) return;
    if (window.confirm('Wipe system core? All unsaved modules will be lost.')) {
      setBlocks([]);
      addToHistory([]);
      onStop();
    }
  }, [blocks.length, addToHistory, onStop]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleBlocksChange = useCallback((newBlocks: BlockInstance[]) => {
    setBlocks(newBlocks);
    addToHistory(newBlocks);
  }, [addToHistory]);

  const validationIssues = validateBlocks(blocks);
  const executionTimeEstimate = estimateExecutionTime(blocks);
  const errorCount = validationIssues.filter(i => i.severity === 'error').length;
  const warningCount = validationIssues.filter(i => i.severity === 'warning').length;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        background: '#0a0a0f',
        color: '#e0e0e0',
        flexDirection: 'column'
      }}
    >
      <div style={{
        background: 'rgba(10, 10, 15, 0.8)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        padding: '8px 16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        backdropFilter: 'blur(16px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="action-pill-btn"
          >
            ↶ UNDO
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="action-pill-btn"
          >
            REDO ↷
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleClear}
            disabled={blocks.length === 0}
            className="action-pill-btn danger"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          background: '#0a0a0f',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      >
        {/* Block Palette */}
        <BlockPalette onBlockAdd={handleAddBlock} allowedCategories={allowedCategories} />

        {/* Main Workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <BlockWorkspace
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
            onExecute={isExecuting ? onStop : handleExecute}
            isExecuting={isExecuting}
          />

          {/* Validation Panel */}
          {showValidation && validationIssues.length > 0 && (
            <div
              style={{
                background: '#fff3f3',
                borderTop: '1px solid #ffcdd2',
                padding: '12px',
                maxHeight: '150px',
                overflowY: 'auto',
                fontSize: '12px'
              }}
            >
              <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#e74c3c' }}>
                Issues ({errorCount} errors, {warningCount} warnings):
              </div>
              {validationIssues.map((issue, i) => (
                <div key={i} style={{
                  marginBottom: '4px',
                  color: issue.severity === 'error' ? '#e74c3c' : '#f39c12'
                }}>
                  [{issue.severity.toUpperCase()}] {issue.message}
                </div>
              ))}
            </div>
          )}

          {/* Statistics Footer */}
          <div style={{
            background: 'rgba(10, 10, 15, 0.95)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 900,
            letterSpacing: '1px'
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                MODULES: <span style={{ color: '#667eea' }}>{blocks.length}</span>
              </div>
              <div>
                EST. RUNTIME: <span style={{ color: '#55efc4' }}>{executionTimeEstimate.toFixed(1)}S</span>
              </div>
            </div>
            <div style={{ opacity: 0.5 }}>
              PERSISTENCE: {autoSave ? 'ACTIVE' : 'OFFLINE'}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .action-pill-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.6);
            padding: 8px 16px; border-radius: 10px;
            font-size: 10px; font-weight: 900; letter-spacing: 1px;
            cursor: pointer; transition: all 0.2s;
        }
        .action-pill-btn:hover:not(:disabled) {
            background: rgba(255,255,255,0.08);
            color: #fff;
            border-color: rgba(255,255,255,0.2);
        }
        .action-pill-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .action-pill-btn.alt {
            border-color: rgba(102, 126, 234, 0.3);
            color: #667eea;
        }
        .action-pill-btn.alt:hover {
            background: rgba(102, 126, 234, 0.1);
            border-color: #667eea;
        }

        .action-pill-btn.danger {
            border-color: rgba(231, 76, 60, 0.3);
            color: #e74c3c;
        }
        .action-pill-btn.danger:hover:not(:disabled) {
            background: rgba(231, 76, 60, 0.1);
            border-color: #e74c3c;
        }
      `}} />
    </div >
  );
}
