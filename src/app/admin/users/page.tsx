'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiSearch } from 'react-icons/fi';

interface User {
  _id: string; name: string; email: string; role: string; skillLevel: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FiShield className="text-danger" /> Manage Users
        </h1>
        <p className="text-muted-foreground mt-1">View and manage all platform users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" placeholder="Search users..." />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto">
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-muted-foreground">No users found. Users will appear here once they register.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Level</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <p className="text-foreground font-medium">{u.name}</p>
                    <p className="text-muted-foreground/80 text-xs">{u.email}</p>
                  </td>
                  <td className="py-3 px-2"><span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'instructor' ? 'badge-warning' : 'badge-info'}`}>{u.role}</span></td>
                  <td className="py-3 px-2 text-muted-foreground capitalize">{u.skillLevel}</td>
                  <td className="py-3 px-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
