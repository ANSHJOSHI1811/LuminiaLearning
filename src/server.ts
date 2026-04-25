import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS first (before all routes)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Explain concept endpoint
app.post('/api/explain', async (req, res) => {
  try {
    const { topic, history } = req.body;

    // Build a properly alternating user/model history
    // Gemini requires: first turn must be 'user', must strictly alternate
    const formattedHistory = history
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: `Explain the following topic in a way that is easy to understand: ${topic}. Use analogies and focus on core principles.` }]
        }
      ],
      config: {
        systemInstruction:
          'You are Lumina, an expert mentor. You help users learn concepts by explaining them clearly, using metaphors, and breaking down complex ideas. Encourage the user to ask questions.'
      }
    });

    res.json({ explanation: response.text || 'Could not generate explanation' });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({ error: error.message || 'Failed to generate explanation' });
  }
});

// Generate roadmap endpoint
app.post('/api/roadmap', async (req, res) => {
  try {
    const { goal } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a learning roadmap for the goal: "${goal}". 
      Format the response as a JSON array of objects with the following structure:
      [{ "id": "uuid", "title": "Topic Name", "description": "Brief description", "order": 1 }]
      Include 5-7 progressive topics.`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const roadmap = JSON.parse(response.text || '[]');
    const formattedRoadmap = roadmap.map((t: any, index: number) => ({
      ...t,
      status: index === 0 ? 'available' : 'locked',
      order: index + 1
    }));

    res.json({ roadmap: formattedRoadmap });
  } catch (error: any) {
    console.error('Error in /api/roadmap:', error);
    res.status(500).json({ error: error.message || 'Failed to generate roadmap' });
  }
});

// Generate quiz endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a short, interactive quiz (3 questions) for the topic: "${topic.title}".
      Focus on conceptual understanding.
      Format your response in Markdown.`,
      config: {
        responseMimeType: 'text/plain'
      }
    });

    res.json({ quiz: response.text || 'Could not generate quiz' });
  } catch (error: any) {
    console.error('Error in /api/quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   API Health: http://localhost:${PORT}/api/health`);
});
