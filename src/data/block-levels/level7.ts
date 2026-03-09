import { BlockLevel } from '../blockLevelTypes';

export const level7: BlockLevel = {
  "id": 7,
  "title": "Mini Boss",
  "theme": "beach",
  "mission": "Defeat the Guardian Crab.",
  "description": "A tougher foe! You'll need multiple attacks to win.",
  "start": {
    "x": 2,
    "y": 5
  },
  "gems": [
    {
      "x": 8,
      "y": 5,
      "id": 701,
      "collected": false
    }
  ],
  "enemies": [
    {
      "x": 5,
      "y": 5,
      "id": 7001,
      "type": "guardian",
      "health": 3,
      "isBoss": true
    }
  ],
  "obstacles": [],
  "constraints": {}
};

export default level7;
