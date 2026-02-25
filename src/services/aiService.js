import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Use current stable model versions
const MAIN_MODEL = "gemini-2.5-flash";
const LITE_MODEL = "gemini-2.5-flash";

/**
 * 1. Process Notes (Summarisation)
 */
export const processNotes = async (images) => {
  try {
    const model = genAI.getGenerativeModel({
      model: MAIN_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summaryText: { type: "string" },
            metadata: {
              type: "object",
              properties: {
                title: { type: "string" },
                subject: { type: "string" },
                topic: { type: "string" },
              },
            },
          },
          required: ["summaryText", "metadata"],
        },
      },
    });

    const imagesArray = Array.isArray(images) ? images : [images];
    const imageParts = imagesArray
      .filter((img) => typeof img === "string" && img.length > 500)
      .map((base64Data) => ({
        inlineData: {
          data: base64Data.includes("base64,")
            ? base64Data.split("base64,")[1]
            : base64Data,
          mimeType: "image/jpeg",
        },
      }));

    const prompt = `
      Act as 'Oga Tutor' for a JAMB candidate. Summarise these notes in British English.
      
      CRITICAL LAYOUT RULES:
      1. Use '##' for main titles and '###' for sub-headers.
      2. YOU MUST use two newlines (\\n\\n) after every header and every paragraph.
      3. Use '---' to create horizontal dividers between different concepts.
      4. For lists, use '*' and put each item on its own line with a blank line between items.
      5. Use '> **JAMB Exam Alert:**' for important pitfalls.
      
      SCIENTIFIC/MATH NOTATION RULES:
      - Use single dollar signs for inline formulas like $H_2SO_4$.
      - Use double dollar signs for centered formulas on their own lines like $$V = I \\times R$$.
      - Always ensure formulas have \\n before and after them.
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Processing Error:", error);
    return null;
  }
};

/**
 * 2. Generate Quiz
 */
export const generateQuiz = async (content) => {
  try {
    const model = genAI.getGenerativeModel({
      model: LITE_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 4,
                    maxItems: 4,
                  },
                  correctAnswer: {
                    type: "number",
                    description: "Index of correct option (0-3)",
                  },
                },
                required: ["question", "options", "correctAnswer"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const prompt = `Based on these notes, generate 5 JAMB-standard MCQs in British English: ${content}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()).questions;
  } catch (e) {
    console.error("Quiz Gen Error:", e);
    return [];
  }
};

/**
 * 3. Explain Further
 */
export const explainFurther = async (originalSummary, specificConcept) => {
  try {
    const model = genAI.getGenerativeModel({ model: LITE_MODEL });
    const prompt = `
      Context: ${originalSummary}
      Explain this specific part: "${specificConcept}"
      
      Role: Oga Tutor. 
      Format: Max 3 short sentences. Use **bold** for key terms. Use a "Pro-Tip" tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return ("Omo, network is acting up. Please try again!", e);
  }
};
