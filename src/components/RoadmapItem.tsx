import { motion } from 'motion/react';
import { Topic } from '../types';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface RoadmapItemProps {
  topic: Topic;
  index: number;
  onSelect: () => void;
}

export function RoadmapItem({ topic, index, onSelect }: RoadmapItemProps) {
  const isMastered = topic.status === 'mastered';
  const isLocked = topic.status === 'locked';

  return (
    <motion.button
      whileHover={!isLocked ? { x: 4, backgroundColor: 'rgba(248, 250, 252, 0.5)' } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      onClick={!isLocked ? onSelect : undefined}
      className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group ${
        isLocked ? 'opacity-40 grayscale cursor-not-allowed border-slate-100' : 'border-slate-200/60 bg-white hover:border-accent'
      }`}
    >
      <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-sm font-black transition-colors ${
        isMastered ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-accent group-hover:text-white'
      }`}>
        {isMastered ? <CheckCircle2 size={24} /> : (index + 1).toString().padStart(2, '0')}
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="font-bold text-slate-900 tracking-tight group-hover:text-accent transition-colors">{topic.title}</h3>
        <p className="text-xs text-slate-400 font-medium">{topic.description}</p>
      </div>

      <div className={`text-slate-300 group-hover:text-accent transition-colors ${isLocked ? 'hidden' : 'block'}`}>
        <ChevronRight size={20} />
      </div>
    </motion.button>
  );
}
