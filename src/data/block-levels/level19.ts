import { BlockLevel } from '../blockLevelTypes';

export const level19: BlockLevel = {
  "id": 19,
  "title": "Pathfinding Puzzle",
  "theme": "abyss",
  "mission": "Find the optimal path to the goal.",
  "description": "Use algorithmic thinking to solve this complex maze.",
  "start": {
    "x": 1,
    "y": 1
  },
  "gems": [
    {
      "x": 8,
      "y": 8,
      "id": 1901,
      "collected": false
    }
  ],
  "obstacles": [],
  "algorithm": "astar",
  "constraints": {
    "requiredBlockTypes": [
      "algorithm"
    ]
  }
};

export default level19;
