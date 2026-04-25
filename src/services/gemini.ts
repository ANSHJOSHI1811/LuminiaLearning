import { GoogleGenAI } from "@google/genai";
import { Message, Topic } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function explainConcept(topic: string, history: Message[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
      { role: 'user', parts: [{ text: `Explain the following topic in a way that is easy to understand: ${topic}. Use analogies and focus on core principles.` }] }
    ],
    config: {
      systemInstruction: "You are Lumina, an expert mentor. You help users learn concepts by explaining them clearly, using metaphors, and breaking down complex ideas. Encourage the user to ask questions.",
    }
  });
  return response.text || "I'm sorry, I couldn't generate an explanation.";
}

export async function generateRoadmap(goal: string): Promise<Topic[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a learning roadmap for the goal: "${goal}". 
    Format the response as a JSON array of objects with the following structure:
    [{ "id": "uuid", "title": "Topic Name", "description": "Brief description", "order": 1 }]
    Include 5-7 progressive topics.`,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data.map((t: any, index: number) => ({
      ...t,
      status: index === 0 ? 'available' : 'locked',
      order: index + 1
    }));
  } catch (e) {
    console.error("Failed to parse roadmap", e);
    return [];
  }
}

export async function generateQuiz(topic: Topic): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a short, interactive quiz (3 questions) for the topic: "${topic.title}".
    Focus on conceptual understanding. Use the person's previous chat history if provided.
    Format your response in Markdown.`,
    config: {
      systemInstruction: "You are an adaptive tutor. Create quizzes that test depth of understanding, not just rote memorization.",
    }
  });
  return response.text || "I'm having trouble creating a quiz right now.";
}
