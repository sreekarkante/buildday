import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/adminSession';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isValid = verifyAdminToken(token);

  if (!isValid) {
    redirect('/admin/login');
  }

  const isSimMode = cookieStore.get('sim_mode')?.value === '1';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Persistent Simulation Mode Badge */}
      {isSimMode && (
        <div className="bg-amber-500 text-black text-center py-1.5 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          s SIMULATED DATA MODE ACTIVE
        </div>
      )}
      
      <nav className="border-b border-white/10 p-4 flex justify-between items-center bg-black/50">
        <div className="font-bold text-xl tracking-tight text-white">BuildDay <span className="text-accent-cyan">Admin</span></div>
        <div className="flex gap-4">
          <button id="logout-btn" className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
        </div>
      </nav>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
