import { BlockLevel } from '../blockLevelTypes';

export const level16: BlockLevel = {
  "id": 16,
  "title": "Reusable Logic",
  "theme": "abyss",
  "mission": "Use functions multiple times.",
  "description": "Write once, run everywhere! Reusing logic saves time.",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 4,
      "y": 2,
      "id": 1601,
      "collected": false
    },
    {
      "x": 6,
      "y": 4,
      "id": 1602,
      "collected": false
    },
    {
      "x": 8,
      "y": 6,
      "id": 1603,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "function"
    ]
  }
};

export default level16;
