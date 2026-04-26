import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { AssessmentAnswers } from '../types';

interface AssessmentQuizProps {
  questions: { key: string, q: string, options: { label: string, value: string }[] }[];
  onComplete: (a: AssessmentAnswers) => void;
}

export function AssessmentQuiz({ questions, onComplete }: AssessmentQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({});

  const handleSelect = (val: string) => {
    const newAnswers = { ...answers, [questions[currentIdx].key]: val };
    setAnswers(newAnswers);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onComplete(newAnswers as AssessmentAnswers);
    }
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Assessment</span>
            <span>{currentIdx + 1} / {questions.length}</span>
          </div>
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight leading-tight">
            {questions[currentIdx].q}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {questions[currentIdx].options.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(opt.value)}
              className="w-full text-left p-5 rounded-xl border border-slate-200 bg-white hover:border-accent hover:bg-accent/5 transition-all text-sm font-medium text-slate-700 flex items-center justify-between group"
            >
              {opt.label}
              <ChevronRight size={16} className="text-slate-300 group-hover:text-accent transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
