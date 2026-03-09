import { BlockLevel } from '../blockLevelTypes';

export const level9: BlockLevel = {
  "id": 9,
  "title": "Resource Mining",
  "theme": "forest",
  "mission": "Mine all 5 crystals in the cave.",
  "description": "Loops are perfect for repetitive tasks like mining.",
  "start": {
    "x": 5,
    "y": 1
  },
  "gems": [
    {
      "x": 5,
      "y": 3,
      "id": 901,
      "collected": false
    },
    {
      "x": 5,
      "y": 4,
      "id": 902,
      "collected": false
    },
    {
      "x": 5,
      "y": 5,
      "id": 903,
      "collected": false
    },
    {
      "x": 5,
      "y": 6,
      "id": 904,
      "collected": false
    },
    {
      "x": 5,
      "y": 7,
      "id": 905,
      "collected": false
    }
  ],
  "obstacles": [],
  "constraints": {
    "requiredBlockTypes": [
      "loop"
    ]
  }
};

export default level9;
