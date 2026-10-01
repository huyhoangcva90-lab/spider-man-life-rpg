---
name: sync-notion
description: Tự động đồng bộ các nhiệm vụ (Master Calendar) và thói quen (Habits) từ Notion Workspace Zeus vào Spidey Life RPG.
---

# Skill: Đồng bộ Notion sang Spidey Life RPG

Kỹ năng này cho phép Agent tự động kết nối với Notion API và cập nhật dữ liệu đời thực vào game.

## Cách thực hiện:
Khi người dùng yêu cầu: "đồng bộ notion", "sync quest", "kéo nhiệm vụ từ notion", chạy lệnh:
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\huyklgl\Documents\antigravity\spider-man-life-rpg\tools\sync_notion_to_game.ps1"
```

## Sau khi đồng bộ thành công:
1. Thông báo số lượng Habits và Tasks vừa đồng bộ.
2. Liệt kê các thói quen hoặc nhiệm vụ nổi bật hôm nay (Today).
3. Hướng dẫn người dùng mở game hoặc chạy thử để nhận XP và kích hoạt đòn đánh của Spider-Man khi hoàn thành nhiệm vụ!
