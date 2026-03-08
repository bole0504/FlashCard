# Agent Instructions - Learn English

Khi làm việc với project này, hãy đọc **PROJECT_CONTEXT.md** để có đầy đủ thông tin.

## Quick Reference

- **Backend**: `backend/` - Express + MongoDB
- **API base**: `http://localhost:5000`
- **Auth**: JWT, header `Authorization: Bearer <token>`
- **Vocabulary**: CRUD + image upload (form-data)

## Khi thêm tính năng mới
1. Tham khảo cấu trúc hiện tại trong `backend/src/`
2. Model mới → `models/`, controller → `controllers/`, route → `routes/`
3. Protected route: thêm `protect` middleware từ `middleware/auth.js`
