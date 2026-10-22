# Xét duyệt hệ thống Spider Life — 23/10/2026

## Kết luận

**Chưa nên coi toàn bộ hệ thống là ổn định để dùng làm nguồn ghi nhận duy nhất.** Khung sản phẩm đã rõ và nhiều thành phần chạy được, nhưng kết nối dữ liệu giữa các app chưa đồng nhất. Ưu tiên tiếp theo là tính đúng đắn của dữ liệu, trạng thái đồng bộ và khả năng khôi phục.

Không có cơ sở để chấm một tỷ lệ “hoàn thiện 80–90%”: chưa có bộ tiêu chí nghiệm thu toàn hệ thống hoặc kiểm thử đủ các luồng trên thiết bị thật.

## Phạm vi và bằng chứng

- Phiên bản đọc: `82f4b09`; 98 kiểm thử tự động hiện có đạt. Chúng bao gồm phân trang Notion, quan hệ, check/undo bằng dữ liệu giả lập, game authority, combat lab, Field, clock và routing.
- Đọc các đường chính: boot, Notion adapter/proxy/session, Habit/Quest/history/Planner, Hero/presenter, game engine/save, Field/backend, Routine, Gym, Journal, English, âm thanh và điều hướng.
- Kiểm tra web thật: Hero Skills, Field Routine; kiểm tra không đăng nhập các endpoint session/game-state/snapshot. Không ghi thử vào dữ liệu đời thực.
- Tái hiện Gym bằng chính hàm `nFetch` hiện có và phản hồi API giả lập: nguồn có một bản ghi nhưng Gym đọc được 0, schema rỗng.
- Các bảng Notion Habit/Daily/Planner đã được kiểm tra schema và dữ liệu có giới hạn ở lượt trước: ba Daily có liên kết Habit; 10 Planner đang mở nhưng không có liên kết Habits. Lượt rà này không khẳng định các bảng đó vẫn không đổi từng phút.
- Chưa kiểm thử trên iPhone/Android thật, hai tài khoản/thiết bị cùng ghi, phiên Google Calendar thật hoặc phục hồi tất cả app từ bản sao lưu. Không phải kiểm toán bảo mật toàn diện hay đọc từng file trong mọi thư mục tài nguyên.
- Finance không được thay đổi. Các phát hiện dưới đây là kết quả rà soát và đề xuất, chưa phải danh sách đã sửa.

## Vấn đề theo ưu tiên

### P1 — Cần xử lý trước khi tiếp tục mở rộng

#### 1. Bản chụp đời thực vẫn công khai

**Đã xác nhận trên web:** `/data/notion-snapshot.json` trả HTTP 200 khi không đăng nhập, gồm 12 Master Calendar và 14 Habits. Không chép tên/nội dung cá nhân vào báo cáo.

`NotionAdapter.loadSnapshot()` đọc file này, và `js/main.js:93` nạp nó khi boot. Phiên riêng của API không bảo vệ một file tĩnh. Phạm vi công khai được chủ dự án cho phép trước đó là dữ liệu game, không phải mọi nhiệm vụ/nhật ký đời thực.

**Giải pháp:** bảo toàn bản sao riêng; tách snapshot công khai chỉ gồm trường game đã cho phép; chuyển dữ liệu đời thực sang API có phiên chủ tài khoản. Kiểm tra URL file trực tiếp, các deployment cũ và nguồn Map. Xử lý lịch sử Git như một việc riêng; không tự xóa lịch sử kho mã.

#### 2. Check Habit và lịch sử ngày chưa là một luồng ghi

`life-reset/js/app.js:962` chỉ ghi `Today.checkbox`. Lịch sử lại đọc quan hệ `Habits.Days ↔ Daily`. Vì vậy một dấu check có thể thành công trong UI nhưng không có hoạt động Daily tương ứng. App đã ghi rõ giới hạn, nhưng logic sử dụng thường ngày vẫn chưa hoàn chỉnh.

