# HelloHabit — kiểm kê trước khi nhập từng phần

Ngày rà soát: 22/10/2026. Phạm vi đợt này: **HelloHabit trước, các app khác sau**. Finance giữ nguyên.

## Nguồn và mức kiểm tra

- [Web gốc](https://app.hellohabit.com/track), bản hiển thị 3.5.1: vào bằng chế độ khách, mở Habit mẫu `UI reference`, trình tạo Habit, chi tiết Track/Stats/Activity Log, Journal, trình soạn note, Calendar, Settings.
- [Tutorial chính thức](https://app.hellohabit.com/account/tutorial): đọc **đủ 53 bài trong 7 nhóm** bên dưới, gồm nội dung ba bước của mỗi bài. Đây là kiểm kê chức năng; không có nghĩa đã thử mọi nhánh thao tác hay tính năng native.
- [Trang giới thiệu](https://hellohabit.com/), [Android chính thức](https://play.google.com/store/apps/details?id=com.studio.hellohabit): đối chiếu sức khỏe, nền tảng và đồng bộ.
- Không đăng nhập tài khoản thật, không mua Premium, không thử xóa dữ liệu, không cấp quyền lịch/sức khỏe/thông báo. Không có mã nguồn backend HelloHabit để nhập vào Spider.

Quy ước: **Một phần** = đã có một luồng hoạt động nhưng chưa tương đương bản gốc. **Thiếu** = chưa triển khai. **Nền tảng** = cần khả năng thiết bị hoặc hạ tầng khác; vẫn giữ trong danh sách, không âm thầm bỏ.

## 1. Tasks — 12 mục

Đối chiếu với Quest hiện tại. Giữ một bản ghi Notion cho mỗi nhiệm vụ, có thể có nhiều màn xem.

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Tạo nhiệm vụ: tên, ghi chú, danh sách, ưu tiên | Một phần: đọc Notion và mở nguồn; chưa có form tạo trong app |
| 2 | Ngày, giờ bắt đầu, thời lượng, nhắc việc | Một phần: hiển thị hạn; chưa sửa lịch/nhắc trong app |
| 3 | Nhập câu có ngày giờ và nhận diện trước khi lưu | Thiếu |
| 4 | Lặp theo lịch tùy chỉnh, có ngày kết thúc | Thiếu engine lặp và bản ghi từng lần |
| 5 | Hoàn thành, bỏ qua, hoàn tác từng lần | Một phần: xác nhận hoàn thành qua Notion; chưa có lịch sử bỏ qua |
| 6 | Sửa, thao tác nhiều nhiệm vụ, xóa | Thiếu trong app; nguồn vẫn mở bằng Notion |
| 7 | Xem/sửa lịch sử các lần nhiệm vụ lặp | Thiếu |
| 8 | Danh sách, bộ lọc lưu lại, ưu tiên | Một phần: tìm kiếm và bộ lọc trạng thái/ngày; chưa có bộ lọc lưu |
| 9 | Nhóm, sắp xếp, kéo đổi thứ tự | Thiếu trong Quest |
| 10 | Hôm nay, quá hạn, tất cả, hiển thị việc hoàn thành | Một phần: có các bộ lọc; chưa đổi lịch hàng loạt và chế độ chung Habit/Task |
| 11 | Hoạt động Task hiện trong nhật ký | Thiếu timeline chung |
| 12 | Task hiện trên lịch và thao tác từ lịch | Một phần Time đọc lịch riêng; chưa cùng một luồng thao tác |

## 2. Habits — 15 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Tạo từ gợi ý hoặc tự định nghĩa kiểu theo dõi | Một phần: mở DB Notion; chưa có form tạo tương đương |
| 2 | Mục tiêu định lượng, đơn vị riêng, bước tăng | Thiếu; `Today` chỉ là checkbox, không giả làm 1/8 cốc |
| 3 | Chu kỳ ngày/tuần/tháng/năm/tùy chỉnh; lịch ngày trong tuần hoặc N ngày/tuần | Thiếu schema và engine lịch mục tiêu |
| 4 | Ghi lượng chính xác, ngày giờ, sửa/xóa hoạt động | Một phần: check/bỏ check hôm nay sau xác nhận Notion |
| 5 | Nhật ký giá trị, bỏ qua, tạm dừng, reset và note đính kèm | Một phần: trang Hoạt động liệt kê ngày check trên thiết bị; thiếu log Notion và sự kiện đầy đủ |
| 6 | Tổng, trung bình, chuỗi, kỷ lục, xu hướng theo khoảng ngày | Một phần: số ngày ghi nhận trên máy, streak do Notion trả; chưa tính thống kê thiếu dữ liệu |
| 7 | Báo cáo nhiều Habit, khoảng ngày, xuất ảnh/chia sẻ ảnh | Một phần: heatmap và xuất/copy TXT; chưa có ảnh và khoảng ngày đầy đủ |
| 8 | Danh sách, ưu tiên, bộ lọc theo nhiều thuộc tính | Một phần: tìm tên, trạng thái, nhóm phân loại/khung giờ; chưa có filter lưu và ưu tiên tương tác |
| 9 | Nhóm, sắp xếp, kéo đổi thứ tự | Một phần: nhóm, tên A–Z, streak, thứ tự nguồn; chưa kéo thả/lưu thứ tự vào Notion |
| 10 | Sửa Habit, màu, nhắc; lưu trữ và khôi phục | Thiếu trong app; mở bản ghi Notion hiện có |
| 11 | Giảm thói quen: giới hạn tối đa trong chu kỳ | Thiếu; không dùng logic mục tiêu tăng cho mục này |
| 12 | Bỏ thói quen: thời điểm bắt đầu, mốc tiến triển, pause/reset | Thiếu |
| 13 | Tâm trạng, các nguyên nhân, trung bình/xu hướng | Thiếu |
| 14 | Cân nặng, đơn vị, mục tiêu, biểu đồ thay đổi | Thiếu |
| 15 | Mục tiêu viết tự đếm từ của note gắn nhãn | Thiếu |

Các kiểu đọc trực tiếp từ trình tạo Habit: Count, Quit, Mood, Body Weight, Journal, Apple Health, Health Connect; mục tiêu Count có Positive, Negative, No Goal. Đây đều là phạm vi cần xem xét, không chỉ checkbox.

## 3. Journal — 6 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Note có ngày giờ và liên kết nhiều Habit | Thiếu trong app Habit; đã có DB Journal riêng |
| 2 | Soạn rich text, định dạng, nhãn Habit | Thiếu; editor gốc còn có thanh link/ảnh/âm thanh, cần kiểm tra nhánh đính kèm trước khi triển khai |
| 3 | Sửa nội dung, ngày, nhãn, xóa có kiểm soát | Thiếu trong app Habit |
| 4 | Timeline chung note, Habit và Task | Thiếu |
| 5 | Tìm nội dung, lọc loại hoạt động và nhãn | Thiếu |
| 6 | Bookmark note và quản lý bookmark | Thiếu |

## 4. Calendar — 4 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Ngày, 3 ngày, tuần, tháng; chuyển ngày và zoom lịch giờ | Một phần: Time hiện tại khác cấu trúc; chưa đạt tương đương |
| 2 | Tạo và sửa Task từ ô lịch, cả ngày hoặc có giờ | Thiếu trong luồng Habit/Quest |
| 3 | Nhiều nhắc Habit: giờ, thời lượng, lặp, thông báo | Thiếu schema reminders và lịch chạy phía máy chủ |
| 4 | Lọc lịch theo danh sách/bộ lọc Task và Habit | Thiếu dùng chung filter |

## 5. Timer — 4 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Chọn Habit nhận thời gian, chọn loại timer | Một phần: có timer tập trung riêng; chưa gắn bản ghi hoạt động Habit |
| 2 | Stopwatch, pause/resume, lap, sự kiện, lưu phiên | Thiếu trong Habit |
| 3 | Countdown, thông báo, dừng sớm và lưu thời gian thực | Một phần: Pomodoro riêng; chưa có hoạt động Notion đúng lượng |
| 4 | Mặc định loại và thời lượng riêng từng Habit | Thiếu |

## 6. Widgets — 5 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Thêm widget lên màn hình thiết bị | Nền tảng: web thường không tạo widget hệ điều hành như app native |
| 2 | Danh sách Task tương tác từ widget | Nền tảng / thiếu |
| 3 | Danh sách Habit và check trực tiếp | Nền tảng / thiếu |
| 4 | Habit report kèm hoạt động và nút ghi | Nền tảng / thiếu |
| 5 | Tạo note nhanh và xem số từ hôm nay | Nền tảng / thiếu |

Không đánh đồng iframe nhúng Notion hoặc shortcut PWA với widget native. Apple Health / Health Connect và Watch cũng cần tích hợp nền tảng riêng; chưa được kiểm thử trên thiết bị.

## 7. General — 7 mục

| # | Chức năng cần giữ | Spider hiện tại / phần thiếu |
|---|---|---|
| 1 | Tìm Task/Habit kể cả archived, completed; thao tác hàng loạt | Một phần: tìm trong từng màn, chưa global search và bulk |
| 2 | Thành tích trọn đời và mốc tiếp theo | Một phần Hero/Badges đọc Notion; chưa đối chiếu đóng góp Habit/Journal |
| 3 | Tài khoản và đồng bộ nhiều thiết bị | Một phần: nguồn Notion; lịch sử Habit trên máy chưa đồng bộ và chưa có tài khoản Spider riêng |
| 4 | Theme, font/cỡ chữ, đầu tuần, ngôn ngữ, màn mặc định | Một phần: phong cách Spider cố định; thiếu tùy chỉnh tương đương |
| 5 | Xuất dữ liệu từng loại và quản lý dữ liệu | Một phần: TXT báo cáo; chưa backup đầy đủ hoặc khôi phục |
| 6 | Hỗ trợ/trao đổi kèm ảnh | Karen mở Telegram có sẵn; chưa có ticket trong app, không gửi dữ liệu tự động |
| 7 | Đăng xuất / xóa tài khoản | Chưa áp dụng tài khoản Spider riêng; không sao chép nút xóa HelloHabit thành xóa dữ liệu Notion |

## Phần trùng — báo để chủ dự án quyết định, chưa loại bỏ

| Chức năng HelloHabit | Trùng với phần đang có | Cách giữ đủ chức năng mà không đếm đôi |
|---|---|---|
| To-do | Quest, Master Calendar, Todo Gambit cũ | Cùng page ID Notion; Today chỉ là màn xem, không nhân bản nhiệm vụ |
| Habit check / báo cáo | Habit Gambit, Habit RPG, Life Reset | Cùng Habit ID và một luồng ghi; giữ bản code/dữ liệu cũ đến khi đủ chức năng thay thế |
| Hành trình ngày | 66 ngày | Chiến dịch là cách xem tiến trình Habit, không tạo một Habit mới cùng tên |
| Schedule / reminders | Time và Routine | Time là màn xem; Routine là mẫu nhịp ngày. Nhắc theo Habit phải gắn đúng Habit ID |
| Stopwatch / Countdown | Pomodoro và Focus | Giữ cả các chế độ khác nhau, dùng chung phiên thời gian và chỉ ghi một lần |
| Journal / mood | Journal Notion và công cụ nhật ký | Dùng quan hệ đến Habit và cùng note ID; không tạo bản sao nội dung |
| Achievements / streak | Hero, Badges, XP | Hiển thị số liệu nguồn; không tự thưởng XP thêm từ check mẫu |
| Calendar sync | Lịch Google trong Field | Đồng bộ là nguồn dữ liệu, không tự gộp sự kiện chỉ vì tên giống |

## Đã làm trong đợt đầu này

- Đổi màn HELLO từ ô vuông check lớn thành hàng Habit có phần tên màu, trạng thái, streak nguồn và nút check riêng theo cấu trúc web gốc.
- Thêm tìm kiếm, trạng thái rõ ràng, nhóm phân loại/khung giờ, sắp tên/streak/thứ tự nguồn.
- Chọn ngày trực tiếp, chuyển tuần, quay hôm nay; ngày cũ và tương lai chỉ đọc.
- Chạm tên mở chi tiết Theo dõi / Thống kê / Hoạt động; trả về danh sách và giữ bộ lọc.
- Giữ luồng ghi Notion đã xác nhận, khóa thao tác khi đang ghi, không tạo store Habit thứ hai.
- Lịch sử nhỏ trùng dưới danh sách được chuyển vào chi tiết; không xóa bản ghi hay tính năng lịch sử.
- Bỏ tuyên bố “100% replica” khỏi mã. Chưa gọi bản này là HelloHabit hoàn chỉnh.

### Kiểm tra đợt đầu

- 92 kiểm thử hiện có đều đạt (gồm kiểm tra ghi thành công, hoàn tác, lỗi ghi và chống thao tác trùng; kiểm thử ghi dùng dữ liệu giả lập).
- Trình duyệt 1280 × 720 và 390 × 844: tìm kiếm, không có kết quả, nhóm theo khung giờ, mở chi tiết, chuyển Thống kê, quay về, chọn ngày cũ và về hôm nay.
- Ngày cũ khóa toàn bộ nút check; không có tràn ngang ở các hàng Habit, thanh ngày và màn hình 390 px. Không thấy lỗi console trong lượt kiểm tra.
- Không check thử vào bản ghi Notion thật trong đợt này. Chưa kiểm thử trên thiết bị Safari/Android thật.

## Thứ tự tiếp theo và dữ liệu cần có

### Đợt 2 — nối nguồn hiện có, không tạo DB trùng (22/10/2026)

Kiểm tra schema thật cho thấy các nhận định “chưa có nguồn lịch sử” ở đợt đầu là **chưa đầy đủ**:

- `Habits.Days` liên kết đến DB Daily `272d787636c681c8b8adc9d6fdada0b7`, data source `272d7876-36c6-8159-a810-000b01bef441`. Công thức `Streak` dùng ngày của chính các liên kết này. Đã nối lịch sử, heatmap, báo cáo và chiến dịch 66 ngày với nguồn đó; không dùng tên hay các checkbox Daily để đoán quan hệ.
- Daily query có ba bản ghi liên kết Habit trong lượt kiểm tra, cả ba có Date. Đây là kết quả nguồn hiện tại, không suy ra các ngày khác đều thất bại. Không đưa bản ghi cá nhân vào Git.
- `Streak` là chuỗi có cả `Curr` và `Long`, không phải luôn là số. Đã sửa lỗi chuyển chuỗi thành 0, hiển thị riêng streak hiện tại và dài nhất, giữ giá trị chưa biết là chưa có.
- DB Habit Planner `272d787636c681228446e717b8137af1` có Frequency, Unit, Start Date, End Date, Total Target, Check và quan hệ Habits. Đã nối hiển thị kế hoạch theo **relation ID**, có lối mở chỉnh trong Notion; không tự nối bằng tên.
- Lượt kiểm tra Planner có 10 kế hoạch chưa lưu trữ, nhưng **không kế hoạch nào có quan hệ Habits**. Vì vậy chi tiết Habit hiển thị chưa có kế hoạch liên kết thay vì giả vờ đã có mục tiêu.
- Công thức Planner `Check` hiện đếm các Daily liên kết qua Habits, chưa lọc Start/End Date. `Total Target` nhân Frequency với số chu kỳ trọn vẹn. App giữ kết quả nguồn và ghi rõ “toàn kế hoạch”; chưa gọi đây là bộ đếm tuần/tháng tự tính của HelloHabit. Chưa sửa công thức Notion.
- Màu Habit lấy trường Color khi có. Kế hoạch và lịch sử vẫn dùng kết nối riêng đã có; không thêm quyền truy cập công khai.

Lịch sử Notion là nguồn chính khi tải thành công; bản quan sát cũ trên máy được giữ nhưng không cộng vào nguồn để tránh đếm đôi. Nếu lần làm mới lỗi, giữ bản đã tải cùng thời điểm đọc và báo rõ lỗi. Phân trang lỗi hoặc quan hệ bị rút gọn không được xem là lịch sử đầy đủ.

**Giới hạn còn lại:** Today và Daily là hai nguồn trạng thái khác nhau. Check Today hiện chưa tự tạo activity có số lượng, đơn vị hoặc thời điểm; không được gọi tính năng này là đã hoàn tất. Mục tiêu số cốc/phút/km vẫn cần model hoạt động phù hợp. Journal, Habit Notification và các bảng Daily/Planner đã được phát hiện, cần ưu tiên tái sử dụng trước khi tạo bảng mới.

Kiểm tra: 98 test đạt, gồm phân trang, timezone Việt Nam, dữ liệu bị rút gọn, remote rỗng, streak dạng chữ, ID quan hệ và giá trị mục tiêu bằng 0. Không sửa bản ghi Notion thật để thử nút check.

1. **Habit + activity log trước**: kiểm tra schema thật, bổ sung model cho type, goal direction/amount/unit, period/start date, weekdays/N-days, increment, màu, list, priority, archive. Mỗi activity cần ID, Habit relation, timestamp, value, unit, kind (log/skip/pause/reset), note relation, nguồn và khóa chống ghi hai lần.
2. **Lịch sử/statistics/reports** trên cùng log. Chỉ tính streak từ lịch mục tiêu và dữ liệu đủ; dữ liệu chưa biết không phải thất bại. Cần xử lý timezone, reset ngày và thao tác offline rõ ràng.
3. **Timer rồi Journal**: phiên thời gian và note liên kết Habit, sửa được, không cộng hai lần; dùng DB Journal đang có sau khi kiểm tra schema.
4. **Schedule rồi Task**: reminders và recurrence có ID riêng, dùng cùng Master Calendar/Quest. Lịch nền cần kiểm thử trên điện thoại khi app đóng.
5. **Preferences, backup, native integrations**: giữ checklist; xác định khả năng web/PWA/native trước khi hứa tương đương app gốc.

Không tạo DB, đổi schema, nhập note cá nhân hoặc xóa dữ liệu chỉ để làm giao diện có vẻ đầy đủ. Các thay đổi nguồn dữ liệu phải có mapping cụ thể và kiểm thử xác nhận ghi/đọc.
