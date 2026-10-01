/* =========================================================================
   LIFE RESET: 66 DAY HABIT ENGINE (SPIDER LIFE OS)
   Dựa trên nghiên cứu của Dr. Phillippa Lally (UCL) về 66 ngày hình thành thói quen.
   Chia làm 3 giai đoạn:
   - Stage 1 (Ngày 1-22): Phá vỡ (Breakdown / Destruction)
   - Stage 2 (Ngày 23-44): Cài đặt (Installation / Wiring)
   - Stage 3 (Ngày 45-66): Đồng hóa (Integration / Mastery)
========================================================================= */

export const RESET_STAGES = [
  {
    id: 1,
    name: 'STAGE 1: PHÁ VỠ',
    subtitle: 'THE BREAKDOWN (NGÀY 1 – 22)',
    badge: 'STAGE I',
    color: '#f0645c',
    description: 'Vượt qua sức ỳ tâm lý, phá vỡ thói quen lười biếng và cắt giảm nguồn dopamine rác. Đây là giai đoạn có lực cản ma sát cao nhất.'
  },
  {
    id: 2,
    name: 'STAGE 2: CÀI ĐẶT',
    subtitle: 'THE INSTALLATION (NGÀY 23 – 44)',
    badge: 'STAGE II',
    color: '#f2c06b',
    description: 'Tái cấu trúc các rãnh thần kinh mới. Hành động bắt đầu trôi chảy hơn, tính kỷ luật thay thế dần cho sự gượng ép.'
  },
  {
    id: 3,
    name: 'STAGE 3: ĐỒNG HÓA',
    subtitle: 'THE INTEGRATION (NGÀY 45 – 66)',
    badge: 'STAGE III',
    color: '#83b96b',
    description: 'Thói quen đi sâu vào vô thức và trở thành bản năng (Automaticity). Bạn trở thành một Superior Spider với phong độ đỉnh cao.'
  }
];

export const HERO_RANKS = [
  { level: 1, name: 'FRIENDLY NEIGHBORHOOD', minXp: 0, maxXp: 100, badge: 'LV.1' },
  { level: 2, name: 'STREET VIGILANTE', minXp: 100, maxXp: 250, badge: 'LV.2' },
  { level: 3, name: 'URBAN DEFENDER', minXp: 250, maxXp: 450, badge: 'LV.3' },
  { level: 4, name: 'WEB WARRIOR', minXp: 450, maxXp: 700, badge: 'LV.4' },
  { level: 5, name: 'AVENGER ALLY', minXp: 700, maxXp: 1050, badge: 'LV.5' },
  { level: 6, name: 'SUPERIOR SPIDER', minXp: 1050, maxXp: 1500, badge: 'LV.6' }
];

