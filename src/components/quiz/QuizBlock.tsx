'use client';

import { useState } from 'react';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

interface Question {
  question: string;
  options: string[];
}

interface QuizBlockProps {
  questions: Question[];
  onSubmit: (answers: number[]) => void;
  loading?: boolean;
}

export default function QuizBlock({ questions, onSubmit, loading = false }: QuizBlockProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [currentQ, setCurrentQ] = useState(0);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((a) => a !== -1);
  const answeredCount = answers.filter((a) => a !== -1).length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-primary-400">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        {/* Question dots */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                i === currentQ
                  ? 'bg-primary-500 text-white'
                  : answers[i] !== -1
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-muted text-muted-foreground hover:bg-dark-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="badge badge-info">Question {currentQ + 1} of {questions.length}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-6">{questions[currentQ].question}</h3>
        <div className="space-y-3">
          {questions[currentQ].options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                answers[currentQ] === i
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-border bg-muted/50 text-muted-foreground hover:border-dark-500 hover:bg-muted/50'
              }`}
            >
              {answers[currentQ] === i ? (
                <FiCheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
              ) : (
                <FiCircle className="w-5 h-5 text-muted-foreground/80 flex-shrink-0" />
              )}
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="btn-primary text-sm"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            disabled={!allAnswered || loading}
            className="btn-accent text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Quiz'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
