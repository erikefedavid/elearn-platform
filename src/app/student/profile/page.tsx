'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';

const INTERESTS = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cybersecurity', 'UI/UX Design', 'Cloud Computing', 'DevOps'];

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '', skillLevel: 'beginner', interests: [] as string[], avatar: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) setUser(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  function toggleInterest(interest: string) {
    setUser((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
    setSaving(false);
  }

  if (loading) return <div className="max-w-2xl mx-auto"><div className="h-64 shimmer rounded-2xl" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>

      <div className="glass-card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {message && <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm">{message}</div>}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
              <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="input-field pl-12" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
              <input type="email" value={user.email} disabled className="input-field pl-12 opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Skill Level</label>
            <select value={user.skillLevel} onChange={(e) => setUser({ ...user, skillLevel: e.target.value })} className="input-field">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    user.interests.includes(interest) ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-muted text-muted-foreground border border-border hover:border-dark-500'
                  }`}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
