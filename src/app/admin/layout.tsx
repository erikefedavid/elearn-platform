import Navbar from '@/components/layouts/Navbar';
import AdminSidebar from '@/components/layouts/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="pt-16 lg:pl-64">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
