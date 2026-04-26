import { useState } from 'react';
import { LearningState } from './types';
import { HomePage } from './pages/Home';
import { CoursePage } from './pages/Course';

export default function App() {
  const [state, setState] = useState<LearningState>({
    goal: '',
    assessment: null,
    preferences: null,
    course: [],
    currentTopicId: null,
    doubts: [],
    history: []
  });
  
  const [step, setStep] = useState<'goal' | 'assessment' | 'preferences' | 'course'>('goal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'roadmap' | 'content' | 'quiz'>('roadmap');

  const markTopicMastered = (topicId: string) => {
    setState(prev => {
      let found = false;
      const newCourse = prev.course.map(week => ({
        ...week,
        topics: week.topics.map(t => {
          if (t.id === topicId) {
            found = true;
            return { ...t, status: 'mastered' as const };
          }
          if (found && t.status === 'locked') {
            found = false;
            return { ...t, status: 'available' as const };
          }
          return t;
        })
      }));
      return { ...prev, course: newCourse };
    });
    setActiveView('roadmap');
  };

  const allTopics = state.course.flatMap(w => w.topics);
  const masteredCount = allTopics.filter(t => t.status === 'mastered').length;
  const progressPercent = allTopics.length > 0 ? Math.round((masteredCount / allTopics.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-accent/20 overflow-hidden h-screen">
      {step !== 'course' ? (
        <HomePage 
          state={state} 
          setState={setState} 
          step={step} 
          setStep={setStep} 
          setActiveView={setActiveView} 
        />
      ) : (
        <CoursePage 
          state={state} 
          setState={setState} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          activeView={activeView} 
          setActiveView={setActiveView} 
          markTopicMastered={markTopicMastered}
          progressPercent={progressPercent}
        />
      )}
    </div>
  );
}
