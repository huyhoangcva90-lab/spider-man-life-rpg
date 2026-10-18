# Kết nối chỉnh sửa Google Sheets

Sheet hiện tại: https://docs.google.com/spreadsheets/d/1eKHEsHwwJxEADx-c4ZUa4taXC8vb6ZQnkBXFEH0aNks/edit

Mã Apps Script đã gửi có chức năng thêm giao dịch, chưa có API sửa giao dịch bất kỳ hoặc ghi ngân sách. Bản mở rộng này dùng cùng dự án và giữ nguyên luồng Telegram, Tasker, Notion.

1. Trong Apps Script của Sheet, tạo file `GambitBridge.gs`, dán nội dung file đi kèm.
2. Trong hàm `doGet(e)` hiện tại, ngay sau dòng khai báo `params`, thêm:

```js
if (params.gambit === 'capabilities') return gambitCapabilities_();
```

3. Trong hàm `doPost(e)`, ngay sau `var contents = parsePostPayload_(e);`, thêm:

```js
if (contents.source === 'gambit_v2') return gambitHandle_(contents);
```

4. Trong Project Settings → Script Properties, tạo `GAMBIT_API_KEY` với một khóa ngẫu nhiên riêng và `GAMBIT_TARGET_YEAR` bằng năm của bảng Target (ví dụ `2026`). Không dùng lại khóa Telegram/Notion.
5. Trong cấu hình máy chủ Gambit, đặt `FINANCE_WRITE_KEY` cùng giá trị đó. Khóa nằm ở máy chủ, không đặt vào HTML/JavaScript trình duyệt. Nếu dùng URL triển khai khác, đặt `FINANCE_V2_SCRIPT_URL` bằng URL `/exec` mới. Bản công khai phải bật đăng nhập Gambit bằng cấu hình `AUTH_SECRET` hiện có; API chỉnh sửa từ chối hoạt động nếu chưa bật. Máy chủ xem trước chỉ lắng nghe tại `127.0.0.1`.
6. Deploy → Manage deployments → sửa triển khai Web app hiện tại → New version → Deploy. Giữ URL hiện tại để Tasker/Telegram tiếp tục dùng được. Khởi động lại máy chủ Gambit nếu đổi biến môi trường, rồi vào Cài đặt → Kiểm tra kết nối chỉnh sửa.

## Hành vi và giới hạn

- Đọc giao dịch H:M từ dòng 10, giữ số dòng thật và dấu kiểm tra nội dung để phát hiện thay đổi đồng thời. Giao dịch lấy từ CSV chưa đủ thông tin để sửa, nên phải tải bản đọc xác thực trước.
- Sửa/xóa chỉ tác động H:M của dòng đã chọn, không xóa nguyên hàng và không dịch chuyển công thức. Giữ cột N:P. Trang Notion đã tạo trước đó không tự sửa/xóa theo thao tác này.
- Ngân sách chỉ cập nhật các ô của tháng đã chọn trong nhóm chi phí Target, không ghi đè cột tổng năm M hoặc các tháng khác. Danh mục mới cần có sẵn trong Target. Nhập 0 để bỏ hạn mức.
- Target là mẫu 12 tháng dùng cho một năm; không mặc định áp lại hạn mức vào mọi năm. Dữ liệu khoản trả nợ và tiết kiệm là dòng tiền, không phải số dư nợ/tài sản.
- Bản mở rộng hỗ trợ đọc, sửa/xóa giao dịch, ngân sách và tạo/sửa/xóa mục tiêu hoặc lịch định kỳ. Kế hoạch riêng lưu trong tab `_GambitPlans`, được tạo khi lưu kế hoạch đầu tiên. Lịch định kỳ không tự ghi giao dịch và không gửi thông báo nền. Mục tiêu cộng các khoản gửi tiết kiệm đúng danh mục trong thời hạn.
- Chuyển ví và quản lý khoản vay chi tiết chưa được triển khai ở giao thức này. Mô phỏng trả nợ có thể dùng ngay, nhưng không sửa số dư hay thực hiện thanh toán.
- Kiểm thử tự động dùng dữ liệu giả lập; không tự tạo giao dịch thử trong Sheet thật.

## Chuyển ví và chia danh mục

Cập nhật toàn bộ GambitBridge.gs trong cùng dự án và triển khai phiên bản Web app mới, giữ URL /exec hiện tại. Snapshot mới trả features: transfers, splits. Hai sổ phụ _GambitTransfers và _GambitSplits được tạo khi lưu lần đầu; không cần tự tạo trước.

Chuyển ví chỉ ghi nhận, không chuyển tiền ngân hàng. Mỗi bản ghi có mã chống gửi trùng; xóa giữ dấu vết để yêu cầu gửi lại cũ không tạo lại giao dịch. Settings tiếp tục là nguồn số dư, sổ chuyển ví không cộng/trừ vào số dư Settings. Phí chuyển tiền ghi thành chi phí riêng.

Chia danh mục giữ nguyên H:M và N:P của giao dịch gốc. Tổng các phần phải bằng số tiền gốc, 2–12 danh mục hợp lệ không lặp. Ngân sách và báo cáo Gambit đọc phân bổ sau khi xác thực kết nối; bảng tính và Notion vẫn hiển thị danh mục gốc. Nếu sửa nguồn trên Sheet hoặc di chuyển dòng, phân bổ cũ không áp dụng cho tới khi chia lại. Các dòng giống hệt nhau không được đoán ghép. Sổ giao dịch và CSV của sổ giữ các dòng gốc; CSV Báo cáo dùng các phần phân bổ.

Kiểm tra bằng dữ liệu giả trong bộ test; chưa ghi dữ liệu thử lên Sheet thật. Chỉ bật nút khi snapshot xác nhận phiên bản hỗ trợ.

## Suivi Notion trong Gambit

GambitBridge mới trả notionSync trong snapshot: số dòng Done/chờ/thiếu relation của Income và Expenses, có token hay chưa (chỉ boolean), và số trigger syncToNotion mà tài khoản thực thi nhìn thấy. Đây là trạng thái nguồn Sheet, không chứng minh từng page Notion còn tồn tại hoặc đúng nội dung. Nút kiểm tra chỉ đọc; không tạo page, cài trigger hoặc chạy đồng bộ. Các khóa tiếp tục ở phía Apps Script/máy chủ.
