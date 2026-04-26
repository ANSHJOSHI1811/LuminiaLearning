import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Topic } from '../types';
import { Trophy, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateQuiz } from '../services/gemini';

interface QuizModuleProps {
  topic: Topic;
  onComplete: () => void;
  onBack: () => void;
}

export function QuizModule({ topic, onComplete, onBack }: QuizModuleProps) {
  const [quizContent, setQuizContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const content = await generateQuiz(topic);
        setQuizContent(content);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuiz();
  }, [topic]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-slate-100 border-t-accent rounded-full"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Designing Knowledge Gates</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-green-100">
           <CheckCircle2 size={48} />
        </div>
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Mastery Confirmed</h2>
           <p className="text-slate-500 font-medium">Neural pathway for <strong>{topic.title}</strong> is now stable.</p>
        </div>
        <button 
          onClick={onComplete}
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all flex items-center gap-3"
        >
          Proceed to Next Module <ArrowRight size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-8 space-y-12 pb-32">
       <button 
         onClick={onBack}
         className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
       >
         <ChevronLeft size={16} /> Revisit Module
       </button>

       <div className="space-y-10">
         <header className="space-y-4">
           <div className="flex items-center gap-2">
             <Trophy size={20} className="text-accent" />
             <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Lab Evaluation</span>
           </div>
           <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">{topic.title} Quiz</h2>
         </header>

         <div className="prose prose-slate max-w-none bg-slate-50 p-10 rounded-2xl border border-slate-100 shadow-sm">
           <Markdown>{quizContent || ''}</Markdown>
         </div>

         <div className="pt-8 flex justify-center">
           <button 
            onClick={() => setIsFinished(true)}
            className="bg-accent text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl shadow-accent/20"
           >
             Finish Evaluation
           </button>
         </div>
       </div>
    </div>
  );
}
