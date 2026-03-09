import { BlockLevel } from '../blockLevelTypes';

export const level13: BlockLevel = {
  "id": 13,
  "title": "Smart Combat",
  "theme": "forest",
  "mission": "Decide whether to fight or fly.",
  "description": "If it's a weak enemy, attack. If it's a Golem, stay away!",
  "start": {
    "x": 2,
    "y": 4
  },
  "gems": [
    {
      "x": 8,
      "y": 4,
      "id": 1301,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 4,
      "y": 4,
      "id": 13001,
      "type": "robot",
      "health": 1
    },
    {
      "x": 6,
      "y": 4,
      "id": 13002,
      "type": "golem",
      "health": 5
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "condition"
    ]
  }
};

export default level13;
