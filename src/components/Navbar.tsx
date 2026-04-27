import { Compass, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="h-24 flex items-center justify-between px-8 md:px-32 sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-slate-50">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-200">
          <Compass size={18} strokeWidth={2.5} />
        </div>
        <span className="font-black text-lg tracking-tighter text-slate-900">NAVIGATE</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        {['Ecosystem', 'Research', 'Community'].map(item => (
          <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
            {item}
          </button>
        ))}
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{user.displayName?.split(' ')[0]}</span>
            </div>
            <button 
              onClick={signOut}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
