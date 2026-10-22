# Một chức năng, một màn chính

Mục đích: tránh phát triển lại cùng tính năng trong Life Reset, RPG và Gambit.

| Phần | Màn chính | Vai trò dữ liệu |
| --- | --- | --- |
| Habit | `life-reset/`, Check Habit và Báo cáo | Đọc/ghi Habit Notion; lịch sử thiết bị ghi rõ phạm vi |
| Hành trình 66 ngày | Tab 66 ngày trong cùng app Habit | Hiển thị những ngày đã ghi nhận check-in; gợi ý mẫu ở dưới |
| Quest / To-do | `life-reset/`, tab Quest | Master Calendar và Active Quests từ Notion |
| Hero | Hồ sơ Hero và các tab bên trong | Stats, trang phục, kỹ năng, map, huy hiệu theo Notion |
| Battle | Arena | Phản ánh trạng thái game Notion; moveset lab vẫn là trang tham khảo riêng |
| Field | Trung tâm công cụ | Lối vào các công cụ; Habit và To-do mở hai màn chính ở trên |
| Time | Field / Lịch trong ngày | Hiển thị lịch theo giờ; không thay thế danh sách Quest |
| Routine | Field / Nhịp sinh học | Sắp xếp các khung sinh hoạt; không tạo bộ Habit độc lập |
| Finance | App Finance hiện tại | Giữ nguyên theo yêu cầu của chủ dự án |

## Đã hợp nhất ngày 2026-10-22

- `spiderApp=habits` và `spiderApp=todo` mở màn Habit/Quest chính.
- Link RPG cũ `HABITS:TODAY`, `PROGRESS`, `66 DAYS` mở đúng tab trong cùng app.
- Link Quest cũ `TODAY`, `OVERDUE`, `GAMBIT` dùng cùng app; giữ bộ lọc quá hạn.
- Menu phụ chỉ có một mục Habit, một mục Quest và một mục Hero.
- Thống kê Field đọc bản lưu của app chính, bỏ nguồn đếm Habit/To-do Gambit cũ.
- Địa chỉ Life OS cũ chỉ chuyển đến Field hoặc màn được đánh dấu trong bookmark; không mở thêm một trung tâm app thứ hai.
- Thử các Habit mẫu không cộng XP, tiền hay sát thương vào save Hero.
- Không xóa LocalStorage cũ và không sửa bản ghi Notion trong đợt hợp nhất.

## Quy tắc cho những lần sửa tiếp theo

Giữ mã giao diện gốc của các app được nhập vào mà chủ dự án thích; cải thiện thao tác và kết nối dữ liệu trên nền đó. Việc thống nhất nguồn dữ liệu và lối vào phải giữ phong cách của app. Khung Spider là lớp ngoài; nội dung và hộp thoại app phải nằm trong vùng màn hình, dưới viền và các nhân vật ở góc.

1. Sửa màn chính trước. Một đường dẫn khác vào cùng chức năng chỉ là lối tắt, không thêm tracker hoặc kho lưu mới.
2. Không phát triển thêm Habit/To-do trong các bản Gambit nhập vào hoặc màn RPG cũ. Giữ chúng để tương thích dữ liệu cũ.
3. Phân biệt nhiệm vụ đời thực với encounter của Battle. Không tự tạo thưởng hoặc trạng thái chiến đấu từ dữ liệu mẫu.
4. Giữ chức năng khác vai trò: Time là lịch giờ; Pomodoro là bộ đếm tập trung; âm thanh Ambient là công cụ âm thanh.

## Những điểm còn chưa hợp lý

- Checkbox `Today` chưa thay thế được nhật ký Habit theo ngày. Cần nguồn nhật ký Notion để lịch sử đa thiết bị và reset theo ngày chính xác.
- DB Habit có thể chứa cả trang ghi chú/đề xuất. Cần trường phân loại rõ để những bản ghi này không trở thành việc cần check; không lọc theo tên tùy đoán và không tự xóa.
- Chế độ lịch Google và Routine Notion là hai nguồn lịch khác nhau. Cần chọn nguồn mặc định rõ ràng và đánh dấu nguồn khi đưa cả hai lên Time; không tự dịch giờ để lấp kín mặt đồng hồ.
- Mã màn cũ và dữ liệu cục bộ vẫn còn để tránh mất thông tin. Chỉ xóa sau khi kiểm kê và chuyển dữ liệu, không coi việc giấu menu là đã di chuyển dữ liệu.
