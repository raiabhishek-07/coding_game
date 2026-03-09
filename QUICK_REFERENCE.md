# Block Adventure v2.0 - Quick Reference

## 🎮 For Players

### Commands
| Command | Icon | Key | Effect |
|---------|------|-----|--------|
| UP | ⬆️ | W | Move up one cell |
| DOWN | ⬇️ | S | Move down one cell |
| LEFT | ⬅️ | A | Move left one cell |
| RIGHT | ➡️ | D | Move right one cell |
| LOOP | 🔄 | L | Repeat next blocks N times |

### Block Colors
- **Blue** (#3498db) = UP
- **Red** (#e74c3c) = DOWN  
- **Purple** (#9b59b6) = LEFT
- **Orange** (#f39c12) = RIGHT
- **Dark Blue** (#2c3e50) = LOOP

### Tips & Tricks

1. **Use Loops to Save Blocks**
   - Instead of: UP, UP, UP, UP, UP
   - Use: LOOP 5x → UP
   - Saves block space!

2. **Plan Ahead**
   - Trace the path before building
   - Collect gems in order
   - Avoid obstacles early

3. **Algorithm Hints**
   - Easy levels: Think step-by-step
   - Medium levels: Plan route to gems
   - Hard levels: Use BFS mentally for optimal path

4. **Commands Reference**
   - One block = one movement
   - Loops repeat ALL inner blocks
   - Maximum 50 blocks per level

### Victory Conditions
- ✅ Collect ALL gems
- ✅ Don't hit walls
- ✅ Don't hit obstacles
- ✅ Script must complete

### Failure Conditions
- ❌ Move out of bounds (water/wall)
- ❌ Hit an obstacle (rock)
- ❌ Don't collect all gems

---

## 💻 For Developers

### File Locations

**Game Files:**
```
src/app/block-adventure/
├── GameEngine.tsx ..................... Phaser game logic
├── page.tsx ........................... Level selection map
└── play/[levelId]/page.tsx ............ Main game screen
```

**Data Files:**
```
src/data/
├── blockLevelTypes.ts ................. Type definitions
└── block-levels/
    ├── index.ts ....................... All levels export
    ├── level1.ts to level21.ts ........ Individual levels
    └── level-examples.ts .............. Example configurations
```

**Algorithm Files:**
```
src/lib/
└── algorithms.ts ...................... BFS, DFS, A* implementations

src/components/
└── AlgorithmHint/
    └── AlgorithmHint.tsx .............. Hint component
```

### Key Functions

```typescript
// Type System
generateBlockId()              // Create unique block ID
flattenBlocks(blocks)          // Convert nested blocks to flat array
countBlocks(blocks)            // Count total blocks (with expansion)

// Algorithms
bfs(start, goal, w, h, obs)    // Breadth-first search
dfs(start, goal, w, h, obs)    // Depth-first search
aStar(start, goal, w, h, obs)  // A* pathfinding

// Utilities
pathToCommands(path)           // Convert path to commands
pathVisitsAllGems(path, gems)  // Check if path gets all gems
```

### Type Definitions

```typescript
// Basic Types
interface Position { x: number; y: number }
interface Gem extends Position { id: number; collected: boolean }

// New Block System
type CodeBlock = ActionBlock | LoopBlock | ConditionBlock | FunctionBlock

interface ActionBlock {
  type: 'action'
  action: ActionBlockType
  id: string
}

interface LoopBlock {
  type: 'loop'
  count: number
  blocks: CodeBlock[]
  id: string
}

// Level Config
interface BlockLevel {
  id: number
  title: string
  width: number
  height: number
  start: Position
  gems: Gem[]
  obstacles: Position[]
  algorithm?: 'bfs' | 'dfs' | 'astar'
  difficulty?: 'easy' | 'medium' | 'hard'
  description?: string
}
```

### Component API

```typescript
// GameEngine Props
<PhaserEngine
  level={BlockLevel}
  blocks={string[]}              // ['UP', 'RIGHT', 'DOWN', ...]
  runTrigger={number}            // Timestamp to trigger execution
  stopTrigger={number}           // Timestamp to stop execution
  onFinish={(success) => void}   // Called when execution completes
  onGemsUpdate={(count) => void} // Called when gem collected
/>
```

### Development Tips

1. **Adding New Commands**
   - Add to `ActionBlockType` union
   - Update `CHARACTER_SPRITES` mapping
   - Add color in `baseColors` object
   - Update GameEngine logic

2. **Creating New Block Type**
   - Extend `CodeBlock` union
   - Update `flattenBlocks()` handler
   - Create UI component
   - Add to command palette

3. **Testing Algorithms**
   ```typescript
   // Console test
   const path = bfs(
     {x: 2, y: 5}, 
     {x: 9, y: 5}, 
     12, 9, 
     [{x: 5, y: 5}]
   );
   console.log(pathToCommands(path));
   ```

---

## 🎨 Visual Design System

### Colors
```javascript
const colors = {
  primary: '#667eea',        // Purple gradient start
  secondary: '#764ba2',      // Purple gradient end
  background: '#1a1a1a',     // Main dark background
  surface: '#2a2a2a',        // Secondary surface
  up: '#3498db',             // Blue (UP)
  down: '#e74c3c',           // Red (DOWN)
  left: '#9b59b6',           // Purple (LEFT)
  right: '#f39c12',          // Orange (RIGHT)
  success: '#2ecc71',        // Green (Success)
  danger: '#e74c3c',         // Red (Danger)
  warning: '#f39c12',        // Orange (Warning)
  text: '#ecf0f1',           // Light text
  muted: '#7f8c8d'           // Muted text
}
```

### Typography
- Headers: Bold, uppercase, uppercase
- Buttons: Bold, 14-20px
- Body: Regular, 12-14px
- Monospace: For code/algorithms

### Spacing
- Small: 8px
- Medium: 12-16px
- Large: 24px
- XL: 40px+

---

## 📊 Performance Guidelines

| Task | Target | Status |
|------|--------|--------|
| Game load | < 2s | ✅ |
| Block add | < 100ms | ✅ |
| Execution | Smooth | ✅ |
| Memory | < 50MB | ✅ |
| Render FPS | 60 | ✅ |

### Optimization Tips
1. Memoize expensive computations
2. Use `dynamicImport` for game engine
3. Clean up Phaser resources on unmount
4. Batch particle effects
5. Cache path calculations

---

## 🔗 Important Links

- [GitHub Repo](#)
- [Design Specs](#)
- [API Documentation](#)
- [Bug Tracker](#)
- [Roadmap](#)

---

## ⚡ Energy-Saving Tips

- Pause animations when not focused
- Reduce particle count on mobile
- Clean up tweens when switching levels
- Unload unused Phaser resources

---

## 📝 Changelog

### v2.0 (Current)
- ✅ Modern UI with gradient theme
- ✅ Loop/repeat block support
- ✅ Enhanced character animations
- ✅ Particle effects
- ✅ Algorithm utilities (BFS, DFS, A*)
- ✅ Nested code block structure
- ✅ Level metadata (difficulty, algorithm)

### v1.0 (Previous)
- Basic movement commands
- Simple gem collection
- 21 level progression
- Sound effects

---

**Last Updated**: March 2026  
**Status**: Production Ready  
**Version**: 2.0.0
