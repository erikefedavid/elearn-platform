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
  // Student has failed this quiz twice or more — flag as at-risk
  if (score < 50 && attemptNumber >= 2) {
    return {
      status: 'at-risk',
      message: "You've struggled with this topic twice. Your instructor has been notified.",
      nextAction: 'review-material',
    };
  }

  // First failure — encourage retry
  if (score < 50) {
    return {
      status: 'needs-review',
      message: 'Not quite there yet. Review the lesson material and try again.',
      nextAction: 'retry',
    };
  }

  // Passed but needs reinforcement
  if (score >= 50 && score < 75) {
    return {
      status: 'reinforce',
      message: 'Good effort! You can proceed but consider reviewing this topic later.',
      nextAction: 'next-lesson',
    };
  }

  // Mastered the topic
  return {
    status: 'advance',
    message: 'Excellent! You\'ve mastered this topic. Moving to the next lesson.',
    nextAction: 'next-lesson',
  };
}
