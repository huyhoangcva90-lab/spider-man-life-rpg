---
name: pixel-art-pipeline
description: Hướng dẫn tạo, chuyển đổi ảnh thường thành Pixel Art, tối ưu hóa sprite sheet và khai thác kho tài nguyên CC0 không lo bản quyền.
---

# Pixel Art Asset Pipeline Skill

## 1. Thuật Toán Chuyển Ảnh Sang Pixel Art (Client-side HTML5 Canvas)
Để chuyển bất kỳ ảnh nào sang phong cách Pixel Art không bị nhòe:
1. Vẽ ảnh gốc vào canvas nhỏ (ví dụ 64x64px hoặc 128x128px):
   ```javascript
   const offCanvas = document.createElement('canvas');
   offCanvas.width = 64;
   offCanvas.height = 64;
   const offCtx = offCanvas.getContext('2d');
   offCtx.drawImage(sourceImage, 0, 0, 64, 64);
   ```
2. Phóng to lên canvas chính với thuộc tính:
   ```javascript
   mainCtx.imageSmoothingEnabled = false; // Chặn khử răng cưa để giữ viền pixel sắc nét
   mainCtx.drawImage(offCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
   ```
3. CSS hiển thị:
   ```css
   canvas, img.pixel-art {
     image-rendering: pixelated;
     image-rendering: crisp-edges;
   }
   ```

## 2. Nguồn Asset Pixel Art Miễn Phí Bản Quyền (CC0 Public Domain)
- **Kenney.nl**: Dùng cho nhân vật, UI icons, tileset đường phố.
- **OpenGameArt.org** (Lọc License: CC0): Dùng cho hiệu ứng nổ, chiêu thức, âm thanh retro.
- **PixelLab.ai / Pixler.dev**: Dùng AI tạo nhân vật pixel mới với nền trong suốt (transparent PNG).
