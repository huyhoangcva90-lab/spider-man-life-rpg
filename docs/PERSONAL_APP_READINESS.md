# Spider Life — kiểm tra Habit / Quest / Time

Ngày cập nhật: 2026-10-22.

## Hướng giao diện

Giữ khung Spider và màu hiện tại. Habit mở bảng check giống cách tổ chức của [HelloHabit](https://hellohabit.com/), Life Reset giữ hành trình 66 ngày, Quest là danh sách việc có hạn và trạng thái. Đồng hồ giữ cách biểu diễn lịch tròn tham khảo [Sectograph](https://sectograph.com/). Finance giữ nguyên.

## Đã xử lý

- [x] Habit mặc định lấy danh sách thật từ Notion, mở trực tiếp bảng check.
- [x] Ghi Notion thành công rồi mới thay trạng thái; ghi lỗi giữ trạng thái cũ.
- [x] Chặn gửi trùng khi đang lưu; không đồng bộ đọc chồng lên thao tác ghi.
- [x] Check và bỏ check cập nhật cùng bản ghi, bộ nhớ đệm, lịch sử và khung cha.
- [x] Làm mới mỗi phút khi màn hình đang mở, khi quay lại app hoặc có mạng.
- [x] Xóa trạng thái ngày cũ trên thiết bị khi qua ngày; lấy lại trạng thái mới từ Notion.
- [x] Không dùng dấu check của snapshot cũ cho hôm nay.
- [x] Báo nguồn chưa tải được khi chỉ đồng bộ thành công một phần.
- [x] Lịch sử 7 ngày và báo cáo chỉ dùng check-in thực sự được ghi nhận trên thiết bị.
- [x] Thay các mục tiêu mẫu cục bộ ở màn Hello Habit bằng thống kê Habit Notion.
- [x] Ngày trước trong chiến dịch 66 ngày không tự được tính là đã hoàn thành.
- [x] Quest có tìm kiếm, hôm nay, quá hạn, cần làm, đã xong và thanh tiến độ.
- [x] Menu và phần cuộn độc lập trong khung; nút thao tác chính đủ lớn cho điện thoại.
- [x] Đồng hồ dùng phản hồi lịch mới nhất, bỏ phản hồi cũ khi đổi ngày nhanh.
- [x] Chế độ Calendar không hiển thị lịch nhập tay thay cho lịch chưa tải được.
- [x] Lịch nhập tay chọn được từng 15 phút và kiểm tra thứ tự giờ.
- [x] Pomodoro đếm theo thời gian thực, không chỉ trừ giây mỗi lần trình duyệt chạy.
- [x] Gói Pages có cả các module `.mjs`.

## Điều kiện còn lại trước khi gọi toàn bộ hệ thống hoàn thiện

- [ ] Kiểm chứng đọc và ghi trên tên miền triển khai sau đăng nhập riêng, bằng bản ghi thử dành riêng cho QA. Đợt này chỉ đọc dữ liệu thật; thao tác ghi và lỗi mạng được kiểm tra bằng dữ liệu giả lập.
- [ ] Lịch sử Habit đa thiết bị cần một nguồn nhật ký theo ngày trong Notion. Checkbox `Today` không cung cấp lịch sử các ngày trước. Lịch sử hiện tại được ghi rõ là trên thiết bị.
- [ ] Notion cần tự đặt lại `Today` theo ngày bằng automation hoặc nhật ký check-in. App không tự sửa hàng loạt Habit khi đổi ngày.
- [ ] Xác nhận Calendar bằng tài khoản Google đang kết nối trên tên miền thật; môi trường phát triển không có phiên Google đó.
- [ ] Chạy thử thực tế trên Safari iPhone và Chrome Android, gồm đổi ngày khi app ngủ và quay lại.
- [ ] Moveset độc lập cần quy tắc ánh xạ đã chốt trước khi đưa vào Battle chính. Chưa ghép các chiêu thử nghiệm với kỹ năng Notion.

## Kiểm tra

`node --experimental-default-type=module --test tests/*.test.mjs`

`node tools/test_gambit_integration.mjs`

`node tools/prepare_private_pages.mjs`

Kiểm tra giao diện trên cửa sổ máy tính và 390 × 844: Habit, báo cáo, tìm kiếm Quest, bộ lọc, khung nhúng và Time. Không thay dữ liệu Finance.
