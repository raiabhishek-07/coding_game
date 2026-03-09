import { BlockLevel } from '../blockLevelTypes';

export const level8: BlockLevel = {
  "id": 8,
  "title": "Repeating Path",
  "theme": "forest",
  "mission": "Use a Loop to travel the long road.",
  "description": "Don't repeat yourself! Use the REPEAT block for long paths.",
  "start": {
    "x": 1,
    "y": 5
  },
  "gems": [
    {
      "x": 9,
      "y": 5,
      "id": 801,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "maxBlocks": 3,
    "requiredBlockTypes": [
      "loop"
    ]
  }
};

export default level8;
