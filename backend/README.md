# Learn English - Backend API

## Setup

1. **Cài đặt dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Tạo file `.env`** (copy từ `.env.example`)
   ```bash
   cp .env.example .env
   ```
   Chỉnh sửa `.env`:
   - `MONGODB_URI`: URL MongoDB (local hoặc Atlas)
   - `JWT_SECRET`: Chuỗi bí mật cho JWT (đổi trong production)

3. **Chạy MongoDB** (nếu dùng local)
   ```bash
   mongod
   ```
   Hoặc dùng [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier).

4. **Chạy server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
| Method | Endpoint | Body | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/register` | `{ name, email, password }` | Đăng ký |
| POST | `/api/auth/login` | `{ email, password }` | Đăng nhập |

### Vocabulary (cần token `Authorization: Bearer <token>`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/vocabulary` | Danh sách từ (query: `?search=`, `?tag=`) |
| GET | `/api/vocabulary/:id` | Chi tiết 1 từ |
| POST | `/api/vocabulary` | Thêm từ (form-data: word, meaning, pronunciation, example, tags, image) |
| PUT | `/api/vocabulary/:id` | Cập nhật từ |
| DELETE | `/api/vocabulary/:id` | Xóa từ |

### Health
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server |

## Test với Postman/Thunder Client

1. **Register**: POST `http://localhost:5000/api/auth/register`  
   Body (JSON): `{ "name": "Test", "email": "test@test.com", "password": "123456" }`

2. **Login**: POST `http://localhost:5000/api/auth/login`  
   Body (JSON): `{ "email": "test@test.com", "password": "123456" }`  
   Copy `token` từ response.

3. **Thêm từ vựng**: POST `http://localhost:5000/api/vocabulary`  
   Headers: `Authorization: Bearer <token>`  
   Body: form-data với `word`, `meaning`, và tùy chọn `image` (file)
