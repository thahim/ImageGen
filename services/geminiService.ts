import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Using gemini-2.5-flash-image (Nano Banana) for fast and high-quality image generation
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateImageWithGemini = async (
  prompt: string, 
  referenceImageBase64?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    let contents;
    // Strict instructions for clean output and style
    const baseInstructions = `Generate a high-quality image based on this prompt: "${prompt}".
    
    CRITICAL VISUAL REQUIREMENTS:
    1. NO WATERMARKS: The image must be 100% free of text, logos, signatures, or watermarks.
    2. High Fidelity: Photorealistic or highly detailed artistic style as requested.
    3. Lighting: Cinematic and atmospheric lighting.`;

    if (referenceImageBase64) {
      const imagePart = {
        inlineData: {
          mimeType: 'image/png',
          data: referenceImageBase64,
        },
      };

      const textPart = {
        text: `${baseInstructions}
               
               CHARACTER REFERENCE INSTRUCTION:
               The attached image is a STRICT REFERENCE for the character.
               - You MUST generate the EXACT SAME character as seen in the reference image.
               - Keep the same facial features, hair style, hair color, and body build.
               - Place this exact character into the new scene described in the prompt: "${prompt}".
               - Do not change the character's identity.`
      };

      contents = { parts: [imagePart, textPart] };
    } else {
      contents = {
        parts: [{ text: baseInstructions }]
      };
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
          // Note: imageSize is not supported in gemini-2.5-flash-image
        },
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response. Please try again.");

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};