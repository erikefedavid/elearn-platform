import Navbar from '@/components/layouts/Navbar';
import StudentSidebar from '@/components/layouts/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <StudentSidebar />
      <main className="pt-16 lg:pl-64">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
