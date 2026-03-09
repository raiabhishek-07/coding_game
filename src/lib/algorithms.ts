/**
 * Algorithm utilities for Block Adventure game
 * Includes DSA algorithms like BFS, DFS, pathfinding
 */

export interface Coordinate { x: number; y: number }

/**
 * Breadth-First Search - finds shortest path
 */
export function bfs(
  start: Coordinate,
  goal: Coordinate,
  width: number,
  height: number,
  obstacles: Coordinate[],
  visualCallback?: (path: Coordinate[]) => void
): Coordinate[] {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const visited = new Set<string>();
  const queue: Array<{ coord: Coordinate; path: Coordinate[] }> = [{ coord: start, path: [start] }];
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { coord, path } = queue.shift()!;

    if (coord.x === goal.x && coord.y === goal.y) {
      visualCallback?.(path);
      return path;
    }

    // Check 4 directions
    const directions = [
      { x: 0, y: -1 },  // up
      { x: 0, y: 1 },   // down
      { x: -1, y: 0 },  // left
      { x: 1, y: 0 },   // right
    ];

    for (const dir of directions) {
      const nx = coord.x + dir.x;
      const ny = coord.y + dir.y;
      const key = `${nx},${ny}`;

      if (
        nx >= 1 &&
        nx < width - 1 &&
        ny >= 1 &&
        ny < height - 1 &&
        !visited.has(key) &&
        !obstacleSet.has(key)
      ) {
        visited.add(key);
        queue.push({ coord: { x: nx, y: ny }, path: [...path, { x: nx, y: ny }] });
      }
    }
  }

  return []; // No path found
}

/**
 * Depth-First Search - finds a path (not necessarily shortest)
 */
export function dfs(
  start: Coordinate,
  goal: Coordinate,
  width: number,
  height: number,
  obstacles: Coordinate[],
  visualCallback?: (path: Coordinate[]) => void
): Coordinate[] {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const visited = new Set<string>();

  function dfsHelper(coord: Coordinate, path: Coordinate[]): Coordinate[] {
    const key = `${coord.x},${coord.y}`;
    if (visited.has(key)) return [];
    visited.add(key);

    if (coord.x === goal.x && coord.y === goal.y) {
      visualCallback?.(path);
      return path;
    }

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const nx = coord.x + dir.x;
      const ny = coord.y + dir.y;

      if (
        nx >= 1 &&
        nx < width - 1 &&
        ny >= 1 &&
        ny < height - 1 &&
        !obstacleSet.has(`${nx},${ny}`)
      ) {
        const result = dfsHelper({ x: nx, y: ny }, [...path, { x: nx, y: ny }]);
        if (result.length > 0) return result;
      }
    }

    return [];
  }

  return dfsHelper(start, [start]);
}

/**
 * A* pathfinding - optimal pathfinding algorithm
 */
export function aStar(
  start: Coordinate,
  goal: Coordinate,
  width: number,
  height: number,
  obstacles: Coordinate[]
): Coordinate[] {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));

  const heuristic = (a: Coordinate, b: Coordinate) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  interface Node {
    coord: Coordinate;
    g: number; // cost from start
    h: number; // heuristic cost to goal
    f: number; // g + h
    parent: Node | null;
  }

  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  const nodeMap = new Map<string, Node>();

  const startNode: Node = {
    coord: start,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null,
  };

  nodeMap.set(`${start.x},${start.y}`, startNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f score
    let current = openSet[0];
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < current.f) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    if (current.coord.x === goal.x && current.coord.y === goal.y) {
      // Reconstruct path
      const path: Coordinate[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node.coord);
        node = node.parent;
      }
      return path;
    }

    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.coord.x},${current.coord.y}`);

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const nx = current.coord.x + dir.x;
      const ny = current.coord.y + dir.y;
      const key = `${nx},${ny}`;

      if (
        nx >= 1 &&
        nx < width - 1 &&
        ny >= 1 &&
        ny < height - 1 &&
        !closedSet.has(key) &&
        !obstacleSet.has(key)
      ) {
        const g = current.g + 1;
        const h = heuristic({ x: nx, y: ny }, goal);
        const f = g + h;

        let neighbor = nodeMap.get(key);
        if (!neighbor) {
          neighbor = { coord: { x: nx, y: ny }, g, h, f, parent: current };
          nodeMap.set(key, neighbor);
          openSet.push(neighbor);
        } else if (g < neighbor.g) {
          neighbor.g = g;
          neighbor.f = f;
          neighbor.parent = current;
        }
      }
    }
  }

  return []; // No path found
}

/**
 * Check if a path visits all gems
 */
export function pathVisitsAllGems(path: Coordinate[], gems: Coordinate[]): boolean {
  const gemSet = new Set(gems.map(g => `${g.x},${g.y}`));
  for (const coord of path) {
    gemSet.delete(`${coord.x},${coord.y}`);
  }
  return gemSet.size === 0;
}

/**
 * Convert a path to movement commands
 */
export function pathToCommands(path: Coordinate[]): Array<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> {
  const commands: Array<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = [];
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;

    if (dx === 1) commands.push('RIGHT');
    else if (dx === -1) commands.push('LEFT');
    else if (dy === 1) commands.push('DOWN');
    else if (dy === -1) commands.push('UP');
  }
  return commands;
}
