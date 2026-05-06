// ==========================================
// Analytics Calculation Helpers
// ==========================================
// All formulas from PRD Section 11

// Engagement Rate = (Active Students / Enrolled Students) × 100
export function calcEngagementRate(activeStudents: number, enrolledStudents: number): number {
  if (enrolledStudents === 0) return 0;
  return Math.round((activeStudents / enrolledStudents) * 100);
}

// Completion Rate = (Students Who Finished / Total Enrolled) × 100
export function calcCompletionRate(completedStudents: number, totalEnrolled: number): number {
  if (totalEnrolled === 0) return 0;
  return Math.round((completedStudents / totalEnrolled) * 100);
}

// Average Quiz Score = Sum of all scores / Number of attempts
export function calcAvgQuizScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

// Retention Rate = (Returning Users / Total Users) × 100
export function calcRetentionRate(returningUsers: number, totalUsers: number): number {
  if (totalUsers === 0) return 0;
  return Math.round((returningUsers / totalUsers) * 100);
}

// Performance Improvement = ((Post-test - Pre-test) / Pre-test) × 100
export function calcPerformanceImprovement(preScore: number, postScore: number): number {
  if (preScore === 0) return 0;
  return Math.round(((postScore - preScore) / preScore) * 100);
}

// Check if student is at-risk: score < 50 AND attemptNumber >= 2
export function isAtRisk(score: number, attemptNumber: number): boolean {
  return score < 50 && attemptNumber >= 2;
}

// Check if student is inactive (7+ days since last activity)
export function isInactive(lastActiveDate: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - lastActiveDate.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 7;
}

// Calculate streak from consecutive days
export function calculateStreak(lastActiveDate: Date, currentStreak: number): number {
  const now = new Date();
  const diffHours = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
  
  // If last active within 24 hours, maintain streak
  if (diffHours <= 24) {
    return currentStreak;
  }
  // If last active between 24-48 hours, increment
  if (diffHours <= 48) {
    return currentStreak + 1;
  }
  // Otherwise reset streak
  return 1;
}
