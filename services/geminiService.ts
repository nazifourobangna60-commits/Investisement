import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    // Note: In a real production app, this key should be handled securely.
    // Assuming process.env.API_KEY is available as per instructions.
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const sendMessageToGemini = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const client = getClient();
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, je rencontre des problèmes de connexion pour le moment. Veuillez réessayer plus tard.";
  }
};