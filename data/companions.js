/* ==========================================================================
   SPIDER-MAN LIFE RPG - COMPANIONS SEED DATA (MARVEL SNAP ACCURATE ARTWORK)
   ========================================================================== */

const COMPANIONS_DATA = [
  {
    id: "miles_morales",
    name: "Miles Morales",
    title: "Spider-Man (Brooklyn)",
    specialty: "Venom Blast & Invisibility",
    icon: "⚡",
    svgAvatar: `<svg viewBox="0 0 100 100" class="snap-avatar-svg">
      <circle cx="50" cy="50" r="46" fill="#09090b" stroke="#e62429" stroke-width="3"/>
      <!-- MILES BLACK & RED MASK -->
      <path d="M50 12 C28 12 15 32 15 55 C15 78 38 88 50 88 C62 88 85 78 85 55 C85 32 72 12 50 12 Z" fill="#18181b"/>
      <polygon points="25,45 42,52 38,35" fill="#e62429"/>
      <polygon points="75,45 58,52 62,35" fill="#e62429"/>
    </svg>`,
    passiveEffect: "+15% Damage lên Boss & +10% Momentum khi hoàn thành Tasks",
    modifiers: [{ target: 'damage', operation: 'multiply', value: 1.15 }],
    activeSkill: "⚡ Venom Strike (Tăng 1.5x damage đòn đánh kế tiếp)",
    unlockRequirement: "Hoàn thành 3 Daily Quests bất kỳ",
    equipped: true
  },
  {
    id: "gwen_stacy",
    name: "Gwen Stacy",
    title: "Ghost-Spider",
    specialty: "Dimension Travel & Agility",
    icon: "🌸",
    svgAvatar: `<svg viewBox="0 0 100 100" class="snap-avatar-svg">
      <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#00f0ff" stroke-width="3"/>
      <!-- GWEN WHITE HOOD -->
      <path d="M50 10 Q10 25 20 85 Q50 95 80 85 Q90 25 50 10 Z" fill="#ffffff" stroke="#ec4899" stroke-width="2"/>
      <polygon points="30,45 44,50 40,36" fill="#00f0ff"/>
      <polygon points="70,45 56,50 60,36" fill="#00f0ff"/>
    </svg>`,
    passiveEffect: "+20% Attribute XP nhận được cho Agility & Focus",
    modifiers: [{ target: 'attributeXp', operation: 'multiply', value: 1.2, when: { attributes: ['agility', 'focus'] } }],
    activeSkill: "🌸 Multiverse Dodge (Bỏ qua 1 hình phạt trễ hạn Task)",
    unlockRequirement: "Đạt Level 5 Agility",
    equipped: false
  },
  {
    id: "black_cat",
    name: "Felicia Hardy",
    title: "Black Cat",
    specialty: "Luck Manipulation & Stealth",
    icon: "🐾",
    svgAvatar: `<svg viewBox="0 0 100 100" class="snap-avatar-svg">
      <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
      <circle cx="50" cy="48" r="22" fill="#334155"/>
      <path d="M28 42 Q50 30 72 42 L68 52 Q50 40 32 52 Z" fill="#000000"/>
    </svg>`,
    passiveEffect: "+25% Gold nhận được từ mọi nguồn thưởng",
    modifiers: [{ target: 'gold', operation: 'multiply', value: 1.25 }],
    activeSkill: "🐾 Bad Luck Aura (Giảm 20% giáp Armor của Boss)",
    unlockRequirement: "Tích lũy 1,000 Gold",
    equipped: false
  },
  {
    id: "daredevil",
    name: "Matt Murdock",
    title: "Daredevil",
    specialty: "Radar Sense & Martial Arts",
    icon: "😈",
    svgAvatar: `<svg viewBox="0 0 100 100" class="snap-avatar-svg">
      <circle cx="50" cy="50" r="46" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
      <polygon points="30,40 45,45 35,55" fill="#ef4444"/>
      <polygon points="70,40 55,45 65,55" fill="#ef4444"/>
    </svg>`,
    passiveEffect: "+30% Stagger gây ra khi strike trúng điểm yếu Weakness",
    modifiers: [{ target: 'stagger', operation: 'multiply', value: 1.3, when: { tags: ['weakness_match'] } }],
    activeSkill: "😈 Radar Sense (Hiển thị mốc Phase tiếp theo của Boss)",
    unlockRequirement: "Mở khóa Skill 'Spider-Sense Overdrive'",
    equipped: false
  }
];
