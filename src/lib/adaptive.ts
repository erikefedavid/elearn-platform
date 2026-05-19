// ==========================================
// Adaptive Learning Engine — Rule-Based
// ==========================================
// This is the core algorithm that makes the platform 'smart'.
// It runs every time a student submits a quiz.
// Pure if/else logic — no AI/ML library needed.

import { AdaptiveResult } from '@/types';

export function runAdaptiveEngine(
  score: number,
  attemptNumber: number
): AdaptiveResult {
  // Score < 50 triggers remedial content
  if (score < 50) {
    return {
      status: attemptNumber >= 2 ? 'at-risk' : 'needs-review',
      message: "Score below 50%. You must complete the remedial material before advancing.",
      nextAction: 'review-material',
    };
  }

  // Score 50 - 69 retains with supplementary hints but allows progression
  if (score >= 50 && score < 70) {
    return {
      status: 'reinforce',
      message: 'Good effort, but there is room for improvement. Here is a supplementary hint: Review the core concepts again.',
      nextAction: 'next-lesson',
    };
  }

  // Score >= 70 advances the learner directly
  return {
    status: 'advance',
    message: 'Excellent! You scored above 70%. Moving to the next module.',
    nextAction: 'next-lesson',
  };
}
