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

Mở `tests/domain-tests.html` qua static server. Bộ test browser-native kiểm tra 11 rule quan trọng: reward-once, HP clamp, boss phase, Finisher, cooldown, unique loot, save/load, migration, difficulty, ally cooldown và Ultimate cap.

## Chạy local

Đây là ứng dụng HTML/CSS/JavaScript module không cần build step. Vì trình duyệt chặn ES modules khi mở bằng `file://`, hãy phục vụ thư mục bằng một static server, ví dụ:

```bash
python -m http.server 4173
```

Sau đó mở <http://127.0.0.1:4173/>. Đây là bản app chính duy nhất và cũng là bản GitHub Pages phục vụ.

## Dữ liệu và âm thanh

- Dữ liệu Life RPG, missions và ally được lưu trong LocalStorage của trình duyệt.
- SFX mặc định bật, nhưng trình duyệt chỉ cho phát audio sau thao tác đầu tiên của người dùng; có thể tắt ngay trên thanh trên hoặc trong Game Settings.
- App không tự xin quyền GPS khi khởi động.

## Công nghệ

- Vanilla HTML, CSS và JavaScript ES modules
- MapLibre GL + CARTO Dark Matter + OpenStreetMap data
- LocalStorage, Web Audio, Geolocation (chỉ khi người dùng bật)

## License

MIT. Các asset brand trong `assets/brand/` được tạo riêng cho dự án SPIDEY LIFE.
