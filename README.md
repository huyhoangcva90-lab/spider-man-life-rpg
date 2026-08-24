# SPIDEY LIFE — Arena Mission Hub

Ứng dụng Life RPG local-first biến nhiệm vụ đời thực thành sát thương trong trận đấu Spider hero vs villain.

- Live: <https://huyhoangcva90-lab.github.io/spider-man-life-rpg/>
- Repository: <https://github.com/huyhoangcva90-lab/spider-man-life-rpg>
- Brand guide: [`docs/SPIDEY_LIFE_BRAND_GUIDE.md`](docs/SPIDEY_LIFE_BRAND_GUIDE.md)

## Luồng chính

1. Tạo một mission thật trong Arena hoặc Map.
2. Chuyển mission sang `DONE`.
3. Nhận XP, Web Coins, điểm thuộc tính, streak và gây damage lên raid boss.
4. Đánh đầy stagger để mở `WEB FINISHER`; hạ boss để sang raid kế tiếp.

## Các mode có chức năng

- **Arena:** màn hình mặc định, Spider đấu villain, boss HP và battle action.
- **Missions:** nhật ký nhiệm vụ, tìm kiếm và lọc trạng thái.
- **Allies:** chọn một trong 100 Spider ally pixel.
- **Map:** mode bản đồ CARTO/MapLibre để tìm, lọc và điều hướng; bấm nền map không tự tạo dữ liệu.
- **Profile:** level, 6 thuộc tính, streak, raid, combat log và loot đã nhận.

Các nút không có nội dung đã được loại bỏ. Giao diện không dùng rương/lootbox; phần thưởng đến từ mission thật.

Hero Arena dùng sprite sheet hành động với 17 state từ `idle` tới `victory`. Mission hoàn thành sẽ tự chạy combo/skill/ultimate phù hợp, kèm VFX truyện tranh `THWIP!`, `POW!`, `KRAK!` và impact shake. Có thể bấm trực tiếp vào hero để duyệt thử từng state.

## Phase 1 action-RPG vertical slice

- Một district chơi được: Manhattan Rooftop, nền thành phố nhiều lớp và mưa đêm.
- Encounter chain: Street Thug → Tech Gunner → Shield Enemy → Hunter Captain → Green Goblin.
- Combat thực: Combo, Web Shot, Impact Web, Call Miles, Ultimate/Finisher; có HP, Web Energy, cooldown, charges, stagger, weakness, resistance và boss phase.
- Main/Side/Daily quest, reward, inventory, skill tree nhỏ, ba gadget và Spider-Verse team bonus đều đọc từ module dữ liệu thay vì hard-code trong HTML.
- Hoàn thành nhiệm vụ đời thật là trigger chính cho animation, damage, XP, Web Coins, daily progress và loot.
- Ba sample audio gốc được giữ nguyên: `spidey_jingle` cho Arena/victory, `another_day_another_sighting` cho crime/wave mới, `calling_all_webheads` cho Ally Call.

## Chạy local

Đây là ứng dụng HTML/CSS/JavaScript module không cần build step. Vì trình duyệt chặn ES modules khi mở bằng `file://`, hãy phục vụ thư mục bằng một static server, ví dụ:

```bash
python -m http.server 4173
```

Sau đó mở <http://127.0.0.1:4173/>. Root tự chuyển sang `app-v6/`, cũng là ứng dụng được GitHub Pages phục vụ.

## Dữ liệu và âm thanh

- Dữ liệu Life RPG, missions và ally được lưu trong LocalStorage của trình duyệt.
- Âm thanh mặc định là `OFF` và chỉ bật sau thao tác của người dùng.
- App không tự xin quyền GPS khi khởi động.

## Công nghệ

- Vanilla HTML, CSS và JavaScript ES modules
- MapLibre GL + CARTO Dark Matter + OpenStreetMap data
- LocalStorage, Web Audio, Geolocation (chỉ khi người dùng bật)

## License

MIT. Các asset brand trong `app-v6/assets/brand/` được tạo riêng cho dự án SPIDEY LIFE.
