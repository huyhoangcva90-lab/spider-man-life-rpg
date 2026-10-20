# Checklist UX và tổ chức hệ thống Spider Life

Ngày: 19/10/2026. Đây là đánh giá thiết kế và mã hiện có, chưa phải nghiên cứu sử dụng với người dùng hoặc chứng nhận chất lượng.

## Khung chuyên môn tham khảo

- [NN/g: 10 Usability Heuristics Applied to Video Games](https://www.nngroup.com/articles/usability-heuristics-applied-video-games/): trạng thái dễ nhận biết, dùng từ quen thuộc, thao tác có đường lui, nhất quán, ngăn lỗi, giảm việc phải nhớ và giảm thông tin phụ.
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/): chữ dễ đọc, thao tác rõ, không chỉ dựa vào màu sắc, giảm chuyển động và điều khiển âm thanh phù hợp.

## Đánh giá hiện tại

**Định hướng đã phù hợp:** game hub Spider ở ngoài, công cụ đời thực có UI riêng ở trong, Notion quyết định dữ liệu và chiến đấu. **Chưa nên xem là hệ thống hoàn thiện:** còn lỗi đồng bộ thực tế ở một số app và đường dữ liệu đời thực cũ cần xử lý. Không cần thay toàn bộ phong cách để sửa những vấn đề này.

| Tiêu chí | Hiện trạng | Tiêu chuẩn để xem là đạt |
|---|---|---|
| Trạng thái đáng tin | Đã sửa HP/KO từ snapshot cũ trong đợt này; nguồn đọc hiện trả 90/100 HP | Bản cũ, đang đọc, lỗi và dữ liệu mới phân biệt được; không coi lỗi mạng là 0 HP |
| Skill dễ hiểu | Đợt này đổi sang danh sách, phân nhóm và hiện mô tả/chi phí | Nội tại không giống nút đánh; CD cơ bản không giả làm bộ đếm sẵn sàng; chọn xem khác trang bị |
| Điều hướng có vai trò | Đã có menu trái, lối tắt phải và nhấn giữ về Home | Người dùng tìm được đường về bằng nút rõ ràng; Back/Forward trong trình duyệt cần hoàn thiện |
| Lưu dữ liệu an toàn | Hero/Habits giữ trạng thái khi ghi lỗi; Todo và Gym còn vấn đề trong báo cáo audit | Không mất bản nháp khi lưu dở; không báo đồng bộ thành công nếu schema/dữ liệu chưa đọc được |
| Tập trung vào công việc | Thông tin build/kết nối ít dùng chuyển thành phần mở rộng ở Skill | Danh sách chiêu và mô tả xuất hiện trước thông tin thiết lập dài |
| Nhất quán mà vẫn có bản sắc | Khung cho game; app Field tràn màn hình | Điều hướng và cách báo lỗi dùng chung, bố cục công cụ giữ phù hợp công việc; Finance giữ nguyên |
| Dùng tốt trên điện thoại | Có kiểm tra viewport 390 × 844; chưa kiểm tra thiết bị vật lý | Không cắt nội dung; chữ/nút đọc và bấm được; timer chính xác khi chạy nền; kiểm tra bàn phím và giảm chuyển động |
| Phạm vi dữ liệu công khai | Game projection có allowlist; legacy snapshot đời thực vẫn là mục P1 đang mở | Chỉ dữ liệu game đã duyệt được đọc không đăng nhập; task/habit/journal cá nhân yêu cầu phiên riêng |

## Các mục nên có một nhiệm vụ chính

| Mục hiện có | Nội dung ưu tiên | Hành động chính |
|---|---|---|
| Home / Battle | Hero HP/Energy, mission hiện tại, đối thủ/HP, chiêu đang chọn và kết quả gần nhất | Xem chiêu/hoạt ảnh và mở điều khiển trên Notion; không tạo kết quả giả trên web |
| Hero | Build đang dùng, trang phục, chiêu, map và huy hiệu | Xem trước → trang bị → chờ Notion xác nhận |
| Quests | Hôm nay/quá hạn, việc con, ưu tiên, hạn và trạng thái lưu | Thêm việc hoặc đánh dấu, giữ bản nháp khi thất bại |
| Habits | Các habit thật của ngày đang xem, dấu hoàn thành và lịch sử | Đánh dấu đúng ngày và đúng bản ghi, không sinh lịch sử 66 ngày giả |
| Field | Các công cụ độc lập, tìm kiếm, bản sao lưu và trạng thái nguồn dữ liệu | Mở đúng công cụ; không nhồi mọi công cụ thành một màn |
| Map (chế độ/lối tắt) | Địa điểm nhiệm vụ, thời gian và địa chỉ | Mở chỉ đường tới địa điểm đã chọn |

