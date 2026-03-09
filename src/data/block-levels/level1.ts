import { BlockLevel } from '../blockLevelTypes';

export const level1: BlockLevel = {
  "id": 1,
  "title": "First Steps",
  "theme": "beach",
  "mission": "Reach the treasure gem.",
  "description": "Welcome Explorer! Use basic move commands to reach the gem.",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 6,
      "y": 2,
      "id": 101,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "maxBlocks": 5
  }
};

export default level1;
