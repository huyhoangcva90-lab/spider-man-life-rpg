# Spider Life Battle Lab

Trang độc lập được chuyển từ bản xem ở cổng 4190 lên `/battle-lab/`.

- Mặc định mở Battle Lab native với sân đấu và bảng lệnh 4 chiêu, 2 gadget, 1 ultimate. Chọn mục tiêu rồi bấm lệnh để đánh thử; HP, Energy, hồi chiêu, lượt địch và kết quả dùng bộ luật thử cục bộ. Mỗi lượt một mục tiêu còn sống phản công, theo nhịp chọn chiêu kiểu Pokémon. Sau mỗi đòn, nhân vật trở về vị trí đứng chuẩn.
- `?mode=native` mở cùng giao diện native; thư viện moveset đầy đủ, các cảnh thử né và Spider-Senses nằm trong mục mở rộng.
- `?mode=trial` mở đấu thử theo lượt cũ.
- `clip-library.html` xem thư viện 47 clip Spider.
- Sprite, dữ liệu hoạt ảnh, thời gian frame, điểm đặt và hiệu ứng dùng dữ liệu đã trích từ game tham khảo của chủ dự án.
- HP, Energy, damage, cooldown và luật lượt là luật thử của trang này. Trận thử không thay thế Arena chính.
- Mục mở rộng đọc Hero và các Skill Slot hiện có qua `/api/game-state`; khi API không hoạt động, hiển thị bản lưu và ghi rõ nguồn. Phần đọc này không thay đổi chỉ số trận thử.
- Mỗi nút trong bộ 4 chiêu, 2 gadget, 1 ultimate có liên kết tới bản ghi Combat Skills tương ứng trên Notion. Spider-Slide, Webbings và Web Shooters Battle Lab Ultimate được bổ sung ngày 28/10/2026.
- Trang chủ nhúng `?mode=native&embed=1`; mọi lối vào Battle Lab chính cũng trỏ tới `?mode=native`.
- Không ghi save Hero, Habit, Quest hay Finance của Spider Life.

Chỉ các file chạy trên web và asset cần thiết được đưa vào đây; các công cụ trích xuất, thư viện Python và file game nhị phân vẫn ở thư mục làm việc gốc.

Kiểm tra: `node --test tests/battle-lab/*.test.mjs` từ gốc repository.
