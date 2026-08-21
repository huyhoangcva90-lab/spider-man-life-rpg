/* ==========================================================================
   SPIDER-MAN LIFE RPG - QUESTS & PROJECTS SEED DATA
   ========================================================================== */

const QUESTS_DATA = {
  goals: [
    {
      id: 'g_spiderman',
      title: 'Become the Ultimate Spider-Man',
      metricLabel: 'Projects Completed',
      targetValue: 2,
      currentValue: 0,
      projectIds: ['proj_life_rpg', 'proj_fitness_mastery'],
      status: 'active'
    }
  ],
  projects: [
    {
      id: 'proj_life_rpg',
      title: 'Build Spider-Man Life RPG Web App Prototype',
      description: 'Dự án trọng điểm xây dựng ứng dụng Life RPG biến cuộc sống thành Game.',
      villainId: 'docock',
      progress: 68, // %
      completed: false,
      milestones: [
        { id: 'm_arch', title: 'Thiết kế Game Engine Architecture & Data Model', completed: true, damage: 150 },
        { id: 'm_boss', title: 'Xây dựng Boss Combat Screen & Phase Mechanics', completed: true, damage: 200 },
        { id: 'm_skill', title: 'Thiết kế Skill Tree 5 Nhánh & Suits Equipment', completed: false, damage: 250 },
        { id: 'm_test', title: 'Kiểm thử Game Loop & Tối ưu hóa UI Cinematic', completed: false, damage: 300 }
      ]
    },
    {
      id: 'proj_fitness_mastery',
      title: 'Chinh Phục Thể Lực 66 Ngày Spider-Strength',
      description: 'Dự án rèn luyện thể chất liên tục 66 ngày vượt qua rào cản kiệt sức.',
      villainId: 'kraven',
      progress: 30,
      completed: false,
      milestones: [
        { id: 'm_fit_1', title: 'Chống đẩy 50 cái mỗi ngày trong 14 ngày', completed: true, damage: 150 },
        { id: 'm_fit_2', title: 'Chạy bộ tích lũy 50km trong tháng', completed: false, damage: 200 }
      ]
    }
  ],

  dailyQuests: [
    {
      id: 'q_morning_workout',
      title: 'Rèn Luyện Thể Chất Buổi Sáng',
      category: 'health',
      attribute: 'agility',
      xpReward: 35,
      attrXpReward: 15,
      goldReward: 50,
      damage: 30,
      stagger: 15,
      completed: true,
      icon: '🏋️‍♂️'
    },
    {
      id: 'q_deep_work',
      title: 'Lập Trình Code Game Engine 90 Phút',
      category: 'intellect',
      attribute: 'intellect',
      xpReward: 50,
      attrXpReward: 25,
      goldReward: 80,
      damage: 45,
      stagger: 20,
      completed: true,
      icon: '🧠'
    },
    {
      id: 'q_book_reading',
      title: 'Đọc 20 Trang Sách Kỹ Năng & Tư Duy',
      category: 'brain',
      attribute: 'focus',
      xpReward: 30,
      attrXpReward: 15,
      goldReward: 40,
      damage: 25,
      stagger: 10,
      completed: false,
      icon: '📚'
    },
    {
      id: 'q_sleep_early',
      title: 'Kỷ Luật Ngủ Trước 23:00',
      category: 'discipline',
      attribute: 'discipline',
      xpReward: 40,
      attrXpReward: 20,
      goldReward: 60,
      damage: 35,
      stagger: 15,
      completed: false,
      icon: '🌙'
    }
  ],

  tasks: [
    { id: 't1', questId: 'q_deep_work', text: 'Viết file game-engine.js xử lý XP & Stat reward', done: true, damage: 20 },
    { id: 't2', questId: 'q_deep_work', text: 'Viết file boss-system.js xử lý HP, Stagger & Weakness', done: true, damage: 25 },
    { id: 't3', questId: 'q_deep_work', text: 'Thiết kế giao diện Boss Combat Arena', done: false, damage: 20 },
    { id: 't4', questId: 'q_morning_workout', text: 'Tập 3 hiệp Chống đẩy x 15 cái', done: true, damage: 15 },
    { id: 't5', questId: 'q_morning_workout', text: 'Tập 3 hiệp Squat x 20 cái', done: true, damage: 15 }
  ],

  rewardShop: [
    { id: 'r1', name: 'Thưởng 1 Cốc Cà Phê Muối Đặc Biệt', cost: 150, category: 'Food & Drink', icon: '☕', purchased: false },
    { id: 'r2', name: 'Chơi Game Giải Trí 1 Giờ', cost: 250, category: 'Entertainment', icon: '🎮', purchased: false },
    { id: 'r3', name: 'Xem 1 Bộ Phim Điện Ảnh Yêu Thích', cost: 400, category: 'Entertainment', icon: '🎬', purchased: false },
    { id: 'r4', name: 'Thưởng 1 Bữa Ăn Ngon Tự Chọn', cost: 500, category: 'Food & Drink', icon: '🍕', purchased: false },
    { id: 'r5', name: '1 Ngày Rest Day Nghỉ Đêm Thư Giãn', cost: 800, category: 'Rest', icon: '🛋️', purchased: false }
  ]
};
