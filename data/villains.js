/* ==========================================================================
   SPIDER-MAN LIFE RPG - VILLAINS SEED DATA (30 VILLAINS COMPENDIUM)
   ========================================================================== */

const VILLAINS_DATA = [
  {
    id: "docock",
    name: "Doctor Octopus",
    title: "Dr. Otto Octavius",
    category: "science",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "intellect",
    maxHp: 1000,
    maxArmor: 300,
    staggerThreshold: 100,
    mediaId: "docock",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Mechanical Arm Rampage", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.75, title: "Overclocked AI", armorMultiplier: 1.2, damageTakenMultiplier: 0.9 },
      { phase: 3, hpPercent: 0.50, title: "Desperate Neural Overdrive", armorMultiplier: 1.5, damageTakenMultiplier: 0.8 },
      { phase: 4, hpPercent: 0.25, title: "Final Mastermind Protocol", armorMultiplier: 2.0, damageTakenMultiplier: 0.7 }
    ],
    icon: "🐙",
    description: "Nhà khoa học thiên tài với 4 cánh tay cơ khí bạch tuộc. Điểm yếu lớn nhất là sự lập kế hoạch Trí Tuệ (Intellect).",
    mechanics: {
      description: "Lane/complexity pressure. Match Intellect or milestone to bypass 50% armor.",
      armorPressure: { bypassAttribute: "intellect", bypassTags: ["milestone"], bypassPct: 0.5 }
    },
    lootTable: [
      { itemId: "item_anti_ock_suit_bp", name: "Anti-Ock Suit Blueprint", dropChance: 1.0 },
      { itemId: "item_gold_chest_500", name: "500 Gold Chest", dropChance: 1.0 }
    ]
  },
  {
    id: "greengoblin",
    name: "Green Goblin",
    title: "Norman Osborn",
    category: "science",
    universe: "Earth-616",
    difficulty: "Expert",
    weakness: "discipline",
    maxHp: 1400,
    maxArmor: 400,
    staggerThreshold: 120,
    mediaId: "greengoblin",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Pumpkin Bomb Barrage", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.65, title: "Goblin Glider Aerial Assault", armorMultiplier: 1.3, damageTakenMultiplier: 0.85 },
      { phase: 3, hpPercent: 0.30, title: "Madness Overdrive", armorMultiplier: 1.8, damageTakenMultiplier: 0.75 }
    ],
    icon: "👺",
    description: "Chủ tịch Oscorp bị quỷ hóa bởi Serum. Tác động đòn phá hoại tâm lý và sự hỗn loạn. Yêu cầu sự Kỷ Luật (Discipline).",
    lootTable: [
      { itemId: "gadget_glider_tech", name: "Oscorp Glider Tech", dropChance: 1.0 }
    ]
  },
  {
    id: "venom",
    name: "Venom",
    title: "Eddie Brock & Symbiote",
    category: "symbiote",
    universe: "Earth-616",
    difficulty: "Master",
    weakness: "willpower",
    maxHp: 2000,
    maxArmor: 600,
    staggerThreshold: 150,
    mediaId: "venom",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "We Are Venom", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Symbiote Rage Unleashed", armorMultiplier: 1.6, damageTakenMultiplier: 0.8 }
    ],
    icon: "🖤",
    description: "Sinh vật cộng sinh ngoạn mục với sức mạnh thể chất vượt trội. Cần Ý Chí (Willpower) kiên cường để chế ngự.",
    lootTable: [
      { itemId: "suit_symbiote_black", name: "Symbiote Black Suit", dropChance: 1.0 }
    ]
  },
  {
    id: "carnage",
    name: "Carnage",
    title: "Cletus Kasady",
    category: "symbiote",
    universe: "Earth-616",
    difficulty: "Master",
    weakness: "willpower",
    maxHp: 2200,
    maxArmor: 500,
    staggerThreshold: 160,
    mediaId: "carnage",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Maximum Carnage", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.40, title: "Blood Tendril Spikes", armorMultiplier: 1.5, damageTakenMultiplier: 0.8 }
    ],
    icon: "🩸",
    description: "Kẻ sát nhân tàn bạo hòa làm một với Symbiote đỏ máu. Cuộc chiến hỗn loạn đòi hỏi Ý Chí thép.",
    lootTable: [
      { itemId: "item_gold_chest_500", name: "Symbiote Tendril Trophy", dropChance: 1.0 }
    ]
  },
  {
    id: "mysterio",
    name: "Mysterio",
    title: "Quentin Beck",
    category: "science",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "focus",
    maxHp: 1100,
    maxArmor: 250,
    staggerThreshold: 90,
    mediaId: "mysterio",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Master of Illusions", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Drone Swarm Hallucination", armorMultiplier: 1.4, damageTakenMultiplier: 0.85 }
    ],
    icon: "🔮",
    description: "Bậc thầy ảo ảnh và công nghệ Hologram. Yêu cầu sự Tập Trung (Focus) cao độ để nhìn thấu sự thật.",
    mechanics: {
      description: "Priority/decoy mechanic. Match Focus or priority to reveal weakness, otherwise 50% damage reduction.",
      decoy: { priorityAttribute: "focus", priorityTags: ["priority"], damageReduction: 0.5 }
    },
    lootTable: [
      { itemId: "gadget_smoke_drone", name: "Hologram Drone Tech", dropChance: 1.0 }
    ]
  },
  {
    id: "kraven",
    name: "Kraven The Hunter",
    title: "Sergei Kravinoff",
    category: "street",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "power",
    maxHp: 1300,
    maxArmor: 350,
    staggerThreshold: 110,
    mediaId: "kraven",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Apex Predator Stalking", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "The Last Hunt", armorMultiplier: 1.5, damageTakenMultiplier: 0.8 }
    ],
    icon: "🦁",
    description: "Thợ săn huyền thoại tìm kiếm con mồi xứng đáng nhất. Yêu cầu Sức Mạnh (Power) đỉnh cao để phản công.",
    lootTable: [
      { itemId: "companion_kraven_trophy", name: "Hunter's Trophy", dropChance: 1.0 }
    ]
  },
  {
    id: "lizard",
    name: "The Lizard",
    title: "Dr. Curt Connors",
    category: "science",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "agility",
    maxHp: 950,
    maxArmor: 200,
    staggerThreshold: 80,
    mediaId: "lizard",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Feral Instinct", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Rapid Cellular Regeneration", armorMultiplier: 1.3, damageTakenMultiplier: 0.9 }
    ],
    icon: "🦎",
    description: "Bác sĩ Connors bị đột biến thành thằn lằn khổng lồ với khả năng hồi phục cực nhanh. Yêu cầu Phản Xạ Agility.",
    mechanics: {
      description: "Regeneration. Match Power attribute or health category to suppress.",
      regen: { amount: 50, suppressAttribute: "power", suppressCategory: "health" }
    },
    lootTable: [
      { itemId: "gadget_regen_serum", name: "Regen Serum Sample", dropChance: 1.0 }
    ]
  },
  {
    id: "sandman",
    name: "Sandman",
    title: "Flint Marko",
    category: "science",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "intellect",
    maxHp: 1500,
    maxArmor: 450,
    staggerThreshold: 130,
    mediaId: "sandman",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Sandstorm Shift", armorMultiplier: 1.2, damageTakenMultiplier: 0.8 },
      { phase: 2, hpPercent: 0.50, title: "Colossal Sand Golem", armorMultiplier: 1.7, damageTakenMultiplier: 0.7 }
    ],
    icon: "⏳",
    description: "Tên cướp biến thành khối cát khổng lồ. Cần tư duy khoa học Intellect để hòa tan cấu trúc.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Sand Core Relic", dropChance: 1.0 }]
  },
  {
    id: "electro",
    name: "Electro",
    title: "Max Dillon",
    category: "science",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "agility",
    maxHp: 1150,
    maxArmor: 220,
    staggerThreshold: 95,
    mediaId: "electro",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "High Voltage Discharge", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Lightning Form Overcharge", armorMultiplier: 1.3, damageTakenMultiplier: 0.85 }
    ],
    icon: "⚡",
    description: "Nguồn điện sống có thể dịch chuyển theo dòng điện. Cần Agility nhạy bén để né tránh sấm sét.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Capacitor Battery", dropChance: 1.0 }]
  },
  {
    id: "vulture",
    name: "Vulture",
    title: "Adrian Toomes",
    category: "science",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "agility",
    maxHp: 880,
    maxArmor: 180,
    staggerThreshold: 75,
    mediaId: "vulture",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Aerial Divebomb", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.40, title: "Razor Wing Sweep", armorMultiplier: 1.2, damageTakenMultiplier: 0.9 }
    ],
    icon: "🦅",
    description: "Bác học phát minh đôi cánh bay cao tần. Đòn đánh không trung cần sự Agility dẻo dai.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Feather Blade Blueprint", dropChance: 1.0 }]
  },
  {
    id: "rhino",
    name: "Rhino",
    title: "Aleksei Sytsevich",
    category: "street",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "power",
    maxHp: 1800,
    maxArmor: 550,
    staggerThreshold: 140,
    mediaId: "rhino",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Unstoppable Charge", armorMultiplier: 1.5, damageTakenMultiplier: 0.75 },
      { phase: 2, hpPercent: 0.40, title: "Seismic Ground Slam", armorMultiplier: 2.0, damageTakenMultiplier: 0.65 }
    ],
    icon: "🦏",
    description: "Bộ giáp Tê Giác bọc thép chịu lực siêu khủng. Đòi hỏi Sức Mạnh Power trực diện đánh dạt giáp.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Polymer Armor Scrap", dropChance: 1.0 }]
  },
  {
    id: "scorpion",
    name: "Scorpion",
    title: "Mac Gargan",
    category: "street",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "discipline",
    maxHp: 1050,
    maxArmor: 280,
    staggerThreshold: 90,
    mediaId: "scorpion",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Neurotoxin Tail Strike", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Corrosive Acid Spray", armorMultiplier: 1.3, damageTakenMultiplier: 0.85 }
    ],
    icon: "🦂",
    description: "Được gia cố bộ đuôi bò cạp tiết độc thần kinh gây hoang tưởng. Cần Kỷ Luật Discipline trấn tĩnh.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Venom Tail Segment", dropChance: 1.0 }]
  },
  {
    id: "shocker",
    name: "Shocker",
    title: "Herman Schultz",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Easy",
    weakness: "focus",
    maxHp: 750,
    maxArmor: 150,
    staggerThreshold: 65,
    mediaId: "shocker",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Vibro-Shock Blast", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 }
    ],
    icon: "🥊",
    description: "Kẻ trộm trang bị găng tay phát sóng xung chấn. Yêu cầu Focus để vượt qua các làn sóng chấn động.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Vibro Gauntlet Part", dropChance: 1.0 }]
  },
  {
    id: "kingpin",
    name: "Kingpin",
    title: "Wilson Fisk",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "discipline",
    maxHp: 1600,
    maxArmor: 380,
    staggerThreshold: 125,
    mediaId: "kingpin",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Crime Empire Directives", armorMultiplier: 1.1, damageTakenMultiplier: 0.9 },
      { phase: 2, hpPercent: 0.45, title: "Summon Enforcers & Heavy Brawler", armorMultiplier: 1.6, damageTakenMultiplier: 0.75 }
    ],
    icon: "👔",
    description: "Ông trùm tội phạm cai trị thế giới ngầm New York. Đòi hỏi sự Kỷ Luật thép để phá vỡ mạng lưới empire.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Fisk Diamond Cane", dropChance: 1.0 }]
  },
  {
    id: "misternegative",
    name: "Mister Negative",
    title: "Martin Li",
    category: "supernatural",
    universe: "Earth-616",
    difficulty: "Expert",
    weakness: "willpower",
    maxHp: 1450,
    maxArmor: 320,
    staggerThreshold: 115,
    mediaId: "misternegative",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Negative Energy Blade", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 },
      { phase: 2, hpPercent: 0.50, title: "Demon Guardian Manifestation", armorMultiplier: 1.5, damageTakenMultiplier: 0.8 }
    ],
    icon: "☯️",
    description: "Sở hữu luồng năng lượng âm bản tà ác biến đổi tâm trí. Yêu cầu Ý Chí Willpower để giữ tâm trí kiên định.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Negative Sword Shard", dropChance: 1.0 }]
  },
  {
    id: "tombstone",
    name: "Tombstone",
    title: "Lonnie Lincoln",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "power",
    maxHp: 1200,
    maxArmor: 300,
    staggerThreshold: 100,
    mediaId: "tombstone",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Dermis Hardening", armorMultiplier: 1.3, damageTakenMultiplier: 0.85 }
    ],
    icon: "🪨",
    description: "Làn da biến đổi thành đá rắn chắc bất xâm phạm. Cần Sức Mạnh Power va đập mãnh liệt.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Hardened Dermis Sample", dropChance: 1.0 }]
  },
  {
    id: "hammerhead",
    name: "Hammerhead",
    title: "Joseph Martello",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "intellect",
    maxHp: 1100,
    maxArmor: 290,
    staggerThreshold: 95,
    mediaId: "hammerhead",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Vibranium Skull Ram", armorMultiplier: 1.2, damageTakenMultiplier: 0.9 }
    ],
    icon: "🔨",
    description: "Trùm Maggia sở hữu hộp sọ cấy ghép hợp kim siêu cứng. Cần Trí Tuệ Intellect lừa đòn cụng đầu.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Cyborg Plate Component", dropChance: 1.0 }]
  },
  {
    id: "taskmaster",
    name: "Taskmaster",
    title: "Tony Masters",
    category: "street",
    universe: "Earth-616",
    difficulty: "Expert",
    weakness: "focus",
    maxHp: 1350,
    maxArmor: 310,
    staggerThreshold: 105,
    mediaId: "taskmaster",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Photographic Reflexes Counter", armorMultiplier: 1.1, damageTakenMultiplier: 0.9 },
      { phase: 2, hpPercent: 0.50, title: "Mimicked Avenger Combat Styles", armorMultiplier: 1.4, damageTakenMultiplier: 0.8 }
    ],
    icon: "💀",
    description: "Sát thủ có khả năng sao chép mọi thế võ ngay lập tức. Yêu cầu Focus để tạo ra đòn đánh bất ngờ.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Combat Mimicry Drive", dropChance: 1.0 }]
  },
  {
    id: "prowler",
    name: "Prowler",
    title: "Aaron Davis",
    category: "street",
    universe: "Earth-1610",
    difficulty: "Medium",
    weakness: "agility",
    maxHp: 980,
    maxArmor: 210,
    staggerThreshold: 85,
    mediaId: "prowler",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "High-Tech Stealth Assault", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 }
    ],
    icon: "🟣",
    description: "Tên trộm công nghệ cao với móng vuốt điện tử và động cơ phản lực. Yêu cầu Agility luồn lách.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Prowler Claw Component", dropChance: 1.0 }]
  },
  {
    id: "tinkerer",
    name: "The Tinkerer",
    title: "Phin Mason",
    category: "science",
    universe: "Earth-1048",
    difficulty: "Hard",
    weakness: "intellect",
    maxHp: 1250,
    maxArmor: 330,
    staggerThreshold: 100,
    mediaId: "tinkerer",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Programmable Matter Weapons", armorMultiplier: 1.2, damageTakenMultiplier: 0.85 },
      { phase: 2, hpPercent: 0.40, title: "Nuform Reactor Overcharge", armorMultiplier: 1.7, damageTakenMultiplier: 0.75 }
    ],
    icon: "💡",
    description: "Nhà sáng tạo vũ khí từ vật liệu biến hình Programmable Matter. Yêu cầu Intellect để vô hiệu hóa.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Programmable Matter Core", dropChance: 1.0 }]
  },
  {
    id: "spot",
    name: "The Spot",
    title: "Dr. Jonathan Ohnn",
    category: "multiverse",
    universe: "Earth-688",
    difficulty: "Master",
    weakness: "focus",
    maxHp: 1700,
    maxArmor: 250,
    staggerThreshold: 120,
    mediaId: "spot",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Interdimensional Portal Strike", armorMultiplier: 1.0, damageTakenMultiplier: 0.8 },
      { phase: 2, hpPercent: 0.40, title: "Multiversal Collapse Swarm", armorMultiplier: 1.5, damageTakenMultiplier: 0.65 }
    ],
    icon: "⚪",
    description: "Thực thể không-thời gian phủ kín các cổng hố đen xuyên không gian. Cần sự Tập Trung Focus cực độ.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Multiverse Portal Fragment", dropChance: 1.0 }]
  },
  {
    id: "morbius",
    name: "Morbius",
    title: "Dr. Michael Morbius",
    category: "supernatural",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "willpower",
    maxHp: 1080,
    maxArmor: 220,
    staggerThreshold: 90,
    mediaId: "morbius",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Living Vampire Bloodlust", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 }
    ],
    icon: "🦇",
    description: "Bác sĩ Ma Cà Rồng sống bị dằn xé bởi cơn thèm máu. Cần Ý Chí Willpower khống chế áp lực.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Vampiric Blood Serum", dropChance: 1.0 }]
  },
  {
    id: "chameleon",
    name: "Chameleon",
    title: "Dmitri Smerdyakov",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Easy",
    weakness: "focus",
    maxHp: 720,
    maxArmor: 140,
    staggerThreshold: 60,
    mediaId: "chameleon",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Identity Theft Disguise", armorMultiplier: 1.0, damageTakenMultiplier: 1.0 }
    ],
    icon: "🎭",
    description: "Kẻ giả dạng tài tình chuyên xâm nhập và phân tán chú ý. Yêu cầu Focus để vạch mặt hắn.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Holographic Mask Array", dropChance: 1.0 }]
  },
  {
    id: "hobgoblin",
    name: "Hobgoblin",
    title: "Roderick Kingsley",
    category: "crime",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "discipline",
    maxHp: 1320,
    maxArmor: 340,
    staggerThreshold: 110,
    mediaId: "hobgoblin",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Sonic Pumpkin Shockwave", armorMultiplier: 1.1, damageTakenMultiplier: 0.9 },
      { phase: 2, hpPercent: 0.45, title: "Goblin Arsenal Frenzy", armorMultiplier: 1.5, damageTakenMultiplier: 0.8 }
    ],
    icon: "🎃",
    description: "Tên trùm buôn lậu thừa kế công nghệ Goblin nhưng máu lạnh và lý trí hơn. Cần Kỷ Luật Discipline.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Orange Pumpkin Core", dropChance: 1.0 }]
  },
  {
    id: "jackal",
    name: "The Jackal",
    title: "Miles Warren",
    category: "science",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "intellect",
    maxHp: 1150,
    maxArmor: 270,
    staggerThreshold: 95,
    mediaId: "jackal",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Clone Saga Ambush", armorMultiplier: 1.0, damageTakenMultiplier: 0.9 }
    ],
    icon: "🐺",
    description: "Kẻ cuồng nhân công nghệ nhân bản di truyền (Clone Saga). Đòi hỏi Intellect phân biệt mẫu gốc.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Cloning Matrix DNA", dropChance: 1.0 }]
  },
  {
    id: "hydroman",
    name: "Hydro-Man",
    title: "Morris Bench",
    category: "science",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "intellect",
    maxHp: 1020,
    maxArmor: 240,
    staggerThreshold: 85,
    mediaId: "hydroman",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Tsunami Wave Surge", armorMultiplier: 1.2, damageTakenMultiplier: 0.9 }
    ],
    icon: "🌊",
    description: "Biến toàn bộ cơ thể thành nước áp lực cao. Cần Intellect đóng băng hoặc bốc hơi.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Condensed Water Molecule", dropChance: 1.0 }]
  },
  {
    id: "moltenman",
    name: "Molten Man",
    title: "Mark Raxton",
    category: "science",
    universe: "Earth-616",
    difficulty: "Medium",
    weakness: "power",
    maxHp: 1180,
    maxArmor: 310,
    staggerThreshold: 95,
    mediaId: "moltenman",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Liquid Metal Heatwave", armorMultiplier: 1.3, damageTakenMultiplier: 0.85 }
    ],
    icon: "🔥",
    description: "Cơ thể phủ hợp kim vàng nóng chảy phát nhiệt cực đại. Yêu cầu Sức Mạnh Power dập tắt.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Molten Alloy Ingot", dropChance: 1.0 }]
  },
  {
    id: "scream",
    name: "Scream",
    title: "Donna Diego",
    category: "symbiote",
    universe: "Earth-616",
    difficulty: "Hard",
    weakness: "willpower",
    maxHp: 1380,
    maxArmor: 290,
    staggerThreshold: 105,
    mediaId: "scream",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Hair Tendril Whip Strike", armorMultiplier: 1.1, damageTakenMultiplier: 0.9 },
      { phase: 2, hpPercent: 0.50, title: "Sonic Screech Waves", armorMultiplier: 1.4, damageTakenMultiplier: 0.8 }
    ],
    icon: "💛",
    description: "Symbiote màu vàng đỏ với mái tóc xúc tu sắc nhọn và sóng âm cuồng bạo. Cần Ý Chí Willpower kiên cường.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Scream Symbiote Tendril", dropChance: 1.0 }]
  },
  {
    id: "knull",
    name: "Knull",
    title: "God of the Symbiotes",
    category: "symbiote",
    universe: "Earth-616",
    difficulty: "Mythic",
    weakness: "willpower",
    maxHp: 3000,
    maxArmor: 800,
    staggerThreshold: 200,
    mediaId: "knull",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "King in Black Manifestation", armorMultiplier: 1.5, damageTakenMultiplier: 0.7 },
      { phase: 2, hpPercent: 0.50, title: "Necrosword Cosmic Ruin", armorMultiplier: 2.2, damageTakenMultiplier: 0.5 }
    ],
    icon: "👑",
    description: "Vị thần hắc ám sáng tạo ra toàn bộ giống loài Symbiote và All-Black Necrosword. Thử thách Ý Chí cực hạn.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "All-Black Necrosword Fragment", dropChance: 1.0 }]
  },
  {
    id: "morlun",
    name: "Morlun",
    title: "Inheritor Apex Hunter",
    category: "multiverse",
    universe: "Earth-001",
    difficulty: "Mythic",
    weakness: "power",
    maxHp: 2800,
    maxArmor: 750,
    staggerThreshold: 190,
    mediaId: "morlun",
    phases: [
      { phase: 1, hpPercent: 1.0, title: "Spider-Totem Life Drain", armorMultiplier: 1.4, damageTakenMultiplier: 0.75 },
      { phase: 2, hpPercent: 0.40, title: "Vampiric Multiverse Feast", armorMultiplier: 2.0, damageTakenMultiplier: 0.55 }
    ],
    icon: "🩸",
    description: "Kẻ đi săn các Thần Thần Mạng Nhện (Spider-Totem) xuyên suốt Đa Vũ Trụ. Đòi hỏi Sức Mạnh Power tối thượng.",
    lootTable: [{ itemId: "item_gold_chest_500", name: "Spider-Totem Essence", dropChance: 1.0 }]
  }
];

window.VILLAINS_DATA = VILLAINS_DATA;
