# Block Programming System - Quick Start Guide

## 🚀 Getting Started

### For Players
1. Navigate to a Block Adventure level (`/block-adventure/play/[levelId]`)
2. On the left sidebar, see the **Block Palette** with 15 different blocks
3. Drag blocks from categories to the **Workspace**
4. Edit parameters (numbers, select options)
5. Click **RUN** to execute blocks
6. Try **Undo**, **Redo**, **Export**, **Import** in the toolbar

### For Developers

#### Adding a New Block Type

1. **Define in BlockTypes.ts**:
```typescript
myNewBlock: {
  id: 'myNewBlock',
  category: 'movement',
  label: 'My Block',
  icon: '🎯',
  color: '#3498db',
  borderColor: '#2980b9',
  params: [
    { name: 'distance', type: 'number', default: 1 }
  ],
  connectable: 'both',
  canNest: true,
  description: 'Does something cool'
}
```

2. **Add compiler support in BlockCompiler.ts**:
```typescript
if (block.blockType === 'myNewBlock') {
  const distance = block.params['distance'] as number;
  return {
    type: 'action',
    action: 'UP' // or generate path
  };
}
```

3. **Add GameEngine handler** (if special action):
```typescript
if (typeof cmd === 'object' && cmd.type === 'myAction') {
  // Handle custom action
}
```

---

## 📋 File Structure

```
src/
├── app/block-adventure/
│   ├── play/[levelId]/
│   │   └── page.tsx ..................... Main game UI with editor
│   └── GameEngine.tsx ................... Phaser game with command execution
└── components/BlockProgramming/
    ├── BlockTypes.ts .................... Block definitions & types
    ├── Block.tsx ........................ Single block UI component
    ├── BlockPalette.tsx ................. Category sidebar
    ├── BlockWorkspace.tsx ............... Canvas for arranging blocks
    ├── BlockCompiler.ts ................. Compilation & validation
    ├── BlockProgrammingEditor.tsx ....... Main container
    └── index.ts ......................... Exports
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────┐
│  BlockProgrammingEditor             │
│  ┌─────────────┬─────────────────┐  │
│  │BlockPalette │ BlockWorkspace  │  │
│  │(categories) │ (canvas)        │  │
│  └─────────────┴─────────────────┘  │
│         │              │             │
│  blocks: BlockInstance[]            │
│         │              │             │
│  onExecute(commands)   ◄──────────   │
└─────────────────────────────────────┘
         │
    [User clicks RUN]
         │
    ▼─────────────────────────────────────
    │ BlockCompiler.compileBlocks()
    │ BlockInstance[] → CompiledBlock[]
    ▼─────────────────────────────────────
    │ BlockCompiler.flattenCompiledBlocks()
    │ CompiledBlock[] → FlatCommand[]
    ▼─────────────────────────────────────
play/[levelId]/page.tsx
    │
    ▼─────────────────────────────────────
    onExecuteBlocks(commands)
    │
    ├─ Handle sound actions
    ├─ Handle character changes
    └─ setBlockCommands(expanded)
       └─ setRunTrigger() ────────────────→
             │                            │
    ▼─────────────────────────────────────┘
    GameEngine
    │
    ├─ updatePath(commands)
    │  └─ drawPath() [visualization]
    │
    ├─ runScript()
    │  └─ executeNextStep()
    │     ├─ Normal movement ('UP', 'DOWN', etc)
    │     ├─ Wait action (delay)
    │     ├─ Algorithm block
    │     │  └─ executeAlgorithmBlock()
    │     │     ├─ Find target gem
    │     │     ├─ Generate path (BFS/DFS/A*)
    │     │     └─ Insert into queue
    │     └─ Character/Sound actions
    │
    └─ onFinishSequence(success)
       └─ Update UI / Victory animation
```

---

## 🎨 Block Categories

