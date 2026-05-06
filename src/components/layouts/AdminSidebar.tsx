'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiUsers, FiBook, FiShield
} from 'react-icons/fi';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/users', label: 'Manage Users', icon: FiUsers },
  { href: '/admin/courses', label: 'Manage Courses', icon: FiBook },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card/90 backdrop-blur-xl border-r border-border/50 hidden lg:block overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <FiShield className="w-4 h-4 text-danger" />
          Admin Panel
        </h2>
        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
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

        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-danger/10 to-primary-500/10 border border-danger/20">
          <p className="text-xs text-muted-foreground">Full platform control. Manage users, courses, and view system-wide analytics.</p>
        </div>
      </div>
    </aside>
  );
}
