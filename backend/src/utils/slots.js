import { getStreakBonus } from './streak.js';

const DAILY_BASE = 5;

export function getTodayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function resetDailyIfNeeded(user) {
  const today = getTodayUTC();
  if (user.lastResetDate !== today) {
    user.dailyAddCount = 0;
    user.unlockedSlots = 0;
    user.reviewPassCountToday = 0;
    user.lastResetDate = today;
    return true;
  }
  return false;
}

export function getAvailableSlots(user) {
  const streakBonus = getStreakBonus(user.streak || 0);
  const total = DAILY_BASE + (user.unlockedSlots || 0) + streakBonus;
  const used = user.dailyAddCount || 0;
  const available = Math.max(0, total - used);
  return { available, total, used, streakBonus };
}

export function getUnlockAmount(reviewPassCountToday) {
  if (reviewPassCountToday === 0) return 3;
  return 1;
}
