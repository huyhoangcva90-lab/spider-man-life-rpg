# Spider Life riêng tư trên Cloudflare Pages

Spider Life có trang đăng nhập riêng trên Cloudflare Pages. Pages Worker kiểm tra phiên đã ký cho **mọi** yêu cầu, kể cả HTML, ảnh và `data/notion-snapshot.json`. Cổng `/api/notion` chỉ chạy sau lớp kiểm tra này và chỉ gọi các thao tác Notion mà ứng dụng sử dụng. Có thể dùng Cloudflare Access thay thế khi tài khoản đã kích hoạt Zero Trust.

## Chuẩn bị gói trang

Chạy `node tools/prepare_private_pages.mjs`. Thư mục `.pages-private` chỉ chứa các file web được cho phép và `_worker.js`. `.env.local`, APK và công cụ nội bộ không được đưa vào gói.

## Cấu hình Cloudflare

1. Đăng nhập tài khoản Cloudflare bằng Wrangler (`npx wrangler whoami` phải hiện tài khoản) hoặc Dashboard.
2. Tạo Pages project riêng cho Spider Life. Dùng gói `.pages-private` qua Wrangler, hoặc kết nối Git với build command `node tools/prepare_private_pages.mjs` và output directory `.pages-private`.
3. Trong Pages project, đặt chế độ Functions **Fail closed** để hết hạn mức cũng không phát file tĩnh ra ngoài.
4. Cấu hình ba secret Pages cho production:
   - `APP_LOGIN_PASSWORD_HASH`: SHA-256 hex của mật khẩu mạnh, duy nhất cho Spider Life.
   - `APP_SESSION_SECRET`: chuỗi ngẫu nhiên dài ít nhất 32 ký tự để ký phiên đăng nhập.
   - `NOTION_TOKEN`: khóa integration Notion hiện dùng ở máy cá nhân; chỉ đặt dưới dạng secret phía server.
5. Chỉ triển khai bản đầy đủ sau khi ba secret đã sẵn sàng. Kiểm tra cửa sổ ẩn danh: URL trang và `data/notion-snapshot.json` đều chuyển về `/login`; `/api/notion` trả 401. Đăng nhập thành công rồi kiểm tra Habit, Quest đọc Notion và ghi check-in. Đăng xuất ở `/logout`.

Cloudflare Access là lựa chọn nâng cấp: bảo vệ production domain và preview; đặt `CF_ACCESS_TEAM_DOMAIN` dạng `<team>.cloudflareaccess.com` và `CF_ACCESS_AUD` của Access app. Khi có hai biến này, Worker dùng Access JWT thay cho mật khẩu riêng. Không chỉ bật “Restrict previews”: tùy chọn đó chỉ bảo vệ URL preview. [Hướng dẫn Cloudflare về production `pages.dev`](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain).

Tài khoản Cloudflare đang dùng yêu cầu thông tin thẻ và chấp nhận điều khoản để kích hoạt Zero Trust Free. Vì vậy cấu hình hiện tại dùng đăng nhập riêng trong Pages mà không cần kích hoạt gói đó.

Trang GitHub Pages cũ vẫn là bản tĩnh; dữ liệu trong `data/notion-snapshot.json` đã được Git theo dõi và không nên cập nhật bằng thông tin riêng tư mới.
