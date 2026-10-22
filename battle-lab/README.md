# Spider Life Battle Lab

Trang độc lập được chuyển từ bản xem ở cổng 4190 lên `/battle-lab/`.

- Mặc định mở đấu thử theo lượt; chọn mục tiêu rồi bấm chiêu.
- `?mode=native` mở bảng moveset gốc, gồm các cảnh thử né và Spider-Senses.
- `clip-library.html` xem thư viện 47 clip Spider.
- Sprite, dữ liệu hoạt ảnh, thời gian frame, điểm đặt và hiệu ứng dùng dữ liệu đã trích từ game tham khảo của chủ dự án.
- HP, Energy, damage, cooldown và luật lượt là luật thử của trang này. Chưa kết nối Notion hoặc thay thế Arena chính.
- Không đọc/ghi save Hero, Habit, Quest hay Finance của Spider Life.

Chỉ các file chạy trên web và asset cần thiết được đưa vào đây; các công cụ trích xuất, thư viện Python và file game nhị phân vẫn ở thư mục làm việc gốc.

Kiểm tra: `node --test tests/battle-lab/*.test.mjs` từ gốc repository.
