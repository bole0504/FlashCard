# Learn English — Features & Roadmap

> Tài liệu tổng hợp các tính năng và ý tưởng để phát triển app. Cập nhật: 2025-02-24

---

## Core Mechanics (Đã define)

### Add new vocabulary — Giới hạn & thử thách

- **Daily limit**: Mỗi ngày được add 5 từ mới → reset sau mỗi ngày
- **Review để unlock**: Khi hết 5 lượt, user phải ôn tập (hoàn thành mới được add tiếp)
- **Progressive unlock sau mỗi lần ôn tập**:
  - Lần 1: +3 lượt thêm mới
  - Lần 2: +1 lượt
  - Lần 3, 4, … n: +1 lượt mỗi lần

### Ôn tập (Review)

- **Flow**: 1 ảnh từ vựng xuất hiện (có animation) → input nhập từ → bấm Verify → kiểm tra kết quả
- **Session**: Mỗi lần ôn tập = 5 flashcards, phải đúng 5/5 mới pass
- **Phần thưởng**: Pass = unlock thêm lượt add từ (theo quy tắc trên)

---

## 1. Cạnh tranh & Social

| Ý tưởng | Mô tả |
|---------|-------|
| **Leaderboard theo tuần/tháng** | Bảng xếp hạng theo số từ mới thêm trong tuần/tháng. Reset định kỳ để mọi người có cơ hội lên top. |
| **Streak (chuỗi ngày)** | logic steak như sau  >=3 --> +1 lượt, >=4  --> + 2, >=5 +3, >=6  --->+ 4, >=7 ---> +5  . |
| **So sánh với bạn bè** | Hiển thị vị trí của user so với bạn bè trong danh sách bạn bè (theo level, số từ, streak). |

---

## 2. Ôn tập & Học tập

| Ý tưởng | Mô tả |
|---------|-------|
| **Spaced repetition** | Từ chưa thuộc xuất hiện nhiều hơn trong ôn tập. |
| **Thời gian cho mỗi từ** | 20s. |
| **Lịch sử ôn tập** | Thống kê từ đã ôn, tỷ lệ đúng, từ đã thuộc. |

---

## 3. Phần thưởng & Cảm giác tiến bộ

| Ý tưởng | Mô tả |
|---------|-------|
| **Milestone** | Thông báo khi lên lớp, khi user add đủ số từ để lên level cần có 1 animation để chúc mừng |

---

## 4. Trải nghiệm người dùng

| Ý tưởng | Mô tả |
|---------|-------|
| **Animation flashcard** | Flip, fade, scale khi chuyển sang từ mới. |
| **Sound** | Âm thanh khi đúng/sai, khi pass. |
| **Haptic feedback** | Rung nhẹ khi đúng/sai (trên mobile). |
| **Confetti** | Hiệu ứng khi pass 5/5. |
| **Progress bar** | Thanh tiến trình 5/5 trong phiên ôn tập. |

---

## 5. Cơ chế game

| Ý tưởng | Mô tả |
|---------|-------|
| **Time pressure** | Thời gian giới hạn cho mỗi ôn tập (tùy chọn)   20s cho mỗi từ. |
| **Power-ups** | Ví dụ: "Gợi ý chữ cái đầu" (dùng sau khi ôn tập). |

---
