'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layouts/Navbar';
import { User, Mail, Lock, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const INTERESTS = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cybersecurity', 'UI/UX Design', 'Cloud Computing', 'DevOps'];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student' as 'student' | 'instructor',
    interests: [] as string[], skillLevel: 'beginner' as string,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push(`/${data.data.role}/dashboard`);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-foreground">EduAdapt</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
            <p className="text-muted-foreground mt-2">Start your adaptive learning journey today</p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['student', 'instructor'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        form.role === role
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span className="block font-bold capitalize">{role}</span>
                      <span className="text-xs opacity-80 mt-1 block">{role === 'student' ? 'I want to learn' : 'I want to teach'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Your full name" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Min 6 characters" required minLength={6} />
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Skill Level</label>
                <select value={form.skillLevel} onChange={(e) => setForm({ ...form, skillLevel: e.target.value })} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground mb-3">Interests (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        form.interests.includes(interest)
                          ? 'bg-primary text-primary-foreground border shadow-sm shadow-primary/20 border-primary'
                          : 'bg-muted/50 text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-xl font-semibold mt-4">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5 ml-2" /></>}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
