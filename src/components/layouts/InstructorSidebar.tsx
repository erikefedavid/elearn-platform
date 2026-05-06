'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiBook, FiPlusCircle, FiUsers
} from 'react-icons/fi';

const instructorLinks = [
  { href: '/instructor/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/instructor/my-courses', label: 'My Courses', icon: FiBook },
  { href: '/instructor/courses/create', label: 'Create Course', icon: FiPlusCircle },
];

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card/90 backdrop-blur-xl border-r border-border/50 hidden lg:block overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Instructor Portal
        </h2>
        <nav className="space-y-1">
          {instructorLinks.map((link) => {
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

        {/* Teaching Stats */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-accent-500/10 to-primary-500/10 border border-accent-500/20">
          <div className="flex items-center gap-2 mb-2">
            <FiUsers className="w-4 h-4 text-accent-400" />
            <span className="text-xs font-semibold text-accent-400">Teaching Hub</span>
          </div>
          <p className="text-xs text-muted-foreground">Monitor student engagement and performance across your courses.</p>
          <Link
            href="/instructor/dashboard"
            className="mt-3 block text-center text-xs py-2 bg-accent-500/20 rounded-lg text-accent-300 hover:bg-accent-500/30 transition-colors"
          >
            View Analytics →
          </Link>
        </div>
      </div>
    </aside>
  );
}
