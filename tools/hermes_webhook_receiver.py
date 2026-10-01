#!/usr/bin/env python3
"""
HERMES AGENT - NOTION WEBHOOK RECEIVER & QUEST GENERATOR
Chạy trên máy trạm Ubuntu để nhận webhook từ Notion khi người dùng bấm nút/tạo task,
và tự động chuyển hóa thành nhiệm vụ siêu anh hùng ghi vào database Quests trong Hero's Vision.
"""

import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler

# --- CẤU HÌNH NOTION ---
NOTION_TOKEN = os.environ.get("NOTION_API_KEY", "")
HERO_QUESTS_DB = "4f919900-85d3-423b-8ae3-b0a252d55fed"  # Database Quests trong Hero's Vision
PORT = int(os.environ.get("PORT", 8000))

NOTION_HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json; charset=utf-8"
}

def create_hero_quest(quest_title, quest_type="Daily", status="To Do"):
    """Tạo record nhiệm vụ mới trong database Quests của Hero's Vision"""
    payload = {
        "parent": {"database_id": HERO_QUESTS_DB},
        "properties": {
            "Quest": {
                "title": [{"text": {"content": quest_title}}]
            },
            "Type": {
                "select": {"name": quest_type}
            },
            "Status": {
                "select": {"name": status}
            }
        }
    }

    req = urllib.request.Request(
        "https://api.notion.com/v1/pages",
        data=json.dumps(payload).encode("utf-8"),
        headers=NOTION_HEADERS,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[Hermes] Created Quest successfully: {quest_title} (ID: {data.get('id')})")
            return data
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        print(f"[Hermes] Notion API Error: {err_body}")
        raise e

def transform_to_superhero_quest(task_name, category="task"):
    """
    Biến đổi tên task/habit đời thực thành Quest Spider-Man hào hứng.
    (Bạn có thể gọi Hermes LLM ở đây, hoặc dùng bộ mapping phong cách comic)
    """
    comic_prefixes = [
        "Đột kích sào huyệt Fisk: ",
        "Phá vỡ ảo ảnh Mysterio: ",
        "Tuần tra Manhattan: ",
        "Nâng cấp linh kiện tơ nhện: ",
        "Giải mã tín hiệu Roxxon: "
    ]
    
    # Nếu là habit thể lực
    if "gym" in task_name.lower() or "straight" in task_name.lower():
        return f"Rèn luyện thể chất cùng Peter Parker: {task_name}", "Daily"
    # Nếu là habit học tập / ngoại ngữ
    elif "tiếng anh" in task_name.lower() or "learn" in task_name.lower():
        return f"Giải mã kho lưu trữ Oscorp: {task_name}", "Daily"
    # Nếu là công việc sâu / deep work
    elif "deep work" in task_name.lower():
        return f"Nghiên cứu công nghệ Nano trong phòng lab: {task_name}", "Main"
    # Task thông thường
    else:
        return f"Nhiệm vụ tuần tra thành phố: {task_name}", "Side"

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode("utf-8")) if post_data else {}
            print(f"[Hermes] Received Webhook payload: {json.dumps(payload, indent=2, ensure_ascii=False)}")
            
            # Trích xuất dữ liệu từ webhook Notion gửi sang
            # Notion Automation Webhook có thể gửi data của page vừa bấm
            task_name = payload.get("title") or payload.get("name") or payload.get("data", {}).get("title", "Nhiệm vụ mới")
            
            # Chuyển hóa thành Quest
            hero_quest_title, quest_type = transform_to_superhero_quest(task_name)
            
            # Ghi vào database Quests trong Hero's Vision
            result = create_hero_quest(hero_quest_title, quest_type)
            
            # Phản hồi 200 OK
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {"status": "ok", "created_quest": hero_quest_title, "id": result.get("id")}
            self.wfile.write(json.dumps(response).encode("utf-8"))

        except Exception as err:
            print(f"[Hermes] Error processing webhook: {err}")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(err)}).encode("utf-8"))

    def do_GET(self):
        # Health check endpoint
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write("Hermes Notion Webhook Receiver is Running!".encode("utf-8"))

def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, WebhookHandler)
    print(f"==================================================")
    print(f"🕷️  HERMES NOTION WEBHOOK LISTENER ACTIVE ON PORT {PORT}")
    print(f"   Endpoint URL: http://<UBUNTU_IP>:{PORT}/")
    print(f"==================================================")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
