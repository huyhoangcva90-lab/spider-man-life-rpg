# Spider Life: Notion quyết định trạng thái game

Web và đường dẫn `/pk` trình bày cùng dữ liệu Notion. Thư mục game chỉ cung cấp hình ảnh và clip tham khảo, không cung cấp luật chiến đấu, phần thưởng hoặc nội dung mission thay thế.

- Hero: đọc đúng Level, Exp, HP, Max HP, Energy, Max Energy; số 0 không được thay bằng giá trị mặc định.
- Chiêu: lấy toàn bộ quan hệ `Skill Slot 1` và các `Skill Slot N` thực sự tồn tại. Một quan hệ có thể chứa nhiều chiêu. Không giả định có bốn slot.
- Trang phục: dùng quan hệ `Equipped Suit`. Trống nghĩa là chưa chọn; không tự chọn từ tủ trang phục.
- Map: dùng quan hệ `Current Map` theo yêu cầu chọn map trên Hero rồi đổi cảnh trong app. Không ghi đè bằng map lưu riêng trên trình duyệt.
- Huy hiệu: đọc quan hệ của Hero và các cờ Unlocked/Equipped. Không tự mở khóa theo công thức level trong web.
- Mission: dùng quan hệ `🚨 Missions`, các dòng wave và quan hệ `Bosses & Minions`. Hiển thị chỗ liên kết chưa khớp, không tự thay địch theo tên mission.
- Mục tiêu sân đấu: các bản ghi trong `👹 Bosses & Minion` của Hero, với HP hiện tại `HP - (1)`. Không tự tạo nhóm ba quái hoặc nhân bản HP.
- Đòn đánh và hồi phục: do nút/công thức/automation trong Notion quyết định. Web không tự tính sát thương, trói, hồi máu, né, thưởng hoặc qua màn.
- Nhật ký: chỉ đọc kết quả chiến đấu gần nhất có Combat Skill hoặc Boss Skill, không đọc nhật ký đời thực.

Mỗi chiêu có mô tả nguyên bản. `Xem hoạt ảnh` là xem thử, không đổi chỉ số và không ghi Notion. Nội tại không được biến thành đòn đánh. Chiêu chưa có clip phù hợp sẽ ghi rõ thay vì gán ngẫu nhiên.

`/api/game-state` chỉ đọc Hero cố định và các bản ghi game đã chọn bằng danh sách trường cho phép. Chủ dự án đã cho phép công khai tên Hero, LV/HP/Energy/XP, chiêu/trang phục/huy hiệu đã chọn, mission, boss/minion và kết quả đòn đánh gần nhất. Task, nhật ký, khóa API và các trường ngoài phạm vi không được trả về.

Web kiểm tra dữ liệu khoảng 20 giây khi đang hiển thị. Khi máy chủ chưa có khóa hoặc Notion không phản hồi, dùng `data/notion-game-state.json` và hiện rõ đây là bản đã lưu. Bản đã lưu không được coi là kết nối trực tiếp.

Làm mới bản dữ liệu công khai bằng `node tools/sync_notion_game_view.mjs <đường-dẫn-env-cục-bộ>`; không đưa tệp env vào Git. Trên Vercel dùng biến máy chủ `NOTION_API_KEY` hoặc `NOTION_TOKEN` cho đường đọc giới hạn này.
