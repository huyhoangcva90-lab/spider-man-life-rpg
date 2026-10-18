# Kiểm tra kết nối Finance và Notion

Kiểm tra ngày 09/09/2026 qua connector Notion hiện có, không dùng hay lưu token người dùng dán vào chat.

- Trang finance: https://www.notion.so/272d787636c681beab10c44f1bc65d09
- Income Record: đúng ID trong mã Apps Script, 0 bản ghi được truy vấn.
- Expenses Record: đúng ID trong mã Apps Script, 1 bản ghi abc, 20.000 đồng, 2026-08-12; khớp khoản đã đọc trong Finance.
- Finance còn có Transfer Record, Investment Records, Bank và Debt. Sự tồn tại database không chứng minh mọi luồng đã được đồng bộ.

Mã Apps Script người dùng đã cung cấp chỉ tạo page cho Income và Expenses; AUTO_SYNC_NOTION=false, có hàm cài trigger 5 phút nhưng chưa kiểm tra được trigger đang triển khai. P lưu Done, không lưu page ID, nên sửa/xóa nguồn không tự cập nhật page cũ. Cần thêm ánh xạ ID và cơ chế cập nhật trước khi mở đồng bộ sửa/xóa tự động. Không tạo luồng Gambit ghi thêm page vào hai database này để tránh trùng.

Vùng Target hiện dùng: Income H25:Y32; Expenses H38:Y53; Debt H59:Y62; Saves H71:Y83. H là tên danh mục, M tổng năm, N:Y tháng 1–12. M không phải năm lịch.

Đã thêm giao diện trạng thái Notion vào Cài đặt và hàm chỉ đọc trong GambitBridge. Chưa triển khai lên dự án Apps Script của người dùng; token Notion không cấp quyền triển khai Apps Script.
