/**
 * Grade levels 1-12 based on vocabulary count
 * Formula: threshold(n) = 20 × 2^(n-1)
 */

export const GRADE_THRESHOLDS = [
  20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480,
];

export const GRADE_GROUPS = {
  primary: { grades: [1, 2, 3, 4, 5], label: 'Primary', color: '#22C55E' },
  middle: { grades: [6, 7, 8], label: 'Middle', color: '#F59E0B' },
  high: { grades: [9, 10, 11, 12], label: 'High', color: '#EC4899' },
};

export function getGradeFromWordCount(count) {
  if (count < 0) return 1;
  for (let i = 0; i < GRADE_THRESHOLDS.length; i++) {
    if (count < GRADE_THRESHOLDS[i]) return i + 1;
  }
  return 12;
}

export function getGradeInfo(grade) {
  const min = grade === 1 ? 0 : GRADE_THRESHOLDS[grade - 2];
  const max = grade === 12 ? null : GRADE_THRESHOLDS[grade - 1] - 1;
  let group = 'primary';
  if (GRADE_GROUPS.middle.grades.includes(grade)) group = 'middle';
  else if (GRADE_GROUPS.high.grades.includes(grade)) group = 'high';
  return {
    grade,
    minWords: min,
    maxWords: max,
    group,
    label: GRADE_GROUPS[group].label,
    color: GRADE_GROUPS[group].color,
  };
}

/**
 * Get progress to next level (0-1). For grade 12, returns 1.
 */
export function getProgressToNextLevel(count) {
  const grade = getGradeFromWordCount(count);
  if (grade === 12) return { grade, progress: 1, current: count, nextThreshold: null };

  const currentMin = grade === 1 ? 0 : GRADE_THRESHOLDS[grade - 2];
  const nextThreshold = GRADE_THRESHOLDS[grade - 1];
  const progress = (count - currentMin) / (nextThreshold - currentMin);

  return {
    grade,
    progress: Math.min(progress, 1),
    current: count,
    nextThreshold,
    wordsNeeded: nextThreshold - count,
  };
}
