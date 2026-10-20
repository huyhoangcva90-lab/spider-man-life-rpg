# Rà soát Spider Life — 19/10/2026

## Phạm vi và kết quả

- Bản đang triển khai: `c519949` trên nhánh production `master`.
- Đọc kiến trúc Spider, các API, cách nối Cloudflare, luồng Notion và mã của 12 app Field; kiểm tra trực tiếp Routine, lối tắt và Hero trên web.
- **29/29 kiểm thử tự động hiện có đạt.** Đây chủ yếu là kiểm thử bằng dữ liệu giả; không chứng minh mọi app đã đồng bộ được dữ liệu thật.
- Tái hiện riêng hai lỗi Gym và Todo bằng dữ liệu giả, không gọi ghi Notion.
- Finance được giữ nguyên: không sửa mã, CSS, kết nối hoặc dữ liệu.
- Lượt này là báo cáo rà soát; chưa áp dụng các bản sửa dưới đây và chưa đẩy thêm thay đổi lên production.

P1: ưu tiên sửa trước khi mở rộng tính năng. P2: ảnh hưởng tính đúng đắn hoặc trải nghiệm. P3: nâng cấp vận hành/hiệu năng.

## 1. P1 — File Notion cũ đang được phục vụ công khai

**Đã xác minh trên web:** yêu cầu không đăng nhập tới file `data/notion-snapshot.json` nhận HTTP 200, gồm 12 bản ghi Master Calendar, 14 Habits và URL nguồn Notion. Không chép nội dung cá nhân vào báo cáo.

Vị trí: `data/notion-snapshot.json:12`; `js/integrations/notion/NotionAdapter.js:13`; `js/main.js:93`; `js/ui/ActionRpgController.js:233`.

Phiên riêng ở API không bảo vệ được một file tĩnh. Phạm vi công khai đã chốt là dữ liệu game; file này còn chứa các bộ dữ liệu đời thực. Map cũng đọc bản chụp này thay vì nguồn riêng có xác thực.

**Cần sửa:** bảo toàn bản sao riêng, bỏ dữ liệu đời thực khỏi bộ file công khai và các luồng đọc công khai; chuyển phần đó sang API riêng. Sau khi sửa, kiểm tra lại URL trực tiếp và các trang Map/Field khi không đăng nhập. Dữ liệu đã xuất hiện trong lịch sử Git cần được xử lý như một việc riêng; không tự ý xóa lịch sử.

## 2. P1 — Gym nhận sai cấu trúc trả về từ API

Vị trí: `field-tools/apps/gym/index.html:224`, `:361`, `:365`, `:385`.

Adapter chung chạy trước khi Gym khai báo hàm `nFetch`, nên không thay được hàm đó. Hàm Gym giữ nguyên toàn bộ phản hồi `{ok,data}` trong `r.data`, nhưng các hàm đọc lại tìm `r.data.properties` và `r.data.results`. Vì vậy dữ liệu nằm sâu hơn một cấp, schema và danh sách bị coi là rỗng. `syncAll` vẫn có thể đặt thời gian đồng bộ và báo “Notion synced”. ID trả về lúc tạo trang cũng bị đọc sai, ảnh hưởng liên kết các set tập.

**Tái hiện bằng dữ liệu giả:** upstream có 1 bản ghi và schema Name; Gym nhận 0 bản ghi, schema không có trường nào.

**Cần sửa:** chuẩn hóa lớp trả về, đúng thứ tự nạp adapter; chỉ báo thành công khi các nguồn bắt buộc đọc thành công. Thử schema, danh sách, tạo log và liên kết set trong môi trường thử trước khi dùng dữ liệu thật.

## 3. P1 — Todo có thể mất bản nháp việc con khi lưu một phần thất bại

Vị trí: `field-tools/notion-connection.js:124–127`.

Sau khi tạo việc chính thành công, mã xóa ô nhập, xóa `newSubtasks` và đóng bảng trước khi tạo hết việc con. Nếu một yêu cầu tạo con thất bại, bản nháp đã bị xóa; không có hàng chờ thử lại từng việc con.

**Tái hiện bằng dữ liệu giả:** việc chính tạo được, việc con thất bại, ô nhập rỗng, số việc con còn trong bản nháp bằng 0, bảng đã đóng.

**Cần sửa:** giữ ID việc chính và các việc con chưa lưu; cho thử lại phần thất bại mà không tạo trùng việc chính hoặc các việc con đã lưu.