export const CORE_PILLARS = [
  {
    id: 'sleep',
    name: 'Sleep Ritual',
    title: 'Giấc ngủ hồi phục',
    icon: '🌙',
    timeOfDay: 'night',
    tier: 'GOLD',
    attribute: 'WILLPOWER',
    target: '7 – 8 giờ ngủ sâu',
    rule: 'Đi ngủ trước 23:00, tắt màn hình trước khi ngủ 45 phút.',
    xp: 25,
    coins: 15
  },
  {
    id: 'water',
    name: 'Hydration Target',
    title: 'Thanh lọc sinh học',
    icon: '💧',
    timeOfDay: 'all',
    tier: 'SILVER',
    attribute: 'AGILITY',
    target: '2.5L – 3.0L nước/ngày',
    rule: 'Uống 500ml ngay sau khi thức dậy, duy trì đều đặn suốt ngày.',
    xp: 20,
    coins: 10
  },
  {
    id: 'exercise',
    name: 'Hero Workout',
    title: 'Rèn luyện thể lực',
    icon: '⚡',
    timeOfDay: 'evening',
    tier: 'GOLD',
    attribute: 'POWER',
    target: '30 – 45 phút vận động',
    rule: 'Cardio, Gym, Calisthenics hoặc Yoga giải phóng endorphin.',
    xp: 35,
    coins: 20
  },
  {
    id: 'mind',
    name: 'Mind & Reflection',
    title: 'Tĩnh tâm & Trí tuệ',
    icon: '🧠',
    timeOfDay: 'morning',
    tier: 'SILVER',
    attribute: 'INTELLECT',
    target: '15 phút đọc / thiền / nhật ký',
    rule: 'Đọc 10 trang sách hoặc ghi nhận 3 điều biết ơn hôm nay.',
    xp: 20,
    coins: 12
  },
  {
    id: 'screen',
    name: 'Dopamine Shield',
    title: 'Cai nghiện Dopamine',
    icon: '📵',
    timeOfDay: 'all',
    tier: 'GOLD',
    attribute: 'DISCIPLINE',
    target: '< 2h mạng xã hội',
    rule: 'Không doomscroll, chuyển điện thoại sang Grayscale khi rảnh.',
    xp: 25,
    coins: 15
  },
  {
    id: 'cold',
    name: 'Reset Protocol',
    title: 'Thử thách kích hoạt',
    icon: '🚿',
    timeOfDay: 'morning',
    tier: 'GOLD',
    attribute: 'WILLPOWER',
    target: '2 phút tắm nước lạnh',
    rule: 'Kích hoạt norepinephrine, đánh thức hệ thần kinh tỉnh táo lập tức.',
    xp: 25,
    coins: 15
  }
];

export const WISDOM_CARDS = [
  {
    hero: 'PETER PARKER',
    quote: 'With great power comes great responsibility.',
    author: 'Stan Lee',
    lesson: 'Kỷ luật không phải là sự trừng phạt. Kỷ luật là trách nhiệm tự thân đối với tiềm năng vĩ đại của chính bạn.'
  },
  {
    hero: 'MARCUS AURELIUS',
    quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Meditations',
    lesson: 'Cơn thèm dopamine ngắn hạn không thể kiểm soát bạn. Bạn là thuyền trưởng làm chủ ý thức của mình.'
  },
  {
    hero: 'MILES MORALES',
    quote: 'It\'s a leap of faith. That\'s all it is, Miles. A leap of faith.',
    author: 'Into the Spider-Verse',
    lesson: 'Đừng đợi khi cảm thấy sẵn sàng 100% mới bắt đầu. Bước nhảy niềm tin bắt đầu từ hành động nhỏ nhất ngày hôm nay.'
  },
  {
    hero: 'JAMES CLEAR',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'Atomic Habits',
    lesson: '66 ngày này là hệ thống của bạn. Bám sát hệ thống, kết quả phi thường sẽ tự đến.'
  },
  {
    hero: 'STEVE ROGERS',
    quote: 'I can do this all day.',
    author: 'Captain America',
    lesson: 'Bất kể hôm nay có mệt mỏi hay lực cản lớn đến đâu, tinh thần bền bỉ không gục ngã sẽ đưa bạn đến đích.'
  },
  {
    hero: 'DOCTOR STRANGE',
    quote: 'We never lose our demons, we only learn to live above them.',
    author: 'Sorcerer Supreme',
    lesson: 'Sự lười biếng luôn rình rập. Thành công là khi bạn nhận diện được nó và chọn nâng tầm bản thân lên trên nó.'
  }
];

