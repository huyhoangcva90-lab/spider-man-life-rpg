# SPIDEY LIFE — Project Defaults & Agent Rules

## 1. Kiến trúc & Công nghệ (Tech Stack & Architecture)
- **Công nghệ**: Vanilla HTML5, CSS3, JavaScript ES Modules. **Không dùng build step** (không bundler, không webpack/vite bắt buộc).
- **Quy tắc Import**: Sử dụng chuẩn ES Modules (`import`/`export`), luôn có đuôi file `.js` trong đường dẫn import tương đối.
- **Tách biệt Logic & UI**:
  - Các module engine nghiệp vụ (`QuestEngine`, `DamageEngine`, `CombatEngine`, `RewardEngine`) hoàn toàn thuần JS, không phụ thuộc trực tiếp vào DOM.
  - State & Event được điều phối qua `PhaseOneGameEngine`.
- **Dữ liệu & Persistence**:
  - Dữ liệu nhiệm vụ và nhân vật lưu trữ tại `localStorage`.
  - Content registry chuẩn hóa với ID kebab-case (`actions`, `heroes`, `allies`, `enemies`, `quests`, `rewards`, `districts`, `zones`).

## 2. Kiểm thử & Chạy Local
- Chạy static server cục bộ (ví dụ: `python -m http.server 4173` hoặc live server) để tránh lỗi CORS khi tải ES Modules qua `file://`.
- Kiểm tra các bài test browser-native tại `tests/domain-tests.html`.

## 3. Tích hợp Notion (Tùy chọn)
- Sử dụng Notion API (Token bot `Calendar`, workspace `Zeus`) khi cần đồng bộ nhiệm vụ đời thực từ Notion sang Quests của Spider-Man.
- Luôn đảm bảo mã hóa UTF-8 khi đọc/ghi file hoặc giao tiếp API.
