# SPIDEY LIFE — Arena Mission Hub

Ứng dụng Life RPG kết hợp Habit, hành trình 66 ngày, Quest, Spider Apps và Battle. Notion là nguồn dữ liệu thật; dữ liệu mẫu và moveset tham khảo được giữ riêng.

- Live: <https://spider.huykl.id.vn/>
- Bản đấu thử theo lượt và moveset riêng: <https://spider.huykl.id.vn/battle-lab/> (chưa nối Notion). Thư viện 47 hoạt ảnh: `/battle-lab/clip-library.html`; có lối vào trực tiếp từ Battle và menu ứng dụng.
- Repository: <https://github.com/huyhoangcva90-lab/spider-man-life-rpg>
- Brand guide: [`docs/SPIDEY_LIFE_BRAND_GUIDE.md`](docs/SPIDEY_LIFE_BRAND_GUIDE.md)
- Phạm vi từng chức năng, tránh xây trùng: [`docs/FEATURE_OWNERSHIP.md`](docs/FEATURE_OWNERSHIP.md)
- LXXXV architecture audit: [`docs/APP_V6_AUDIT_LXXXV.md`](docs/APP_V6_AUDIT_LXXXV.md)

## Luồng chính

1. Habit chính nằm trong **Life Reset**; tab Progress dùng lưới ô vuông kiểu Hello Habit và tab 66 Days theo dõi hành trình.
2. Quest được lấy từ Notion rồi tự chia Today, Main, Side và Daily theo Type, Frequency và Priority.
3. Hoàn thành Habit hoặc Quest thật trong Notion để hồi HP, Energy, nhận XP và tiến triển trận đấu.
4. Field là trung tâm app nhỏ: Time, Gym, Journal, Place Map và các app Gambit liên quan.
5. Place Map lưu địa điểm theo danh mục, mở chỉ đường ngoài và chia sẻ link sang điện thoại.

## Các mode có chức năng

- **Arena:** màn hình mặc định, Spider đấu villain, boss HP và battle action.
- **Life Reset:** Habit hôm nay, lưới tiến độ và chiến dịch 66 ngày dùng Notion làm nguồn chuẩn.
- **Quests:** Main/Side/Daily quest và cổng tạo nhiệm vụ đời thật.
- **Spider-Verse:** Peter Classic, Miles assist và team synergy của vertical slice.
- **Field:** trung tâm Spider Apps; Place Map là một công cụ con để tìm, lưu, lọc, chia sẻ và điều hướng.
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

Đây là ứng dụng HTML/CSS/JavaScript module không cần build step. Để đọc và ghi Notion từ máy cá nhân, tạo `.env.local` trong thư mục dự án với dòng `NOTION_API_KEY=<khóa của bạn>` (hoặc `NOTION_TOKEN=<khóa của bạn>` như Gambit) rồi chạy:

```bash
powershell -ExecutionPolicy Bypass -File tools/start_local_server.ps1 -Port 4173
```

Sau đó mở <http://127.0.0.1:4173/>. Nếu cổng 4173 đang chạy máy chủ cũ, hãy dừng máy chủ đó hoặc chọn cổng khác bằng `-Port 4186`. Máy chủ static thông thường không có API Notion.

## Trang riêng có đăng nhập

Bản Cloudflare Pages có trang đăng nhập riêng cho cả giao diện và dữ liệu Notion. Hướng dẫn cấu hình và đóng gói nằm trong [`docs/PRIVATE_CLOUDFLARE_PAGES.md`](docs/PRIVATE_CLOUDFLARE_PAGES.md). Gói triển khai được tạo bằng `node tools/prepare_private_pages.mjs`.

## Dữ liệu và âm thanh

- Quest, Habit, Goal, Active Quests, Hero Profile, suit, skill, gadget, companion và badge được đọc từ Notion khi `/api/notion` hoạt động. Check-in, hoàn thành quest và đổi trang bị ghi lại vào Notion; tác vụ hoàn thành và chỉ số Hero có hàng chờ cục bộ khi mạng lỗi.
- Phần chiến đấu, nhật ký và một số chế độ phụ vẫn dùng LocalStorage. Hero Profile trong Notion là nguồn khởi tạo tiến độ; trạng thái trận đánh được lưu riêng trên thiết bị.
- GitHub Pages chỉ phục vụ file tĩnh, nên không thể gọi Notion live qua `/api/notion`. Trên Vercel, đồng bộ Notion riêng cần **cả hai** biến môi trường Production: `NOTION_API_KEY` (khóa Notion) và `NOTION_PROXY_ACCESS_TOKEN` (mã truy cập riêng đủ dài, khác khóa Notion). Triển khai lại, mở Quest và nhập mã truy cập riêng để tạo phiên chủ tài khoản kéo dài 12 giờ. Mã không được lưu trong JavaScript hay file Git; phiên dùng cookie HttpOnly. Nếu chưa kết nối, thao tác được lưu cục bộ và không ghi lên Notion. `data/notion-snapshot.json` là file được Git theo dõi và có thể công khai; không đẩy dữ liệu Notion cá nhân vào file này nếu không chủ ý công bố. Máy chủ local chỉ lắng nghe `127.0.0.1` và dùng khóa trong `.env.local`.
- Khi không kết nối Notion, Quest, Habit và Goal vẫn tạo, hoàn thành và lưu trong trình duyệt trên thiết bị đang dùng. Battle dùng cùng tiến độ cục bộ. File **Export Save JSON** trong Settings chứa cả tiến độ game và các mục cục bộ để chuyển hoặc sao lưu; Import Save JSON khôi phục chúng. Xóa dữ liệu trình duyệt sẽ xóa tiến độ nếu chưa xuất file. Chế độ này không gửi thay đổi lên Notion.
- SFX mặc định bật, nhưng trình duyệt chỉ cho phát audio sau thao tác đầu tiên của người dùng; có thể tắt ngay trên thanh trên hoặc trong Game Settings.
- App không tự xin quyền GPS khi khởi động.

## Công nghệ

- Vanilla HTML, CSS và JavaScript ES modules
- MapLibre GL + CARTO Dark Matter + OpenStreetMap data
- LocalStorage, Web Audio, Geolocation (chỉ khi người dùng bật)

## License

MIT. Các asset brand trong `assets/brand/` được tạo riêng cho dự án SPIDEY LIFE.
