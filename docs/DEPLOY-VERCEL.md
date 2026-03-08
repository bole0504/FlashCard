# Deploy Learn English lên Vercel

App có **frontend** (React) và **backend** (Node.js + MongoDB). Vercel phù hợp cho frontend; backend cần host riêng.

---

## Tổng quan

| Thành phần | Nơi deploy | Gợi ý |
|------------|------------|-------|
| Frontend   | Vercel     | Static + SPA |
| Backend    | Render / Railway | Node.js + MongoDB Atlas |

---

## Bước 1: Deploy Backend (Render)

### 1.1. Chuẩn bị MongoDB Atlas
- Tạo cluster tại [cloud.mongodb.com](https://cloud.mongodb.com)
- Thêm IP `0.0.0.0/0` vào Network Access
- Lấy connection string (ví dụ: `mongodb+srv://user:pass@cluster.mongodb.net/learn-english`)

### 1.2. Deploy lên Render
1. Vào [render.com](https://render.com) → Sign up
2. **New → Web Service**
3. Kết nối repo GitHub `bole0504/FlashCard`
4. Cấu hình:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Environment**:
     - `MONGODB_URI` = connection string MongoDB
     - `JWT_SECRET` = chuỗi bí mật bất kỳ (ví dụ: `my-super-secret-key-123`)

5. Deploy → Render sẽ cho URL dạng `https://your-app.onrender.com`

### 1.3. Lưu ý Backend
- **Uploads**: Render dùng filesystem tạm, file upload có thể mất khi restart. Production nên dùng S3/Cloudinary.
- **Free tier**: Service sleep sau ~15 phút không có request.

---

## Bước 2: Deploy Frontend lên Vercel

### 2.1. Cấu hình Vercel
1. Vào [vercel.com](https://vercel.com) → Sign up (dùng GitHub)
2. **Add New Project** → Import repo `bole0504/FlashCard`
3. **Root Directory**: để mặc định (root) — file `vercel.json` ở root đã cấu hình build từ `frontend/`
4. Không cần chỉnh Build Command / Output Directory — đã có trong `vercel.json`

### 2.2. Environment Variables
Trong **Settings → Environment Variables**, thêm:

| Name           | Value                          | Môi trường |
|----------------|--------------------------------|------------|
| `VITE_API_URL` | `https://your-app.onrender.com/api` | Production |

Thay `your-app.onrender.com` bằng URL backend thực tế từ Render.

### 2.3. Deploy
- Bấm **Deploy**
- Vercel sẽ build và cho URL dạng `https://your-project.vercel.app`

---

## Bước 3: CORS

Backend mặc định cho phép mọi origin (`cors()`), nên frontend Vercel có thể gọi API mà không cần cấu hình thêm.

---

## Bước 4: Kiểm tra

1. Mở URL Vercel
2. Đăng ký / đăng nhập
3. Thử thêm từ vựng, ôn tập

---

## Tóm tắt URLs

Sau khi deploy:

- **Frontend**: `https://learn-english-xxx.vercel.app`
- **Backend API**: `https://learn-english-api.onrender.com`
- **MongoDB**: Atlas cluster

---

## Troubleshooting

### Lỗi CORS
- Kiểm tra `VITE_API_URL` đúng URL backend (có `/api` ở cuối)
- Backend cần `cors()` hoặc cấu hình `CORS_ORIGIN`

### Ảnh không hiển thị
- Backend trả về path `/uploads/xxx`
- Frontend dùng `resolveAssetUrl()` để ghép với base URL
- Đảm bảo `VITE_API_URL` = `https://your-backend.com/api` (không có `/api` trong base cho uploads – code đã xử lý)

### Backend sleep (Render free)
- Request đầu sau khi sleep có thể mất 30–60 giây
- Cân nhắc nâng cấp plan hoặc dùng Railway nếu cần luôn sẵn sàng
