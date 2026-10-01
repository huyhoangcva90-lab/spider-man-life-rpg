---
name: web-game-design
description: Kỹ năng thiết kế và tối ưu trải nghiệm Web Game 2D, Action-RPG, Game Feel (Juice, Screen Shake, Comic VFX, Sprite Animation) và cân bằng chiến đấu.
---

# Web Game Design & Game Feel Skill

Kỹ năng này hướng dẫn Agent cách xây dựng, tinh chỉnh và nâng cấp các cơ chế game web 2D, đặc biệt là thể loại Action-RPG / Gamification.

## 1. Nguyên Tắc "Game Feel" (Tạo độ đã tay, cuốn hút)
- **Hitstop (Độ trễ va chạm)**: Khi đòn đánh chí mạng hoặc Finisher trúng đích, tạm dừng chuyển động trong 60-100ms trước khi kẻ thù bật lùi để tạo cảm giác lực đòn nặng.
- **Screen Shake (Rung chấn màn hình)**:
  - Rung nhẹ (`2-4px`) cho các đòn thường (Web Shot, Basic Combo).
  - Rung mạnh (`8-12px`) kèm hiệu ứng chớp sáng cho Finisher hoặc đòn Boss.
- **Comic Book VFX (Hiệu ứng truyện tranh)**:
  - Hiển thị chữ SFX phong cách Marvel (`THWIP!`, `POW!`, `BAM!`, `KRAK!`) tại đúng tọa độ va chạm.
  - Chuyển động nảy (Scale up 1.2x -> Fade out).

## 2. Quản Lý Sprite & Hoạt Ảnh Nhân Vật
- Sử dụng CSS Sprite Sheet kết hợp `steps()` hoặc Canvas `drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)`.
- Luôn đặt `image-rendering: pixelated;` để sprite sắc nét ở mọi độ phân giải.
- 17 trạng thái tiêu chuẩn: `idle`, `run`, `jump`, `attack-combo`, `web-shot`, `impact-web`, `ally-call`, `stagger`, `hurt`, `victory`...

## 3. Cân Bằng Chiến Đấu (Combat Balancing)
- **Stagger Meter**: Kẻ thù có thanh giáp Stagger (100%). Khi bị tấn công liên tục, thanh Stagger đầy sẽ đưa quái vào trạng thái choáng (Stun) và mở khóa `FINISHER`.
- **Hệ số Thưởng Kỷ Luật Thực**:
  - Nhiệm vụ thực tế mức độ khó cao (`Deep work`) phải cho lượng sát thương và Stagger tương xứng (x1.5 - x2.0).
