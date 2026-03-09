import { BlockLevel } from '../blockLevelTypes';

export const level11: BlockLevel = {
  "id": 11,
  "title": "Conditional Path",
  "theme": "forest",
  "mission": "Navigate the path with possible enemies.",
  "description": "If there's an enemy, attack. Otherwise, move forward.",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 7,
      "y": 2,
      "id": 1101,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 4,
      "y": 2,
      "id": 11001,
      "type": "robot",
      "health": 1
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "condition"
    ]
  }
};

export default level11;
