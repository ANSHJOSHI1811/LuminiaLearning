import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onStart: (goal: string) => void;
  isLoading: boolean;
  loadingStage: string;
  error: string | null;
}

export function Onboarding({ onStart, isLoading, loadingStage, error }: OnboardingProps) {
  const [goal, setGoal] = useState('');
  
  const suggestions = [
    "Master Cloud Architecture",
    "Product Design Strategy",
    "Advanced Neural Networks",
    "Strategic Business Growth"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 80, damping: 20 }
    }
  };

  return (
    <>
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-10 relative z-10 w-full"
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-4">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Intelligence v4.0</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase">
              Navigate <br/>
              <span className="text-accent italic">Your skills.</span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-xl mx-auto space-y-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-accent/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white border border-slate-100 rounded-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-slate-100 shadow-xl shadow-slate-200/40 flex items-center">
                <input 
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="What is your learning destination?"
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-base font-bold text-slate-900 placeholder:text-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && goal.trim() && !isLoading) {
                      onStart(goal);
                    }
                  }}
                />
                <button
                  onClick={() => onStart(goal)}
                  disabled={!goal.trim() || isLoading}
                  className="bg-slate-900 text-white h-12 px-8 rounded-xl hover:bg-accent transition-all disabled:opacity-20 flex items-center justify-center gap-2.5 shadow-md"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Identify</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onStart(suggestion)}
                  className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-500 text-sm font-bold bg-red-50 px-4 py-2 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="bg-slate-900 py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10">
          {[
            { label: "Sync", title: "Neural Velocity", desc: "Generating expert-level pathways in sub-second intervals." },
            { label: "Flow", title: "Adaptive Bias", desc: "The engine learns your pace and adjusts complexity thresholds." },
            { label: "Core", title: "Peak Signals", desc: "Synthesizing only high-signal knowledge for maximum durability." }
          ].map((feature, i) => (
            <div key={i} className="space-y-6">
              <span className="text-accent text-[10px] font-black uppercase tracking-widest opacity-60">[{feature.label}]</span>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{feature.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
