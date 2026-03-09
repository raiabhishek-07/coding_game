import { BlockLevel } from '../blockLevelTypes';

export const level3: BlockLevel = {
  "id": 3,
  "title": "Collect Items",
  "theme": "beach",
  "mission": "Collect all 3 gems in the clearing.",
  "description": "Use the COLLECT command to pick up multiple gems.",
  "start": {
    "x": 2,
    "y": 2
  },
  "gems": [
    {
      "x": 4,
      "y": 2,
      "id": 301,
      "collected": false
    },
    {
      "x": 4,
      "y": 4,
      "id": 302,
      "collected": false
    },
    {
      "x": 2,
      "y": 4,
      "id": 303,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "COLLECT"
    ]
  }
};

export default level3;
