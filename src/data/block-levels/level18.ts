import { BlockLevel } from '../blockLevelTypes';

export const level18: BlockLevel = {
  "id": 18,
  "title": "Resource Strategy",
  "theme": "abyss",
  "mission": "Collect, avoid, and fight your way to the exit.",
  "description": "Use multi-condition logic to handle various obstacles.",
  "start": {
    "x": 1,
    "y": 1
  },
  "gems": [
    {
      "x": 8,
      "y": 8,
      "id": 1801,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 3,
      "y": 3,
      "id": 18001,
      "type": "robot",
      "health": 1
    }
  ],
  "obstacles": [
    {
      "x": 5,
      "y": 5
    }
  ],
  "constraints": {}
};

export default level18;