## 4. P2 — Trạng thái “kết nối Notion” chưa phản ánh nguồn dữ liệu từng app

Vị trí: `field-tools/notion-connection.js:50–71`; `field-tools/apps/routine/index.html:61`; `field-tools/apps/routine/app.compiled.js:216`, `:310`, `:334`.

Adapter kiểm tra được phiên riêng, nhưng chỉ có nhánh tự làm mới dành cho Todo và Habits. Routine đang chạy bản compiled sử dụng localStorage và Cloudflare cloud, không dùng API Routine từ Notion; lúc chưa có dữ liệu còn khởi tạo bộ routine mẫu và tự thêm Lunch mặc định. Journal/English cũng đang lưu riêng trên trình duyệt. Vì vậy “đã kết nối” không có nghĩa dữ liệu của app đó đang lấy từ Notion.

**Cần sửa:** phân biệt “Phiên riêng đã mở”, “Đã đồng bộ Notion”, “Lưu trên thiết bị”, “Đồng bộ cloud”. Lập ánh xạ app → database → trường đọc/ghi. Giữ UI riêng, nối dữ liệu thật từng app và có màn trống rõ ràng; không tự biến mẫu thành dữ liệu người dùng.

API `api/routine.mjs:8` hiện cũng chỉ nhận phiên Notion kiểu cũ, chưa dùng phiên Field production. Nếu dùng lại API này, cần thống nhất xác thực trước.

## 5. P2 — Bốn âm Ambient Focus thực chất dùng cùng một loại noise

Vị trí: `field-tools/apps/someday/index.html:287`, `:338`.

Hàm `createNoiseNode(type)` không dùng tham số `type`. Mưa, Sóng, Pink Noise và Cafe đều chạy cùng thuật toán pink noise, chỉ khác tên và mức âm lượng. Đây là phần khác với ba file âm thanh Spider vừa được sửa.

**Cần sửa:** dùng nguồn/phương pháp tạo âm khác nhau cho từng lựa chọn, mô tả đúng nội dung, có trạng thái bật/tắt truy cập được bằng bàn phím. Không gọi noise là âm thu mưa/cafe khi chưa có nguồn tương ứng.

## 6. P2 — Pomodoro dễ sai thời gian khi điện thoại chạy nền

Vị trí: `field-tools/apps/someday/index.html:384–398`; tương tự bộ đếm tại `field-tools/apps/routine/app.compiled.js`.

Bộ đếm giảm một đơn vị cho mỗi lần `setInterval` chạy. Trình duyệt điện thoại có thể giảm nhịp timer khi chuyển app hoặc khóa màn hình; thời gian hiển thị sẽ chậm hơn thời gian thực.

**Cần sửa:** tính từ mốc bắt đầu/kết thúc bằng thời gian thực; cập nhật lại khi quay về trang; lưu phiên đang chạy nếu cần khôi phục sau tải lại.

## 7. P2 — Thanh kết nối Hero bóp phần mô tả thành cột rất hẹp

Vị trí: `css/hero-loadout.css:1`; `js/ui/HeroLoadout.js:33`.

**Đã nhìn thấy trực tiếp:** ở viewport khoảng 806 px, đoạn “Mở phiên riêng…” và mô tả bị ép xuống từng vài ký tự, trong khi form và các nút chiếm ngang. `flex:1` chưa có độ rộng tối thiểu phù hợp.

**Cần sửa:** tách dòng trạng thái/mô tả với dòng thao tác; đặt cơ sở chiều rộng và điểm xuống hàng cho form; kiểm tra lại 360/390/768/1280 px. Không đụng CSS Finance.

Ảnh bằng chứng: `C:/Users/huyklgl/.codex/visualizations/2026/10/11/01a12bdc-9f3d-7790-8cfc-dbf716b6e52a/audit-hero-toolbar.png`.

## 8. P2 — Nút Back của trình duyệt không theo lịch sử điều hướng app

Vị trí: `js/ui/ActionRpgController.js:454`.

Các lần đổi mục đều gọi `history.replaceState`. Dù URL phản ánh màn hiện tại, các bước Field → app → mục khác không được thêm vào lịch sử. Nút Back của điện thoại có thể rời Spider thay vì về màn trước trong app.

**Cần sửa:** dùng lịch sử mới cho hành động điều hướng của người dùng; chỉ thay thế lịch sử khi chuẩn hóa URL hoặc cập nhật trạng thái phụ. Thử Back/Forward, tải lại và mở link trực tiếp.

