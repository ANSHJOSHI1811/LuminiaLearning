import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPreferences } from '../types';
import { Compass } from 'lucide-react';

interface PreferenceSelectionProps {
  onComplete: (p: UserPreferences) => void;
  isLoading: boolean;
  loadingStage: string;
}

export function PreferenceSelection({ onComplete, isLoading, loadingStage }: PreferenceSelectionProps) {
  const [format, setFormat] = useState<'reading' | 'combined'>('reading');
  const [language, setLanguage] = useState('English');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Preferences</span>
          </div>
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight leading-tight">
            How would you like to receive your curriculum?
          </h2>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Delivery Format</span>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormat('combined')}
                className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${format === 'combined' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <p className="font-bold text-sm text-slate-900">Multi-Modal</p>
                <p className="text-xs text-slate-500 font-medium">Text lessons paired with curated video searches.</p>
              </button>
              <button 
                onClick={() => setFormat('reading')}
                className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${format === 'reading' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <p className="font-bold text-sm text-slate-900">Text Only</p>
                <p className="text-xs text-slate-500 font-medium">Focused deep-reading protocols without distractions.</p>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Language</span>
            <div className="grid grid-cols-2 gap-4">
              {['English', 'Spanish', 'Hindi', 'Automatic'].map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-4 rounded-xl border transition-all text-sm font-bold text-slate-700 ${language === lang ? 'border-accent bg-accent/5' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onComplete({ format, videoLanguage: language })}
            disabled={isLoading}
            className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            Construct Path
          </button>
        </div>
      </motion.div>
    </div>
  );
}
