# 🕷️ Spider-Man Life RPG Engine (Marvel Snap & Notion Style)

> **Gamify Your Life with Spider-Man RPG Mechanics!**  
> Biến hành động cuộc sống hàng ngày (thói quen, mục tiêu, dự án) thành game nhập vai Siêu Anh Hùng Spider-Man hành động thời gian thực lấy cảm hứng từ *Marvel Snap*, *Solo Leveling System*, *LifeReset: 66 Day Habit* và *Notion Life RPG*.

🌐 **Live Demo Trải Nghiệm Trực Tuyến:** [https://huyhoangcva90-lab.github.io/spider-man-life-rpg/](https://huyhoangcva90-lab.github.io/spider-man-life-rpg/)  
📦 **GitHub Repository:** [https://github.com/huyhoangcva90-lab/spider-man-life-rpg](https://github.com/huyhoangcva90-lab/spider-man-life-rpg)

---

## 🌟 Tính Năng Nổi Bật (Key Features)

### 1. 🦾 Hệ Thống 6 Thuộc Tính Siêu Anh Hùng (Core Attributes)
- **⚡ Agility (Nhanh Nhẹn):** Thể chất, tập luyện, thể thao.
- **🦾 Power (Sức Mạnh):** Đột phá giới hạn, nhiệm vụ nặng.
- **🧠 Intellect (Trí Tuệ):** Học tập, đọc sách, lập trình, nghiên cứu.
- **🧘 Focus (Tập Trung):** Deep Work, thiền định, loại bỏ xao nhãng.
- **🛡️ Discipline (Kỷ Luật):** Thói quen lành mạnh, thức dậy đúng giờ, ăn uống healthy.
- **💎 Willpower (Ý Chí):** Vượt khó khăn, từ chối cám dỗ.

### 2. 🦹 Boss Raid & Weakness System (Phó Bản Phản Diện)
- Mỗi **Dự án lớn (Project)** gắn liền với một Siêu Phản Diện (Doctor Octopus, Green Goblin, Venom, Mysterio, Kraven, Lizard).
- **Cơ chế Điểm Yếu (Weakness Match):** Khi thực hiện hành động đúng hệ thuộc tính điểm yếu của Boss, bạn gây **1.5x Damage & Stagger**!
- **Hệ thống Choáng & Đòn Kết Liễu (Stagger & Finisher):** Đạt 100% Stagger mở khóa `⚡ EXECUTE FINISHER (+350 Critical Damage)`.

### 3. 🍱 Bento Grid UI & 3D Card Parallax Tilt
- Giao diện thiết kế theo ngôn ngữ **Bento Box Grid** hiện đại với hiệu ứng kính mờ **Glassmorphism**.
- **Hiệu ứng Thẻ bài 3D Marvel Snap:** Thẻ bài nghiêng 3D mượt mà theo góc con trỏ chuột (`Card3DTiltEngine`) cùng ánh kim 7 màu **Holographic Foil Shimmer**.

### 4. 🕸️ Spider Web Hexagon Radar Chart & Dynamic Particles
- Biểu đồ mạng nhện 6 góc vẽ động bằng HTML5 Canvas trực quan hóa cấp độ thuộc tính của Peter Parker.
- Mạng tơ nhện neon tự co giãn và kết nối theo con trỏ chuột trên nền Halftone Comic.

### 5. ⚡ Spider-Sense QTE Reaction Minigame
- Minigame phản xạ Quick-Time Event: Bấm đúng khoảnh khắc vòng tròn thu nhỏ chạm mốc vàng để tung đòn **+500 OVERKILL DAMAGE** rung chuyển màn hình (`Screen Shake Impact FX`)!

### 6. 📊 Notion-Style Kanban Board
- Quản lý công việc 3 cột chuẩn Notion: `⚪ TO DO` ➔ `🕸️ WEB SLINGING` ➔ `✓ BOSS DAMAGED`.

### 7. 🔧 360° Radial Gadget Wheel & 🌌 Multiverse Rift
- Vòng xoay thiết bị 360° (Web-Shooter, Impact Web, Web Bomb, Spider-Drone) tung chiêu phụ trợ.
- Cánh cổng Đa Vũ Trụ Multiverse Rift mang tới viện trợ ngẫu nhiên từ Spider-Ham, Spider-Man 2099 & Spider-Noir.

### 8. 🥋 Dynamic Suit Themes & 🎶 Synthwave Lo-Fi Audio Synthesizer
- Đổi Suit (Advanced White, Symbiote Black, Iron Spider Gold, Miles Black/Red) lập tức biến đổi toàn bộ màu sắc, hiệu ứng neon & âm thanh.
- Nhạc nền Lo-Fi Synthwave và giọng nói Siêu Anh Hùng (`Speech Synthesis API`) hô vang khẩu hiệu chiến đấu.

### 9. 💾 Local-First & 1-Click JSON Backup
- Dữ liệu lưu trữ an toàn ngay trên trình duyệt (Local Storage).
- Nút **📥 EXPORT** và **📤 IMPORT** JSON 1-click giúp sao lưu hoặc chuyển đổi dữ liệu dễ dàng.

---

## 🚀 Hướng Dẫn Sử Dụng (Quick Start)

Ứng dụng hoàn toàn **Local-First / Zero Dependencies**: Không cần cài đặt Node.js hay Build tool phức tạp!

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/huyhoangcva90-lab/spider-man-life-rpg.git
   cd spider-man-life-rpg
   ```
2. **Mở ứng dụng:**
   - Nhấp đúp mở trực tiếp file `index.html` trên bất kỳ trình duyệt nào (Chrome, Edge, Brave, Safari, Firefox), hoặc:
   - Dùng Live Server (VS Code Extension) / `npx serve .`

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** Vanilla HTML5, CSS3 Modern Glassmorphism & Bento Grid, JavaScript (ES6+ Modules).
- **Graphics & Animation:** HTML5 Canvas Particle Engine, 3D CSS Transforms, Canvas-Confetti.
- **Audio & Speech:** Web Audio API Sound Synthesizer, Web Speech Synthesis API.
- **Storage:** LocalStorage API với Data Importer/Exporter JSON.

---

## 📜 License

Dự án được phân phối dưới giấy phép **MIT License**.
Phát triển với niềm đam mê dành cho vũ trụ Spider-Man & phương pháp phát triển bản thân Gamification! 🕸️❤️
