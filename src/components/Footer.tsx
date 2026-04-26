import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white py-20 px-8 border-t border-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-3">
           <Compass size={20} className="text-slate-900" />
           <span className="font-black text-lg tracking-tighter uppercase text-slate-900">Navigate</span>
        </div>
        <div className="flex gap-10">
          {['Privacy Protocol', 'Security Research', 'Global Systems'].map(t => (
            <button key={t} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
              {t}
            </button>
          ))}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">© 2026 Navigate Intelligence</span>
      </div>
    </footer>
  );
}
