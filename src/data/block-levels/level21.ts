import { BlockLevel } from '../blockLevelTypes';

export const level21: BlockLevel = {
  "id": 21,
  "title": "Final Boss",
  "theme": "abyss",
  "mission": "Defeat the Ancient Code Dragon.",
  "description": "Use everything you've learned to defeat the ultimate boss!",
  "start": {
    "x": 2,
    "y": 5
  },
  "enemies": [
    {
      "x": 7,
      "y": 5,
      "id": 21001,
      "type": "dragon",
      "health": 20,
      "isBoss": true
    }
  ],
  "gems": [
    {
      "x": 9,
      "y": 5,
      "id": 2101,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "loop",
      "condition",
      "function"
    ]
  }
};

export default level21;
