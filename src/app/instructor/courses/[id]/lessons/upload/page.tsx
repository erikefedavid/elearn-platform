'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

interface QuizQuestion { question: string; options: string[]; correct: number; }

export default function UploadLessonPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [form, setForm] = useState({ title: '', type: 'video' as string, contentUrl: '', duration: '' });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function addQuestion() {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  }

  function updateQuestion(idx: number, field: string, value: string | number) {
    const updated = [...questions];
    if (field === 'question') updated[idx].question = value as string;
    else if (field === 'correct') updated[idx].correct = value as number;
    setQuestions(updated);
  }

  function updateOption(qIdx: number, oIdx: number, value: string) {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  }

  function removeQuestion(idx: number) {
    setQuestions(questions.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          title: form.title,
          type: form.type,
          contentUrl: form.contentUrl,
          duration: form.duration ? parseInt(form.duration) : undefined,
          quizQuestions: questions.length > 0 ? questions : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ title: '', type: 'video', contentUrl: '', duration: '' });
        setQuestions([]);
        alert('Lesson created successfully!');
      } else {
        setError(data.error || 'Failed to create lesson');
      }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Lesson</h1>
        <p className="text-muted-foreground mt-1">Add content and quiz questions to your course</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Lesson Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Content Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              {form.type === 'text' ? 'Text Content (HTML allowed)' : 'Content URL (Cloudinary/YouTube/etc)'}
            </label>
            {form.type === 'text' ? (
              <textarea value={form.contentUrl} onChange={(e) => setForm({ ...form, contentUrl: e.target.value })} className="input-field min-h-[150px] resize-y" required />
            ) : (
              <input type="text" value={form.contentUrl} onChange={(e) => setForm({ ...form, contentUrl: e.target.value })} className="input-field" placeholder="https://..." required />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Duration (minutes, optional)</label>
            <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field w-32" min="0" />
          </div>

          {/* Quiz Questions */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quiz Questions (optional)</h3>
              <button type="button" onClick={addQuestion} className="btn-secondary text-sm py-2 flex items-center gap-1">
                <FiPlus className="w-4 h-4" /> Add Question
              </button>
            </div>

            {questions.map((q, qi) => (
              <div key={qi} className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-primary-400">Question {qi + 1}</span>
                  <button type="button" onClick={() => removeQuestion(qi)} className="text-danger hover:text-red-400">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <input type="text" value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                  className="input-field mb-3" placeholder="Enter question..." />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oi) => (
                    <input key={oi} type="text" value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                      className="input-field text-sm" placeholder={`Option ${oi + 1}`} />
                  ))}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Correct answer:</label>
                  <select value={q.correct} onChange={(e) => updateQuestion(qi, 'correct', parseInt(e.target.value))} className="input-field w-32 ml-2 text-sm">
                    {q.options.map((_, oi) => <option key={oi} value={oi}>Option {oi + 1}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave className="w-4 h-4" /> Create Lesson</>}
          </button>
        </form>
      </div>
    </div>
  );
}
