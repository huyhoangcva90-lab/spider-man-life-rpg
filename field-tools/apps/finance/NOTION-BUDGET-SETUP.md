# Google Sheet → Notion: ngân sách và mục tiêu thu nhập

Nguồn chính do người dùng chọn: Google Sheet. Mã đã chuẩn bị trong `NotionBudgetSync.gs`, chưa cài lên Apps Script. Sáu kiểm tra mô phỏng đã đạt; chưa xác minh chạy thật qua Google.

## Quy tắc cập nhật

- Target được tìm theo gid 1966630911 bằng hàm có sẵn trong dự án.
- Thu nhập: H25:Y32, đối chiếu tên với Settings D5:F12; F là ID trang Notion.
- Chi tiêu: H38:Y53, đối chiếu tên với Settings D16:F31; F là ID trang Notion.
- Cột tháng hiện tại N:Y → Monthly Budget. Ví dụ tháng 9 lấy V.
- Cột M → Yearly Budget. M là số tiền cả năm, không phải năm lịch.
- Ô trống bỏ qua; số 0 cập nhật thành 0. Không tự nhân ngân sách tháng với 12.
- Chỉ cập nhật hai thuộc tính số của trang danh mục hiện có. Không tạo trang mới, không sửa công thức Jan–Dec, không ghi ngược vào Sheet.
- Debt/Saves chưa đồng bộ trong phần này vì cấu trúc đích khác Budget thu/chi. Các liên kết Wish List/JARS/Net Worth trong Notion không đồng nghĩa đã được đồng bộ từ Target.

## Cài vào dự án hiện có

1. Mở Google Sheet → Tiện ích mở rộng → Apps Script. Thêm một file `NotionBudgetSync`, dán nội dung `NotionBudgetSync.gs`. Giữ mã Telegram/Tasker/Notion đang dùng.
2. Trong Script Properties, đặt `GAMBIT_TARGET_YEAR` bằng năm của bảng Target, hiện là `2026`. Hàm sẽ dừng nếu sang năm khác để không dùng nhầm kế hoạch cũ.
3. Dùng token đã cấu hình trong Apps Script; mã ưu tiên Script Property `NOTION_TOKEN`, sau đó biến `NOTION_TOKEN` hiện có. Không đưa token vào trình duyệt Finance.
4. Chạy `previewGambitNotionBudgets` để xem danh mục và giá trị dự kiến thay đổi. Hàm chỉ đọc Sheet/Notion, ghi báo cáo xem trước vào Script Properties.
5. Chạy `syncGambitNotionBudgets` để cập nhật. Chạy `installGambitNotionBudgetTrigger` một lần để cài lịch 5 phút. Hàm cài đặt kiểm tra trước và giữ trigger có sẵn.

Đây là trigger trong Apps Script, không cần sửa doGet/doPost hoặc triển khai lại Web App chỉ để chạy đồng bộ ngân sách. Cần đăng nhập tài khoản có quyền chỉnh sửa dự án và hoàn tất cấp quyền Google nếu được yêu cầu. Dừng tự động bằng cách xóa trigger `syncGambitNotionBudgets` trong bảng Triggers của Apps Script.

## Trạng thái và giới hạn

`GAMBIT_NOTION_BUDGET_STATUS` lưu lần ghi gần nhất, số mục đã ghi và lỗi; `GAMBIT_NOTION_BUDGET_PREVIEW` lưu lần xem trước riêng. Mỗi đích được kiểm tra đúng database và đúng thuộc tính số trước lượt ghi đầu tiên. Notion không có giao dịch nguyên tử cho nhiều trang: nếu một yêu cầu lỗi giữa chừng, một số trang có thể đã cập nhật; lần chạy sau đọc lại và chỉ ghi các giá trị còn khác.

Lần đối chiếu 09/09/2026: Target thu/chi có tên danh mục nhưng ô số tiền trống; Clothes trong Notion là 300.000/tháng, Project là 200/tháng, nên chưa có giá trị nguồn để thay thế. Chi tiêu Đầu tư thiếu ID Notion; thu nhập Đầu tư đang ánh xạ sang Loan theo Settings, cần kiểm tra ý nghĩa trước khi nhập mục tiêu cho dòng đó. Không tự đoán ánh xạ theo tên tiếng Anh.

Tham chiếu API: https://developers.notion.com/reference/patch-page và https://developers.notion.com/reference/retrieve-a-page.
