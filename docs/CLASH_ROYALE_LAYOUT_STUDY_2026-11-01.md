# Clash Royale → Spider: nghiên cứu bố cục

Ngày kiểm tra: 01/11/2026. Ưu tiên của chủ dự án: giữ viền xanh, logo ở giữa, mọi mục thuộc khung game, Battle không cuộn, bốn skill + hai gadget + một ultimate. Hành trình 66 ngày thuộc Quest.

## 1. Chọn mẫu nào và vì sao

| Mẫu | Bằng chứng mức phổ biến | Phần đáng học cho Spider |
|---|---|---|
| Clash Royale — mẫu chính | Google Play hiển thị 500M+ lượt tải | Bố cục dọc, bốn hành động dễ nhận, nhịp tài nguyên → chọn thẻ → sân đấu; điều hướng bộ sưu tập cùng hệ thống với Battle |
| Brawl Stars — mẫu phụ | Google Play hiển thị 500M+ lượt tải | Nhân vật và mục tiêu rõ, kỹ năng thường / gadget / super khác vai trò; trạng thái nút đọc ngay trong giao tranh |
| Pokémon TCG Pocket — mẫu phụ | Google Play hiển thị 50M+ lượt tải | Lưới bộ sưu tập đồng đều; ảnh, tìm kiếm và bộ lọc tách khỏi phần mô tả dài; thanh điều hướng cố định |

Đây là nhóm game phổ biến phù hợp để nghiên cứu, không phải khẳng định thứ hạng tải toàn cầu. Các con số là mốc hiển thị trên Google Play khi kiểm tra.

