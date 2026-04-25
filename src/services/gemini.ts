import { Message, Topic } from "../types";

const API_URL = "http://localhost:5000/api";

export async function explainConcept(topic: string, history: Message[]): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, history })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.explanation || "I'm sorry, I couldn't generate an explanation.";
  } catch (error) {
    console.error("Error explaining concept:", error);
    return "Error generating explanation. Is the server running?";
  }
}

export async function generateRoadmap(goal: string): Promise<Topic[]> {
  try {
    const response = await fetch(`${API_URL}/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.roadmap || [];
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return [];
  }
}

export async function generateQuiz(topic: Topic): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.quiz || "I'm having trouble creating a quiz right now.";
  } catch (error) {
    console.error("Error generating quiz:", error);
    return "Error generating quiz. Is the server running?";
  }
}
