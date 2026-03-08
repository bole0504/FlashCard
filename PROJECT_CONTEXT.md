# Learn English - Project Context

> Tài liệu context cho AI agents. Đọc file này để hiểu và làm việc với project.

## 1. Tổng quan

**Mục đích**: Website tự học tiếng Anh cá nhân.

**Mục tiêu chính**:
- Ghi lại từ vựng (kèm ảnh kiểu flashcard)
- Dùng từ vựng mới viết thành câu (tính năng sẽ triển khai)

**Đối tượng**: Ứng dụng cá nhân, chưa cần tối ưu hiệu năng.

---

## 2. Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT + bcrypt |
| **Validation** | express-validator |
| **Upload ảnh** | Multer (local storage) |
| **Frontend** (kế hoạch) | React, Vite, MUI, TanStack Query, Axios |

---

## 3. Cấu trúc Project

```
learn-english/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── config/         # db.js, multer.js
│   │   ├── models/         # User, Vocabulary
│   │   ├── middleware/     # auth.js (JWT protect)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/            # Ảnh upload (tự tạo khi chạy)
│   └── .env
├── frontend/               # (chưa tạo) React app
└── PROJECT_CONTEXT.md      # File này
```

---

## 4. Data Models

### User
```javascript
{ name, email, password(hashed), timestamps }
// password: select: false, min 6 chars
```

### Vocabulary
```javascript
{
  userId: ObjectId (ref User),
  word: String (required),
  meaning: String (required),
  pronunciation: String,
  example: String,
  image: String | null,     // path: /uploads/filename
  tags: [String],
  timestamps
}
// Unique index: userId + word
```

---

## 5. API Reference

**Base URL**: `http://localhost:5000` (mặc định)

### Auth (public)
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

**Response**: `{ _id, name, email, token }`

### Vocabulary (protected - cần `Authorization: Bearer <token>`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/vocabulary` | List. Query: `?search=`, `?tag=` |
| GET | `/api/vocabulary/:id` | Chi tiết |
| POST | `/api/vocabulary` | Thêm. Body: form-data (word, meaning, pronunciation?, example?, tags?, image?) |
| PUT | `/api/vocabulary/:id` | Cập nhật. Body: form-data |
| DELETE | `/api/vocabulary/:id` | Xóa |

**Ảnh**: Upload qua form-data field `image`. Max 5MB. Format: jpeg, jpg, png, gif, webp. URL: `/uploads/<filename>`.

---

## 6. Conventions

- **Backend**: ES modules (`"type": "module"`), `import/export`
- **API**: REST, JSON body (trừ upload dùng form-data)
- **Error**: `{ message: string }` hoặc `{ errors: [...] }` (validation)
- **Auth**: JWT trong header `Authorization: Bearer <token>`, expires 30d

---

## 7. Chạy Backend

```bash
cd backend
cp .env.example .env   # Sửa MONGODB_URI, JWT_SECRET
npm install
npm run dev
```

Cần MongoDB chạy (local hoặc Atlas).

---

## 8. Tính năng đã có / Kế hoạch

| Tính năng | Trạng thái |
|-----------|------------|
| Đăng ký, đăng nhập | ✅ |
| CRUD từ vựng + ảnh | ✅ |
| Frontend Login/Register | ✅ |
| Viết câu với từ vựng | 📋 Kế hoạch |
| Flashcard / Quiz | 📋 Kế hoạch |
| Thống kê | 📋 Kế hoạch |

---

## 9. Lưu ý cho Agents

- Backend dùng cấu trúc đơn giản, không over-engineer
- FE sẽ dùng: protected routes, Axios interceptor gắn token
- Khi thêm model/API mới: giữ pattern hiện tại (controller → route → middleware)
