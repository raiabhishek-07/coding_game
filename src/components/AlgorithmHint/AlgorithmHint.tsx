/**
 * Algorithm Hint Component
 * Provides visual hints to players about which algorithms they could use
 */

import React from 'react';

interface AlgorithmHintProps {
  algorithmName?: 'bfs' | 'dfs' | 'astar';
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
}

const algorithms = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    description: 'Find the shortest path by exploring all neighbors level by level',
    emoji: '📍',
    color: '#3498db',
    tips: [
      'Visit cells layer by layer',
      'Use a queue - First In, First Out',
      'Guarantees shortest path',
      'Good for mazes with multiple paths'
    ]
  },
  dfs: {
    name: 'Depth-First Search (DFS)',
    description: 'Explore deeply into a path before backtracking',
    emoji: '🧗',
    color: '#e74c3c',
    tips: [
      'Go as deep as possible before backing up',
      'Use a stack - Last In, First Out',
      'Uses less memory than BFS',
      'May not find shortest path'
    ]
  },
  astar: {
    name: 'A* (A-Star) Pathfinding',
    description: 'Smart pathfinding using estimated distance to goal',
    emoji: '⭐',
    color: '#f39c12',
    tips: [
      'Uses heuristic (estimated distance)',
      'Combines actual cost and future estimate',
      'Faster than BFS for single target',
      'Most efficient for large maps'
    ]
  }
};

export function AlgorithmHint({ algorithmName, difficulty, description }: AlgorithmHintProps) {
  if (!algorithmName) return null;

  const algo = algorithms[algorithmName];

  return (
    <div style={{
      background: `${algo.color}20`,
      border: `3px solid ${algo.color}`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
        color: '#ecf0f1',
        fontWeight: 'bold'
      }}>
        <span style={{ fontSize: '20px' }}>{algo.emoji}</span>
        <span>{algo.name}</span>
        {difficulty && (
          <span style={{
            marginLeft: 'auto',
            background: difficulty === 'easy' ? '#2ecc71' : difficulty === 'medium' ? '#f39c12' : '#e74c3c',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {difficulty.toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ color: '#bdc3c7', fontSize: '13px', marginBottom: '8px' }}>
        {description || algo.description}
      </div>

      <div style={{ fontSize: '12px', color: '#95a5a6' }}>
        <strong>💡 Tips:</strong>
        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
          {algo.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}

export function AlgorithmVisualizer({ 
  path, 
  visited, 
  start, 
  goal 
}: { 
  path?: Array<{ x: number; y: number }>;
  visited?: Array<{ x: number; y: number }>;
  start?: { x: number; y: number };
  goal?: { x: number; y: number };
}) {
  return (
    <div style={{
      background: '#1a1a1a',
      border: '2px solid #34495e',
      borderRadius: '6px',
      padding: '8px',
      fontSize: '11px',
      color: '#ecf0f1'
    }}>
      <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>Algorithm Progress:</div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {visited && visited.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#3498db', borderRadius: '2px' }} />
            <span>Visited: {visited.length}</span>
          </div>
        )}
        {path && path.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: '#2ecc71', borderRadius: '2px' }} />
            <span>Path: {path.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
