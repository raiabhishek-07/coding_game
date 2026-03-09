import { BlockLevel } from '../blockLevelTypes';

export const level10: BlockLevel = {
  "id": 10,
  "title": "Enemy Detection",
  "theme": "forest",
  "mission": "Use SCAN to find enemies in the grass.",
  "description": "Check your surroundings before moving!",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 6,
      "y": 2,
      "id": 1001,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 4,
      "y": 2,
      "id": 10001,
      "type": "robot",
      "health": 1
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "SCAN"
    ]
  }
};

export default level10;