export class LifeResetEngine {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'spider-life-reset-66-v1';
    this.state = this.load();
  }

  createInitialState() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      version: 1,
      startDate: today,
      currentDay: 1,
      hardMode: false,
      totalXp: 0,
      totalCoins: 0,
      penalties: 0,
      streak: 1,
      bestStreak: 1,
      waterLoggedMl: 750,
      waterGoalMl: 2500,
      timerSessions: 0,
      timerTotalMinutes: 0,
      habitStats: {},
      history: {
        [today]: {
          dayNumber: 1,
          pillars: {},
          customHabits: [],
          notes: '',
          waterMl: 750,
          completed: false,
          chestClaimed: false,
          xpEarned: 0
        }
      },
      customHabits: []
    };
  }

  load() {
    const fallback = this.createInitialState();
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        habitStats: parsed.habitStats || {},
        history: { ...fallback.history, ...(parsed.history || {}) },
        customHabits: parsed.customHabits || []
      };
    } catch {
      return fallback;
    }
  }

  save() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('[LifeResetEngine] Save failed:', e);
    }
  }

  getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  getEffectiveDayNumber() {
    // Tính toán số ngày trôi qua kể từ ngày bắt đầu
    const start = new Date(this.state.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(66, Math.max(1, diffDays));
  }

  getCurrentStage() {
    const day = this.getEffectiveDayNumber();
    if (day <= 22) return RESET_STAGES[0];
    if (day <= 44) return RESET_STAGES[1];
    return RESET_STAGES[2];
  }

  getTodayData() {
    const key = this.getTodayKey();
    if (!this.state.history[key]) {
      this.state.history[key] = {
        dayNumber: this.getEffectiveDayNumber(),
        pillars: {},
        customHabits: [],
        notes: '',
        waterMl: this.state.waterLoggedMl || 0,
        completed: false,
        xpEarned: 0
      };
      this.save();
    }
    return this.state.history[key];
  }

  togglePillar(pillarId) {
    const today = this.getTodayData();
    const pillar = CORE_PILLARS.find((p) => p.id === pillarId);
    if (!pillar) return false;

    const isChecked = !today.pillars[pillarId];
    today.pillars[pillarId] = isChecked;

    this.state.habitStats = this.state.habitStats || {};
    this.state.habitStats[pillarId] = this.state.habitStats[pillarId] || { streak: 0, totalDone: 0 };

    if (isChecked) {
      today.xpEarned = (today.xpEarned || 0) + pillar.xp;
      this.state.totalXp += pillar.xp;
      this.state.totalCoins += pillar.coins;
      this.state.habitStats[pillarId].streak += 1;
      this.state.habitStats[pillarId].totalDone += 1;
    } else {
      today.xpEarned = Math.max(0, (today.xpEarned || 0) - pillar.xp);
      this.state.totalXp = Math.max(0, this.state.totalXp - pillar.xp);
      this.state.totalCoins = Math.max(0, this.state.totalCoins - pillar.coins);
      this.state.habitStats[pillarId].streak = Math.max(0, this.state.habitStats[pillarId].streak - 1);
      this.state.habitStats[pillarId].totalDone = Math.max(0, this.state.habitStats[pillarId].totalDone - 1);
    }

    this.checkDayCompletion();
    this.save();
    return { checked: isChecked, xp: pillar.xp, coins: pillar.coins, rank: this.getHeroRank() };
  }

  toggleCustomHabit(habitId) {
    const today = this.getTodayData();
    today.customHabits = today.customHabits || [];
    const idx = today.customHabits.indexOf(habitId);
    let checked = false;

    this.state.habitStats = this.state.habitStats || {};
    this.state.habitStats[habitId] = this.state.habitStats[habitId] || { streak: 0, totalDone: 0 };

    if (idx >= 0) {
      today.customHabits.splice(idx, 1);
      this.state.totalXp = Math.max(0, this.state.totalXp - 15);
      this.state.habitStats[habitId].streak = Math.max(0, this.state.habitStats[habitId].streak - 1);
      this.state.habitStats[habitId].totalDone = Math.max(0, this.state.habitStats[habitId].totalDone - 1);
    } else {
      today.customHabits.push(habitId);
      this.state.totalXp += 15;
      this.state.habitStats[habitId].streak += 1;
      this.state.habitStats[habitId].totalDone += 1;
      checked = true;
    }
    this.checkDayCompletion();
    this.save();
    return { checked, xp: 15, rank: this.getHeroRank() };
  }

  addCustomHabit(title, icon = '⚡', timeOfDay = 'all', target = 'Hàng ngày', attribute = 'DISCIPLINE') {
    const id = 'custom_' + Date.now();
    const newHabit = {
      id,
      title: title.trim(),
      icon,
      timeOfDay,
      target,
      attribute,
      xp: 15,
      coins: 10
    };
    this.state.customHabits.push(newHabit);
    this.save();
    return newHabit;
  }

  deleteCustomHabit(id) {
    this.state.customHabits = this.state.customHabits.filter((h) => h.id !== id);
    this.save();
  }

  getHeroRank() {
    const xp = this.state.totalXp;
    for (let i = HERO_RANKS.length - 1; i >= 0; i--) {
      if (xp >= HERO_RANKS[i].minXp) {
        const cur = HERO_RANKS[i];
        const next = HERO_RANKS[i + 1] || null;
        const progress = next ? Math.min(100, Math.round(((xp - cur.minXp) / (next.minXp - cur.minXp)) * 100)) : 100;
        return {
          level: cur.level,
          name: cur.name,
          badge: cur.badge,
          currentXp: xp,
          nextXp: next ? next.minXp : cur.maxXp,
          progressPercent: progress,
          isMax: !next
        };
      }
    }
    return { level: 1, name: HERO_RANKS[0].name, badge: HERO_RANKS[0].badge, currentXp: xp, nextXp: 100, progressPercent: 0, isMax: false };
  }

  claimDailyChest() {
    const today = this.getTodayData();
    if (today.chestClaimed) return { success: false, message: 'Hôm nay bạn đã mở Hòm Tiếp Tế rồi! Quay lại vào ngày mai nhé.' };
    const completedCount = Object.values(today.pillars || {}).filter(Boolean).length;
    if (completedCount < 4) {
      return { success: false, message: 'Cần hoàn thành ít nhất 4/6 trụ cột hôm nay để mở Hòm Tiếp Tế!' };
    }
    const bonusXp = 50 + Math.floor(Math.random() * 51); // 50 - 100 XP
    const bonusCoins = 30 + Math.floor(Math.random() * 31); // 30 - 60 Coins
    today.chestClaimed = true;
    this.state.totalXp += bonusXp;
    this.state.totalCoins += bonusCoins;
    this.save();
    return {
      success: true,
      bonusXp,
      bonusCoins,
      quote: 'Tuyệt vời lắm Spider-Hero! Thành phố luôn biết ơn kỷ luật phi thường của bạn.'
    };
  }

  getHabitDetail(habitId) {
    const pillar = CORE_PILLARS.find((p) => p.id === habitId);
    const custom = this.state.customHabits.find((h) => h.id === habitId);
    const item = pillar || custom;
    if (!item) return null;

    const stats = this.state.habitStats?.[habitId] || { streak: 0, totalDone: 0 };
    const recentDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayData = this.state.history[key];
      let done = false;
      if (dayData) {
        if (pillar) done = !!(dayData.pillars && dayData.pillars[habitId]);
        else done = !!(dayData.customHabits && dayData.customHabits.includes(habitId));
      }
      recentDays.push({
        date: key,
        dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        done
      });
    }

    return {
      id: habitId,
      title: item.title,
      icon: item.icon,
      xp: item.xp,
      coins: item.coins || 10,
      attribute: item.attribute || 'DISCIPLINE',
      timeOfDay: item.timeOfDay || 'all',
      rule: item.rule || 'Duy trì kỷ luật hàng ngày để tích lũy XP.',
      target: item.target || 'Mỗi ngày',
      streak: stats.streak || 0,
      totalDone: stats.totalDone || 0,
      recentDays
    };
  }

  checkDayCompletion() {
    const today = this.getTodayData();
    const completedCount = Object.values(today.pillars).filter(Boolean).length;
    const allPillarsDone = completedCount >= 5; // Ít nhất 5/6 trụ cột đạt chuẩn

    if (allPillarsDone && !today.completed) {
      today.completed = true;
      this.state.streak += 1;
      if (this.state.streak > this.state.bestStreak) {
        this.state.bestStreak = this.state.streak;
      }
    } else if (!allPillarsDone && today.completed) {
      today.completed = false;
    }
  }

  toggleHardMode() {
    this.state.hardMode = !this.state.hardMode;
    this.save();
    return this.state.hardMode;
  }

  logWater(amountMl) {
    this.state.waterLoggedMl = Math.min(4000, Math.max(0, (this.state.waterLoggedMl || 0) + amountMl));
    const today = this.getTodayData();
    today.waterMl = this.state.waterLoggedMl;

    // Tự động hoàn thành trụ cột nước nếu đạt >= 2500ml
    if (this.state.waterLoggedMl >= this.state.waterGoalMl && !today.pillars['water']) {
      this.togglePillar('water');
    }
    this.save();
    return this.state.waterLoggedMl;
  }

  resetWater() {
    this.state.waterLoggedMl = 0;
    const today = this.getTodayData();
    today.waterMl = 0;
    this.save();
    return 0;
  }

  logFocusTimer(minutes) {
    this.state.timerSessions = (this.state.timerSessions || 0) + 1;
    this.state.timerTotalMinutes = (this.state.timerTotalMinutes || 0) + minutes;
    const xpBonus = Math.round(minutes * 0.8);
    this.state.totalXp += xpBonus;
    this.save();
    return { sessions: this.state.timerSessions, totalMinutes: this.state.timerTotalMinutes, xpBonus };
  }

  getRandomWisdomCard() {
    const idx = Math.floor(Math.random() * WISDOM_CARDS.length);
    return WISDOM_CARDS[idx];
  }

  getRadarStats() {
    // Thống kê 6 thuộc tính dựa trên tỷ lệ hoàn thành 14 ngày gần nhất
    const historyList = Object.values(this.state.history);
    const count = Math.max(1, Math.min(14, historyList.length));
    const recent = historyList.slice(-count);

    const stats = {
      WILLPOWER: 0,
      AGILITY: 0,
      POWER: 0,
      INTELLECT: 0,
      DISCIPLINE: 0,
      FOCUS: 0
    };

    CORE_PILLARS.forEach((p) => {
      const completedDays = recent.filter((h) => h.pillars && h.pillars[p.id]).length;
      const score = Math.round((completedDays / count) * 100);
      if (p.id === 'sleep' || p.id === 'cold') stats.WILLPOWER += score / 2;
      else if (p.id === 'water') stats.AGILITY = score;
      else if (p.id === 'exercise') stats.POWER = score;
      else if (p.id === 'mind') stats.INTELLECT = score;
      else if (p.id === 'screen') stats.DISCIPLINE = score;
    });

    // FOCUS tính từ số phiên focus timer
    stats.FOCUS = Math.min(100, Math.round(((this.state.timerSessions || 0) * 15)));
    return stats;
  }

  getSnapshot() {
    return {
      currentDay: this.getEffectiveDayNumber(),
      stage: this.getCurrentStage(),
      streak: this.state.streak,
      bestStreak: this.state.bestStreak,
      hardMode: this.state.hardMode,
      totalXp: this.state.totalXp,
      totalCoins: this.state.totalCoins,
      waterLoggedMl: this.state.waterLoggedMl,
      waterGoalMl: this.state.waterGoalMl,
      rank: this.getHeroRank(),
      habitStats: this.state.habitStats || {},
      today: this.getTodayData(),
      customHabits: this.state.customHabits,
      radar: this.getRadarStats(),
      history: this.state.history
    };
  }
}
