import { BlockLevel } from '../blockLevelTypes';

export const level17: BlockLevel = {
  "id": 17,
  "title": "Enemy Strategy",
  "theme": "abyss",
  "mission": "Develop a strategy for different enemy types.",
  "description": "Differentiate your tactics based on enemy speed and armor.",
  "start": {
    "x": 2,
    "y": 2
  },
  "enemies": [
    {
      "x": 4,
      "y": 2,
      "id": 17001,
      "type": "robot",
      "health": 1
    },
    {
      "x": 6,
      "y": 6,
      "id": 17002,
      "type": "guardian",
      "health": 3
    }
  ],
  "gems": [
    {
      "x": 8,
      "y": 8,
      "id": 1701,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {}
};

export default level17;