Nguồn chính thức: [Clash Royale](https://play.google.com/store/apps/details?id=com.supercell.clashroyale), [Brawl Stars](https://play.google.com/store/apps/details?id=com.supercell.brawlstars), [Pokémon TCG Pocket](https://play.google.com/store/apps/details?id=jp.pokemon.pokemontcgp).

## 2. APK đã thực sự đọc

- Nguồn sẵn có trên máy: `D:/test/Zenflow-main/Clash+Royale_160402020_APKPure.xapk` (1.028.220.365 byte).
- Manifest trong XAPK: package `com.supercell.clashroyale`, version `160402020`, target SDK 35; có base APK và `install_time_asset_pack.apk`.
- Base APK đã có trong kho nghiên cứu: `tools/apk_unpacked/clash-reference/base.apk`.
- SHA256 base APK: `0D0DFED74FDB755B71F5424E70AF9234ED25471C029D09863B657FED9057B13E`.
- Lượt này đã giải nén lại asset pack, lấy bảng gốc và giải mã Supercell LZMA. Kết quả nằm dưới `tools/reference-apks/clash-layout-study/assets/`.
- Đọc tĩnh, không cài/chạy game, không lấy dữ liệu tài khoản. Chưa xác minh chữ ký nhà phát hành của gói Clash cục bộ; hash chỉ xác định đúng tệp đã nghiên cứu.

Tải bổ sung: APKPure trả HTTP 403 cho Brawl Stars và Pokémon TCG Pocket. Đã tìm trang APKMirror và thử liên kết tải Pokémon; công cụ không lấy được trang tải tiếp theo. Vì vậy **chưa có APK mới của hai game này trên máy**; nhận xét về chúng dựa trên nguồn chính thức và hình ảnh công khai, không được gọi là kết quả giải mã APK.

Ảnh tham khảo chính thức được lưu trong `output/reference-ui/`. Đây là ảnh quảng bá có lồng giao diện, không phải ảnh chụp từ một phiên game chạy trên máy.

## 3. Clash xác nhận được gì từ tệp gốc?

### `csv_client/battle_page_button_layout.csv`

17 loại nút có các trường `HorAlign`, `Order`, `MaxCount`.

Ví dụ: `button_daily_tasks` bên trái / thứ tự 0 / tối đa 1; `button_dailylogin` bên trái / thứ tự 1 / tối đa 1; `button_survey` bên phải / thứ tự 3 / tối đa 1. Các nút sự kiện, ưu đãi và nhiệm vụ được quản lý thành những vị trí có trật tự.

Tên các nút cho thấy bảng này liên quan trang Battle/lobby và nút phụ của trang; **không dùng nó để suy ra tọa độ bốn thẻ trong trận**. Bảng không có trường X/Y hoặc kích thước màn hình.

Áp dụng: mỗi cạnh của Spider chỉ nên có một nhóm chức năng ổn định; dùng menu cho phần phụ. Đừng thêm nhiều nút nổi chen vào sân đấu chỉ vì còn khoảng trống.

### `csv_client/ability_button.toml`

13 trạng thái được khai báo: chưa biết nhân vật, nhân vật vắng mặt, sẵn sàng, hồi chiêu, hết lượt dùng, có thời hạn, vô hiệu hóa, thiếu Elixir, tạm không dùng được, đang triển khai, chờ, đang thi triển, chưa mở.

Điểm cụ thể: trạng thái vắng mặt có `Alpha = 0` và `Interactive = false`; trạng thái thiếu Elixir và vô hiệu hóa dùng grayscale; trạng thái Ready có nhãn `available` và âm báo riêng.

Áp dụng: Spider dùng trạng thái thật từ engine. Chiêu đang hồi hiện số lượt còn lại; thiếu Energy hiện số thiếu; khi đang diễn hoạt ảnh thì khóa bấm. Không dùng cùng một trạng thái mờ cho mọi nguyên nhân rồi bắt người chơi đoán.

### `csv_client/health_bars.csv`

Tệp khai báo riêng export cho người chơi / đối thủ, nhiều cỡ thanh máu, thanh có số, shield và thanh chia đoạn. Ví dụ: `hp_player_medium`, `hp_enemy_medium`, `hp_shield_player_medium`; `ShowOwnAlways` và `ShowEnemyAlways` được cấu hình theo loại.

Áp dụng: giữ máu và khiên tách nghĩa, gắn với đúng nhân vật. HUD trận thử chỉ hiển thị một bộ HP/Energy; EXP hồ sơ thuộc màn Hero, không lặp thêm một bộ trên Battle Lab.

### `csv_logic/loadout.toml`

Các cấu hình bộ bài có giới hạn slot và loại slot riêng, thay đổi theo chế độ/điều kiện. Không sao chép số lượng thẻ của Clash sang Spider. Spider tiếp tục dùng bốn skill, hai gadget và một ultimate đã thống nhất.

Các tệp `sc/ui.sc` và `sc/ui_ability_button.sc` có trong gói; chưa dựng scene nhị phân thành ảnh. Không khẳng định đã lấy được tọa độ giao diện chính xác hoặc dựng lại pixel giống hệt Clash.

## 4. Logic hình ảnh cần học

### Trang chính / bộ sưu tập

Ảnh bộ sưu tập Clash trên Google Play cho thấy thẻ trong lưới bốn cột, nhãn cấp độ và tiến độ ở cùng vị trí giữa các thẻ; điều hướng chính nằm dưới, tab đang chọn được làm nổi. Tên và ảnh của từng thẻ thay đổi nhưng hình dáng và vị trí thông tin ổn định.

Spider áp dụng vào Hero: ảnh nhân vật là trọng tâm; bộ đang trang bị nằm trước kho đồ; thẻ suit/skill cùng tỷ lệ; chạm một thẻ mới mở mô tả và nút trang bị. Bộ sưu tập được cuộn bên trong vùng nội dung. Khung, logo và điều hướng chính ở yên.

### Trong trận

Vòng nhìn nên ngắn: **mục tiêu → tài nguyên → hành động → kết quả trên sân**. Bốn hành động chính ở cùng một hàng giúp nhớ vị trí. Hỗ trợ và ultimate có nhóm riêng. Trạng thái không dùng được nằm trên chính thẻ.

Clash dùng tài nguyên để ra quyết định triển khai bài; xem [hướng dẫn Elixir của Supercell](https://support.supercell.com/clash-royale/en/articles/elixir.html). Spider áp dụng cách hiển thị chi phí gần hành động, giữ cơ chế chiến đấu theo lượt hiện có.

### Brawl và Pokémon đóng góp gì?

Brawl giúp phân vai trò hành động thường, gadget và super. Đây là tham khảo chức năng; không lấy bố cục chiến đấu ngang của Brawl ép vào màn dọc Spider. [Mô tả chính thức](https://play.google.com/store/apps/details?id=com.supercell.brawlstars).

Ảnh Pokémon TCG Pocket cho thấy công cụ collection ở phía trên, lưới thẻ ở giữa, điều hướng ở dưới. Dùng nguyên tắc này cho kho suit, skill và badge. Quest/Habit vẫn là công việc và lịch sử thực tế, nên dùng danh sách dễ đọc trong cùng khung, không biến mọi nhiệm vụ thành thẻ sưu tập. [Trang chính thức](https://play.google.com/store/apps/details?id=jp.pokemon.pokemontcgp).

## 5. Bố cục Spider áp dụng trong lượt này

```text
VIỀN SPIDER / LOGO GIỮA
┌─────────────────────────────────┐
│ HP · Energy               Lượt │
│                                 │
│        NHÂN VẬT / ĐỐI THỦ        │
│     Mục tiêu · HP đúng đối tượng │
│                                 │
│ Thông báo hành động ngắn         │
│ [Skill 1][Skill 2][Skill 3][Skill 4]│
│ [Gadget1][Gadget2][   Ultimate   ]│
├─────────────────────────────────┤
│ Quest · Hero · Battle · Habit · Apps│
└─────────────────────────────────┘
```

- Trên điện thoại: bốn thẻ skill cao 86 px; hàng hỗ trợ cao 50 px. Ultimate chiếm hai cột. Các số này là lựa chọn cho Spider, không phải số đo lấy từ Clash.
- So với bốn hàng nút cũ cao 44 px, phần rack mới cao 142 px thay vì 191 px (đã tính gap). Sân đấu được thêm khoảng 49 px ở cùng chiều cao tổng.
- Tên chiêu xuống dòng, chi phí nằm ở đáy thẻ; trạng thái hồi chiêu màu vàng nhạt, thiếu Energy màu đỏ nhạt, vẫn có chữ giải thích.
- Điều hướng chính hiện ở Hero, Quest, Habit và app Gambit trong khung; phần nội dung dành sẵn chỗ phía trên thanh này.
- Desktop tiếp tục bố trí bốn skill thành nhóm 2×2 bên cạnh hai gadget và ultimate; thay đổi rack chỉ áp dụng cho màn hẹp ≤600 px.
- Chỉ thay cách trình bày và trạng thái nút; không thêm sát thương, phần thưởng, slot Notion hay giao dịch mua vật phẩm.

## 6. Phạm vi và kiểm tra

Kiểm tra trên 360×640 và 390×844: bảy nút trong vùng nhìn, tên không bị cắt mất, nút cao ít nhất 44 px; Battle không cuộn; dock không che hành động; Web-Pull chuyển sang hồi chiêu sau khi dùng. Kiểm tra riêng Hero/Quest/Habit để bảo đảm dock không che nội dung app.

Các thư mục APK, gói công cụ và ảnh đối chiếu được giữ ngoài phần mã xuất bản. Không đưa font, texture, logo hay scene của Clash vào Spider.

## Nguồn bổ sung

- [Supercell — March Update 2026](https://supercell.com/en/games/clashroyale/blog/release-notes/march-update-2026/): UI và slot tiếp tục thay đổi; không coi một phiên bản APK là thiết kế vĩnh viễn.
- [DeNA — giới thiệu Pokémon TCG Pocket](https://dena.com/intl/news/4742/): vòng sưu tập, trưng bày và giao tranh.
- [APKMirror — Brawl Stars](https://www.apkmirror.com/apk/supercell/brawl-stars/) và [Pokémon TCG Pocket](https://www.apkmirror.com/apk/the-pokemon-company/pokemon-tcg-pocket/): nguồn tải phụ đã khảo sát, không dùng để thay thế nguồn chính thức khi nói về gameplay.