Khi qua ngày, app xóa dấu cục bộ rồi lần sync sau đọc lại `Today`. **Nếu automation Notion chưa reset trường này**, dấu hôm trước có thể trở lại và còn được ghi thành quan sát của ngày mới. Chưa xác minh automation bên ngoài nên đây là rủi ro có điều kiện, không khẳng định nó luôn xảy ra.

**Giải pháp:** định nghĩa một lần check theo Habit ID + ngày Việt Nam + mã thao tác. Dùng Daily hiện có cho hoạt động đúng/sai; kiểm tra nhu cầu trước khi thêm Activity riêng cho lượng/phút/km. Luồng ghi cần có trạng thái chưa gửi/đang gửi/đã xác nhận/lỗi, mã chống ghi hai lần, đọc lại sau ghi, thử lại phần còn thiếu. Notion không cung cấp giao dịch nhiều bảng theo cách app đang dùng; không gọi hai lần ghi độc lập là nguyên tử.

#### 3. Gym hiểu sai phản hồi API

`field-tools/apps/gym/index.html:361–365`: `nFetch` bọc toàn bộ `{ok,data}` vào `r.data`, trong khi `queryDb` và `dbSchema` đọc `r.data.results` và `r.data.properties`. Dữ liệu thực nằm sâu thêm một cấp. Adapter chung được chèn ở dòng 224, trước phần khai báo hàm Gym, nên không sửa được đường này theo cách hiện tại.

**Tái hiện:** nguồn trả một bản ghi → Gym đọc 0; có Name schema → Gym đọc schema rỗng. `syncAll` vẫn có thể báo “Notion synced”. `queryDb` cũng chỉ lấy trang đầu, tối đa 50 bản ghi.

**Giải pháp:** một chuẩn phản hồi API dùng chung; sửa thứ tự khởi tạo; phân trang; chỉ báo nguồn đã đồng bộ khi đọc hợp lệ. Kiểm tra schema, query, tạo log, trả ID và liên kết set bằng bản ghi QA riêng.

#### 4. Phụ thuộc dịch vụ Gambit vẫn còn

`server/field-backend.mjs:3` trỏ tới `gambit-d9b.pages.dev`. Nó giữ các kết nối cloud/Google/Sheets và có thể là đường Notion của Spider. Endpoint session trên web trả `configured:true, connected:false, backend:field` ở lượt kiểm tra.

**Giải pháp:** giữ dịch vụ này chạy cho đến khi kiểm kê và chuyển xong KV/dữ liệu/OAuth/session/biến môi trường/URL callback. Có thể chuyển hoặc đóng giao diện cũ độc lập với backend. Tên miền Gambit còn tồn tại chưa có nghĩa là đã gộp thất bại; tắt toàn bộ project ngay có thể làm Field hỏng. Đặt tên và tài liệu rõ cho phần dịch vụ còn dùng.

### P2 — Cần sửa để người dùng hiểu và tin trạng thái

#### 5. Một phiên đăng nhập chưa đồng nghĩa mọi app dùng Notion

Routine `app.compiled.js:310` lưu `/api/cloud?key=routines`, còn khởi tạo `ensureRoutineDefaults(ldR())`; web thật hiện các routine mặc định, có Lunch. Journal và English có kho LocalStorage riêng. `api/routine.mjs` lại chỉ chấp nhận `hasOwnerSession`, khác đường Field session production.

**Giải pháp:** bảng ánh xạ app → dữ liệu → API → phương thức đọc/ghi → quyền truy cập. Mỗi app hiển thị riêng “Notion”, “Cloud”, “Thiết bị”, “Bản lưu”, thời điểm và thao tác chưa gửi. Routine cần adapter cho DB Routine hiện có; thống nhất xác thực trước khi bật API. Dữ liệu mẫu phải là lựa chọn dùng thử, không tự coi là dữ liệu người dùng.

#### 6. Định nghĩa mục tiêu Habit chưa khớp đầy đủ HelloHabit

