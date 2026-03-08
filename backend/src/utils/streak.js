export function getTodayUTC() {
  return new Date().toISOString().slice(0, 10);
}

export function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = typeof dateStr === 'string' ? dateStr : dateStr.toISOString?.().slice(0, 10);
  return d || null;
}

/**
 * Get streak bonus slots: >=3 → +1, >=4 → +2, >=5 → +3, >=6 → +4, >=7 → +5
 */
export function getStreakBonus(streak) {
  if (!streak || streak < 3) return 0;
  if (streak >= 7) return 5;
  if (streak >= 6) return 4;
  if (streak >= 5) return 3;
  if (streak >= 4) return 2;
  return 1;
}

/**
 * Update user streak when activity (add vocab or complete review).
 * @param {Object} user - Mongoose user document
 * @returns {boolean} - true if streak was updated
 */
export function updateStreak(user) {
  const today = getTodayUTC();
  const lastDate = parseDate(user.lastActiveDate);

  if (!lastDate) {
    user.streak = 1;
    user.lastActiveDate = today;
    return true;
  }

  if (lastDate === today) {
    return false; // already counted today
  }

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (lastDate === yesterdayStr) {
    user.streak = (user.streak || 0) + 1;
    user.lastActiveDate = today;
    return true;
  }

  // Gap: streak broken
  user.streak = 1;
  user.lastActiveDate = today;
  return true;
}
