import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Onboarding } from '../components/Onboarding';
import { AssessmentQuiz } from '../components/AssessmentQuiz';
import { PreferenceSelection } from '../components/PreferenceSelection';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AssessmentAnswers, UserPreferences, LearningState } from '../types';
import { Compass } from 'lucide-react';
import { generateCustomCourse, generateAssessmentQuestions } from '../services/gemini';

interface HomePageProps {
  state: LearningState;
  setState: React.Dispatch<React.SetStateAction<LearningState>>;
  step: 'goal' | 'assessment' | 'preferences' | 'course';
  setStep: (s: 'goal' | 'assessment' | 'preferences' | 'course') => void;
  setActiveView: (v: 'roadmap' | 'content' | 'quiz') => void;
}

export function HomePage({ state, setState, step, setStep, setActiveView }: HomePageProps) {
  const [assessmentQuestions, setAssessmentQuestions] = useState<{ key: string, q: string, options: { label: string, value: string }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadingPhrases = [
    "Analyzing your goals...",
    "Curating expert content...",
    "Crafting your personalized path...",
    "Syncing with Navigate intelligence...",
    "Organizing modules for maximum retention...",
    "Almost there, polishing your curriculum...",
    "Making it just for you...",
    "Finalizing your master plan..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && step !== 'course') {
      let phraseIdx = 0;
      interval = setInterval(() => {
        setLoadingStage(loadingPhrases[phraseIdx]);
        phraseIdx = (phraseIdx + 1) % loadingPhrases.length;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, step]);

  const handleStartGoal = async (goal: string) => {
    if (!goal.trim()) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const questions = await generateAssessmentQuestions(goal);
      setAssessmentQuestions(questions);
      setState(prev => ({ ...prev, goal }));
      setStep('assessment');
    } catch (e: any) {
      console.error(e);
      setError('The AI service is currently busy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssessmentComplete = (answers: AssessmentAnswers) => {
    setState(prev => ({ ...prev, assessment: answers }));
    setStep('preferences');
  };

  const handlePreferencesComplete = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setLoadingStage('Thinking...');
    setError(null);
    setState(prev => ({ ...prev, preferences: prefs }));
    
    try {
      await new Promise(r => setTimeout(r, 800));
      setLoadingStage('Creating your plan...');
      
      const course = await generateCustomCourse(state.goal, state.assessment!, prefs);
      
      if (!course || course.length === 0) {
        throw new Error('No course generated');
      }

      await new Promise(r => setTimeout(r, 1000));
      setLoadingStage('Finishing up your plan...');
      
      await new Promise(r => setTimeout(r, 800));
      
      setState(prev => ({
        ...prev,
        course,
        currentTopicId: course[0]?.topics[0]?.id || null,
        history: [{
          role: 'assistant',
          content: `Course generated! We'll start with **${course[0]?.topics[0]?.title}**. Ready to begin?`,
          timestamp: Date.now()
        }]
      }));
      
      setStep('course');
      setActiveView('roadmap');
    } catch (e: any) {
      console.error(e);
      setError('Failed to generate your personalized course. Please try again in a bit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-x-hidden overflow-y-auto custom-scrollbar relative min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {isLoading && step !== 'goal' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="space-y-6 max-w-sm w-full">
                <div className="relative w-16 h-16 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full border border-slate-100 border-t-accent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Compass size={20} className="text-slate-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-[11px] font-black text-slate-900 tracking-widest uppercase italic">Synthesizing Pathways</h2>
                  <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] animate-pulse">{loadingStage}</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'goal' && (
            <motion.div 
              key="goal" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Onboarding 
                onStart={handleStartGoal} 
                isLoading={isLoading} 
                loadingStage={loadingStage}
                error={error}
              />
            </motion.div>
          )}

          {step === 'assessment' && !isLoading && (
            <motion.div 
              key="assessment" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AssessmentQuiz questions={assessmentQuestions} onComplete={handleAssessmentComplete} />
            </motion.div>
          )}

          {step === 'preferences' && !isLoading && (
            <motion.div 
              key="preferences" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <PreferenceSelection onComplete={handlePreferencesComplete} isLoading={isLoading} loadingStage={loadingStage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
