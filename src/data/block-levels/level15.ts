import { BlockLevel } from '../blockLevelTypes';

export const level15: BlockLevel = {
  "id": 15,
  "title": "Function Basics",
  "theme": "abyss",
  "mission": "Define a function to collect gems.",
  "description": "Group common commands into a Function for cleaner code.",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 5,
      "y": 2,
      "id": 1501,
      "collected": false
    },
    {
      "x": 5,
      "y": 5,
      "id": 1502,
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

export default level15;