Giữ năm mục điều hướng chính hiện có. Map tiếp tục là chế độ/lối tắt, không thêm một hàng menu mới. Cài đặt và kết nối nằm trong menu hoặc phần mở rộng.

## Skill sau đợt sửa này

- Mặc định xem các chiêu đang dùng trong ô Notion đang chọn. Có tìm kiếm và các nhóm Đang dùng / Tất cả / Chủ động / Nội tại-bổ trợ / Ultimate / Chưa phân loại.
- Nhãn loại gốc của database vẫn được giữ. Việc gom nhóm chỉ để trình bày, không đổi cơ chế hay loại chiêu trong Notion.
- Mỗi dòng có tên, loại và chi phí/CD khi có dữ liệu; nội tại có nhãn không bấm đánh.
- Khung chi tiết ưu tiên mô tả. Energy hiện tại chỉ dùng để giải thích so với chi phí cơ bản, không suy diễn rằng nút Attack chắc chắn được phép dùng.
- Cooldown đang là giá trị cơ bản. Chưa có dữ liệu thời điểm dùng/remaining thì không vẽ đồng hồ hồi chiêu hay chữ Sẵn sàng giả.
- Chọn một dòng chỉ đổi phần xem; nút thêm/bỏ khỏi build mới ghi quan hệ Skill Slot thật trong Hero. Không tự tạo tám slot theo Clash Royale.
- Ở Battle, nội tại/bổ trợ có hàng riêng; chiêu chủ động và Ultimate ở hàng tương tác. Web vẫn chỉ giải thích/xem hoạt ảnh, kết quả do Notion quyết định.

## HP: nguyên nhân và bản sửa

Nguồn game công khai đã được kiểm tra và trả HP 90 / Max HP 100. File snapshot đóng gói cũ có HP 0. Trước đây snapshot đó có thể khiến HUD và hoạt ảnh coi Hero là KO trước khi đọc dữ liệu mới.

Đợt này:

1. Ưu tiên bản game đọc thành công gần nhất trên trình duyệt nếu mới hơn file đóng gói.
2. Số 0 từ bản cũ chưa được xác nhận không được coi là KO; HUD ghi Đang đọc HP.
3. Khi Notion xác nhận HP = 0 thật, vẫn hiển thị 0 và KO. Không cộng máu hoặc sửa Notion để che lỗi.
4. Khi phiên riêng không còn hợp lệ, game vẫn đọc được phép chiếu công khai đã được duyệt; dữ liệu riêng tiếp tục khóa.
5. Không phát lại đòn đánh cũ khi chuyển từ snapshot sang lần đọc live đầu tiên.

## Thứ tự công việc tiếp theo

- [ ] P1: xử lý legacy snapshot công khai; bảo toàn dữ liệu riêng và đưa luồng Map/task đời thực về nguồn có xác thực.
- [ ] P1: sửa lớp dữ liệu Gym và báo lỗi đúng; giữ việc con Todo chưa lưu khi yêu cầu thất bại.
- [ ] P2: nối rõ từng app với Notion/cloud/thiết bị; không gọi việc mở phiên là đã đồng bộ tất cả.
- [ ] P2: sửa Back/Forward, quan hệ Habit dài và timer chạy nền.
- [ ] P3: tối ưu tải Map/thư viện theo nhu cầu; kiểm tra trải nghiệm trên điện thoại thật.
- [ ] Sau các mục trên, thử các luồng liên tục: Notion đổi HP → web cập nhật; chọn Skill → trang bị → tải lại; mất mạng lúc tạo việc con → thử lại; habit đổi ngày → đánh dấu đúng ngày.

**Không cần thêm nhiều DB hoặc tính năng ngay.** Dùng các quan hệ Hero/Skill/Suit/Map/Mission/Habit/Daily hiện có trước. Với trường chưa có dữ liệu, hiển thị chưa có thay vì tự đặt luật hoặc phần thưởng.

## Kiểm tra đợt này

36 kiểm thử tự động hiện có đạt, gồm các trường hợp mới về HP cũ/HP 0 thật, phân loại Skill và phiên riêng lỗi. Không ghi HP hoặc chiêu vào Notion thật trong kiểm tra; không ghi giao dịch tài chính. Finance không bị thay đổi.
