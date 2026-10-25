# Spider Suit OS — kế hoạch giao diện

## Mục tiêu

Spider Life là bộ công cụ hằng ngày của một Người Nhện: màn chính cho biết việc cần xử lý, Field mở các thiết bị hỗ trợ, Arena phản hồi khi hoàn thành nhiệm vụ thật. Cảm giác là giao diện trong bộ đồ, với vật liệu đen/đỏ/xanh thép từ hai ảnh đồng hồ người dùng cung cấp. Nội dung phải đọc được ngay và mỗi chuyển động phải báo một trạng thái có thật.

## Nguyên tắc chung

- Một trạng thái, một tín hiệu: đỏ cho cảnh báo/đòn đánh, xanh lạnh cho dữ liệu và thao tác, trắng cho thông tin, tím chỉ cho nghỉ/ngủ. Không tô đủ màu cầu vồng cho mọi thẻ.
- Biểu tượng dùng chung một bộ hình học: lục giác thiết bị, mắt nạ, mạng nhện, tracer, web shooter và spider crest. Trạng thái hover có hình dạng và chữ thay đổi rõ ngoài việc đổi màu.
- Chữ nhiệm vụ và số liệu dùng hai nhịp: tiêu đề mạnh, số giờ/HP/XP dễ quét; mô tả tiếng Việt dùng cỡ chữ đọc được. Đồng hồ vẫn hiển thị đủ 24 giờ.
- Chuyển động có lý do: quét khi mở công cụ, xung ngắn khi đồng bộ xong, Spider-Sense khi có cảnh báo, đòn đánh khi nhiệm vụ thật hoàn thành. Tôn trọng tùy chọn giảm chuyển động.
- Giữ đầy đủ chức năng của app Gambit đã chọn. Lớp Suit OS thay giao diện và lối vào, không thay thế dữ liệu hoặc tự tạo tiến trình giả.

## Lộ trình theo thứ tự

1. **Time và Field:** bộ icon Spider, mặt nạ thông thoáng với bảng tín hiệu riêng, phản hồi vùng giờ khi rê/chạm/bàn phím, preview hoạt ảnh Người Nhện tại Field và lối vào thư viện 47 clip. Xác nhận hoạt ảnh phát không cần Notion.
2. **Màn chính:** gom trạng thái nhiệm vụ hôm nay, năng lượng, kết nối và cảnh báo vào một HUD gọn. Khi có dữ liệu trống hoặc mất kết nối, báo đúng nguồn thay vì hiển thị số liệu mẫu như dữ liệu thật.
3. **Luồng nhiệm vụ → hành động:** Habit/Quest được xác nhận từ nguồn thật mới kích hoạt Hero animation và kết quả Arena; click xem trước vẫn phát clip nhưng không đổi HP/XP. Xác định rõ animation nào ứng với hoàn thành, bỏ lỡ, cảnh báo và chiến thắng.
4. **Đồng bộ từng app:** làm lại Routine, Dopamine Menu, Habit, Gym theo cùng vật liệu, icon, trạng thái và chuyển cảnh; giữ thao tác gốc của mỗi app và kiểm tra desktop/mobile sau từng app.

## Nguồn dữ liệu và chuyển động

- Thư viện 47 clip và preview Field đọc sprite cục bộ ở `battle-lab/spiderman.json` và `spiderman.png`. Không cần kết nối Notion.
- Notion cấp nhiệm vụ, thói quen và kết quả thực. Google Calendar cấp sự kiện Timetable khi người dùng kết nối riêng. Các kết nối này không quyết định việc phát sprite.
- Arena đã có bộ điều khiển Hero và hành động chiến đấu. Dùng lại chúng khi nối trạng thái nhiệm vụ; tránh tạo một hệ hoạt ảnh thứ hai.

## Tham khảo

- Hai ảnh đồng hồ do người dùng cung cấp là chuẩn hình ảnh trực tiếp cho Time: mặt nạ HUD đỏ và vỏ đồng hồ kim loại xanh/đỏ.
- [Insomniac: tùy chọn HUD, cỡ icon, nền tương phản và giảm parallax](https://support.insomniac.games/hc/en-us/articles/46670280641299-What-Accessibility-options-does-Marvel-s-Spider-Man-Remastered-have) — cơ sở cho HUD đọc rõ và chuyển động tùy chọn.
- [PlayStation: Clear Text, High Contrast Visuals và Visual Comfort trong Marvel’s Spider-Man 2](https://www.playstation.com/en-gb/games/marvels-spider-man-2/) — cơ sở để hiệu ứng điện ảnh không che thông tin.
