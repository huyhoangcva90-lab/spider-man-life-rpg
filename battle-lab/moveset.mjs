// Native animation catalogue only. No combat values or Notion skills.
export const GAME_MOVES=[
  {
    "id": "punch",
    "source": "Attack1",
    "name": "Đấm thẳng",
    "group": "basic",
    "clips": [
      "Attack1"
    ],
    "description": "Đấm thẳng. Chuỗi clip gốc: Attack1.",
    "contactClip": "Attack1",
    "flip": false
  },
  {
    "id": "attack2",
    "source": "Attack2",
    "name": "Đòn tay tiếp nối",
    "group": "basic",
    "clips": [
      "Attack2"
    ],
    "description": "Đòn tay tiếp nối. Chuỗi clip gốc: Attack2.",
    "contactClip": "Attack2",
    "flip": false
  },
  {
    "id": "kick",
    "source": "Attack3",
    "name": "Đá thấp / xoay người",
    "group": "basic",
    "clips": [
      "Attack3"
    ],
    "description": "Đá thấp / xoay người. Chuỗi clip gốc: Attack3.",
    "contactClip": "Attack3",
    "flip": false
  },
  {
    "id": "launch",
    "source": "Attack4",
    "name": "Đòn đánh hướng lên",
    "group": "basic",
    "clips": [
      "Attack4"
    ],
    "description": "Đòn đánh hướng lên. Chuỗi clip gốc: Attack4.",
    "contactClip": "Attack4",
    "flip": false
  },
  {
    "id": "charged",
    "source": "Attackcharged",
    "name": "Kéo bằng tơ",
    "group": "basic",
    "clips": [
      "Attackchargedstart",
      "Attackchargedheld",
      "Attackcharged",
      "Attackchargedend"
    ],
    "description": "Kéo bằng tơ. Chuỗi clip gốc: Attackchargedstart → Attackchargedheld → Attackcharged → Attackchargedend.",
    "contactClip": "Attackcharged",
    "flip": true
  },
  {
    "id": "sprint",
    "source": "Attacksprinting",
    "name": "Trượt đá",
    "group": "basic",
    "clips": [
      "Attacksprinting"
    ],
    "description": "Trượt đá. Chuỗi clip gốc: Attacksprinting.",
    "contactClip": "Attacksprinting",
    "flip": false
  },
  {
    "id": "swing",
    "source": "Attackswinging",
    "name": "Đá khi đu tơ",
    "group": "air",
    "clips": [
      "Attackswinging"
    ],
    "description": "Đá khi đu tơ. Chuỗi clip gốc: Attackswinging.",
    "contactClip": "Attackswinging",
    "flip": false
  },
  {
    "id": "aircombo",
    "source": "Attackair",
    "name": "Đá trên không",
    "group": "air",
    "clips": [
      "Attackairstart",
      "Attackair"
    ],
    "description": "Đá trên không. Chuỗi clip gốc: Attackairstart → Attackair.",
    "contactClip": "Attackair",
    "flip": false
  },
  {
    "id": "web",
    "source": "Power1",
    "name": "Bắn tơ · dạng 1",
    "group": "web",
    "clips": [
      "Power1start",
      "Power1",
      "Power1end"
    ],
    "description": "Bắn tơ · dạng 1. Chuỗi clip gốc: Power1start → Power1 → Power1end.",
    "contactClip": "Power1",
    "flip": false
  },
  {
    "id": "impact",
    "source": "Power2",
    "name": "Bắn tơ · dạng 2",
    "group": "web",
    "clips": [
      "Power2",
      "Power2end"
    ],
    "description": "Bắn tơ · dạng 2. Chuỗi clip gốc: Power2 → Power2end.",
    "contactClip": "Power2",
    "flip": false
  },
  {
    "id": "airweb",
    "source": "Powerair1",
    "name": "Tơ trên không · dạng 1",
    "group": "air",
    "clips": [
      "Powerair1start",
      "Powerair1",
      "Powerair1end"
    ],
    "description": "Tơ trên không · dạng 1. Chuỗi clip gốc: Powerair1start → Powerair1 → Powerair1end.",
    "contactClip": "Powerair1",
    "flip": false
  },
  {
    "id": "airburst",
    "source": "Powerair2",
    "name": "Tơ trên không · dạng 2",
    "group": "air",
    "clips": [
      "Powerair2",
      "Powerair2end"
    ],
    "description": "Tơ trên không · dạng 2. Chuỗi clip gốc: Powerair2 → Powerair2end.",
    "contactClip": "Powerair2",
    "flip": false
  },
  {
    "id": "webswing",
    "source": "Webswing",
    "name": "Đu tơ",
    "group": "defense",
    "clips": [
      "Webswing"
    ],
    "description": "Đu tơ. Chuỗi clip gốc: Webswing.",
    "contactClip": "Webswing",
    "flip": false
  },
  {
    "id": "dodge",
    "source": "Dodge",
    "name": "Né tránh",
    "group": "defense",
    "clips": [
      "Dodge"
    ],
    "description": "Né tránh. Chuỗi clip gốc: Dodge.",
    "contactClip": "Dodge",
    "flip": false
  },
  {
    "id": "special",
    "source": "Special",
    "name": "Động tác đặc biệt",
    "group": "special",
    "clips": [
      "Special"
    ],
    "description": "Động tác đặc biệt. Chuỗi clip gốc: Special.",
    "contactClip": "Special",
    "flip": false
  }
];
export const GAME_STATES=[
  {
    "id": "idle",
    "name": "Đứng chờ",
    "clips": [
      "Idle"
    ]
  },
  {
    "id": "walk",
    "name": "Đi bộ",
    "clips": [
      "Walkstart",
      "Walk"
    ]
  },
  {
    "id": "run",
    "name": "Chạy",
    "clips": [
      "Sprintstart",
      "Sprint",
      "Sprintend"
    ]
  },
  {
    "id": "jump",
    "name": "Nhảy / tiếp đất",
    "clips": [
      "Jump",
      "Jumpapex",
      "Jumpfall",
      "Land"
    ]
  },
  {
    "id": "sense",
    "name": "Spider sense · hiệu ứng",
    "clips": [
      "Spidersense"
    ]
  },
  {
    "id": "hit",
    "name": "Trúng đòn",
    "clips": [
      "Hitstun"
    ]
  },
  {
    "id": "fall",
    "name": "Ngã / đứng dậy",
    "clips": [
      "Kd",
      "Kdfall",
      "Downbounce",
      "Down",
      "Downgetup"
    ]
  },
  {
    "id": "spawn",
    "name": "Xuất hiện",
    "clips": [
      "Spawnrainbow",
      "Spawnrainbowend"
    ]
  },
  {
    "id": "select",
    "name": "Chọn nhân vật",
    "clips": [
      "Selectscreenstart",
      "Selectscreen",
      "Selectscreenend"
    ]
  }
];