### Movement
- **Move Up**, **Move Down**, **Move Left**, **Move Right**
- Direct grid-based movement
- Color: Blue (#3498db)

### Control
- **Repeat**: Loop N times 
- **Repeat Forever**: Infinite loop
- **Wait**: Pause execution
- Color: Orange (#f39c12)

### Logic  
- **If Then**: Conditional execution
- **If Then Else**: Two-path conditional
- Color: Purple (#9b59b6)

### Algorithm
- **Run BFS**: Breadth-first pathfinding
- **Run DFS**: Depth-first pathfinding
- **Run A***: A* optimal pathfinding
- Color: Red (#e74c3c)

### Action
- **Change Character**: Switch player sprite
- **Play Sound**: Play SFX
- **Comment**: Notes (non-executing)
- Color: Green (#2ecc71)

---

## 🛠️ Compiler Pipeline

### Stage 1: BlockInstance Array
```typescript
[
  { blockType: 'repeat', params: { times: 3 }, children: [...] },
  { blockType: 'moveUp', params: {}, children: [] }
]
```

### Stage 2: CompiledBlock Array
```typescript
[
  {
    type: 'loop',
    count: 3,
    blocks: [
      { type: 'action', action: 'UP' }
    ]
  }
]
```

### Stage 3: Flattened Commands
```typescript
[
  'UP', 'UP', 'UP',  // Loop expanded 3x
  { type: 'algorithm', algorithm: 'bfs', target: 'nearestGem' }
]
```

### Stage 4: GameEngine Execution
- Processes commands sequentially
- Animates player movement
- Expands algorithm blocks into movement steps
- Handles special actions (wait, sound, character)

---

## 💾 Persistence

### localStorage
- **Key**: `blockProgram_{levelId}`
- **Auto-save**: Every 1 second (debounced)
- **Data**: Full serialized BlockInstance[]

### Export/Import
- **Export**: Downloads JSON file
- **Import**: File picker → validates → loads

### Manual Undo/Redo
- **Undo**: Reverts to previous state
- **Redo**: Re-applies undone changes
- **History**: Unlimited states

---

## ⚠️ Error Handling

### Validation Types

| Severity | Message | Action |
|----------|---------|--------|
| **Error** | Missing parameters | Block won't execute |
| **Warning** | Deep nesting | Execution continues |
| **Info** | Code quality | Just informational |

### Error Display
- Validation panel shows below workspace
- Click to dismiss or scroll through issues
- Color-coded by severity

---

## 🧪 Testing Commands

### Test Scenario 1: Basic Movement
1. Add 4 Move Up blocks
2. Click RUN
3. Observe player moves up 4 cells
4. ✅ Should reach wall and fail if at top

### Test Scenario 2: Loops
1. Add Repeat(3x) block
2. Nest 1 Move Right inside
3. Click RUN
4. ✅ Should move right 3 cells

### Test Scenario 3: Algorithm
1. Add RunBFS block
2. Click RUN
3. ✅ Should generate path to nearest gem
4. ✅ Should execute that path

### Test Scenario 4: Auto-Save
1. Add any blocks
2. Wait 1 second
3. Reload page
4. ✅ Blocks should still be there

### Test Scenario 5: Undo/Redo
1. Add 5 blocks
2. Click Undo (should remove last block)
3. Click Redo (should restore last block)
4. ✅ History should work correctly

---

## 🐛 Common Issues

### "Blocks won't execute"
- Check validation panel for red errors
- Ensure all parameters are set
- Try clearing and rebuilding

### "Algorithm block fails"
- Verify gems exist on level
- Check map boundaries
- Ensure algorithms.ts has BFS/DFS/A* functions

### "Save not working"
- Check browser localStorage is enabled
- Verify localStorage quota not exceeded
- Try exporting to file instead

### "Undo/Redo not working"
- Reload page (clears history)
- History only tracks block changes
- File import/export resets history

---

## 📚 API Reference

### BlockProgrammingEditor Props
```typescript
interface BlockProgrammingEditorProps {
  onExecute: (commands: any[]) => void;     // Called when RUN clicked
  isExecuting: boolean;                      // Disable UI during execution
  onStop: () => void;                        // Called when STOP clicked
  levelId?: number;                          // For localStorage key
  autoSave?: boolean;                        // Enable auto-save (default: true)
}
```

### Block Action Types
```typescript
type FlatCommand = 
  | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'        // Movement
  | { type: 'algorithm'; algorithm: 'bfs' | 'dfs' | 'astar'; target: string }
  | { type: 'wait'; duration: number }       // Milliseconds
  | { type: 'sound'; sound: string }         // Sound name
  | { type: 'character'; char: string }      // Emoji string
```

### Compiler Functions
```typescript
// Convert UI blocks to intermediate format
compileBlocks(blocks: BlockInstance[]): CompiledBlock[]

// Expand loops and flatten to commands
flattenCompiledBlocks(compiled: CompiledBlock[]): FlatCommand[]

// Check for errors/warnings
validateBlocks(blocks: BlockInstance[]): ValidationIssue[]

// Estimate execution time in seconds
estimateExecutionTime(blocks: BlockInstance[]): number

// JSON serialization
serializeBlocks(blocks: BlockInstance[]): string
deserializeBlocks(json: string): BlockInstance[]
```

---

## 🎓 Educational Value

This block programming system teaches:
- **Sequential execution**: Blocks run in order
- **Loops**: Repeat blocks for efficiency
- **Conditionals**: If/Then for decision-making
- **Algorithms**: BFS/DFS/A* for pathfinding
- **Debugging**: Validation panel catches mistakes
- **Persistence**: Save/load programs

Perfect for introducing students to programming concepts!

---

## 📞 Support

For issues or questions:
1. Check the **Validation Panel** for specific errors
2. Review **Block Descriptions** (hover for tooltips)
3. Try **Exporting** blocks to inspect JSON structure
4. Consult documentation files in workspace root

Happy coding! 🎮
