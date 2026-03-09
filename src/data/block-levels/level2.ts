import { BlockLevel } from '../blockLevelTypes';

export const level2: BlockLevel = {
  "id": 2,
  "title": "Path Navigation",
  "theme": "beach",
  "mission": "Navigate around the rocks.",
  "description": "Rocks are blocking the direct path. You must go around them!",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 6,
      "y": 6,
      "id": 201,
      "collected": false
    }
  ],
  "obstacles": [
    {
      "x": 4,
      "y": 2
    },
    {
      "x": 4,
      "y": 3
    },
    {
      "x": 4,
      "y": 4
    }
  ],
  "constraints": {
    "maxBlocks": 10
  }
};

export default level2;
