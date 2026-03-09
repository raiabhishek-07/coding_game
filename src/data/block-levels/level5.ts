import { BlockLevel } from '../blockLevelTypes';

export const level5: BlockLevel = {
  "id": 5,
  "title": "Timing Puzzle",
  "theme": "beach",
  "mission": "Wait for the right moment to cross.",
  "description": "Some obstacles require timing. Move carefully!",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 7,
      "y": 2,
      "id": 501,
      "collected": false
    }
  ],
  "obstacles": [
    {
      "x": 4,
      "y": 1
    },
    {
      "x": 4,
      "y": 3
    },
    {
      "x": 5,
      "y": 2
    }
  ],
  "constraints": {}
};

export default level5;
