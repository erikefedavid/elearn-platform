'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiSearch, FiLock, FiUnlock } from 'react-icons/fi';

interface User {
  _id: string; name: string; email: string; role: string; skillLevel: string; status: string;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

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

  async function toggleUserStatus(userId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'restricted' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error');
    }
  }

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
        <p className="text-muted-foreground mt-1">View and manage all platform users. Ban or restrict access as needed.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" placeholder="Search users by name or email..." />
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
            <p className="text-muted-foreground">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Level</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className={`border-b border-border transition-colors hover:bg-muted/30 ${u.status === 'restricted' ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-2">
                      <p className="text-foreground font-medium">{u.name}</p>
                      <p className="text-muted-foreground/80 text-xs">{u.email}</p>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'instructor' ? 'badge-warning' : 'badge-info'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground capitalize">
                      {u.role === 'student' ? u.skillLevel : '—'}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`badge ${u.status === 'restricted' ? 'bg-danger text-white' : 'bg-success-500/20 text-success-500'}`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserStatus(u._id, u.status || 'active')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-colors ${
                            u.status === 'restricted' 
                            ? 'bg-success-500/20 text-success-500 hover:bg-success-500/30' 
                            : 'bg-danger/20 text-danger hover:bg-danger/30'
                          }`}
                        >
                          {u.status === 'restricted' ? <><FiUnlock className="w-3 h-3" /> Unrestrict</> : <><FiLock className="w-3 h-3" /> Restrict</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
