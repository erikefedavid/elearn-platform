import Navbar from '@/components/layouts/Navbar';
import InstructorSidebar from '@/components/layouts/InstructorSidebar';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <InstructorSidebar />
      <main className="pt-16 lg:pl-64">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
