import { GoogleGenAI } from "@google/genai";
import { Message, Topic, CourseWeek, AssessmentAnswers, UserPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota'))) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function explainConcept(topic: string, history: Message[], assessment: AssessmentAnswers | null) {
  const levelContext = assessment ? `User level is ${assessment.currentLevel}. Background: ${assessment.background}. Goal: ${assessment.goal}.` : "";
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: `Explain the following topic: ${topic}. ${levelContext} Use analogies and focus on core principles.` }] }
      ],
      config: {
        systemInstruction: "You are Lumina, an expert mentor. You help users learn concepts by explaining them clearly, using metaphors, and breaking down complex ideas. Tailor your tone and complexity to the user's background.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate an explanation.";
  });
}

export async function generateCustomCourse(goal: string, assessment: AssessmentAnswers, preferences: UserPreferences): Promise<CourseWeek[]> {
  const prompt = `Create a custom week-by-week curriculum for the goal: "${goal}".
  
  User Profile:
  - Level: ${assessment.currentLevel}
  - Time per week: ${assessment.timePerWeek}
  - Background: ${assessment.background}
  - Specific Goal: ${assessment.goal}
  - Pace: ${assessment.pace}
  - Preference: ${preferences.format === 'combined' ? `Reading + Video (${preferences.videoLanguage || 'English'})` : 'Reading only'}

  Format the response as a JSON array of CourseWeek objects:
  [{ 
    "weekNum": 1, 
    "topics": [
      { 
        "id": "uuid", 
        "title": "Topic Name", 
        "description": "Short summary", 
        "content": "Detailed text-based lesson notes", 
        "youtubeSearchTerm": "A highly specific YouTube search string to find the best lesson if the ID fails (e.g., 'React Hooks explained simple').",
        "youtubeVideoId": "The YouTube Video ID of a high-quality, popular educational video for this topic (e.g. 'LOH1l-M_pxI'). MUST be a valid, public video ID.",
        "videoLength": "e.g. 5 mins", 
        "exercises": ["Exercise 1", "Exercise 2"],
        "order": 1
      }
    ] 
  }]
  
  Provide 4-8 weeks depending on the pace and difficulty. Ensure the content is specifically tailored to a ${assessment.currentLevel} with a ${assessment.background} background.`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      const data = JSON.parse(response.text || "[]");
      return data.map((week: any) => ({
        ...week,
        topics: week.topics.map((t: any, idx: number) => ({
          ...t,
          status: (week.weekNum === 1 && idx === 0) ? 'available' : 'locked',
        }))
      }));
    } catch (e) {
      console.error("Failed to parse custom course", e);
      return [];
    }
  });
}

export async function answerDoubt(question: string, topic: Topic, assessment: AssessmentAnswers | null): Promise<string> {
  const context = assessment ? `The user is a ${assessment.currentLevel} with ${assessment.background} background.` : "";
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Topic: ${topic.title}. 
      Content: ${topic.description}.
      Question: ${question}.
      ${context}
      Explain in simple terms with an analogy. Relate to their goal if possible. Keep it 2-3 paragraphs max.`,
      config: {
        systemInstruction: "You are an adaptive AI mentor. Provide clear, empathetic, and level-appropriate answers to student doubts.",
      }
    });
    return response.text || "I'm having trouble answering that right now.";
  });
}

export async function generateQuiz(topic: Topic): Promise<string> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Create a short, interactive quiz (3 questions) for the topic: "${topic.title}".
      Focus on conceptual understanding. Use a cheerful and encouraging tone.
      Format your response in Markdown.`,
    });
    return response.text || "I'm having trouble creating a quiz right now.";
  });
}

export async function generateAssessmentQuestions(goal: string): Promise<{ key: string, q: string, options: { label: string, value: string }[] }[]> {
  const prompt = `Generate 5 specific assessment questions to help personalize a learning path for the goal: "${goal}".
  The questions should help determine the user's current knowledge, constraints, and target outcomes.
  Format as a JSON array of objects:
  [{ "key": "unique_key", "q": "Question text", "options": [{ "label": "Option text", "value": "value" }] }]
  Keep the options concise (max 20 chars). Ensure the questions are highly relevant to "${goal}".`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse dynamic questions", e);
      return [
        {
          key: 'currentLevel',
          q: "What's your current level?",
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ]
        }
      ];
    }
  });
}
