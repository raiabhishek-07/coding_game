import { BlockLevel } from '../blockLevelTypes';

export const level14: BlockLevel = {
  "id": 14,
  "title": "Forest Boss",
  "theme": "forest",
  "mission": "Defeat the Stone Golem.",
  "description": "Combine loops and conditions to defeat the forest guardian!",
  "start": {
    "x": 1,
    "y": 5
  },
  "gems": [
    {
      "x": 9,
      "y": 5,
      "id": 1401,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 5,
      "y": 5,
      "id": 14001,
      "type": "golem",
      "health": 10,
      "isBoss": true
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "loop",
      "condition"
    ]
  }
};

export default level14;
