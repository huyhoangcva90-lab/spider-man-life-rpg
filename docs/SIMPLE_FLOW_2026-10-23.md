# Luồng đơn giản, thuận tiện và tiết kiệm

## Quy tắc sản phẩm

Mở Hôm nay → chọn việc/Habit → thực hiện → xác nhận một lần → lưu Notion → game phản ánh cấu hình và kết quả từ Notion.

- Quest/Todo là cùng nhóm việc có hạn; Map và Calendar là cách xem cùng bản ghi.
- Habit có một luồng check theo ngày. Routine chỉ sắp thứ tự thực hiện; 66 ngày chỉ xem hành trình, không tạo thêm dấu hoàn thành hoặc thưởng.
- Chỉ hiện đã lưu khi có xác nhận. Mất mạng giữ ý định; không suy rằng gửi lỗi có nghĩa máy chủ chưa ghi.
- Bản lưu giúp mở nhanh nhưng không phải dữ liệu trực tiếp mới nhất.
- Giữ Finance và phong cách Spider hiện tại.

## Đã sửa trong đợt này

1. Các nút Habit cũ trong host mở màn Habit chung thay vì tự đánh dấu, gọi game và ghi Today theo đường cũ.
2. Hàng chờ Habit cũ thiếu ngày được giữ để xem lại, không gửi lại như check hôm nay. Các Quest hợp lệ vẫn gửi được. Không xóa lịch sử người dùng.
3. Client và API dùng chung ngày Việt Nam để nhận biết hôm nay, đổi ngày và kiểm tra thời điểm bản lưu. Lịch xem ngày do người dùng chọn vẫn giữ ngày đã chọn.
4. Màn Habit hiện bản lưu trước, sau đó chỉ dùng một lượt đồng bộ trực tiếp; bỏ lượt snapshot khởi động trùng nguồn và phần thưởng mặc định từ đường đó.
5. Kiểm tra phiên kết nối được gộp khi có yêu cầu đồng thời, nhớ trạng thái 30 giây. Đăng nhập hoặc bấm đồng bộ chủ động sẽ kiểm tra lại. Chưa mở phiên thì không truy vấn cả nhóm database.
6. Các sự kiện tự làm mới Habit cách nhau ít nhất một phút; nút đồng bộ thủ công vẫn hoạt động ngay khi không có thao tác ghi đang chạy.
7. Map chỉ tự đọc dữ liệu riêng khi đang mở Map và trang đang hiện. Mở lại liên tục trong một phút không gửi lại cùng lượt đọc. Gán địa điểm giữ ID Notion để không tạo marker trùng khi làm mới.
8. Phân trang Notion phát hiện cursor lặp, dừng và báo lỗi thay vì gọi vô hạn.

Không thêm dịch vụ trả phí, AI hoặc dịch vụ hàng đợi mới trong đợt này. Việc sử dụng miễn phí vẫn phụ thuộc hạn mức và gói của tài khoản hiện có; chưa đo hóa đơn/hạn mức thực tế.

## Kiểm chứng và giới hạn

- 116 kiểm tra tự động, gồm 7 trường hợp mới: nửa đêm Việt Nam, gộp/đổi phiên, lỗi phiên, bảo toàn ý định cũ, cursor lặp, định danh Map và hạn chế đọc lại.
- Script kiểm tra chuẩn phản hồi/phân trang/hàng chờ Quest hiện có cũng đạt.
- Giao diện Habit trên máy phát triển đọc được 13 Habit, không có lỗi console. Không check Habit thật để thử nghiệm.
- Các đợt trước đã thống nhất lối vào Habit/Quest; đợt này xử lý thêm các đường ghi cũ còn sót, không tuyên bố toàn bộ luồng đời thực đã hợp nhất.
- Routine/Journal/English, sao lưu/khôi phục toàn bộ, kiểm tra hai thiết bị và toàn bộ bộ tính năng HelloHabit vẫn còn trong kế hoạch. Khóa ghi Daily vẫn chỉ trong một tiến trình, chưa bảo đảm đồng thời nhiều máy chủ.