Planner có Frequency, Unit, Start/End và công thức; chưa có liên kết Habits trong 10 kế hoạch đã kiểm tra. Công thức Check hiện đếm Daily qua Habit nhưng không lọc khoảng Start/End. Total Target dùng số chu kỳ trọn vẹn; không nên tự diễn giải nó thành tiến độ tuần hiện tại.

**Giải pháp:** nối kế hoạch bằng ID sau khi xác nhận bản ghi; giữ công thức cũ để đối chiếu. Bổ sung quy tắc rõ cho tăng/giảm/bỏ thói quen, số lượng/đơn vị, lịch lặp, ngày nghỉ và tạm dừng. Tách “chưa biết”, “bỏ qua” và “không đạt”. Xem checklist 53 mục trong `HELLOHABIT_AUDIT.md`.

#### 7. Một ngày trong hành trình 66 ngày hiện chỉ cần có bất kỳ check-in

`life-reset/js/app.js:1276–1280` hợp ngày của mọi Habit thành một tập; chỉ cần một Habit có ghi nhận thì ô ngày có trạng thái done. Điều này chỉ đúng nếu sản phẩm định nghĩa “ngày có hoạt động”, không chứng minh hoàn thành toàn bộ mục tiêu ngày.

**Giải pháp:** giữ nhãn “có hoạt động”, hoặc định nghĩa tiêu chuẩn chiến dịch: các Habit bắt buộc, ngưỡng hoàn thành, lịch nghỉ. Hiển thị 2/5 bên cạnh hoạt động ngày. Chốt ý nghĩa trước khi nối thưởng.

#### 8. Map chưa đối soát đầy đủ thay đổi từ nguồn

`NotionAdapter.parseSnapshot()` ưu tiên tạo marker mới, bỏ qua nhiệm vụ đã done và không cập nhật marker cũ khi tên/tọa độ/trạng thái thay đổi. Vì vậy marker đã nhập có thể cũ hoặc vẫn hiện sau khi nhiệm vụ hoàn thành.

**Giải pháp:** đối soát theo Notion page ID; cập nhật trường nguồn, giữ phần ghi chú địa điểm của người dùng, xử lý hoàn thành/lưu trữ có quy tắc. Map là cách xem nhiệm vụ đã có, không tạo thêm nhiệm vụ thưởng độc lập.

#### 9. Arena chưa bảo đảm phát đủ mọi hoạt ảnh từ nhiều log liên tiếp

Reader `server/notion-game-reader.mjs:32` chỉ lấy một log gần nhất. Presenter thăm dò mỗi 20 giây và so fingerprint. Cách này hạn chế phát lại khi tải trang, nhưng nếu có nhiều log giữa hai lần đọc thì không bảo đảm trình chiếu hết. Đây là vấn đề trình chiếu; không có bằng chứng nó tự làm mất dữ liệu Notion.

**Giải pháp:** đọc nhóm log mới theo mốc, phân trang và giữ tập log đã trình chiếu. Xếp hàng hoạt ảnh; kết quả cuối vẫn lấy Notion. Xử lý pending → resolved đúng một lần. Giữ battle-lab là khu thử, chưa ghép luật sát thương/cooldown của lab vào Arena thật.

#### 10. Lưu/khôi phục và mất dữ liệu chưa có một quy trình chung

GameSaveManager xuất state của game; Habit, Journal, English và các app khác lưu ở các khóa khác. Một file game save không phải bản sao lưu toàn Spider. Một số `catch` khi LocalStorage lỗi chỉ im lặng, ví dụ `life-reset/js/app.js:194–198`.

**Giải pháp:** màn dữ liệu cho biết nơi lưu từng app, lần sao lưu và trạng thái chưa gửi. Xuất theo từng nguồn trước, sau đó mới làm gói backup có version. Thử phục hồi trên trình duyệt sạch. Cảnh báo lỗi lưu thật; không báo thành công nếu chỉ còn state trong RAM.

### P3 — Hoàn thiện trải nghiệm và khả năng bảo trì

