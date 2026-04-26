import { motion } from 'motion/react';
import { LearningState, Topic } from '../types';
import { 
  CheckCircle2, 
  Layout,
  RotateCcw,
  Compass,
  PanelLeft,
  Trophy,
  PlayCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import Markdown from 'react-markdown';
import ReactPlayer from 'react-player';
import { RoadmapItem } from '../components/RoadmapItem';
import { QuizModule } from '../components/QuizModule';
import { ChatInterface } from '../components/ChatInterface';

const Player = ReactPlayer as any;

interface CoursePageProps {
  state: LearningState;
  setState: React.Dispatch<React.SetStateAction<LearningState>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (o: boolean) => void;
  activeView: 'roadmap' | 'content' | 'quiz';
  setActiveView: (v: 'roadmap' | 'content' | 'quiz') => void;
  markTopicMastered: (id: string) => void;
  progressPercent: number;
}

export function CoursePage({ 
  state, 
  setState, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeView, 
  setActiveView, 
  markTopicMastered,
  progressPercent
}: CoursePageProps) {
  
  const allTopics = state.course.flatMap(w => w.topics);
  const currentTopic = allTopics.find(t => t.id === state.currentTopicId) || null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-screen bg-white">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="w-7 h-7 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
              <Compass size={10} />
            </div>
            <span className="font-black text-lg tracking-tighter hidden md:block text-slate-900">NAVIGATE</span>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{state.goal}</span>
            <span className="text-xs font-bold text-primary truncate max-w-[200px] md:max-w-md">
              {currentTopic ? currentTopic.title : 'Overview'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 mr-4">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Progress</div>
              <div className="text-xs font-black text-primary">{progressPercent}%</div>
            </div>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-accent"
              />
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-accent transition-colors"
            title="Reset Curriculum"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <motion.nav 
          initial={false}
          animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="h-full bg-slate-50 border-r border-slate-100 flex flex-col z-40 overflow-hidden relative shadow-sm"
        >
          <div className="p-6 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curriculum</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-accent transition-colors"
            >
              <PanelLeft size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
            <button 
              onClick={() => setActiveView('roadmap')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden ${
                activeView === 'roadmap' 
                ? 'bg-accent/10 text-accent font-bold' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layout size={18} className={activeView === 'roadmap' ? 'text-accent' : 'text-slate-400'} />
              <span>Overview</span>
            </button>

            <div className="space-y-4">
              {state.course.map((week) => (
                <div key={week.weekNum} className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-3 block mb-2 opacity-50">Section {week.weekNum}</span>
                  {week.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setState(prev => ({ ...prev, currentTopicId: topic.id }));
                        setActiveView('content');
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all group relative flex items-start gap-3 ${
                        state.currentTopicId === topic.id 
                        ? 'bg-white shadow-sm ring-1 ring-slate-200 border-l-4 border-l-accent text-slate-900 font-bold' 
                        : 'text-slate-500 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                        topic.status === 'mastered' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                      }`}>
                        {topic.status === 'mastered' && <CheckCircle2 size={10} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate leading-tight">
                          {topic.title}
                        </p>
                        <p className="text-[9px] font-medium opacity-50 uppercase tracking-tighter mt-0.5">5 mins</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.nav>

        <main className="flex-1 flex overflow-hidden relative">
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-30 p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 hover:text-accent transition-all"
            >
              <PanelLeft size={18} />
            </button>
          )}

          <div className="flex-1 flex flex-col overflow-hidden h-full">
            {activeView === 'roadmap' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto h-full"
              >
                <div className="max-w-4xl mx-auto py-12 px-6">
                  <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Curriculum Overview</h1>
                    <p className="text-slate-500 font-medium">Master {state.goal} through this structured sequence of learning modules.</p>
                  </header>

                  <div className="space-y-12 pb-20">
                    {state.course.map((week) => (
                      <div key={week.weekNum} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h2 className="text-lg font-bold text-slate-900">
                            Section {week.weekNum}
                          </h2>
                          <div className="h-px bg-slate-100 flex-1" />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {week.topics.map((topic, tIdx) => (
                            <RoadmapItem 
                              key={topic.id}
                              topic={topic}
                              index={tIdx}
                              onSelect={() => {
                                setState(prev => ({ ...prev, currentTopicId: topic.id }));
                                setActiveView('content');
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'content' && currentTopic && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full bg-white overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto h-full custom-scrollbar">
                  <div className="max-w-4xl mx-auto py-16 px-8 space-y-16 pb-32">
                    <section className="space-y-10">
                      <header className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] bg-accent/5 px-2 py-1 rounded">Module {currentTopic.order}</span>
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{state.goal}</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">{currentTopic.title}</h2>
                      </header>

                      <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
                        <Markdown>{currentTopic.content || currentTopic.description}</Markdown>
                      </div>

                      {currentTopic.exercises && currentTopic.exercises.length > 0 && (
                        <section className="bg-slate-50 border border-slate-100 rounded-2xl p-8 space-y-6">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                            <Zap size={20} className="text-accent" /> Practice & Application
                          </h3>
                          <div className="space-y-3">
                            {currentTopic.exercises.map((ex, i) => (
                              <div key={i} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                                  {i + 1}
                                </div>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed pt-1">{ex}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </section>

                    {state.preferences?.format === 'combined' && (
                      <section className="space-y-6">
                         <div className="flex items-center justify-between">
                           <div className="space-y-1">
                             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                               <PlayCircle size={22} className="text-accent" /> Video Lesson
                             </h3>
                             <p className="text-xs text-slate-400 font-medium ml-8">Curated search result for this module</p>
                           </div>
                           <a 
                             href={currentTopic.youtubeVideoId ? `https://www.youtube.com/watch?v=${currentTopic.youtubeVideoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(currentTopic.title)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center gap-2 text-xs font-bold text-accent hover:underline px-4 py-2 bg-accent/5 rounded-lg transition-all"
                           >
                             Watch on YouTube <ExternalLink size={14} />
                           </a>
                         </div>
                         <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative">
                         <Player 
                             url={currentTopic.youtubeVideoId ? `https://www.youtube.com/watch?v=${currentTopic.youtubeVideoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(currentTopic.title)}`}
                             width="100%"
                             height="100%"
                             controls={true}
                             pip={true}
                             stopOnTerminate={false}
                             light={true}
                             playIcon={<div className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110"><PlayCircle size={40} fill="currentColor" /></div>}
                           />
                         </div>
                      </section>
                    )}
                    
                    <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
                      <button 
                        onClick={() => setActiveView('quiz')}
                        className="bg-accent text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-accent/10"
                      >
                        <Trophy size={18} /> Start Lab Evaluation
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'quiz' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex-1 overflow-y-auto h-full"
              >
                <QuizModule 
                  topic={currentTopic!} 
                  onComplete={() => markTopicMastered(currentTopic!.id)}
                  onBack={() => setActiveView('content')}
                />
              </motion.div>
            )}
          </div>
          
          <ChatInterface 
            history={state.history}
            currentTopic={currentTopic}
            goal={state.goal}
            assessment={state.assessment}
            onUpdateHistory={(newHistory) => setState(prev => ({ ...prev, history: newHistory }))}
          />
        </main>
      </div>
    </div>
  );
}
