# SPIDEY LIFE — Arena Mission Hub

Ứng dụng Life RPG local-first biến nhiệm vụ đời thực thành sát thương trong trận đấu Spider hero vs villain.

- Live: <https://huyhoangcva90-lab.github.io/spider-man-life-rpg/>
- Repository: <https://github.com/huyhoangcva90-lab/spider-man-life-rpg>
- Brand guide: [`docs/SPIDEY_LIFE_BRAND_GUIDE.md`](docs/SPIDEY_LIFE_BRAND_GUIDE.md)
- LXXXV architecture audit: [`docs/APP_V6_AUDIT_LXXXV.md`](docs/APP_V6_AUDIT_LXXXV.md)

## Luồng chính

1. Tạo một mission thật trong Arena hoặc Map.
2. Chuyển mission sang `DONE`.
3. Quest event được normalize rồi kích hoạt CombatEngine và RewardEngine.
4. Nhận XP, Web Coins, streak, loot và gây damage lên encounter hiện tại.
5. Đánh đầy stagger để mở `FINISHER`; hạ Green Goblin để kết thúc Chapter.

## Các mode có chức năng

- **Arena:** màn hình mặc định, Spider đấu villain, boss HP và battle action.
- **Missions:** Main/Side/Daily quest và cổng tạo nhiệm vụ đời thật.
- **Spider-Verse:** Peter Classic, Miles assist và team synergy của vertical slice.
- **City:** mode MapLibre để tìm, lọc và điều hướng; bấm nền map không tự tạo dữ liệu.
- **Hero:** profile, skill tree, gadget và inventory.

Các nút không có nội dung đã được loại bỏ. Giao diện không dùng rương/lootbox; phần thưởng đến từ mission thật.

Hero Arena dùng sprite sheet hành động với 17 state từ `idle` tới `victory`. Mission hoàn thành sẽ tự chạy combo/skill/ultimate phù hợp, kèm VFX truyện tranh `THWIP!`, `POW!`, `KRAK!` và impact shake. Có thể bấm trực tiếp vào hero để duyệt thử từng state.

## Action-RPG vertical slice

- Một district chơi được: Manhattan Rooftop, nền thành phố nhiều lớp và mưa đêm.
- Encounter chain: Street Thug → Tech Gunner → Shield Enemy → Hunter Captain → Green Goblin.
- Combat thực: Combo, Web Shot, Impact Web, Call Miles, Ultimate/Finisher; có HP, Web Energy, cooldown, charges, stagger, weakness, resistance và boss phase.
- Main/Side/Daily quest, reward, inventory, skill tree nhỏ, ba gadget và Spider-Verse team bonus đều đọc từ module dữ liệu thay vì hard-code trong HTML.
- Hoàn thành nhiệm vụ đời thật là trigger chính cho animation, damage, XP, Web Coins, daily progress và loot.
- Ba sample audio gốc được giữ nguyên: `spidey_jingle` cho Arena/victory, `another_day_another_sighting` cho crime/wave mới, `calling_all_webheads` cho Ally Call.

## Kiến trúc hiện tại

- Content được tách thành registry có ID kebab-case và validation khi boot: actions, heroes, allies, enemies, quests, rewards, districts và zones.
- `QuestEngine`, `DamageEngine`, `CombatEngine` và `RewardEngine` không phụ thuộc DOM; `PhaseOneGameEngine` chỉ điều phối state/event.
- Save canonical là version 2, tự migrate từ `spidey-action-rpg-phase-one-v1` mà không xóa dữ liệu cũ; có export/import/reset trong Game Settings.
- Event game chuẩn hóa cho quest, hit, damage, boss phase, reward, SFX, VFX và save; hai event cũ vẫn được phát để giữ tương thích UI/animation.
- Auto Combat là demo animation-only, không gây damage và không farm progression.

## Test

Mở `tests/domain-tests.html` qua static server. Bộ test browser-native kiểm tra 13 rule quan trọng: reward-once, Notion EXP idempotency, habit resource restore, HP clamp, boss phase, Finisher, cooldown, unique loot, save/load, migration, difficulty, ally cooldown và Ultimate cap.

## Chạy local

Đây là ứng dụng HTML/CSS/JavaScript module không cần build step. Để đọc và ghi Notion từ máy cá nhân, tạo `.env.local` trong thư mục dự án với dòng `NOTION_API_KEY=<khóa của bạn>` rồi chạy:

```bash
powershell -ExecutionPolicy Bypass -File tools/start_local_server.ps1 -Port 4173
```

Sau đó mở <http://127.0.0.1:4173/>. Nếu cổng 4173 đang chạy máy chủ cũ, hãy dừng máy chủ đó hoặc chọn cổng khác bằng `-Port 4186`. Máy chủ static thông thường không có API Notion.

## Dữ liệu và âm thanh

- Quest, Habit, Goal, Active Quests, Hero Profile, suit, skill, gadget, companion và badge được đọc từ Notion khi `/api/notion` hoạt động. Check-in, hoàn thành quest và đổi trang bị ghi lại vào Notion; tác vụ hoàn thành và chỉ số Hero có hàng chờ cục bộ khi mạng lỗi.
- Phần chiến đấu, nhật ký và một số chế độ phụ vẫn dùng LocalStorage. Hero Profile trong Notion là nguồn khởi tạo tiến độ; trạng thái trận đánh được lưu riêng trên thiết bị.
- GitHub Pages chỉ phục vụ file tĩnh, nên không thể gọi Notion live qua `/api/notion`. Vercel `/api/notion` mặc định từ chối truy cập; cần thiết kế đăng nhập riêng trước khi bật đồng bộ trên Internet. `data/notion-snapshot.json` là file được Git theo dõi và có thể công khai; không đẩy dữ liệu Notion cá nhân vào file này nếu không chủ ý công bố. Máy chủ local chỉ lắng nghe `127.0.0.1` và dùng khóa trong `.env.local`.
- SFX mặc định bật, nhưng trình duyệt chỉ cho phát audio sau thao tác đầu tiên của người dùng; có thể tắt ngay trên thanh trên hoặc trong Game Settings.
- App không tự xin quyền GPS khi khởi động.

## Công nghệ

- Vanilla HTML, CSS và JavaScript ES modules
- MapLibre GL + CARTO Dark Matter + OpenStreetMap data
- LocalStorage, Web Audio, Geolocation (chỉ khi người dùng bật)

## License

MIT. Các asset brand trong `assets/brand/` được tạo riêng cho dự án SPIDEY LIFE.
