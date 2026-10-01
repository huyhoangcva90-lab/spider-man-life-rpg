---
name: vercel-deploy
description: Hướng dẫn đóng gói, deploy dự án lên Vercel, cấu hình serverless proxy cho Notion API và thiết lập tên miền riêng.
---

# Vercel Deployment & Custom Domain Skill

## 1. Cấu Trúc Deploy Chuẩn Cho Web Game Vanilla JS
- **Root Directory**: `./`
- **Output**: Static files (`index.html`, `js/`, `css/`, `assets/`, `data/`)
- **Serverless API**: `api/notion.js` (tự động được Vercel nhận diện làm endpoint `/api/notion`).

## 2. Serverless Function Proxy Cho Notion (`api/notion.js`)
Tránh lỗi CORS và giấu Token Notion an toàn:
```javascript
export default async function handler(req, res) {
  const token = process.env.NOTION_API_KEY;
  if (!token) return res.status(500).json({ error: 'Missing NOTION_API_KEY' });

  const { path } = req.query;
  const notionUrl = `https://api.notion.com${path || '/v1/search'}`;

  const response = await fetch(notionUrl, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
```

## 3. Cấu Hình Tên Miền Riêng (DNS Setup)
- Root domain (`yourdomain.com`): Bản ghi `A` trỏ về `76.76.21.21`.
- Subdomain (`game.yourdomain.com`): Bản ghi `CNAME` trỏ về `cname.vercel-dns.com`.
