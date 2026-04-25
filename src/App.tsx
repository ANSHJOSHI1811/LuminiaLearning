import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Map as MapIcon, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight, 
  Send,
  Zap,
  RotateCcw,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Message, Topic, LearningState } from './types';
import { explainConcept, generateRoadmap, generateQuiz } from './services/gemini';

export default function App() {
  const [state, setState] = useState<LearningState>({
    currentTopicId: null,
    history: [],
    roadmap: [],
    userLevel: 'beginner'
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'roadmap' | 'chat' | 'quiz'>('roadmap');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentTopic = state.roadmap.find(t => t.id === state.currentTopicId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.history]);

  const handleStartLearning = async (goal: string) => {
    setIsLoading(true);
    const newRoadmap = await generateRoadmap(goal);
    setState(prev => ({
      ...prev,
      roadmap: newRoadmap,
      currentTopicId: newRoadmap[0]?.id || null,
      history: [{
        role: 'assistant',
        content: `Welcome to your learning journey for **${goal}**! I've built a roadmap for you. We'll start with **${newRoadmap[0]?.title}**. Ready to dive in?`,
        timestamp: Date.now()
      }]
    }));
    setActiveView('chat');
    setIsLoading(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    const newHistory = [...state.history, userMessage];
    setState(prev => ({ ...prev, history: newHistory }));
    setInputValue('');
    setIsLoading(true);

    try {
      const explanation = await explainConcept(currentTopic?.title || 'General Learning', newHistory);
      setState(prev => ({
        ...prev,
        history: [...newHistory, {
          role: 'assistant',
          content: explanation,
          timestamp: Date.now()
        }]
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const markTopicMastered = (topicId: string) => {
    setState(prev => {
      const newRoadmap = prev.roadmap.map((t, idx) => {
        if (t.id === topicId) return { ...t, status: 'mastered' as const };
        if (prev.roadmap[idx - 1]?.id === topicId) return { ...t, status: 'available' as const };
        return t;
      });
      return { ...prev, roadmap: newRoadmap };
    });
    setActiveView('roadmap');
  };

  const masteredCount = state.roadmap.filter(t => t.status === 'mastered').length;
  const progressPercent = state.roadmap.length > 0 ? Math.round((masteredCount / state.roadmap.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg text-text-main flex font-sans">
      {/* Sidebar - Matching theme instructions */}
      <nav className="w-64 h-screen border-r border-border bg-surface flex flex-col p-6 sticky top-0">
        <div className="flex items-center gap-2 font-bold text-xl text-primary mb-10">
          <div className="w-2.5 h-2.5 bg-primary rounded-[2px]" />
          Lumina
        </div>
        
        <div className="space-y-8">
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] font-semibold uppercase text-text-muted tracking-wider mb-3">Focus Area</span>
            <NavItem 
              icon={<MapIcon size={18} />} 
              active={activeView === 'roadmap'} 
              onClick={() => setActiveView('roadmap')}
              label="Learning Path"
            />
            <NavItem 
              icon={<MessageSquare size={18} />} 
              active={activeView === 'chat'} 
              onClick={() => setActiveView('chat')}
              label="AI Mentor"
              disabled={!state.currentTopicId}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] font-semibold uppercase text-text-muted tracking-wider mb-3">Insights</span>
            <NavItem 
              icon={<BarChart3 size={18} />} 
              active={activeView === 'quiz'} 
              onClick={() => setActiveView('quiz')}
              label="Assessments"
              disabled={!state.currentTopicId}
            />
          </div>
        </div>

        <div className="mt-auto">
          <NavItem 
            icon={<RotateCcw size={18} />} 
            onClick={() => window.location.reload()}
            label="Restart Session"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          {state.roadmap.length === 0 ? (
            <Onboarding key="onboarding" onStart={handleStartLearning} isLoading={isLoading} />
          ) : (
            <div className="flex-1 flex h-screen overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeView === 'roadmap' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-10 max-w-4xl mx-auto w-full overflow-y-auto custom-scrollbar"
                  >
                    <header className="mb-10">
                      <h1 className="text-2xl font-bold tracking-tight mb-2">Mastery Roadmap</h1>
                      <p className="text-text-muted">A structured path through your learning goal.</p>
                    </header>

                    <div className="space-y-3">
                      {state.roadmap.map((topic, i) => (
                        <RoadmapItem 
                          key={topic.id} 
                          topic={topic} 
                          index={i} 
                          onSelect={() => {
                            setState(prev => ({ ...prev, currentTopicId: topic.id }));
                            setActiveView('chat');
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeView === 'chat' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col h-full bg-bg"
                  >
                    <header className="px-10 py-6 border-b border-border bg-surface">
                      <span className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold">Active Module</span>
                      <h2 className="text-lg font-semibold">{currentTopic?.title}</h2>
                    </header>

                    <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                      {state.history.map((msg, i) => (
                        <div key={i} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-medium ${
                            msg.role === 'user' ? 'bg-slate-200 text-slate-700' : 'bg-primary text-white'
                          }`}>
                            {msg.role === 'user' ? 'U' : 'L'}
                          </div>
                          <div className={`p-4 rounded-xl shadow-sm text-[0.95rem] leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-surface border border-border prose'
                          }`}>
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-4 self-start">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-white shrink-0">L</div>
                          <div className="bg-surface border border-border p-4 rounded-xl shadow-sm flex gap-1">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <div className="p-8 px-10">
                      <form onSubmit={handleSendMessage} className="bg-surface border border-border rounded-xl p-3 px-4 shadow-sm flex items-center gap-3">
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Explore this concept further..."
                          className="flex-1 outline-none text-sm placeholder:text-text-muted bg-transparent"
                        />
                        <button 
                          type="submit"
                          disabled={isLoading || !inputValue.trim()}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {activeView === 'quiz' && currentTopic && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-10 h-full overflow-y-auto"
                  >
                    <QuizModule 
                      topic={currentTopic} 
                      onComplete={() => markTopicMastered(currentTopic.id)}
                      onBack={() => setActiveView('chat')}
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Panel - Matching theme */}
              <aside className="w-72 border-l border-border bg-surface p-6 h-full overflow-y-auto hidden lg:block">
                <div className="bg-slate-100 rounded-2xl p-5 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-text-main">Progress</span>
                    <span className="text-xs font-bold text-primary">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full bg-primary" 
                    />
                  </div>
                </div>

                <span className="text-[0.7rem] font-semibold uppercase text-text-muted tracking-wider block mb-4">Topic Path</span>
                <div className="flex flex-wrap gap-2 mb-8">
                  {state.roadmap.map(t => (
                    <div 
                      key={t.id} 
                      className={`text-[0.7rem] px-2.5 py-1 rounded-full border transition-colors ${
                        t.id === state.currentTopicId 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-slate-50 text-text-muted border-border'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>

                <div className="border border-border rounded-xl p-4 bg-slate-50/50">
                  <span className="text-[0.7rem] font-semibold text-text-muted uppercase tracking-wider block mb-2">Mentor Tip</span>
                  <p className="text-[0.8rem] leading-relaxed text-text-muted italic">
                    "Consistent engagement is key. Aim for mastery in one core concept per session to ensure long-term retention."
                  </p>
                </div>
              </aside>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, active, onClick, label, disabled }: { icon: React.ReactNode, active?: boolean, onClick: () => void, label: string, disabled?: boolean }) {
  return (
    <button 
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        active 
        ? 'bg-blue-50 text-primary font-medium shadow-sm' 
        : 'text-text-main hover:bg-slate-50'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={active ? 'text-primary' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function Onboarding({ onStart, isLoading }: { onStart: (goal: string) => void, isLoading: boolean }) {
  const [goal, setGoal] = useState('');

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-bg">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface border border-border p-10 rounded-3xl shadow-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Master anything</h1>
          <p className="text-text-muted text-sm px-4">Lumina designs a personalized roadmap to guide you from foundation to mastery.</p>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="What do you want to learn?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl px-5 py-3.5 outline-none focus:border-primary transition-colors text-sm font-medium"
            onKeyDown={(e) => e.key === 'Enter' && goal && onStart(goal)}
          />
          <button
            onClick={() => onStart(goal)}
            disabled={!goal.trim() || isLoading}
            className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RotateCcw className="animate-spin" size={18} />
            ) : (
              <>Generate My Path <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function RoadmapItem({ topic, index, onSelect }: { topic: Topic, index: number, onSelect: () => void }) {
  const isLocked = topic.status === 'locked';
  const isMastered = topic.status === 'mastered';

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !isLocked && onSelect()}
      className={`group p-4 rounded-xl border flex items-center gap-4 transition-all ${
        isLocked 
        ? 'opacity-40 border-border bg-transparent grayscale cursor-not-allowed' 
        : isMastered
        ? 'border-green-100 bg-green-50/30'
        : 'border-border bg-surface hover:border-primary hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className={`w-9 h-9 flex items-center justify-center rounded-lg ${
        isMastered ? 'bg-green-100 text-green-600' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-primary'
      }`}>
        {isMastered ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
      </div>
      <div className="flex-1">
        <h3 className={`text-sm font-semibold ${isLocked ? 'text-text-muted' : 'text-text-main'}`}>
          {topic.title}
        </h3>
        <p className="text-[0.75rem] text-text-muted line-clamp-1">{topic.description}</p>
      </div>
      {!isLocked && !isMastered && (
        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
      )}
    </motion.div>
  );
}

function QuizModule({ topic, onComplete, onBack }: { topic: Topic, onComplete: () => void, onBack: () => void }) {
  const [quizContent, setQuizContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchQuiz = async () => {
      const q = await generateQuiz(topic);
      if (active) {
        setQuizContent(q);
        setLoading(false);
      }
    };
    fetchQuiz();
    return () => { active = false; };
  }, [topic]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Concept Check</h2>
          <p className="text-xs text-text-muted">Mastering: **{topic.title}**</p>
        </div>
        <button onClick={onBack} className="text-[0.7rem] font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors">
          Exit
        </button>
      </header>

      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm min-h-[300px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Zap size={32} className="text-primary animate-pulse" />
            <p className="text-sm font-medium text-text-muted">Generating assessments...</p>
          </div>
        ) : (
          <>
            <div className="flex-1 prose prose-slate">
              <Markdown>{quizContent}</Markdown>
            </div>
            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-text-muted italic">Self-reflect on these points before moving forward.</p>
              <button 
                onClick={onComplete}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm"
              >
                Mark as Mastered
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

