/* ==========================================================================
   SPIDER-RESET 66 - NOTION LIFE RPG 10-PASS ENGINE
   Core JavaScript Engine & Complete Card Database
   ========================================================================== */

// --- 1. SOUND MANAGER (Web Audio API Synthesizer) ---
class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playWebShoot() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playUpgrade() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  playCheckinSuccess() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const soundFX = new SoundManager();

function makeSvgArt(primaryColor, secondaryColor) {
  return `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill="${primaryColor}"/>
    <path d="M30 40 Q50 20 70 40 L65 70 Q50 85 35 70 Z" fill="${secondaryColor}"/>
    <ellipse cx="40" cy="45" rx="9" ry="13" fill="#ffffff" transform="rotate(-15 40 45)"/>
    <ellipse cx="60" cy="45" rx="9" ry="13" fill="#ffffff" transform="rotate(15 60 45)"/>
  </svg>`;
}

// --- 2. MARVEL SNAP EXPANDED CARD DATABASE (36 CARDS) ---
const MARVEL_SNAP_CARDS = [
  // --- SPIDER-HEROES (13) ---
  { id: 'spiderman', name: 'SPIDER-MAN', category: 'hero', cost: 3, power: 5, quote: '"Vào vị trí! Sức mạnh càng lớn, trách nhiệm càng cao."', ability: 'Bắn tơ linh hoạt: Cộng +2 Web Boosters cho mỗi lần check-in thói quen.', colorGradient: 'linear-gradient(135deg, #e62429 0%, #00f0ff 100%)', svgArt: makeSvgArt('#e62429', '#000000') },
  { id: 'symbiotespidey', name: 'SYMBIOTE SPIDER-MAN', category: 'hero', cost: 4, power: 6, quote: '"Bóng tối trao sức mạnh, nhưng kỷ luật giúp làm chủ nó."', ability: 'Symbiote Power: Đồng hóa thói quen cũ và tăng gấp đôi điểm thưởng.', colorGradient: 'linear-gradient(135deg, #111827 0%, #a855f7 100%)', svgArt: makeSvgArt('#111827', '#a855f7') },
  { id: 'miles', name: 'MILES MORALES', category: 'hero', cost: 2, power: 5, quote: '"Ai cũng có thể đeo mặt nạ. Nhưng cách bạn rèn luyện mới định nghĩa bạn!"', ability: 'Venom Blast: Nhân 1.5x điểm Streak khi hoàn thành đủ 7 ngày liên tiếp.', colorGradient: 'linear-gradient(135deg, #111827 0%, #e62429 100%)', svgArt: makeSvgArt('#111827', '#e62429') },
  { id: 'spidergwen', name: 'GHOST-SPIDER GWEN', category: 'hero', cost: 1, power: 2, quote: '"Tơ nhện của tôi tạo nên luật lệ riêng trên mái nhà."', ability: 'Tơ Cứu Viện: Bảo vệ chuỗi Streak không bị đứt nếu bạn quên 1 ngày.', colorGradient: 'linear-gradient(135deg, #ffffff 0%, #ec4899 50%, #00f0ff 100%)', svgArt: makeSvgArt('#ec4899', '#ffffff') },
  { id: 'spider2099', name: 'SPIDER-MAN 2099', category: 'hero', cost: 4, power: 6, quote: '"Tương lai 2099 được định hình từ kỷ luật hôm nay."', ability: 'Du Hành Thời Gian: Mở khóa xem trước ma trận 66 ngày sắp tới.', colorGradient: 'linear-gradient(135deg, #1e3a8a 0%, #ef4444 100%)', svgArt: makeSvgArt('#1e3a8a', '#ef4444') },
  { id: 'spiderham', name: 'SPIDER-HAM (PORKER)', category: 'hero', cost: 1, power: 1, quote: '"Biến áp lực thành Donut và tiến lên phía trước!"', ability: 'Vui Vẻ Mới Ngày: Nhận ngẫu nhiên 5-20 Boosters mỗi sáng.', colorGradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', svgArt: makeSvgArt('#fb7185', '#e62429') },
  { id: 'spiderwoman', name: 'SPIDER-WOMAN', category: 'hero', cost: 5, power: 8, quote: '"Nọc độc sinh học sẽ loại bỏ sự do dự trong mục tiêu của bạn!"', ability: 'Nọc Độc Kỷ Luật: Giảm bớt mục tiêu của thói quen khó.', colorGradient: 'linear-gradient(135deg, #b91c1c 0%, #f59e0b 100%)', svgArt: makeSvgArt('#b91c1c', '#f59e0b') },
  { id: 'silk', name: 'SILK (CINDY MOON)', category: 'hero', cost: 2, power: 5, quote: '"Phản xạ siêu tốc, nhịp điệu thói quen không thể gián đoạn."', ability: 'Bắn Tơ Nhanh: Giảm thời gian thực hiện thói quen.', colorGradient: 'linear-gradient(135deg, #991b1b 0%, #ffffff 100%)', svgArt: makeSvgArt('#991b1b', '#ffffff') },
  { id: 'spiderboy', name: 'SPIDER-BOY', category: 'hero', cost: 1, power: 2, quote: '"Người bạn đồng hành nhỏ tuổi với năng lượng không giới hạn!"', ability: 'Năng Lượng Trẻ Trung: Thưởng +5 Boosters khi hoàn thành thói quen thứ 2.', colorGradient: 'linear-gradient(135deg, #0ea5e9 0%, #e62429 100%)', svgArt: makeSvgArt('#0ea5e9', '#e62429') },
  { id: 'agentvenom', name: 'AGENT VENOM', category: 'hero', cost: 2, power: 4, quote: '"Kỷ luật quân đội kết hợp cùng sức mạnh Symbiote!"', ability: 'Chiến Thuật Quân Sự: Tăng +1 Power cho tất cả mục tiêu.', colorGradient: 'linear-gradient(135deg, #1f2937 0%, #ffffff 100%)', svgArt: makeSvgArt('#1f2937', '#ffffff') },
  { id: 'madameweb', name: 'MADAME WEB', category: 'hero', cost: 2, power: 1, quote: '"Tất cả các sợi tơ định mệnh đều kết nối tại Mạng Nhện Cuộc Sống."', ability: 'Tiên Tri Định Mệnh: Tự động điều chỉnh mục tiêu 5 Trụ cột.', colorGradient: 'linear-gradient(135deg, #5b21b6 0%, #10b981 100%)', svgArt: makeSvgArt('#5b21b6', '#10b981') },
  { id: 'blackcat', name: 'BLACK CAT (FELICIA)', category: 'hero', cost: 3, power: 10, quote: '"May mắn luôn mỉm cười với những ai dũng cảm hành động!"', ability: 'Bùa May Mắn: 20% cơ hội x2 Boosters khi check-in.', colorGradient: 'linear-gradient(135deg, #18181b 0%, #facc15 100%)', svgArt: makeSvgArt('#18181b', '#facc15') },
  { id: 'silversable', name: 'SILVER SABLE', category: 'hero', cost: 1, power: 1, quote: '"Đội quân Sable International sẽ bảo vệ mục tiêu tài chính của bạn."', ability: 'Hợp Đồng Lực Lượng: Tăng +20% tiến độ Trụ cột Tài chính.', colorGradient: 'linear-gradient(135deg, #64748b 0%, #cbd5e1 100%)', svgArt: makeSvgArt('#64748b', '#cbd5e1') },

  // --- SYMBIOTES (7) ---
  { id: 'venom', name: 'VENOM (EDDIE BROCK)', category: 'symbiote', cost: 3, power: 1, quote: '"WE ARE VENOM! Nuốt chửng sự trì hoãn và lười biếng!"', ability: 'Đồng Hóa Symbiote: Tích lũy +1 Power cho mỗi thói quen hoàn thành.', colorGradient: 'linear-gradient(135deg, #000000 0%, #581c87 100%)', svgArt: makeSvgArt('#09090b', '#a855f7') },
  { id: 'carnage', name: 'CARNAGE (CLETUS)', category: 'symbiote', cost: 2, power: 2, quote: '"Hỗn loạn sẽ bị tiêu diệt bằng sự tập trung tuyệt đối!"', ability: 'Phá Hủy Thói Quen Xấu: Giúp xóa bỏ các thói quen lãng phí thời gian.', colorGradient: 'linear-gradient(135deg, #7f1d1d 0%, #000000 100%)', svgArt: makeSvgArt('#7f1d1d', '#000000') },
  { id: 'scream', name: 'SCREAM', category: 'symbiote', cost: 2, power: 2, quote: '"Tiếng hú Symbiote đánh thức mọi tiềm năng ẩn giấu!"', ability: 'Tiếng Hú Động Lực: Phát âm thanh nhắc nhở check-in mỗi ngày.', colorGradient: 'linear-gradient(135deg, #ca8a04 0%, #dc2626 100%)', svgArt: makeSvgArt('#ca8a04', '#dc2626') },
  { id: 'agony', name: 'AGONY', category: 'symbiote', cost: 1, power: 2, quote: '"Chuyển hóa nỗi đau tập luyện thành sức mạnh thể chất!"', ability: 'Axit Chuyển Hóa: Giúp bứt phá vượt ngưỡng bài tập khó.', colorGradient: 'linear-gradient(135deg, #7e22ce 0%, #ec4899 100%)', svgArt: makeSvgArt('#7e22ce', '#ec4899') },
  { id: 'toxin', name: 'TOXIN', category: 'symbiote', cost: 2, power: 1, quote: '"Symbiote thế hệ tiếp theo với sức mạnh vượt trội!"', ability: 'Tương Lai Đột Phá: Thưởng +15 Boosters khi mở khóa.', colorGradient: 'linear-gradient(135deg, #ef4444 0%, #1e3a8a 100%)', svgArt: makeSvgArt('#ef4444', '#1e3a8a') },
  { id: 'antivenom', name: 'ANTI-VENOM', category: 'symbiote', cost: 4, power: 7, quote: '"Tẩy sạch mọi độc tố trì hoãn và khôi phục năng lượng tích cực!"', ability: 'Chữa Lành Kỷ Luật: Khôi phục lại 1 ngày Streak lỡ làng.', colorGradient: 'linear-gradient(135deg, #f8fafc 0%, #0284c7 100%)', svgArt: makeSvgArt('#f8fafc', '#0284c7') },
  { id: 'knull', name: 'KNULL (GOD OF SYMBIOTES)', category: 'symbiote', cost: 6, power: 0, quote: '"CHÚA TỂ SYMBIOTE - THÂU TÓM TOÀN BỘ SỨC MẠNH KỶ LUẬT!"', ability: 'Thâu Tóm Sức Mạnh: Nhận Power bằng tổng số thói quen hoàn thành.', colorGradient: 'linear-gradient(135deg, #09090b 0%, #dc2626 100%)', svgArt: makeSvgArt('#09090b', '#dc2626') },

  // --- SINISTER SIX (12) ---
  { id: 'docock', name: 'DOCTOR OCTOPUS', category: 'sinister6', cost: 5, power: 10, quote: '"4 Cánh tay cơ khí tối ưu hóa 4 mục tiêu cùng lúc!"', ability: 'Đa Nhiệm Siêu Cấp: Đạt 100% tỷ lệ check-in cho tất cả thói quen.', colorGradient: 'linear-gradient(135deg, #1e3a8a 0%, #15803d 100%)', svgArt: makeSvgArt('#1e3a8a', '#15803d') },
  { id: 'greengoblin', name: 'GREEN GOBLIN', category: 'sinister6', cost: 3, power: -3, quote: '"Thử thách Bom Bí Ngô! Vượt qua để chứng minh bản lĩnh."', ability: 'Thử Thách Cam Go: Vượt qua thói quen khó nhất để nhận +50 Boosters.', colorGradient: 'linear-gradient(135deg, #15803d 0%, #6b21a8 100%)', svgArt: makeSvgArt('#15803d', '#6b21a8') },
  { id: 'hobgoblin', name: 'HOBGOBLIN', category: 'sinister6', cost: 5, power: -8, quote: '"Bóng ma thử thách lớn nhất sẽ đẩy bạn vượt qua giới hạn!"', ability: 'Vượt Áp Lực: Nhận ngay +100 Boosters khi duy trì 21 ngày liên tiếp.', colorGradient: 'linear-gradient(135deg, #c2410c 0%, #4c1d95 100%)', svgArt: makeSvgArt('#c2410c', '#4c1d95') },
  { id: 'kraven', name: 'KRAVEN THE HUNTER', category: 'sinister6', cost: 2, power: 2, quote: '"Thói quen tốt là con mồi vĩ đại nhất cần chinh phục."', ability: 'Săn Lùng Mục Tiêu: Thưởng +30 Boosters khi hoàn thành mốc Day 21.', colorGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)', svgArt: makeSvgArt('#78350f', '#b45309') },
  { id: 'vulture', name: 'VULTURE (ADRIAN TOOMES)', category: 'sinister6', cost: 3, power: 3, quote: '"Bay cao trên những trở ngại và bao quát mọi mục tiêu!"', ability: 'Cánh Thép Bay Cao: Tăng tốc độ hoàn thành sứ mệnh.', colorGradient: 'linear-gradient(135deg, #166534 0%, #854d0e 100%)', svgArt: makeSvgArt('#166534', '#854d0e') },
  { id: 'rhino', name: 'RHINO (ALEKSEI)', category: 'sinister6', cost: 3, power: 3, quote: '"Húc văng mọi cản trở bằng sức mạnh thể chất trâu bò!"', ability: 'Cú Húc Trọng Đột: Đập tan sự trì hoãn.', colorGradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', svgArt: makeSvgArt('#475569', '#1e293b') },
  { id: 'lizard', name: 'LIZARD (CURT CONNORS)', category: 'sinister6', cost: 2, power: 5, quote: '"Khôi phục và tái tạo năng lượng thể chất liên tục!"', ability: 'Tái Sinh Sinh Học: Giúp bạn không bị kiệt sức.', colorGradient: 'linear-gradient(135deg, #15803d 0%, #047857 100%)', svgArt: makeSvgArt('#15803d', '#047857') },
  { id: 'electro', name: 'ELECTRO (MAX DILLON)', category: 'sinister6', cost: 3, power: 3, quote: '"Năng lượng điện cao thế sạc căng cho mỗi buổi sáng!"', ability: 'Sạc Điện Cao Thế: Thưởng +1 Năng lượng hành động mỗi ngày.', colorGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', svgArt: makeSvgArt('#eab308', '#ca8a04') },
  { id: 'scorpion', name: 'SCORPION (MAC GARGAN)', category: 'sinister6', cost: 2, power: 2, quote: '"Đuôi bọ cạp đâm thủng sự lười biếng!"', ability: 'Cú Đâm Kỷ Luật: Giảm ảnh hưởng của những ngày mệt mỏi.', colorGradient: 'linear-gradient(135deg, #16a34a 0%, #155e75 100%)', svgArt: makeSvgArt('#16a34a', '#155e75') },
  { id: 'mysterio', name: 'MYSTERIO (QUENTIN BECK)', category: 'sinister6', cost: 2, power: 4, quote: '"Ảo ảnh sẽ biến thành hiện thực khi bạn kiên trì rèn luyện!"', ability: 'Ảo Ảnh Mục Tiêu: Biến mục tiêu lớn thành các bước nhỏ dễ đạt.', colorGradient: 'linear-gradient(135deg, #0284c7 0%, #7e22ce 100%)', svgArt: makeSvgArt('#0284c7', '#7e22ce') },
  { id: 'sandman', name: 'SANDMAN (FLINT MARKO)', category: 'sinister6', cost: 5, power: 7, quote: '"Vững chắc như tường cát bão bùng trước mọi cám dỗ!"', ability: 'Bão Cát Vững Chắc: Ngăn chặn thói quen xấu xâm nhập.', colorGradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)', svgArt: makeSvgArt('#d97706', '#78350f') },
  { id: 'shocker', name: 'SHOCKER (HERMAN)', category: 'sinister6', cost: 2, power: 3, quote: '"Sóng chấn động đập tan rào cản tâm lý trì hoãn!"', ability: 'Sóng Chấn Động: Kích hoạt chuỗi hành động nhanh chóng.', colorGradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)', svgArt: makeSvgArt('#ca8a04', '#a16207') },

  // --- VILLAINS (4) ---
  { id: 'morbius', name: 'MORBIUS THE VAMP', category: 'villain', cost: 2, power: 0, quote: '"Khao khát bứt phá của Ma Cà Rồng Sống!"', ability: 'Hút Năng Lượng Tích Cực: Tăng Power khi hoàn thành thói quen ban đêm.', colorGradient: 'linear-gradient(135deg, #450a0a 0%, #000000 100%)', svgArt: makeSvgArt('#450a0a', '#000000') },
  { id: 'kingpin', name: 'KINGPIN (WILSON FISK)', category: 'villain', cost: 3, power: 4, quote: '"Làm chủ đế chế kỷ luật cá nhân của chính bạn!"', ability: 'Thống Trị Đế Chế: Tăng 20% tổng chỉ số Mạng Nhện.', colorGradient: 'linear-gradient(135deg, #3f3f46 0%, #09090b 100%)', svgArt: makeSvgArt('#3f3f46', '#09090b') },
  { id: 'stegron', name: 'STEGRON DINO-MAN', category: 'villain', cost: 4, power: 5, quote: '"Khủng long bạo chúa quét sạch mọi chướng ngại vật!"', ability: 'Quét Sạch Cản Trở: Giúp đẩy nhanh tiến độ mục tiêu.', colorGradient: 'linear-gradient(135deg, #15803d 0%, #713f12 100%)', svgArt: makeSvgArt('#15803d', '#713f12') },
  { id: 'thespot', name: 'THE SPOT (JONATHAN)', category: 'villain', cost: 2, power: 3, quote: '"Dịch chuyển không gian giữa các mục tiêu một cách mượt mà!"', ability: 'Cổng Dịch Chuyển: Chuyển đổi linh hoạt giữa các trụ cột.', colorGradient: 'linear-gradient(135deg, #ffffff 0%, #000000 100%)', svgArt: makeSvgArt('#ffffff', '#000000') }
];

const RARITY_TIERS = [
  { level: 0, name: 'COMMON', costReq: 10, nextTier: 'FRAME BREAK', cssClass: 'rarity-common' },
  { level: 1, name: 'FRAME BREAK', costReq: 25, nextTier: '3D HOLOGRAPHIC', cssClass: 'rarity-framebreak' },
  { level: 2, name: '3D HOLOGRAPHIC', costReq: 50, nextTier: 'ANIMATED GLOW', cssClass: 'rarity-3d' },
  { level: 3, name: 'ANIMATED GLOW', costReq: 100, nextTier: 'INFINITE COSMIC', cssClass: 'rarity-animated' },
  { level: 4, name: 'INFINITE COSMIC', costReq: 0, nextTier: 'MAXED OUT', cssClass: 'rarity-infinite' }
];

const SPIDER_QUOTES = [
  '"Với sức mạnh lớn đến trách nhiệm lớn. 66 ngày để biến bạn thành phiên bản Siêu Anh Hùng tốt nhất!" - Uncle Ben',
  '"Dù bạn bị quật ngã bao nhiêu lần, điều quan trọng duy nhất là bạn luôn ĐỨNG DẬY!" - Peter Parker',
  '"Ai cũng có thể đeo mặt nạ. Cách bạn rèn luyện kỷ luật mỗi ngày mới định nghĩa bạn là ai." - Miles Morales',
  '"Kỷ luật không phải là xiềng xích, kỷ luật là bệ phóng cho sự tự do của Siêu Anh Hùng!" - Miguel O\'Hara',
  '"Mỗi thói quen nhỏ hoàn thành hôm nay là một sợi tơ kiên cố dệt nên tương lai rực rỡ!" - Ghost-Spider Gwen'
];

const BOSS_DUNGEONS = [
  { id: 'b1', name: 'GREEN GOBLIN (NORMAN OSBORN)', hp: 400, maxHp: 400, icon: '👺', rewardBoosters: 150 },
  { id: 'b2', name: 'DOCTOR OCTOPUS (DOC OCK)', hp: 700, maxHp: 700, icon: '🐙', rewardBoosters: 250 },
  { id: 'b3', name: 'VENOM (SYMBIOTE ROAR)', hp: 1000, maxHp: 1000, icon: '🖤', rewardBoosters: 400 },
  { id: 'b4', name: 'KRAVEN THE HUNTER', hp: 1400, maxHp: 1400, icon: '🦁', rewardBoosters: 600 },
  { id: 'b5', name: 'KINGPIN (WILSON FISK)', hp: 2000, maxHp: 2000, icon: '🕴️', rewardBoosters: 1000 }
];

// 12 TROPHIES DEFINITION
const TROPHIES_DEF = [
  { id: 't1', title: 'FIRST BLOOD', desc: 'Hoàn thành thói quen check-in đầu tiên', icon: '🩸' },
  { id: 't2', title: 'STREAK 7 DAYS', desc: 'Duy trì kỷ luật liên tiếp 7 ngày', icon: '🔥' },
  { id: 't3', title: 'STREAK 21 DAYS', desc: 'Khóa vết hằn thần kinh 21 ngày', icon: '⚡' },
  { id: 't4', title: 'MASTER 66 DAYS', desc: 'Hoàn thành xuất sắc mốc 66 Ngày Reset!', icon: '🏆' },
  { id: 't5', title: 'BOSS SLAYER', desc: 'Đánh gục Boss Phản Diện đầu tiên', icon: '⚔️' },
  { id: 't6', title: 'CARD COLLECTOR', desc: 'Mở khóa 10 thẻ bài Marvel Snap', icon: '🃏' },
  { id: 't7', title: 'CARD MASTER', desc: 'Nâng cấp 1 thẻ bài lên Cấp INFINITE', icon: '✨' },
  { id: 't8', title: 'SUB-TASK HUNTER', desc: 'Hoàn thành 10 sub-tasks mục tiêu', icon: '🎯' },
  { id: 't9', title: 'JOURNAL WRITER', desc: 'Ghi lại 5 nhật ký thực hiện daily', icon: '📓' },
  { id: 't10', title: 'STAT MAXIMIZER', desc: 'Phân bổ 20 điểm Stat Points', icon: '🦾' },
  { id: 't11', title: 'HERO S-RANK', desc: 'Đạt danh hiệu S-Rank Hunter Spider!', icon: '👑' },
  { id: 't12', title: 'INFINITY LEGEND', desc: 'Mở khóa trọn bộ 36 Thẻ bài Marvel Snap', icon: '🌟' }
];

// --- 3. APPLICATION STATE STORE ---
class AppStore {
  constructor() {
    this.storageKey = 'SPIDER_RESET_66_DATA_V5';
    this.loadState();
  }

  getDefaultState() {
    const defaultCardsState = {};
    MARVEL_SNAP_CARDS.forEach(c => {
      const isInitialUnlocked = (c.id === 'spiderman' || c.id === 'miles');
      defaultCardsState[c.id] = { unlocked: isInitialUnlocked, rarityLevel: 0 };
    });

    return {
      userProfile: {
        heroName: 'Peter Parker',
        contractSigned: false
      },
      currentSuit: 'suit-classic',
      rpg: {
        level: 1,
        exp: 0,
        expToNext: 100,
        statPoints: 5,
        str: 10,
        int: 10,
        agi: 10,
        vit: 10,
        cha: 10
      },
      currentBossIndex: 0,
      bossHp: 400,
      equippedCompanions: ['spidergwen', 'miles'],
      unlockedTrophies: ['t1'],
      emergencyQuestDoneToday: false,
      boosters: 80,
      cardsState: defaultCardsState,
      habits: [
        { id: 'h1', name: 'Tập Luyện Thể Chất Spider-Strength', pillar: 'health', icon: '🏋️‍♂️', targetNote: '30 phút chống đẩy buổi sáng', checkins: {} },
        { id: 'h2', name: 'Đọc Sách & Nạp Tri Thức Spider-Brain', pillar: 'brain', icon: '🧠', targetNote: 'Đọc 20 trang sách kỹ năng', checkins: {} },
        { id: 'h3', name: 'Kỷ Luật Symbiote (0 Thức Khuya)', pillar: 'discipline', icon: '🕸️', targetNote: 'Ngủ trước 23:00 mỗi ngày', checkins: {} }
      ],
      missions: [
        {
          id: 'm1',
          title: 'Tập Luyện Chạy Bộ Tích Lũy 50km',
          pillar: 'health',
          rewardClaimed: false,
          subtasks: [
            { id: 'st1_1', text: 'Tuần 1: Chạy bộ 10km nhẹ nhàng', done: true },
            { id: 'st1_2', text: 'Tuần 2: Tăng tốc chạy 15km', done: false },
            { id: 'st1_3', text: 'Tuần 3 & 4: Hoàn thành 25km còn lại', done: false }
          ],
          journalLogs: []
        }
      ],
      startDate: new Date().toISOString().slice(0, 10)
    };
  }

  loadState() {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (json) {
        this.data = JSON.parse(json);
        MARVEL_SNAP_CARDS.forEach(c => {
          if (!this.data.cardsState[c.id]) {
            this.data.cardsState[c.id] = { unlocked: false, rarityLevel: 0 };
          }
        });
      } else {
        this.data = this.getDefaultState();
        this.saveState();
      }
    } catch (e) {
      console.error('Error loading state:', e);
      this.data = this.getDefaultState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }
}

const store = new AppStore();

// --- 4. SPIDER WEB CANVAS BACKGROUND ---
class SpiderWebCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.mouse = { x: null, y: null };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.initNodes();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      nodeA.x += nodeA.vx;
      nodeA.y += nodeA.vy;

      if (nodeA.x < 0 || nodeA.x > this.canvas.width) nodeA.vx *= -1;
      if (nodeA.y < 0 || nodeA.y > this.canvas.height) nodeA.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      this.ctx.fill();

      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(nodeB.x, nodeB.y);
          this.ctx.strokeStyle = `rgba(230, 36, 41, ${0.15 * (1 - dist / 130)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }

      if (this.mouse.x !== null) {
        const dx = nodeA.x - this.mouse.x;
        const dy = nodeA.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 * (1 - dist / 160)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// --- 5. UI CONTROLLER & NOTION LIFE RPG 10-PASS ENGINE ---
class UIController {
  constructor() {
    this.selectedCardIdForUpgrade = null;
    this.selectedHabitForHistory = null;
    this.activeMissionForJournal = null;
    this.initEventListeners();
    this.renderAll();
  }

  getTodayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  getResetDayIndex() {
    const start = new Date(store.data.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 66);
  }

  getHunterRankTitle(level) {
    if (level >= 30) return 'NATIONAL HERO SPIDER-MAN 🌟';
    if (level >= 20) return 'S-RANK HUNTER SPIDER 👑';
    if (level >= 15) return 'A-RANK HUNTER SPIDER 🔥';
    if (level >= 10) return 'B-RANK HUNTER SPIDER ⚡';
    if (level >= 7) return 'C-RANK HUNTER SPIDER 🛡️';
    if (level >= 4) return 'D-RANK HUNTER SPIDER 🗡️';
    return 'E-RANK SPIDER-MAN 🕸️';
  }

  getSynergyMultiplier() {
    let multiplier = 1.0;
    const { cardsState } = store.data;

    const heroesCount = MARVEL_SNAP_CARDS.filter(c => c.category === 'hero' && cardsState[c.id]?.unlocked).length;
    if (heroesCount >= 10) multiplier += 0.5;

    const symbiotesCount = MARVEL_SNAP_CARDS.filter(c => c.category === 'symbiote' && cardsState[c.id]?.unlocked).length;
    if (symbiotesCount >= 5) multiplier += 0.3;

    const sinister6Count = MARVEL_SNAP_CARDS.filter(c => c.category === 'sinister6' && cardsState[c.id]?.unlocked).length;
    if (sinister6Count >= 6) multiplier += 0.4;

    return multiplier;
  }

  addExp(amount) {
    store.data.rpg.exp += amount;
    while (store.data.rpg.exp >= store.data.rpg.expToNext) {
      store.data.rpg.exp -= store.data.rpg.expToNext;
      store.data.rpg.level++;
      store.data.rpg.statPoints += 5;
      store.data.rpg.expToNext = Math.round(store.data.rpg.expToNext * 1.3);
      soundFX.playUpgrade();
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80 });
      }
    }
    store.saveState();
  }

  dealDamageToBoss(amount) {
    const bossDef = BOSS_DUNGEONS[store.data.currentBossIndex] || BOSS_DUNGEONS[0];
    const dmg = Math.round(amount + (store.data.rpg.str * 2));
    store.data.bossHp -= dmg;

    if (store.data.bossHp <= 0) {
      store.data.bossHp = 0;
      this.openLootChestModal(bossDef);
    }
    store.saveState();
  }

  openLootChestModal(bossDef) {
    const lootReveal = document.getElementById('lootItemsReveal');
    lootReveal.innerHTML = `
      <div>🎉 BẠN ĐÃ ĐÁNH GỤC BOSS <strong>${bossDef.name}</strong>!</div>
      <div style="margin-top:0.75rem; color: var(--infinite-gold);">
        🎁 Phần thưởng: <strong>+${bossDef.rewardBoosters} WEB BOOSTERS</strong> & <strong>+500 EXP</strong>!
      </div>
    `;

    document.getElementById('claimLootBtn').onclick = () => {
      store.data.boosters += bossDef.rewardBoosters;
      this.addExp(500);

      if (store.data.currentBossIndex < BOSS_DUNGEONS.length - 1) {
        store.data.currentBossIndex++;
      }
      const nextBoss = BOSS_DUNGEONS[store.data.currentBossIndex];
      store.data.bossHp = nextBoss.maxHp;

      store.saveState();
      document.getElementById('lootModal').classList.remove('active');
      this.renderAll();
      soundFX.playUpgrade();
    };

    document.getElementById('lootModal').classList.add('active');
  }

  // --- PASS 1: AUTOMATED 10-DAY SIMULATOR ---
  simulate10DaysProgress() {
    alert('🚀 Đang bắt đầu mô phỏng tự động 10 ngày kỷ luật...');
    
    for (let day = 1; day <= 10; day++) {
      // 1. Checkin all habits for relative day
      const d = new Date(store.data.startDate);
      d.setDate(d.getDate() + (day - 1));
      const dateStr = d.toISOString().slice(0, 10);

      store.data.habits.forEach(h => {
        h.checkins[dateStr] = true;
        store.data.boosters += 15;
        this.addExp(35);
        this.dealDamageToBoss(30);
      });

      // 2. Complete random subtask
      store.data.missions.forEach(m => {
        if (m.subtasks) {
          m.subtasks.forEach(st => {
            if (!st.done && Math.random() > 0.4) {
              st.done = true;
              this.addExp(40);
              this.dealDamageToBoss(40);
            }
          });
        }
      });

      // 3. Random card unlock/upgrade
      const lockedCards = MARVEL_SNAP_CARDS.filter(c => !store.data.cardsState[c.id]?.unlocked);
      if (lockedCards.length > 0 && store.data.boosters >= 20) {
        const c = lockedCards[0];
        store.data.cardsState[c.id] = { unlocked: true, rarityLevel: 1 };
        store.data.boosters -= 10;
      }
    }

    store.saveState();
    this.renderAll();
    soundFX.playUpgrade();

    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 100 });
    }

    alert('🎉 Mô phỏng 10 ngày hoàn tất! Bạn đã thăng cấp Level, nhận điểm Boosters và gây sát thương lớn lên Boss!');
  }

  initEventListeners() {
    // Simulator Button
    document.getElementById('simulate10DaysBtn').addEventListener('click', () => {
      this.simulate10DaysProgress();
    });

    // Suits Selector Buttons
    document.querySelectorAll('.suit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.suit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const suitClass = btn.getAttribute('data-suit');
        document.body.className = `dark-theme ${suitClass}`;
        store.data.currentSuit = suitClass;
        store.saveState();
      });
    });

    // Preset Data Loader Button
    document.getElementById('loadPresetDataBtn').addEventListener('click', () => {
      if (confirm('Nạp Preset Mẫu Spider-Man Legend sẽ làm phong phú thói quen & mục tiêu của bạn. Tiếp tục?')) {
        store.data.boosters += 150;
        this.addExp(250);
        store.saveState();
        this.renderAll();
        soundFX.playUpgrade();
      }
    });

    // Card Sort Select
    document.getElementById('cardSortSelect').addEventListener('change', (e) => {
      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter') || 'all';
      this.renderSnapCards(activeFilter, e.target.value);
    });

    // Navigation Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const page = document.getElementById(targetTab);
        if (page) page.classList.add('active');

        if (targetTab === 'tab-analytics') {
          this.renderWebVisualCanvas();
        }
      });
    });

    // Sound toggle
    document.getElementById('soundToggleBtn').addEventListener('click', () => {
      soundFX.enabled = !soundFX.enabled;
      document.getElementById('soundToggleBtn').textContent = soundFX.enabled ? '🔊' : '🔇';
    });

    // Random quote refresh
    document.getElementById('refreshQuoteBtn').addEventListener('click', () => {
      const q = SPIDER_QUOTES[Math.floor(Math.random() * SPIDER_QUOTES.length)];
      document.getElementById('spiderSenseQuote').textContent = q;
    });

    // Emergency Quest Complete button
    document.getElementById('completeEmergencyQuestBtn').addEventListener('click', () => {
      store.data.boosters += 50;
      this.addExp(200);
      store.data.emergencyQuestDoneToday = true;
      document.getElementById('emergencyQuestBanner').style.display = 'none';
      store.saveState();
      this.renderAll();
      soundFX.playUpgrade();
    });

    // Add Stat points buttons
    document.querySelectorAll('.add-stat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const stat = btn.getAttribute('data-stat');
        if (store.data.rpg.statPoints > 0 && store.data.rpg[stat] !== undefined) {
          store.data.rpg[stat]++;
          store.data.rpg.statPoints--;
          store.saveState();
          this.renderRpgDashboard();
          soundFX.playWebShoot();
        }
      });
    });

    // Habit Modal
    document.getElementById('addHabitBtn').addEventListener('click', () => {
      document.getElementById('habitModalTitle').textContent = 'TẠO THÓI QUEN RESET MỚI';
      document.getElementById('habitIdInput').value = '';
      document.getElementById('habitNameInput').value = '';
      document.getElementById('habitTargetInput').value = '';
      document.getElementById('habitModal').classList.add('active');
    });

    document.getElementById('closeHabitModalBtn').addEventListener('click', () => {
      document.getElementById('habitModal').classList.remove('active');
    });

    document.getElementById('cancelHabitBtn').addEventListener('click', () => {
      document.getElementById('habitModal').classList.remove('active');
    });

    document.getElementById('habitForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('habitIdInput').value || 'h_' + Date.now();
      const name = document.getElementById('habitNameInput').value.trim();
      const pillar = document.getElementById('habitPillarSelect').value;
      const icon = document.getElementById('habitIconInput').value.trim() || '⚡';
      const targetNote = document.getElementById('habitTargetInput').value.trim();

      const existingIndex = store.data.habits.findIndex(h => h.id === id);
      if (existingIndex >= 0) {
        store.data.habits[existingIndex].name = name;
        store.data.habits[existingIndex].pillar = pillar;
        store.data.habits[existingIndex].icon = icon;
        store.data.habits[existingIndex].targetNote = targetNote;
      } else {
        store.data.habits.push({
          id, name, pillar, icon, targetNote, checkins: {}
        });
      }

      store.saveState();
      document.getElementById('habitModal').classList.remove('active');
      this.renderAll();
    });

    // History Matrix Modal Close
    document.getElementById('closeHistoryModalBtn').addEventListener('click', () => {
      document.getElementById('historyModal').classList.remove('active');
    });

    // Card Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sortVal = document.getElementById('cardSortSelect').value;
        this.renderSnapCards(btn.getAttribute('data-filter'), sortVal);
      });
    });

    // Upgrade Card Modal Close
    document.getElementById('closeCardUpgradeBtn').addEventListener('click', () => {
      document.getElementById('cardUpgradeModal').classList.remove('active');
    });

    document.getElementById('executeUpgradeBtn').addEventListener('click', () => {
      this.executeCardUpgrade();
    });

    // Hero Contract Modal
    document.getElementById('resetContractBtn').addEventListener('click', () => {
      document.getElementById('userNameInput').value = store.data.userProfile.heroName;
      document.getElementById('userGoalInput').value = store.data.userProfile.mainGoal || '';
      document.getElementById('contractModal').classList.add('active');
    });

    document.getElementById('closeContractBtn').addEventListener('click', () => {
      document.getElementById('contractModal').classList.remove('active');
    });

    document.getElementById('saveContractBtn').addEventListener('click', () => {
      const name = document.getElementById('userNameInput').value.trim() || 'Peter Parker';
      const goal = document.getElementById('userGoalInput').value.trim();
      store.data.userProfile.heroName = name;
      store.data.userProfile.mainGoal = goal;
      store.data.userProfile.contractSigned = true;
      store.saveState();
      document.getElementById('contractModal').classList.remove('active');
      this.renderHeaderStatus();
      soundFX.playUpgrade();
    });

    // Mission Form Modal
    document.getElementById('addMissionBtn').addEventListener('click', () => {
      document.getElementById('missionModal').classList.add('active');
    });
    document.getElementById('closeMissionModalBtn').addEventListener('click', () => {
      document.getElementById('missionModal').classList.remove('active');
    });
    document.getElementById('cancelMissionBtn').addEventListener('click', () => {
      document.getElementById('missionModal').classList.remove('active');
    });

    document.getElementById('missionForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('missionTitleInput').value.trim();
      const pillar = document.getElementById('missionPillarSelect').value;
      const st1 = document.getElementById('missionSubtask1').value.trim();
      const st2 = document.getElementById('missionSubtask2').value.trim();
      const st3 = document.getElementById('missionSubtask3').value.trim();

      const subtasks = [];
      if (st1) subtasks.push({ id: 'st_' + Date.now() + '_1', text: st1, done: false });
      if (st2) subtasks.push({ id: 'st_' + Date.now() + '_2', text: st2, done: false });
      if (st3) subtasks.push({ id: 'st_' + Date.now() + '_3', text: st3, done: false });

      store.data.missions.push({
        id: 'm_' + Date.now(),
        title, pillar, subtasks, journalLogs: [], rewardClaimed: false
      });

      store.saveState();
      document.getElementById('missionModal').classList.remove('active');
      this.renderPillarsAndMissions();
      this.renderTodayActions();
    });

    // Journal Modal Close & Save
    document.getElementById('closeJournalModalBtn').addEventListener('click', () => {
      document.getElementById('journalModal').classList.remove('active');
    });

    document.getElementById('saveJournalNoteBtn').addEventListener('click', () => {
      if (!this.activeMissionForJournal) return;
      const noteTxt = document.getElementById('newJournalNoteInput').value.trim();
      if (!noteTxt) return;

      if (!this.activeMissionForJournal.journalLogs) {
        this.activeMissionForJournal.journalLogs = [];
      }

      this.activeMissionForJournal.journalLogs.push({
        date: this.getTodayStr(),
        note: noteTxt
      });

      store.saveState();
      document.getElementById('newJournalNoteInput').value = '';
      this.openJournalModal(this.activeMissionForJournal);
      soundFX.playCheckinSuccess();
    });

    // Export & Import Data
    document.getElementById('exportDataBtn').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `spider_reset_66_backup_${this.getTodayStr()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    document.getElementById('importDataBtn').addEventListener('click', () => {
      document.getElementById('importFileInput').click();
    });

    document.getElementById('importFileInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData && importedData.habits) {
            store.data = importedData;
            store.saveState();
            this.renderAll();
            alert('Đã tải thành công dữ liệu RPG!');
          }
        } catch (err) {
          alert('File JSON không hợp lệ!');
        }
      };
      reader.readAsText(file);
    });
  }

  renderAll() {
    this.renderHeaderStatus();
    this.renderRpgDashboard();
    this.renderTrophies();
    this.renderResetProgressBar();
    this.renderTodayActions();
    this.renderHabits();
    this.renderSnapCards();
    this.renderPillarsAndMissions();
    this.renderAnalyticsStats();
  }

  renderHeaderStatus() {
    const { heroName } = store.data.userProfile;
    const rankTitle = this.getHunterRankTitle(store.data.rpg.level);
    document.getElementById('hunterRankVal').textContent = rankTitle;
    document.getElementById('heroLevelVal').textContent = `LV.${store.data.rpg.level} ${heroName.toUpperCase()}`;
    document.getElementById('boosterCount').textContent = store.data.boosters;

    let maxStreak = 0;
    store.data.habits.forEach(h => {
      const streak = this.calculateHabitStreak(h);
      if (streak > maxStreak) maxStreak = streak;
    });
    document.getElementById('globalStreak').textContent = maxStreak;

    let unlockedCount = 0;
    Object.values(store.data.cardsState).forEach(c => {
      if (c.unlocked) unlockedCount++;
    });
    document.getElementById('cardUnlockedBadge').textContent = `${unlockedCount}/36`;

    const banner = document.getElementById('emergencyQuestBanner');
    if (store.data.emergencyQuestDoneToday) {
      banner.style.display = 'none';
    } else {
      banner.style.display = 'flex';
    }

    if (store.data.currentSuit) {
      document.body.className = `dark-theme ${store.data.currentSuit}`;
    }
  }

  renderRpgDashboard() {
    const bossDef = BOSS_DUNGEONS[store.data.currentBossIndex] || BOSS_DUNGEONS[0];
    document.getElementById('bossNameDisplay').textContent = bossDef.name;
    document.getElementById('bossHpVal').textContent = `${store.data.bossHp} / ${bossDef.maxHp} HP`;
    const hpPct = Math.max(0, Math.min(100, Math.round((store.data.bossHp / bossDef.maxHp) * 100)));
    document.getElementById('bossHpFill').style.width = `${hpPct}%`;
    document.getElementById('bossAvatarBox').innerHTML = `<div class="boss-icon-graphic">${bossDef.icon}</div>`;

    const { exp, expToNext, statPoints, str, int, agi, vit, cha } = store.data.rpg;
    document.getElementById('expProgressTxt').textContent = `${exp} / ${expToNext} EXP`;
    const expPct = Math.min(100, Math.round((exp / expToNext) * 100));
    document.getElementById('expFill').style.width = `${expPct}%`;

    document.getElementById('statPointsBadge').textContent = `${statPoints} STAT POINTS`;
    document.getElementById('statStrVal').textContent = str;
    document.getElementById('statIntVal').textContent = int;
    document.getElementById('statAgiVal').textContent = agi;
    document.getElementById('statVitVal').textContent = vit;
    document.getElementById('statChaVal').textContent = cha;

    const compContainer = document.getElementById('companionsSlotsContainer');
    if (!compContainer) return;
    compContainer.innerHTML = '';

    const companionsDef = [
      { id: 'spidergwen', name: 'GHOST-SPIDER GWEN', buff: '+15% Sát Thương Boss', icon: '🕷️' },
      { id: 'miles', name: 'MILES MORALES', buff: '+25% Kinh Nghiệm EXP', icon: '⚡' },
      { id: 'silk', name: 'SILK (CINDY MOON)', buff: '+10% Boosters Nhận Được', icon: '🕸️' },
      { id: 'spiderham', name: 'SPIDER-HAM', buff: '+5 Stat Points Thưởng', icon: '🐽' }
    ];

    companionsDef.forEach(comp => {
      const isEquipped = store.data.equippedCompanions.includes(comp.id);
      const item = document.createElement('div');
      item.className = 'companion-slot-item';
      item.innerHTML = `
        <div class="comp-info">
          <h4>${comp.icon} ${comp.name}</h4>
          <span class="comp-buff">Buff: ${comp.buff}</span>
        </div>
        <button class="equip-comp-btn">${isEquipped ? '✓ ĐÃ TRANG BỊ' : 'TRANG BỊ'}</button>
      `;

      item.querySelector('.equip-comp-btn').addEventListener('click', () => {
        if (isEquipped) {
          store.data.equippedCompanions = store.data.equippedCompanions.filter(cId => cId !== comp.id);
        } else {
          if (store.data.equippedCompanions.length < 2) {
            store.data.equippedCompanions.push(comp.id);
          } else {
            alert('Chỉ được trang bị tối đa 2 Bạn Đồng Hành cùng lúc!');
          }
        }
        store.saveState();
        this.renderRpgDashboard();
      });

      compContainer.appendChild(item);
    });
  }

  // --- RENDER 12 TROPHIES ---
  renderTrophies() {
    const grid = document.getElementById('trophiesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    TROPHIES_DEF.forEach(tr => {
      // Check unlock status
      let isUnlocked = store.data.unlockedTrophies.includes(tr.id);
      if (tr.id === 't5' && store.data.currentBossIndex > 0) isUnlocked = true;
      if (tr.id === 't11' && store.data.rpg.level >= 20) isUnlocked = true;

      const item = document.createElement('div');
      item.className = `trophy-card-item ${isUnlocked ? 'unlocked' : ''}`;
      item.innerHTML = `
        <div class="trophy-icon">${tr.icon}</div>
        <div class="trophy-info">
          <h4>${tr.title} ${isUnlocked ? '✓' : '🔒'}</h4>
          <p>${tr.desc}</p>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  calculateHabitStreak(habit) {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 66; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (habit.checkins[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  renderResetProgressBar() {
    const currentDay = this.getResetDayIndex();
    const pct = Math.min(100, Math.round((currentDay / 66) * 100));

    document.getElementById('resetDayCurrent').textContent = `NGÀY ${currentDay}`;
    document.getElementById('resetPctVal').textContent = `${pct}%`;
    document.getElementById('resetProgressFill').style.width = `${pct}%`;
  }

  renderTodayActions() {
    const container = document.getElementById('todayActionsList');
    if (!container) return;
    container.innerHTML = '';

    const todayStr = this.getTodayStr();
    let hasActions = false;

    store.data.habits.forEach(habit => {
      hasActions = true;
      const isDone = !!habit.checkins[todayStr];
      const item = document.createElement('div');
      item.className = `action-check-item ${isDone ? 'done' : ''}`;
      item.innerHTML = `
        <div class="action-left">
          <div class="custom-checkbox">${isDone ? '✓' : ''}</div>
          <span class="action-title">${habit.icon} ${habit.name}</span>
        </div>
        <span class="action-tag-pill">THÓI QUEN DAILY</span>
      `;
      item.addEventListener('click', () => {
        this.toggleCheckin(habit.id);
      });
      container.appendChild(item);
    });

    store.data.missions.forEach(mission => {
      if (mission.subtasks) {
        mission.subtasks.forEach(st => {
          if (!st.done) {
            hasActions = true;
            const item = document.createElement('div');
            item.className = `action-check-item ${st.done ? 'done' : ''}`;
            item.innerHTML = `
              <div class="action-left">
                <div class="custom-checkbox">${st.done ? '✓' : ''}</div>
                <span class="action-title">🎯 ${mission.title}: ${st.text}</span>
              </div>
              <span class="action-tag-pill" style="color: var(--spider-blue);">SUB-TASK GOAL</span>
            `;
            item.addEventListener('click', () => {
              st.done = !st.done;
              if (st.done) {
                this.addExp(40);
                this.dealDamageToBoss(30);
              }
              store.saveState();
              this.renderAll();
            });
            container.appendChild(item);
          }
        });
      }
    });

    if (!hasActions) {
      container.innerHTML = `<div style="color: var(--text-muted); font-style: italic;">Bạn đã hoàn thành xuất sắc tất cả hành động mục tiêu hôm nay! 🎉</div>`;
    }
  }

  renderHabits() {
    const container = document.getElementById('habitsContainer');
    if (!container) return;
    container.innerHTML = '';

    const todayStr = this.getTodayStr();

    if (store.data.habits.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
        Chưa có thói quen nào. Nhấn "+ TẠO THÓI QUEN MỚI" để bắt đầu hành trình 66 ngày!
      </div>`;
      return;
    }

    const multiplier = this.getSynergyMultiplier();
    const boosterReward = Math.round(10 * multiplier);

    store.data.habits.forEach(habit => {
      const isCheckedToday = !!habit.checkins[todayStr];
      const streak = this.calculateHabitStreak(habit);

      const card = document.createElement('div');
      card.className = `habit-card pillar-${habit.pillar}`;
      card.innerHTML = `
        <div class="habit-header">
          <div class="habit-title-wrap">
            <div class="habit-icon">${habit.icon}</div>
            <div class="habit-info">
              <h3>${habit.name}</h3>
              <p class="habit-target-note">${habit.targetNote || 'Kỷ luật hàng ngày'}</p>
            </div>
          </div>
          <div class="habit-actions-menu">
            <button class="mini-icon-btn history-btn" title="Xem Ma trận 66 Ngày">📅</button>
            <button class="mini-icon-btn delete-btn" title="Xóa thói quen">🗑️</button>
          </div>
        </div>

        <div class="habit-stats-row">
          <div class="habit-streak-badge">
            🔥 <span>${streak}</span> NGÀY STREAK
          </div>
          <button class="habit-day-bubble-btn view-matrix-btn">
            🕸️ Ma trận 66 Ngày
          </button>
        </div>

        <button class="checkin-btn ${isCheckedToday ? 'checked' : ''}">
          ${isCheckedToday ? `✓ ĐÃ HOÀN THÀNH HÔM NAY (+${boosterReward} BOOSTERS)` : `⚡ CHECK-IN HOÀN THÀNH HÔM NAY (+${boosterReward} BOOSTERS)`}
        </button>
      `;

      card.querySelector('.checkin-btn').addEventListener('click', () => {
        this.toggleCheckin(habit.id);
      });

      card.querySelector('.view-matrix-btn').addEventListener('click', () => {
        this.openHistoryModal(habit);
      });

      card.querySelector('.history-btn').addEventListener('click', () => {
        this.openHistoryModal(habit);
      });

      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa thói quen "${habit.name}"?`)) {
          store.data.habits = store.data.habits.filter(h => h.id !== habit.id);
          store.saveState();
          this.renderAll();
        }
      });

      container.appendChild(card);
    });
  }

  toggleCheckin(habitId) {
    const habit = store.data.habits.find(h => h.id === habitId);
    if (!habit) return;

    const todayStr = this.getTodayStr();
    const multiplier = this.getSynergyMultiplier();
    const boosterReward = Math.round(10 * multiplier);

    if (habit.checkins[todayStr]) {
      delete habit.checkins[todayStr];
    } else {
      habit.checkins[todayStr] = true;
      store.data.boosters += boosterReward;
      this.addExp(50);
      this.dealDamageToBoss(40);
      soundFX.playWebShoot();
      soundFX.playCheckinSuccess();

      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    }

    store.saveState();
    this.renderAll();
  }

  openHistoryModal(habit) {
    this.selectedHabitForHistory = habit;
    document.getElementById('historyModalTitle').textContent = habit.name.toUpperCase();
    const streak = this.calculateHabitStreak(habit);
    document.getElementById('historyModalSub').textContent = `Thói quen: ${habit.name} | Chuỗi hiện tại: ${streak} ngày`;

    const grid = document.getElementById('matrix66Grid');
    grid.innerHTML = '';

    const milestones = [7, 21, 30, 45, 66];
    const todayIndex = this.getResetDayIndex();

    for (let day = 1; day <= 66; day++) {
      const dayBubble = document.createElement('div');
      let classes = ['day-bubble'];

      if (milestones.includes(day)) classes.push('milestone');
      if (day === todayIndex) classes.push('today');

      const d = new Date(store.data.startDate);
      d.setDate(d.getDate() + (day - 1));
      const dStr = d.toISOString().slice(0, 10);

      if (habit.checkins[dStr]) {
        classes.push('done');
      }

      dayBubble.className = classes.join(' ');
      dayBubble.innerHTML = `<span>D${day}</span>`;
      grid.appendChild(dayBubble);
    }

    document.getElementById('historyModal').classList.add('active');
  }

  renderSnapCards(filter = 'all', sort = 'name') {
    const container = document.getElementById('snapCardsContainer');
    if (!container) return;
    container.innerHTML = '';

    const mult = this.getSynergyMultiplier();
    const synTextEl = document.getElementById('synergyText');
    if (synTextEl) {
      if (mult > 1.0) {
        synTextEl.innerHTML = `<strong style="color: var(--sinister-green);">ĐÃ KÍCH HOẠT THƯỞNG X${mult.toFixed(1)} BOOSTERS!</strong> (Nhờ sở hữu bộ thẻ bài Siêu Anh Hùng/Symbiote/Sinister Six).`;
      } else {
        synTextEl.textContent = 'Sưu tập từ 6-10 thẻ bài cùng nhóm (Heroes, Symbiotes, Sinister Six) để kích hoạt thưởng thêm x1.3x - x1.8x Boosters!';
      }
    }

    let filteredCards = MARVEL_SNAP_CARDS.filter(c => {
      if (filter === 'all') return true;
      return c.category === filter;
    });

    // Sorting
    filteredCards.sort((a, b) => {
      if (sort === 'cost') return a.cost - b.cost;
      if (sort === 'power') return b.power - a.power;
      if (sort === 'rarity') {
        const rA = store.data.cardsState[a.id]?.rarityLevel || 0;
        const rB = store.data.cardsState[b.id]?.rarityLevel || 0;
        return rB - rA;
      }
      return a.name.localeCompare(b.name);
    });

    filteredCards.forEach(cardData => {
      const state = store.data.cardsState[cardData.id] || { unlocked: false, rarityLevel: 0 };
      const rarity = RARITY_TIERS[state.rarityLevel] || RARITY_TIERS[0];

      const cardEl = document.createElement('div');
      cardEl.className = `snap-card ${rarity.cssClass}`;
      cardEl.style.background = cardData.colorGradient;

      cardEl.innerHTML = `
        <div class="snap-card-inner">
          <div class="card-cost-badge">${cardData.cost}</div>
          <div class="card-power-badge">${cardData.power}</div>
          
          <div class="snap-card-art-box">
            ${cardData.svgArt}
          </div>

          <div class="card-bottom-info">
            <h3 class="card-hero-name">${cardData.name}</h3>
            <span class="card-rarity-pill">${rarity.name}</span>
            <button class="card-upgrade-btn">
              ${state.unlocked ? (rarity.level < 4 ? `NÂNG CẤP (${rarity.costReq} ✨)` : 'MAXED INFINITE') : 'MỞ KHÓA (10 ✨)'}
            </button>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        this.openCardUpgradeModal(cardData);
      });

      container.appendChild(cardEl);
    });
  }

  openCardUpgradeModal(cardData) {
    this.selectedCardIdForUpgrade = cardData.id;
    const state = store.data.cardsState[cardData.id] || { unlocked: false, rarityLevel: 0 };
    const rarity = RARITY_TIERS[state.rarityLevel];

    document.getElementById('upgradeRarityBadge').textContent = rarity.name;
    document.getElementById('upgradeHeroName').textContent = cardData.name;
    document.getElementById('upgradeHeroQuote').textContent = cardData.quote;
    document.getElementById('upgradeCostVal').textContent = cardData.cost;
    document.getElementById('upgradePowerVal').textContent = cardData.power;
    document.getElementById('upgradeAbilityVal').textContent = cardData.ability;

    const preview = document.getElementById('upgradeCardPreview');
    preview.innerHTML = `
      <div class="snap-card ${rarity.cssClass}" style="background: ${cardData.colorGradient}; width: 100%;">
        <div class="snap-card-inner">
          <div class="card-cost-badge">${cardData.cost}</div>
          <div class="card-power-badge">${cardData.power}</div>
          <div class="snap-card-art-box">${cardData.svgArt}</div>
          <div class="card-bottom-info">
            <h3 class="card-hero-name">${cardData.name}</h3>
            <span class="card-rarity-pill">${rarity.name}</span>
          </div>
        </div>
      </div>
    `;

    const upgradeBtn = document.getElementById('executeUpgradeBtn');
    const costReqEl = document.getElementById('upgradeCostReq');

    if (!state.unlocked) {
      costReqEl.textContent = '10 BOOSTERS';
      upgradeBtn.textContent = '🔓 MỞ KHÓA THẺ BÀI (10 ✨)';
      upgradeBtn.disabled = store.data.boosters < 10;
    } else if (rarity.level < 4) {
      costReqEl.textContent = `${rarity.costReq} BOOSTERS`;
      upgradeBtn.textContent = `✨ NÂNG CẤP LÊN ${rarity.nextTier}`;
      upgradeBtn.disabled = store.data.boosters < rarity.costReq;
    } else {
      costReqEl.textContent = 'ĐÃ ĐẠT CẤP TỐI THƯỢNG';
      upgradeBtn.textContent = '🏆 CẤP INFINITE COSMIC THẦN THOẠI';
      upgradeBtn.disabled = true;
    }

    document.getElementById('cardUpgradeModal').classList.add('active');
  }

  executeCardUpgrade() {
    if (!this.selectedCardIdForUpgrade) return;
    const cardId = this.selectedCardIdForUpgrade;
    let cardState = store.data.cardsState[cardId] || { unlocked: false, rarityLevel: 0 };

    if (!cardState.unlocked) {
      if (store.data.boosters >= 10) {
        store.data.boosters -= 10;
        cardState.unlocked = true;
        soundFX.playUpgrade();
        if (window.confetti) window.confetti({ particleCount: 50 });
      }
    } else {
      const currentRarity = RARITY_TIERS[cardState.rarityLevel];
      if (currentRarity.level < 4 && store.data.boosters >= currentRarity.costReq) {
        store.data.boosters -= currentRarity.costReq;
        cardState.rarityLevel++;
        soundFX.playUpgrade();
        if (window.confetti) window.confetti({ particleCount: 80, spread: 100 });
      }
    }

    store.data.cardsState[cardId] = cardState;
    store.saveState();
    document.getElementById('cardUpgradeModal').classList.remove('active');
    this.renderAll();
  }

  renderPillarsAndMissions() {
    const pillarsContainer = document.getElementById('pillarsContainer');
    if (!pillarsContainer) return;
    pillarsContainer.innerHTML = '';

    const pillarsDef = [
      { id: 'health', name: '💪 Spider-Strength', title: 'Thể Chất & Sức Khỏe', icon: '🏋️‍♂️' },
      { id: 'brain', name: '🧠 Spider-Brain', title: 'Trí Tuệ & Học Tập', icon: '📚' },
      { id: 'wealth', name: '💰 Daily Bugle Cash', title: 'Tài Chính & Sự Nghiệp', icon: '💵' },
      { id: 'discipline', name: '🕸️ Symbiote Control', title: 'Kỷ Luật Bản Thân', icon: '🛡️' },
      { id: 'allies', name: '🤝 Web of Allies', title: 'Đồng Đội & Xã Hội', icon: '🌐' }
    ];

    pillarsDef.forEach(p => {
      const pillarMissions = store.data.missions.filter(m => m.pillar === p.id);
      let totalSub = 0;
      let doneSub = 0;
      pillarMissions.forEach(m => {
        if (m.subtasks) {
          totalSub += m.subtasks.length;
          doneSub += m.subtasks.filter(st => st.done).length;
        }
      });
      const pct = totalSub > 0 ? Math.round((doneSub / totalSub) * 100) : 0;

      const card = document.createElement('div');
      card.className = 'pillar-card';
      card.innerHTML = `
        <div class="pillar-head">
          <span class="pillar-icon">${p.icon}</span>
          <span class="pillar-pct">${pct}%</span>
        </div>
        <div class="pillar-title">${p.name}</div>
        <div class="pillar-bar-track">
          <div class="pillar-bar-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      pillarsContainer.appendChild(card);
    });

    this.renderMissions();
  }

  renderMissions() {
    const missionsGrid = document.getElementById('missionsGrid');
    if (!missionsGrid) return;
    missionsGrid.innerHTML = '';

    if (store.data.missions.length === 0) {
      missionsGrid.innerHTML = `<div style="color: var(--text-muted);">Chưa có mục tiêu chi tiết nào.</div>`;
      return;
    }

    store.data.missions.forEach(m => {
      const subtasks = m.subtasks || [];
      const doneCount = subtasks.filter(st => st.done).length;
      const pct = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0;
      const isComplete = pct === 100 && subtasks.length > 0;

      const card = document.createElement('div');
      card.className = 'mission-card-rich';
      
      let subtasksHtml = '';
      subtasks.forEach(st => {
        subtasksHtml += `
          <div class="subtask-item ${st.done ? 'done' : ''}" data-subid="${st.id}">
            <div class="custom-checkbox" style="width:18px; height:18px; font-size:0.75rem;">${st.done ? '✓' : ''}</div>
            <span>${st.text}</span>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="mission-card-header">
          <div class="mission-card-title-wrap">
            <span class="mission-pillar-tag">TRỤ CỘT: ${m.pillar.toUpperCase()}</span>
            <h3>🎯 ${m.title}</h3>
          </div>
          <button class="mini-icon-btn delete-mission-btn" title="Xóa mục tiêu">🗑️</button>
        </div>

        <div class="mission-progress-box">
          <div class="mission-pct-txt">
            <span>Tiến độ thực hiện:</span>
            <strong>${doneCount}/${subtasks.length} Bước (${pct}%)</strong>
          </div>
          <div class="pillar-bar-track" style="height: 10px;">
            <div class="pillar-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--spider-blue), var(--infinite-gold));"></div>
          </div>
        </div>

        <div class="subtasks-checklist-box">
          ${subtasksHtml || '<div style="font-size:0.8rem; color:var(--text-muted);">Chưa có bước hành động.</div>'}
        </div>

        ${isComplete && !m.rewardClaimed ? `
          <button class="claim-chest-btn">🎁 MỞ RƯƠNG THƯỞNG MARVEL SNAP (+100 BOOSTERS)</button>
        ` : ''}

        <div class="mission-actions-row">
          <button class="secondary-btn journal-btn" style="flex:1; font-size:0.9rem;">📓 Nhật ký thực hiện (${(m.journalLogs || []).length})</button>
        </div>
      `;

      card.querySelectorAll('.subtask-item').forEach(stEl => {
        stEl.addEventListener('click', () => {
          const subId = stEl.getAttribute('data-subid');
          const targetSub = m.subtasks.find(s => s.id === subId);
          if (targetSub) {
            targetSub.done = !targetSub.done;
            if (targetSub.done) {
              this.addExp(40);
              this.dealDamageToBoss(30);
            }
            store.saveState();
            this.renderAll();
            soundFX.playWebShoot();
          }
        });
      });

      const claimBtn = card.querySelector('.claim-chest-btn');
      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          m.rewardClaimed = true;
          store.data.boosters += 100;
          this.addExp(300);
          store.saveState();
          soundFX.playUpgrade();
          if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 90 });
          }
          this.renderAll();
        });
      }

      card.querySelector('.journal-btn').addEventListener('click', () => {
        this.openJournalModal(m);
      });

      card.querySelector('.delete-mission-btn').addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa mục tiêu "${m.title}"?`)) {
          store.data.missions = store.data.missions.filter(item => item.id !== m.id);
          store.saveState();
          this.renderAll();
        }
      });

      missionsGrid.appendChild(card);
    });
  }

  openJournalModal(mission) {
    this.activeMissionForJournal = mission;
    document.getElementById('journalModalTitle').textContent = `📓 NHẬT KÝ: ${mission.title.toUpperCase()}`;
    const container = document.getElementById('journalEntriesContainer');
    container.innerHTML = '';

    const logs = mission.journalLogs || [];
    if (logs.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size:0.9rem;">Chưa có ghi chú nhật ký nào. Viết ghi chú đầu tiên của bạn ở dưới!</div>`;
    } else {
      logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'journal-entry-card';
        item.innerHTML = `
          <div class="journal-entry-date">📅 ${log.date}</div>
          <div class="journal-entry-txt">${log.note}</div>
        `;
        container.appendChild(item);
      });
    }

    document.getElementById('journalModal').classList.add('active');
  }

  renderAnalyticsStats() {
    let maxStreak = 0;
    let totalCheckins = 0;

    store.data.habits.forEach(h => {
      const streak = this.calculateHabitStreak(h);
      if (streak > maxStreak) maxStreak = streak;
      totalCheckins += Object.keys(h.checkins).length;
    });

    document.getElementById('statStreakMax').textContent = `${maxStreak} NGÀY`;
    document.getElementById('statTotalCheckins').textContent = totalCheckins;

    const currentDay = this.getResetDayIndex();
    const stabilityPct = Math.min(100, Math.round((totalCheckins / Math.max(1, store.data.habits.length * currentDay)) * 100));
    document.getElementById('statWebStability').textContent = `${stabilityPct}%`;

    let maxedCards = 0;
    Object.values(store.data.cardsState).forEach(c => {
      if (c.rarityLevel >= 4) maxedCards++;
    });
    document.getElementById('statCardsMaxed').textContent = `${maxedCards} / 36`;
  }

  renderWebVisualCanvas() {
    const canvas = document.getElementById('habitWebVisualCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = 350;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    const pillars = [
      { name: 'Strength', color: '#10b981' },
      { name: 'Brain', color: '#00f0ff' },
      { name: 'Cash', color: '#ffb700' },
      { name: 'Discipline', color: '#a855f7' },
      { name: 'Allies', color: '#e62429' }
    ];

    for (let r = 0.2; r <= 1; r += 0.2) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * r);
        const y = centerY + Math.sin(angle) * (radius * r);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
    }

    pillars.forEach((p, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.font = '14px "Bebas Neue", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, x + Math.cos(angle) * 20, y + Math.sin(angle) * 20);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SpiderWebCanvas('spiderWebCanvas');
  window.uiApp = new UIController();
});