11. **Điều hướng:** các lối tắt Habit/Quest đã được gom tốt hơn, nhưng main/subview/bộ lọc/chi tiết chưa đều có URL và nút Back tương ứng; Life Reset dùng replaceState cho tab. Nên giữ vị trí cuộn/bộ lọc, đồng bộ URL cho các màn có thể chia sẻ/nhúng. Đổi ngôn ngữ “Today”, “HELLO”, “66 NGÀY” thành tên vai trò dễ hiểu mà vẫn giữ thương hiệu.
12. **Không gian điện thoại:** giữ nguyên khung Spider; giảm số lớp header và dòng trạng thái lặp trong màn con. Ưu tiên nội dung/thao tác chính, chữ dễ đọc và vùng chạm tối thiểu khoảng 44 px. Kiểm tra bàn phím, safe area, chữ lớn, reduced motion và iframe thực tế. Không coi thử viewport Chrome là đã kiểm thử iPhone.
13. **Âm thanh:** `createNoiseNode(type)` trong Someday vẫn dùng một thuật toán pink noise cho các tên âm khác nhau. Đổi mô tả cho đúng hoặc cung cấp nguồn âm riêng; tách việc này khỏi ba clip Spider đã sửa.
14. **Tài liệu/phiên bản:** README vẫn mô tả nhiều luật combat cục bộ và khả năng offline rộng hơn màn chính hiện tại; dữ liệu thật hiện theo Notion authority. Cần viết lại theo đường thực tế và hiển thị mã bản đang chạy, tránh nhầm local/GitHub/production/battle lab.

Todo cũ còn handler xóa bản nháp việc con trước khi mọi việc con lưu xong (`field-tools/notion-connection.js:126`). Hiện lối vào Todo chính đã chuyển sang Quest, nên không đánh đồng lỗi handler cũ này với màn Quest đang dùng. Giữ trong danh sách kiểm tra trước khi mở lại hoặc nhập chức năng việc con.

## Những phần đang đi đúng hướng

- `js/main.js:34` bật Notion authority; các thao tác tiến triển/phục hồi/tấn công/đổi mission của engine có chặn tương ứng. Không phát hiện bằng chứng đường chính đang tự cộng thưởng từ mẫu.
- Hero đã phân biệt chiêu chủ động, nội tại, Ultimate; không tự gán Energy/CD khi nguồn không có. Chế độ xem bộ sưu tập và thao tác lưu trang bị đã được phân biệt.
- Phạm vi game công khai có danh sách trường cho phép; các API dữ liệu riêng có cơ chế phiên. Vấn đề file snapshot công khai phải xử lý riêng.
- Check Habit đổi trạng thái sau khi API xác nhận, có chặn thao tác đang gửi; lịch sử đọc phân trang và không biến ô trống thành thất bại.
- Lối vào Habit/Quest đã dùng chung màn, dữ liệu cũ chưa bị xóa. Có giảm chuyển động và hỗ trợ focus ở nhiều màn.
- Battle lab tách riêng là phù hợp để thử hoạt ảnh và luật mà không sửa dữ liệu Hero thật.

## Thiết kế logic đề xuất

| Thành phần | Sở hữu điều gì | Không được đếm thêm |
|---|---|---|
| Habit | Định nghĩa thói quen và lịch mục tiêu | Không nhân bản thành nhiệm vụ thưởng khác cùng lần check |
| Daily / Activity | Bằng chứng đã làm, ngày giờ, lượng và nguồn | Mỗi lần thực hiện có ID và quy tắc chống ghi hai lần |
| Quest | Việc có hạn/kết quả và các lần lặp | Calendar/Map chỉ là màn xem cùng nhiệm vụ |
| Routine | Trình tự thực hiện các bước | Liên kết Habit/Task có sẵn khi cùng hành động |
| Timer | Một phiên thời gian và Habit/Task nhận phiên đó | Không vừa lưu Pomodoro vừa cộng thêm cùng phiên ở Habit |
| Journal | Một note liên kết nhiều mục nếu cần | Không chép nội dung note thành nhiều kho khác nhau |
| Hero / Battle | Kết quả game do Notion xác nhận | Web không tự cộng XP/HP/damage lần thứ hai |
| Field | Lối vào công cụ và trạng thái nguồn | Không sở hữu một bộ Habit/Quest mới |

