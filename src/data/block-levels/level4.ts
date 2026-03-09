import { BlockLevel } from '../blockLevelTypes';

export const level4: BlockLevel = {
  "id": 4,
  "title": "Enemy Introduction",
  "theme": "beach",
  "mission": "Defeat the crab robot and reach the exit.",
  "description": "An enemy blocks your path! Use ATTACK to clear the way.",
  "start": {
    "x": 2,
    "y": 4
  },
  "gems": [
    {
      "x": 8,
      "y": 4,
      "id": 401,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 5,
      "y": 4,
      "id": 4001,
      "type": "robot",
      "health": 1
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "ATTACK"
    ]
  }
};

export default level4;
