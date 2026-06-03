
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

export const getGeminiInsights = async (students: Student[], lang: 'fr' | 'ar') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const studentDataStr = students.map(s => `${s.name}: [${s.grades.join(', ')}]`).join('; ');
  
  const prompt = lang === 'fr' 
    ? `Analyse ces notes d'élèves de la plateforme Massar et donne des conseils pédagogiques rapides pour l'enseignant. Sois concis et professionnel. Voici les données: ${studentDataStr}`
    : `حلل هذه النقاط لتلاميذ مسار وقدم نصائح تربوية سريعة للأستاذ. كن مختصراً ومهنياً. البيانات: ${studentDataStr}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: lang === 'fr' 
          ? "Tu es un expert en pédagogie marocaine, spécialisé dans l'analyse des données de la plateforme Massar."
          : "أنت خبير في البيداغوجيا المغربية، متخصص في تحليل بيانات منظومة مسار.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'fr' ? "Impossible de générer les analyses IA pour le moment." : "عذراً، لا يمكن إنشاء التحليلات حالياً.";
  }
};

export const extractGradesFromAudio = async (base64Audio: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'audio/webm', // Assuming MediaRecorder provides webm or mp3
              data: base64Audio,
            },
          },
          {
            text: "Listen to the teacher reading grades. Extract a list of students and their grades. Return ONLY a JSON array with this structure: [{ \"name\": \"spoken_name\", \"grade\": number }]. If no grade is heard, ignore. Do not add markdown code blocks."
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "[]";
    // Clean up if markdown is present despite instructions
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Audio Error:", error);
    return [];
  }
};
