import { BlockLevel } from '../blockLevelTypes';

export const level12: BlockLevel = {
  "id": 12,
  "title": "Trap Avoidance",
  "theme": "forest",
  "mission": "Avoid the spike traps.",
  "description": "Use logical checks to detect and avoid dangerous tiles.",
  "start": {
    "x": 2,
    "y": 1
  },
  "gems": [
    {
      "x": 2,
      "y": 8,
      "id": 1201,
      "collected": false
    }
  ],
  "obstacles": [
    {
      "x": 2,
      "y": 3
    },
    {
      "x": 2,
      "y": 5
    },
    {
      "x": 2,
      "y": 7
    }
  ],
  "constraints": {
    "requiredBlockTypes": [
      "condition"
    ]
  }
};

export default level12;
