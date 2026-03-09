import { BlockLevel } from '../blockLevelTypes';

export const level6: BlockLevel = {
  "id": 6,
  "title": "Maze Challenge",
  "theme": "beach",
  "mission": "Find the path through the jungle maze.",
  "description": "Plan your sequence carefully to escape the jungle.",
  "start": {
    "x": 1,
    "y": 1
  },
  "gems": [
    {
      "x": 8,
      "y": 8,
      "id": 601,
      "collected": false
    }
  ],
  "obstacles": [
    {
      "x": 2,
      "y": 1
    },
    {
      "x": 2,
      "y": 2
    },
    {
      "x": 2,
      "y": 3
    },
    {
      "x": 4,
      "y": 0
    },
    {
      "x": 4,
      "y": 1
    },
    {
      "x": 4,
      "y": 2
    }
  ],
  "constraints": {}
};

export default level6;
