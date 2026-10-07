# Spidey Life Tracker — kiểm kê 05/10/2026

## Trải nghiệm hiện có

| Màn hình | Nội dung | Nguồn chính | Ghi chú |
| --- | --- | --- | --- |
| Battle | Trận theo lượt, HP, Energy, combo, tơ, gadget, đồng đội, ultimate, 5 wave, hiệu ứng, âm thanh | Hero Profile Notion cho chỉ số; trận và quy tắc đánh lưu trên thiết bị | Bắt đầu ở wave 1. HP/Energy Notion bằng 0 nên đòn đánh khóa tới khi hồi phục qua Habit. Bosses & Minion được đọc từ Notion nhưng chưa thay thế trọn bộ encounter trong battle engine. |
| Quest | Master Calendar, Active Quests, Goals, lịch patrol; tạo và hoàn thành | Các database tương ứng trong Notion | Hoàn thành quest có thể gây sát thương, thưởng EXP; thao tác ghi Notion. |
| Hero | Profile, suit, kỹ năng, gadget, đồng đội Spider-Verse, badge | Hero Profile, Suits, Combat Skills, Spider Gadgets, Spider-Verse, Badges & Medals trong Notion | Trang bị được ghi vào relation của Hero Profile. Bonus và đòn đánh của từng món chưa áp dụng đầy đủ vào battle engine. |
| Habit | Check-in hôm nay, tổng quan, liên kết Life Reset 66 | Habits trong Notion | Check-in hồi HP/Energy. Chưa có Habit Log theo ngày nên không dựng biểu đồ lịch sử giả. |
| Field | Focus 25 phút, Gym, Journal, Bestiary, Backpack | Time-Tracking, Habits, Workout Plans, Exercise/Cardio/Sport Logs, Journal Database, Bosses & Minion trong Notion; Backpack cục bộ | Focus/Journal có thể tạo bản ghi Notion. Gym dùng Habit tập luyện và giáo án Notion. Bestiary chỉ hiển thị catalogue, chưa chi phối trận. |
| Map / Message Center / Life Reset | Bản đồ nhiệm vụ, chat game, ứng dụng Life Reset riêng | Hỗn hợp Notion và dữ liệu cục bộ | Đây vẫn là các hệ phụ, chưa có một nguồn Notion duy nhất. |

## Trạng thái Notion đã xác nhận

- Hero `Spider - man`: level 1, EXP 0, Gold 0, HP 0/100, Energy 0/10; chưa trang bị suit/gadget/skill/companion.
- Active Quests: 4 việc, chưa hoàn thành. Master Calendar: 12. Habits: 14. Goals: 8.
- Badges & Medals: 37 badge, chưa có badge mở khóa/trang bị. Biểu tượng ở đầu game tạm dùng hình badge đầu tiên từ Notion; đây chỉ là hình nhận diện, không cấp badge cho Hero.
- Time-Tracking chưa có phiên; các bảng Workout Plans, Exercise/Cardio/Sport Logs, Journal Database và Bosses & Minion truy cập được.
- Dữ liệu trên là ảnh chụp tại thời điểm kiểm tra; app sẽ đọc lại từ Notion khi mở/sync.

## Ranh giới đồng bộ hiện nay

- `.env.local` giữ Notion key trên máy; không đưa vào Git. Máy chủ local chỉ nghe `127.0.0.1`.
- Chỉ số Hero, check-in, hoàn thành Quest/Goal, tạo Quest/Habit/Goal, đổi trang bị, lưu Focus và Journal ghi vào Notion. Quest/Habit và chỉ số Hero có hàng chờ cục bộ nếu mạng gián đoạn.
- Battle wave, enemy HP, backpack, một số tùy chọn và các app phụ còn lưu trong trình duyệt; chưa có database Notion tương ứng được nối vào toàn bộ luồng.
- Public Vercel proxy mặc định chặn truy cập để không lộ toàn bộ workspace Notion. Muốn dùng đồng bộ trên Internet cần thêm đăng nhập riêng. GitHub Pages không chạy được API Notion.
- `data/notion-snapshot.json` là file có thể được công khai trong Git; không ghi dữ liệu cá nhân mới từ Notion vào đó.

## Việc còn cần quyết định/hoàn thiện

1. Liên kết GitHub chính xác của dự án Gambit để nối Gym/Time theo cấu trúc người dùng đã xây.
2. Chuyển hiệu ứng suit/gadget/skill/companion từ Notion thành quy tắc battle có cân bằng và điều kiện mở khóa; hiện loadout mới là dữ liệu/trang bị.
3. Thêm Habit Log hoặc lịch sử ngày trong Notion nếu muốn báo cáo tuần/tháng/năm chính xác như các app habit tham khảo.
4. Thiết kế đăng nhập cho bản online trước khi bật Notion API công khai.
