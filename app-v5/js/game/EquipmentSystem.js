/* ==========================================================================
   V5 EQUIPMENT SYSTEM
   Collectible suits, gadgets, skills, and implants with mechanical effects
   ========================================================================== */

export const INITIAL_EQUIPMENT_CATALOG = [
  {
    id: 'eq-suit-v1',
    name: 'Áo Choàng Web-Operative V1',
    category: 'Suit',
    icon: '🛡️',
    rarity: 'RARE',
    equipped: true,
    description: 'Trang phục đặc trưng của Đặc vụ Web tại thành phố Neon Noir.',
    mechanicalEffect: '+10% XP thưởng từ mọi nhiệm vụ. +2 Điểm Tập Trung.',
    modifiers: { xpMultiplier: 0.10, focusBonus: 2, bossDamageBonus: 0 }
  },
  {
    id: 'eq-gadget-weblauncher',
    name: 'Súng Phóng Tơ Mạch Điện V2',
    category: 'Gadget',
    icon: '⚡',
    rarity: 'EPIC',
    equipped: true,
    description: 'Thiết bị bắn tơ phát xung điện cao tần gây choáng mối đe dọa.',
    mechanicalEffect: '+20% Sát thương Trùm Thành Phố khi hoàn thành nhiệm vụ.',
    modifiers: { bossDamageBonus: 0.20, xpMultiplier: 0, focusBonus: 0 }
  },
  {
    id: 'eq-skill-deepfocus',
    name: 'Kỹ Năng Tập Trung Sâu (Deep Focus)',
    category: 'Skill',
    icon: '🧠',
    rarity: 'UNCOMMON',
    equipped: true,
    description: 'Khả năng duy trì dòng chảy tập trung tuyệt đối trong môi trường nhiễu.',
    mechanicalEffect: '+25% Gold thu nhập và +3 Điểm Trí Tuệ.',
    modifiers: { goldMultiplier: 0.25, intBonus: 3, xpMultiplier: 0 }
  },
  {
    id: 'eq-implant-lens',
    name: 'Kính Thực Tế Tăng Cường Neural AR',
    category: 'Implant',
    icon: '👁️',
    rarity: 'LEGENDARY',
    equipped: false,
    description: 'Vi mạch phân tích trực tiếp dữ liệu Notion Master Calendar trên HUD.',
    mechanicalEffect: '+15% XP cho Nhiệm vụ Tài Chính & Tri Thức. +2 Kiên Cường.',
    modifiers: { domainXpBonus: 0.15, resBonus: 2 }
  },
  {
    id: 'eq-suit-stealth',
    name: 'Bộ Giáp Tàng Hình Cyber-Shadow',
    category: 'Suit',
    icon: '🌃',
    rarity: 'LEGENDARY',
    equipped: false,
    description: 'Hệ thống ngụy trang quang học giúp di chuyển qua các vùng nguy hiểm.',
    mechanicalEffect: '+30% Sát thương Trùm đối với Nhiệm vụ Mức độ Cao (HIGH).',
    modifiers: { highPriorityBossDmg: 0.30 }
  },
  {
    id: 'eq-gadget-pulseshield',
    name: 'Thiết Bị Khiên Xung Điện Vũ Trụ',
    category: 'Gadget',
    icon: '🔰',
    rarity: 'RARE',
    equipped: false,
    description: 'Phát ra tần số sóng điện từ làm suy yếu mức độ đe dọa đô thị.',
    mechanicalEffect: 'Giảm 15% Tốc độ Gia tăng Nhiễm Độc Thành Phố.',
    modifiers: { threatReduction: 0.15 }
  }
];

export class EquipmentSystem {
  static getEquippedModifiers(equipmentList) {
    const totalMods = {
      xpMultiplier: 0,
      goldMultiplier: 0,
      bossDamageBonus: 0,
      focusBonus: 0,
      intBonus: 0,
      resBonus: 0,
      highPriorityBossDmg: 0,
      domainXpBonus: 0
    };

    equipmentList.filter(item => item.equipped).forEach(item => {
      if (item.modifiers) {
        if (item.modifiers.xpMultiplier) totalMods.xpMultiplier += item.modifiers.xpMultiplier;
        if (item.modifiers.goldMultiplier) totalMods.goldMultiplier += item.modifiers.goldMultiplier;
        if (item.modifiers.bossDamageBonus) totalMods.bossDamageBonus += item.modifiers.bossDamageBonus;
        if (item.modifiers.focusBonus) totalMods.focusBonus += item.modifiers.focusBonus;
        if (item.modifiers.intBonus) totalMods.intBonus += item.modifiers.intBonus;
        if (item.modifiers.resBonus) totalMods.resBonus += item.modifiers.resBonus;
        if (item.modifiers.highPriorityBossDmg) totalMods.highPriorityBossDmg += item.modifiers.highPriorityBossDmg;
        if (item.modifiers.domainXpBonus) totalMods.domainXpBonus += item.modifiers.domainXpBonus;
      }
    });

    return totalMods;
  }
}
