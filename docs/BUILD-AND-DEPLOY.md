# Learn English — Build & Deploy

App chạy trên **3 nền tảng**: Web, Android, iOS.

---

## 1. Web (PWA)

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend (terminal khác)
cd frontend && npm run dev
```

### Production build
```bash
cd frontend
npm run build
```

Output sẽ nằm trong `frontend/dist/`. Deploy thư mục này lên bất kỳ static hosting (Vercel, Netlify, VPS, v.v.).

### PWA
- App đã có sẵn PWA (manifest + service worker)
- User có thể "Add to Home Screen" trên mobile browser
- Offline: một số asset được cache

### Cấu hình API cho production
Tạo file `frontend/.env.production`:
```
VITE_API_URL=https://your-api-domain.com/api
```

Ví dụ: nếu backend chạy tại `https://api.learnenglish.com`, thì:
```
VITE_API_URL=https://api.learnenglish.com/api
```

---

## 2. Android

### Yêu cầu
- [Android Studio](https://developer.android.com/studio) (hoặc Android SDK)
- [Java JDK 17](https://adoptium.net/)

### Build
```bash
cd frontend

# 1. Cấu hình API URL (production)
echo "VITE_API_URL=https://your-api.com/api" > .env.production

# 2. Build và sync
npm run cap:sync

# 3. Mở Android Studio
npm run cap:android

# Hoặc chạy trực tiếp trên thiết bị/emulator
npm run cap:run:android
```

### Build APK/AAB
Trong Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)** hoặc **Build App Bundle** (cho Google Play).

---

## 3. iOS

### Yêu cầu
- **Mac** với [Xcode](https://developer.apple.com/xcode/)
- [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`)
- Apple Developer account (để build cho thiết bị thật)

### Build
```bash
cd frontend

# 1. Cấu hình API URL
echo "VITE_API_URL=https://your-api.com/api" > .env.production

# 2. Build và sync
npm run cap:sync

# 3. Cài CocoaPods dependencies (trên Mac)
cd ios/App && pod install && cd ../..

# 4. Mở Xcode
npm run cap:ios

# Hoặc chạy trên simulator
npm run cap:run:ios
```

Trong Xcode: chọn simulator/thiết bị → Run (⌘R).

### Build cho App Store
Trong Xcode: **Product → Archive** → Distribute App.

---

## 4. Cấu hình Backend

### CORS
Backend mặc định cho phép mọi origin. Khi deploy production, có thể giới hạn bằng biến môi trường `CORS_ORIGIN` (danh sách origin cách nhau bởi dấu phẩy).

### Uploads
Ảnh từ vựng được lưu tại `/uploads/`. Đảm bảo:
- Static hosting cho thư mục `uploads`
- Hoặc dùng CDN / cloud storage (S3, Cloudinary) cho production

---

## 5. Scripts

| Script | Mô tả |
|-------|-------|
| `npm run dev` | Chạy dev server (web) |
| `npm run build` | Build production |
| `npm run cap:sync` | Build + copy vào Android/iOS |
| `npm run cap:android` | Mở Android Studio |
| `npm run cap:ios` | Mở Xcode |
| `npm run cap:run:android` | Chạy trên Android |
| `npm run cap:run:ios` | Chạy trên iOS |

---

## 6. Lưu ý

- **API URL**: Trên mobile, cần cấu hình `VITE_API_URL` trỏ đến backend production. Không dùng `localhost`.
- **HTTPS**: Backend production nên dùng HTTPS để tránh lỗi mixed content.
- **Icons PWA**: Thay `vite.svg` bằng icon riêng trong `vite.config.js` khi publish.
