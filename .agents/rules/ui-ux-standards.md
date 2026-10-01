# Quy Chuẩn Thiết Kế UI/UX & Game Feel (UI/UX Standards)

Hệ thống quy chuẩn này áp dụng cho toàn bộ giao diện web, dashboard và HUD chiến đấu của dự án.

## 1. Hệ Thống Màu & Semantic Tokens (Color Hierarchy)
- **Nền tảng (Backgrounds)**: Dark mode chiều sâu với gam màu xanh đen comic `#071426` và `#0d1b2a`.
- **Màu ngữ nghĩa (Semantic Status)**:
  - `HP / Danger`: Đỏ thắm `#ff3b30` hoặc `#e53935`.
  - `Web Energy / Tech`: Xanh Cyan điện tử `#00e5ff` hoặc `#00bcd4`.
  - `Stagger / Alert / Coins`: Vàng kim Amber `#ffb300` hoặc `#f2c06b`.
  - `Success / Completed`: Xanh lá neon `#00e676` hoặc `#83b96b`.
  - `Notion Integration`: Tím Indigo `#7c4dff` hoặc `#6c5ce7`.
- **Độ tương phản**: Đảm bảo tỷ lệ tương phản tối thiểu **4.5:1 (WCAG AA)** cho text và icon.

## 2. Hệ Thống Lưới & Không Gian (Spacing & Layout)
- **Quy tắc 8-Point Grid**: Mọi padding, margin, gap đều chia hết cho 4 hoặc 8 (4px, 8px, 12px, 16px, 24px, 32px).
- **Thiết kế Mobile-First**: 
  - Toàn bộ thanh điều hướng, nút kỹ năng (Attack, Web, Gadget, Finisher) phải có kích thước tối thiểu **44x44px** (chuẩn touch target ngón tay cái).
  - Khu vực combat chính phải hiển thị trọn vẹn trên màn hình điện thoại mà không bị tràn khung ngang.

## 3. Game Feel & Phản Hồi Tức Thì (Juicy Micro-Interactions)
- **Xúc giác thị giác (Tactile Buttons)**:
  - Khi hover: Tăng nhẹ độ sáng (`brightness(1.15)`) hoặc viền phát sáng (`box-shadow: 0 0 10px var(--glow)`).
  - Khi click/active: Thu nhỏ nhẹ (`transform: scale(0.96)`) tạo cảm giác nhấn phím cơ.
- **Phản hồi khi có biến cố (Combat & Task Trigger)**:
  - Hoàn thành nhiệm vụ: Hiệu ứng popup truyện tranh (Comic text `THWIP!`, `POW!`) nảy lên trong 400ms và tan dần.
  - Sát thương lớn / Finisher: Rung nhẹ màn hình (Screen shake 200ms) kèm âm thanh va chạm.
- **Âm thanh phản hồi (Audio Design)**:
  - Click nút / Chuyển tab: Âm thanh cơ học ngắn nhẹ (30-50ms).
  - Hoàn thành Quest: Âm vang chiến thắng (Victory cue).

## 4. Khả Năng Tiếp Cận (Accessibility & Performance)
- **Tôn trọng Reduced Motion**: Luôn hỗ trợ `prefers-reduced-motion` và cài đặt trong game để tắt rung màn hình cho người dùng nhạy cảm.
- **Điều khiển phím tắt**: Phím `Escape` luôn đóng mọi modal / drawer đang mở.
