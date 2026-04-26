export type TopicStatus = 'locked' | 'available' | 'in_progress' | 'mastered';

export interface AssessmentAnswers {
  [key: string]: string;
}

export interface UserPreferences {
  format: 'reading' | 'combined';
  videoLanguage?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content?: string;
  videoLink?: string;
  youtubeSearchTerm?: string;
  youtubeVideoId?: string;
  videoLength?: string;
  exercises?: string[];
  notes?: string;
  status: TopicStatus;
  order: number;
}

export interface CourseWeek {
  weekNum: number;
  topics: Topic[];
}

export interface Doubt {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LearningState {
  goal: string;
  assessment: AssessmentAnswers | null;
  preferences: UserPreferences | null;
  course: CourseWeek[];
  currentTopicId: string | null;
  doubts: Doubt[];
  history: Message[];
}
