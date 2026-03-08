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
| **Streak (chuỗi ngày)** | Đếm số ngày liên tiếp có thêm từ mới hoặc ôn tập. Streak càng dài → badge, bonus lượt thêm từ. |
| **So sánh với bạn bè** | Hiển thị vị trí của user so với bạn bè trong danh sách bạn bè (theo level, số từ, streak). |
| **Challenge** | Thách bạn bè: "Ai thêm được 10 từ mới trong 3 ngày?" |
| **Ranking theo level** | Hiển thị vị trí của user trong toàn bộ app (theo level). |
| **Login with Facebook** | Cho phép user tạo account bằng fb account điều này giúp chúng ta dễ kết nối với bạn bè hơn. |
---

## 2. Ôn tập & Học tập

| Ý tưởng | Mô tả |
|---------|-------|
| **Spaced repetition** | Từ chưa thuộc xuất hiện nhiều hơn trong ôn tập. |
| **Chọn độ khó** | User chọn độ khó (dễ/trung bình/khó) → số lượng từ và thời gian ôn tập khác nhau. |
| **Ôn tập nhanh** | Chế độ ngắn: 3 flashcards thay vì 5, để nhanh có thêm lượt. |
| **Ôn tập nâng cao** | Chế độ khó: nhập cả nghĩa + ví dụ. Thưởng nhiều lượt hơn. |
| **Lịch sử ôn tập** | Thống kê từ đã ôn, tỷ lệ đúng, từ đã thuộc. |

---

## 3. Phần thưởng & Cảm giác tiến bộ

| Ý tưởng | Mô tả |
|---------|-------|
| **Achievement badges** | Ví dụ: "100 từ mới", "7 ngày streak", "5/5 ôn tập 10 lần", "Level 5". |
| **Milestone** | Thông báo khi đạt mốc (50, 100, 500 từ). |
| **Bonus lượt** | Streak 7 ngày → +1 lượt thêm từ. |
| **Daily bonus** | Đăng nhập vào khung giờ vàng → +1 lượt. |
| **Level tree** | Hiển thị cây tiến bộ theo level. |

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
| **Combo** | Trả lời đúng liên tiếp → combo. Combo cao → bonus điểm. |
| **Time pressure** | Thời gian giới hạn cho mỗi ôn tập (tùy chọn). |
| **Lives** | Thay vì 5/5, có thể dùng 3 lives: sai 1 lần mất 1 life. |
| **Power-ups** | Ví dụ: "Skip 1 từ", "Gợi ý chữ cái đầu" (dùng sau khi ôn tập). |
| **Season** | Mùa giải mỗi 3 tháng, reset leaderboard, có badge mùa. |

---

## 6. Roadmap — Thứ tự implement

### Phase 1 (MVP)

- [ ] Daily limit 5 từ + reset mỗi ngày
- [ ] Review flow: ảnh → input → verify, 5/5 để pass
- [ ] Unlock: 3 → 1 → 1 → 1…
- [ ] Animation flashcard

### Phase 2

- [ ] Streak
- [ ] Leaderboard
- [ ] Achievement badges

### Phase 3

- [ ] Spaced repetition
- [ ] So sánh với bạn bè
- [ ] Challenge

### Phase 4

- [ ] Season
- [ ] Power-ups
- [ ] Sound

---

## 7. Lưu ý kỹ thuật

1. **Tránh quá khó**: 5/5 có thể khó khi từ vựng nhiều. Cân nhắc: 4/5 pass hoặc 5 câu nhưng cho phép sai 1 lần.
2. **Thời gian reset**: Nên rõ ràng (ví dụ: 00:00 theo múi giờ của user).
3. **Lưu trữ**: Cần lưu: lượt thêm trong ngày, ngày reset, lượt unlock sau mỗi lần ôn tập, lịch sử ôn tập.

---

## 8. Data model cần thêm (dự kiến)

- **User**: `dailyAddCount`, `lastResetDate`, `unlockedSlots`, `streak`, `lastActiveDate`
- **ReviewSession**: `userId`, `vocabularyIds`, `results`, `passed`, `createdAt`
- **Achievement**: `userId`, `type`, `progress`, `unlockedAt`



## 9. Feature work
   Cạnh tranh & Social