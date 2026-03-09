import { BlockLevel } from '../blockLevelTypes';

export const level20: BlockLevel = {
  "id": 20,
  "title": "Advanced Strategy",
  "theme": "abyss",
  "mission": "Survive the enemy waves.",
  "description": "Combine functions, loops, and conditions to survive.",
  "start": {
    "x": 4,
    "y": 4
  },
  "enemies": [
    {
      "x": 2,
      "y": 2,
      "id": 20001,
      "type": "robot",
      "health": 1
    },
    {
      "x": 6,
      "y": 2,
      "id": 20002,
      "type": "robot",
      "health": 1
    },
    {
      "x": 2,
      "y": 6,
      "id": 20003,
      "type": "robot",
      "health": 1
    },
    {
      "x": 6,
      "y": 6,
      "id": 20004,
      "type": "robot",
      "health": 1
    }
  ],
  "gems": [
    {
      "x": 4,
      "y": 0,
      "id": 2001,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {}
};

export default level20;