Sự kiện đời thực → ghi nhận được xác nhận trong Notion → quy tắc game Notion tính kết quả → game log được xác nhận → web trình chiếu và cập nhật HUD. Mỗi bước cần có dấu vết để tìm được “vì sao chỉ số này thay đổi”.

Không cần tách hàng loạt microservice hoặc đổi framework lúc này. Một lớp kết nối có chuẩn phản hồi, phiên và lỗi thống nhất đã giải quyết được nhiều vấn đề hiện tại. LocalStorage phù hợp làm bản lưu/nháp; cần nói rõ khi nó đang là nơi lưu duy nhất.

## Thứ tự nâng cấp đề nghị

1. **Cổng dữ liệu và an toàn bản ghi:** thu hẹp snapshot công khai; thống nhất phiên/chuẩn API; sửa Gym; lập bản đồ phụ thuộc dịch vụ cũ.
2. **Hoàn tất một vòng Habit:** check → Daily/activity → đọc lại → history → Planner → báo cáo. Thêm reset ngày, retry và quy tắc chống ghi đôi. Sau đó mới mở rộng đủ các kiểu HelloHabit.
3. **Quest và Routine:** giữ nháp, nhiệm vụ con, lặp, undo; nối Routine thật, Calendar và Map vào cùng ID. Chưa nhập thêm app mới khi nguồn chưa rõ.
4. **Game:** chốt ánh xạ skill Notion ↔ moveset, xử lý log nhiều lượt, và tiêu chuẩn animation. Tiến triển game vẫn do Notion quyết định.
5. **UX và phát hành:** màn hình điện thoại, nút Back, nguồn trạng thái, backup/restore, tài liệu và chỉ báo phiên bản. Finance giữ phiên bản người dùng đang hài lòng; chỉ kiểm tra các tích hợp chung có ảnh hưởng.

## Tiêu chí để gọi là “ổn”

- Check rồi tải lại hoặc mở thiết bị thứ hai cho cùng ngày: dữ liệu và lịch sử khớp.
- Qua 00:00 Việt Nam: dấu hôm trước không thành check mới; ngày nghỉ không bị phạt sai.
- Gửi rồi mất mạng: có thể xác định kết quả, thử lại không tạo trùng; lỗi không làm mất nháp.
- Bỏ check/sửa log: thống kê và phần thưởng theo quy tắc đã chốt, có dấu vết thay đổi.
- Nguồn không tải được: hiện bản lưu và thời điểm đúng; không báo “synced” chung.
- Hai log game giữa hai lần tải: kết quả cuối đúng và cách phát hoạt ảnh có quy tắc.
- Map/Calendar/Quest cùng một nhiệm vụ không làm tăng gấp đôi số việc hoặc XP.
- Khôi phục bản sao trên trình duyệt sạch và kiểm tra đủ từng app quan trọng.
- Kiểm tra thật trên Chrome Android/Safari iPhone và iframe Notion; cả chạm, bàn phím, chữ lớn và app ngủ rồi mở lại.
- URL không đăng nhập chỉ trả đúng phạm vi được chủ dự án cho phép công khai.

## Nguồn đánh giá UX

- [10 nguyên tắc usability của Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/): trọng tâm là hiển thị trạng thái, tính nhất quán, ngăn lỗi và khả năng phục hồi.
- [Web Interface Guidelines của Vercel Labs](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): đối chiếu ngữ nghĩa điều khiển, focus, URL state, safe area và chuyển động.

Đây là cách áp dụng các nguyên tắc vào sản phẩm hiện tại, không phải chứng nhận từ các tổ chức trên.
