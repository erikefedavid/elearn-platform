'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiBook, FiTarget, FiUser, FiBarChart2, FiAward
} from 'react-icons/fi';

const studentLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/student/my-courses', label: 'My Courses', icon: FiBook },
  { href: '/student/learning-path', label: 'Learning Path', icon: FiTarget },
  { href: '/student/profile', label: 'Profile', icon: FiUser },
  { href: '/student/certificates', label: 'Certificates', icon: FiAward },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card/90 backdrop-blur-xl border-r border-border/50 hidden lg:block overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Student Portal
        </h2>
        <nav className="space-y-1">
          {studentLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
          <div className="flex items-center gap-2 mb-2">
            <FiBarChart2 className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400">Quick Stats</span>
          </div>
          <p className="text-xs text-muted-foreground">Track your progress and keep your learning streak going!</p>
          <Link
            href="/student/dashboard"
            className="mt-3 block text-center text-xs py-2 bg-primary-500/20 rounded-lg text-primary-300 hover:bg-primary-500/30 transition-colors"
          >
            View Progress →
          </Link>
        </div>
      </div>
    </aside>
  );
}
