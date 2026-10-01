# 🕷️ Hướng Dẫn Tích Hợp Notion Webhook + Hermes Agent (Ubuntu)

Tài liệu hướng dẫn kết nối nút bấm (Button) hoặc Automation trong Notion với máy trạm Ubuntu chạy **Hermes Agent** để tự động tạo nhiệm vụ siêu anh hùng vào database `📜 Quests` trong **Hero's Vision**.

---

## 🎯 1. Cơ Chế Hoạt Động (Architecture Flow)

```
[Notion Workspace: Zeus]
   │
   ├─► Người dùng bấm nút "⚡ Send to Spidey Life" (hoặc tick hoàn thành Task / Habit)
   │
   ├─► Notion gửi HTTP POST Webhook (JSON chứa Page Title, Type, Status)
   │
[Cloudflare Tunnel / Ngrok / Reverse Proxy] (HTTPS Public)
   │
   ▼
[Ubuntu Workstation: Port 8000]
   │
   ├─► `hermes_webhook_receiver.py` tiếp nhận payload
   ├─► Chuyển hóa Task/Habit đời thực thành Quest siêu anh hùng phong cách Spider-Man:
   │     • "Gym đẩy ngực 4 hiệp"  ──► "Rèn luyện thể chất cùng Peter Parker: Gym..."
   │     • "Học 20 từ vựng Anh"   ──► "Giải mã kho lưu trữ Oscorp: Học từ vựng..."
   │     • "Code tính năng login" ──► "Nghiên cứu công nghệ Nano phòng lab: Code..."
   │
   └─► Gọi Notion API (REST v1/pages) ghi bản ghi mới vào:
         Database `📜 Quests` (ID: `4f919900-85d3-423b-8ae3-b0a252d55fed`)
```

> **Nguyên tắc an toàn:**
> - Máy trạm Ubuntu chỉ tương tác với Database `📜 Quests` trong `Hero's Vision`.
> - Tuyệt đối không can thiệp hay sửa đổi các database cá nhân khác (Master Calendar, Daily, Habits, Tài chính, Gym,...).

---

## 🛠️ 2. Cài Đặt Trên Máy Trạm Ubuntu

### Bước 2.1: Sao chép file receiver sang Ubuntu
Copy file [`tools/hermes_webhook_receiver.py`](file:///C:/Users/huyklgl/Documents/antigravity/spider-man-life-rpg/tools/hermes_webhook_receiver.py) sang thư mục làm việc trên máy Ubuntu (ví dụ: `/home/ubuntu/hermes-notion/`):

```bash
mkdir -p ~/hermes-notion
cd ~/hermes-notion
# Lưu script hermes_webhook_receiver.py vào thư mục này
```

### Bước 2.2: Thiết lập biến môi trường
```bash
export NOTION_API_KEY="YOUR_NOTION_API_KEY"
export PORT=8000
```

### Bước 2.3: Chạy thử nghiệm receiver
```bash
python3 hermes_webhook_receiver.py
```
Khi chạy thành công, console sẽ hiển thị:
```
🕷️  HERMES NOTION WEBHOOK LISTENER ACTIVE ON PORT 8000
   Endpoint URL: http://0.0.0.0:8000/
```

### Bước 2.4: Mở Public URL an toàn bằng Cloudflare Tunnel (Miễn phí & Cực ổn định)
Vì Notion nằm trên cloud nên cần gửi Webhook đến một HTTPS URL công khai. Cách tốt nhất trên Ubuntu là dùng **Cloudflare Tunnel**:
```bash
# Cài cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Mở tunnel nhanh không cần domain riêng:
cloudflared tunnel --url http://localhost:8000
```
Cloudflare sẽ cung cấp cho bạn một đường dẫn dạng:
`https://xxx-xxx-xxx.trycloudflare.com`

---

## ⚙️ 3. Cấu Hình Nút Bấm / Automation Trên Notion

Notion hỗ trợ 2 cách kích hoạt Webhook:

### Cách 1: Tạo Nút Bấm (Button Block) trên trang bất kỳ
1. Trên trang Notion (ví dụ ở Dashboard hoặc Daily Hub), gõ `/button`.
2. Đặt tên nút: `🕷️ Gửi Sang Spidey Quest`.
3. Trong mục **"When clicked"**:
   - Chọn **Add action** ➡️ **Send webhook**.
   - **URL**: Điền URL Cloudflare Tunnel của bạn: `https://xxx-xxx.trycloudflare.com/`
   - **HTTP Method**: `POST`.
   - **Payload**: Notion sẽ tự động đính kèm thông tin trang hiện tại hoặc bạn có thể custom JSON.
4. Bấm **Done**.

### Cách 2: Database Automation (Tự động khi tick Done hoặc tạo Task mới)
1. Mở Database cần theo dõi (ví dụ Daily Tasks).
2. Nhấn vào biểu tượng **⚡ (Automations)** ở góc trên bên phải database.
3. Chọn **New automation**:
   - **Trigger**: `When Task is created` hoặc `When Status changes to 'In Progress'`.
   - **Action**: Chọn **Send webhook**.
   - **URL**: `https://xxx-xxx.trycloudflare.com/`.
4. Nhấn **Save**. Mỗi khi có task mới, Notion sẽ ping webhook sang Hermes Agent trên Ubuntu để sinh ra Quest tương ứng!

---

## 🚀 4. Chạy Ngầm Bằng Systemd Service Trên Ubuntu (Chạy 24/7)

Tạo file service để receiver tự chạy khi bật máy:
```bash
sudo nano /etc/systemd/system/hermes-webhook.service
```
Dán nội dung sau:
```ini
[Unit]
Description=Hermes Notion Webhook Receiver
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/hermes-notion
Environment="NOTION_API_KEY=YOUR_NOTION_API_KEY"
Environment="PORT=8000"
ExecStart=/usr/bin/python3 /home/ubuntu/hermes-notion/hermes_webhook_receiver.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
Kích hoạt service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hermes-webhook
sudo systemctl status hermes-webhook
```
