import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a friendly, empathetic, and professional pharmacist assistant for "Medixly Pharmacy". 
      Your goal is to help users with general health inquiries, explain medication usages, and guide them to use the pharmacy services. 
      You are NOT a doctor and must always advise users to consult a physician for serious medical conditions.
      Keep answers concise, warm, and helpful. Use a tone that matches the "soft, supportive" aesthetic of the pharmacy.`,
    },
  });
};

export const analyzePrescriptionImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Analyze this prescription image. Extract the following information if visible:
            1. Medication Name
            2. Dosage
            3. Patient Instructions
            
            Return the result in JSON format.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicationName: { type: Type.STRING },
            dosage: { type: Type.STRING },
            instructions: { type: Type.STRING },
            confidence: { type: Type.STRING, description: "High, Medium, or Low" }
          }
        }
      }
    });
    
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Error analyzing prescription:", error);
    throw error;
  }
};