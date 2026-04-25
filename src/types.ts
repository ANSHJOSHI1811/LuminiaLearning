export type TopicStatus = 'locked' | 'available' | 'in_progress' | 'mastered';

export interface Topic {
  id: string;
  title: string;
  description: string;
  status: TopicStatus;
  order: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LearningState {
  currentTopicId: string | null;
  history: Message[];
  roadmap: Topic[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}
