import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export async function analyzeRoomPhoto(base64Image: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Analyze this architectural/interior photo. Identify the room type, estimate visible dimensions if possible, and describe the layout and key features. Provide a professional architectural summary.",
          },
        ],
      },
    });

    return response.text || "Unable to analyze the image.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "Error analyzing image. Please ensure the file is a valid image.";
  }
}