## 9. P2 có điều kiện — Quan hệ Habit dài có thể bị cắt khi ghi lại

Vị trí: `field-tools/notion-connection.js:109`; `field-tools/apps/habits/index.html:844`.

Luồng bật/tắt habit lấy quan hệ từ phản hồi page và ghi lại toàn bộ mảng, chưa đọc các trang thuộc tính quan hệ khi `has_more=true`. Với dữ liệu dài vượt giới hạn phản hồi của Notion, các quan hệ chưa được đọc có thể bị bỏ khỏi bản ghi mới. Bộ test hiện tại chỉ có 1 quan hệ khác nên không bắt trường hợp này. Đây là lỗi theo điều kiện dữ liệu, chưa thử ghi vào bản ghi thật.

**Cần sửa:** dùng cơ chế đọc toàn bộ relation giống HeroLoadout; thử trường hợp nhiều trang bằng dữ liệu giả trước.

## 10. P2 có điều kiện — Cookie Field không còn hợp lệ có thể làm màn game công khai ngừng cập nhật

Vị trí: `api/game-state.mjs:21–28`.

Khi không có cookie, endpoint đọc nguồn game công khai. Nhưng khi có cookie Field trông đúng định dạng mà phiên upstream không còn hợp lệ, endpoint trả 401 và không rơi về nguồn game công khai. Điều này có thể xảy ra sau khi phiên bị vô hiệu hóa trước lúc cookie trên trình duyệt tự hết hạn.

**Cần sửa:** phân biệt lỗi phiên riêng và quyền xem game công khai; màn game vẫn dùng được phép chiếu game đã duyệt, phần dữ liệu riêng tiếp tục yêu cầu kết nối lại.

## Nâng cấp P3 sau khi sửa dữ liệu

- **Tải khi cần:** `js/main.js:89` khởi tạo Map ngay cả khi mở một app con; `js/ui/ActionRpgController.js:224` tải nhiều bộ dữ liệu game cũ ngay lúc mở. Chỉ khởi tạo Map và tải thư viện khi dùng, đặc biệt trên điện thoại.
- **Quy trình kiểm thử khi đẩy code:** chưa có cổng CI chạy bộ test hiện có. Thêm kiểm thử lỗi API, lưu một phần, phân trang và vài luồng trình duyệt cho từng app; test xanh hiện tại chưa bao phủ Gym/Routine thực tế.
- **Build dịch vụ tái lập được:** `tools/build_field_service.mjs:4` mặc định phụ thuộc một đường dẫn tuyệt đối trên máy và thư mục nguồn riêng. Đưa nguồn dịch vụ vào cấu trúc/version được quản lý hoặc bắt buộc cấu hình đường dẫn rõ ràng trong quy trình build; không đưa khóa hay dữ liệu cloud vào repo công khai.
- **CSS theo phạm vi app:** giữ bản sắc từng app, gom phần điều hướng chung và tránh selector chung tác động vào nội dung iframe. Finance được loại khỏi đợt chỉnh giao diện này.
- **Tính nhất quán:** sửa nhãn cũ như Life 66/Gambit và các lời báo lưu thành công khi chỉ mới lưu cục bộ; trạng thái mạng phải cho biết cách thử lại.

## Thứ tự thực hiện đề xuất

- [ ] Đợt 1: đóng đường đọc công khai dữ liệu đời thực; sửa Gym và giữ bản nháp Todo khi lưu dở thất bại.
- [ ] Đợt 2: xác định nguồn dữ liệu từng app, nối đúng Notion, sửa nhãn kết nối và tình huống phiên hết hiệu lực.
- [ ] Đợt 3: sửa Hero toolbar, Back/Forward và relation Habit dài.
- [ ] Đợt 4: sửa Ambient Focus/Pomodoro; tối ưu tải và thêm cổng kiểm thử khi triển khai.
- [ ] Finance giữ nguyên trong mọi đợt sửa UI; nếu thay lớp kết nối chung, kiểm tra hồi quy đọc dữ liệu Finance mà không ghi giao dịch thật.

## Giới hạn của lượt rà soát

Chưa thực hiện ghi/xóa bản ghi Notion thật, giao dịch tài chính, cấp quyền Google mới hoặc thử trên thiết bị iOS/Android vật lý. Các mục được ghi “có điều kiện” được suy ra từ nhánh mã, không tuyên bố đã xảy ra với dữ liệu hiện tại. Hướng dẫn giao diện đối chiếu: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md .
