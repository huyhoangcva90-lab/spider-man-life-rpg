# Đợt nâng cấp ưu tiên — 2026-10-23

## Đã triển khai trong mã

- Dữ liệu nhiệm vụ, Habit và mục tiêu chuyển sang `/api/personal-state`, yêu cầu phiên riêng giống proxy Notion. Tệp snapshot công khai chỉ còn các mảng rỗng. Công cụ xuất dữ liệu ghi vào thư mục sao lưu bị loại khỏi Git và gói Vercel.
- Habit ghi đúng ngày Việt Nam vào quan hệ `Daily.Habits`, giữ các Habit khác. `Today` chỉ là checkbox tương thích. Không tự đặt thưởng Hero.
- Lưu ý định check trước khi gửi; gửi lại cùng giá trị, không toggle lại. Đổi ngày hoặc phiên bản xung đột chuyển sang cần xem lại. Không lặp lại chỉnh checkbox đã đúng vì có thể kích hoạt automation phía Notion.
- Chặn Daily trùng ngày, phân trang hỏng, Habit sai database và gửi khác nguồn. Các thao tác cùng ngày được tuần tự hóa trong một tiến trình.
- Gym đọc đúng lớp phản hồi Notion và tất cả các trang. Nguồn lỗi giữ bản lưu, hiện trạng thái đồng bộ một phần; không cập nhật thời điểm thành công toàn bộ khi còn lỗi.
- Map đối chiếu ID Notion ổn định, cập nhật marker đã có khi đổi tên, vị trí hoặc hoàn thành. Giữ ghi chú tự nhập. Làm mới khi quay lại trang và mỗi phút khi đang mở.
- Field ghi rõ nguồn dữ liệu từng app. Routine vẫn dùng thiết bị/cloud; Journal và English vẫn cục bộ. API Routine dùng cùng phiên riêng với Field.
- Giữ giao diện/khung hiện tại. Không chỉnh mã, dữ liệu hoặc luồng Finance.

## Bằng chứng kiểm tra

- 109 kiểm tra tự động đạt: lịch sử ngày, gửi lại, lỗi một phần, phản hồi thất lạc, phiên bản cũ, ngày Việt Nam, giữ quan hệ, chặn truy cập riêng, phân trang Gym, đối chiếu Map và các kiểm tra hiện có.
- Đọc thử Notion thật trên máy phát triển; Habit hiển thị 13 bản ghi. Gym báo đồng bộ một phần khi một nguồn lỗi.
- Không check hoặc bỏ check Habit thật trong đợt QA này. Luồng ghi và lỗi mạng dùng dữ liệu giả lập.
- Tệp snapshot công khai trên máy phát triển có 0 nhiệm vụ, 0 Habit, 0 mục tiêu.

## Phần kế hoạch còn lại

- Kiểm chứng đọc/ghi sau đăng nhập trên tên miền thật bằng bản ghi QA; thử Safari iPhone, Chrome Android, hai thiết bị và qua nửa đêm.
- Notion không có giao dịch/CAS cho nhiều máy chủ. Khóa hiện tại chỉ có hiệu lực trong một tiến trình; cần hàng đợi ghi dùng chung trước khi đảm bảo đồng thời trên nhiều instance. Kiểm tra phiên bản hiện tại giúp phát hiện một số xung đột, không phải bảo đảm tuyệt đối.
- Bản triển khai cũ và lịch sử Git có thể còn snapshot cũ; đợt này gỡ khỏi bản hiện tại, chưa xóa lịch sử hoặc deployment bất biến.
- Sao lưu và phục hồi đầy đủ, chuyển Routine/Journal/English sang nguồn thống nhất, Habit số lượng/đơn vị/timer/ghi chú và đầy đủ tính năng HelloHabit còn chờ.
- Map chưa tự xóa marker khi nguồn bị lưu trữ/mất khỏi truy vấn; cần quy tắc lưu trữ rõ trước khi xóa.
- Battle chính chưa ghép moveset thử nghiệm; xử lý hàng đợi combat log và ánh xạ Skill Notion còn riêng.
- Backend Gambit vẫn cần cho cloud/Google/Sheets/Finance; không được tắt trước khi chuyển xong các kết nối đó.

Đây là đợt sửa ưu tiên của kế hoạch, chưa phải xác nhận toàn bộ hệ thống hoàn thiện.
