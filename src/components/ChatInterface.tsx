import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Message, Topic, AssessmentAnswers } from '../types';
import { Send, Zap, Activity } from 'lucide-react';
import { explainConcept } from '../services/gemini';

interface ChatInterfaceProps {
  history: Message[];
  currentTopic: Topic | null;
  goal: string;
  assessment: AssessmentAnswers | null;
  onUpdateHistory: (history: Message[]) => void;
}

export function ChatInterface({ history, currentTopic, goal, assessment, onUpdateHistory }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    setError(null);

    const userMsg: Message = { role: 'user', content: inputValue, timestamp: Date.now() };
    const newHistory = [...history, userMsg];
    onUpdateHistory(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const resp = await explainConcept(currentTopic?.title || goal, newHistory, assessment);
      onUpdateHistory([...newHistory, { role: 'assistant', content: resp, timestamp: Date.now() }]);
    } catch (e: any) {
      console.error(e);
      setError('Chat service is experiencing heavy load. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-100 w-[400px] hidden xl:flex">
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Intelligence Sync</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400">ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {history.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-slate-900 text-white rounded-br-none' 
              : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none animate-pulse">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                </div>
             </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-4 text-red-500 bg-red-50 p-4 rounded-xl">
             <Activity size={16} />
             <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="relative">
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Lumina anything..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 pr-10 text-xs font-medium outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-accent transition-colors disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
