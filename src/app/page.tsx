'use client';

import Link from 'next/link';
import Navbar from '@/components/layouts/Navbar';
import { BookOpen, Users, BarChart2, Zap, ArrowRight, Play, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const features = [
    { icon: BookOpen, title: 'Rich Course Content', desc: 'Video lessons, PDF materials, and interactive text content for every learning style.', color: 'bg-primary/20 text-primary' },
    { icon: Zap, title: 'Adaptive Learning', desc: 'Smart engine adjusts difficulty and recommendations based on your quiz performance.', color: 'bg-emerald-500/20 text-emerald-500' },
    { icon: BarChart2, title: 'Learning Analytics', desc: 'Track your progress with detailed charts, streaks, and performance insights.', color: 'bg-blue-500/20 text-blue-500' },
    { icon: Users, title: 'Instructor Tools', desc: 'Create courses, monitor engagement, and identify at-risk students instantly.', color: 'bg-orange-500/20 text-orange-500' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Secure dashboards for Students, Instructors, and Admins with proper access control.', color: 'bg-destructive/20 text-destructive' },
    { icon: Award, title: 'Achievement System', desc: 'Earn streaks, badges, and completion certificates as you progress through courses.', color: 'bg-purple-500/20 text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <Zap className="w-4 h-4" />
              Adaptive E-Learning Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-foreground animate-in slide-in-from-bottom-6 duration-700 fade-in delay-150 fill-mode-both">
              Learn Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">EduAdapt</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300 fill-mode-both">
              An intelligent e-learning platform that adapts to your pace, personalizes your path, and tracks your progress — all in one clean interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-10 duration-700 fade-in delay-500 fill-mode-both">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full hover:bg-muted transition-all">
                  <Play className="w-5 h-5 mr-2" /> Browse Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Dashboard Image Animation */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/20 animate-float bg-card">
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none z-10" />
              <img 
                src="/hero-mockup.png" 
                alt="EduAdapt Platform Dashboard Mockup" 
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            {/* Glowing Reflection underneath */}
            <div className="absolute -bottom-10 left-10 right-10 h-20 bg-primary/30 blur-[60px] -z-10 rounded-full" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-1000 fill-mode-both">
            {[
              { label: 'Active Students', value: '2,500+' },
              { label: 'Courses', value: '150+' },
              { label: 'Instructors', value: '50+' },
              { label: 'Completion Rate', value: '89%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Everything You Need to <span className="text-primary">Excel</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for modern education. Powerful features bundled in a simple, intuitive interface.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                  <feature.icon className="w-48 h-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to start your learning journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />
            
            {[
              { step: '01', title: 'Sign Up & Choose', desc: 'Create your account, select your interests, and browse the modern course catalogue.' },
              { step: '02', title: 'Learn & Practice', desc: 'Watch videos, read materials, and take quizzes. The platform adapts to your pace.' },
              { step: '03', title: 'Track & Grow', desc: 'Monitor your progress, maintain streaks, and receive personalized recommendations.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center p-8 bg-background rounded-3xl border border-border shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-2xl mb-6 shadow-sm border border-primary/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to Start Learning?
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students and instructors on EduAdapt. It&apos;s free to get started.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg h-14 px-10 rounded-full hover:scale-105 transition-transform shadow-xl text-primary">
              Create Your Account <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">EduAdapt</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 EduAdapt. Built for Lead City University. BSc Final Year Project.
          </p>
        </div>
      </footer>
    </div>
  );
}
