import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Use current stable model versions to ensure connection stability
const MAIN_MODEL = "gemini-2.5-flash";
const LITE_MODEL = "gemini-2.0-flash-lite";

/**
 * UTILITY: Compresses base64 images to reduce payload size
 * This prevents ERR_CONNECTION_CLOSED by keeping the POST body small.
 */
const compressImage = (base64Str, maxWidth = 1024, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str.startsWith("data:")
      ? base64Str
      : `data:image/jpeg;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      // Return raw base64 without the data:image/jpeg;base64, prefix
      resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
    };
  });
};

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

    // Compress all images in parallel before sending
    const compressedImages = await Promise.all(
      imagesArray.map((img) => compressImage(img)),
    );

    const imageParts = compressedImages.map((base64Data) => ({
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    }));

    const prompt = `
      Act as 'A School Teacher with years of experience' for a JAMB candidate. Summarise these notes in British English.
      
      CRITICAL LAYOUT RULES:
      1. Use '##' for main titles and '###' for sub-headers.
      2. Use two newlines (\\n\\n) after every header and paragraph.
      3. Use '---' for dividers.
      4. For lists, use '*' with blank lines between items.
      5. Use '> **JAMB Exam Alert:**' for pitfalls.
      
      SCIENTIFIC/MATH NOTATION:
      - Inline: $formula$
      - Block: $$formula$$
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
export const generateQuiz = async (content, count = 5) => {
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
                  options: { type: "array", items: { type: "string" } },
                  correctAnswer: { type: "number" },
                  explanation: { type: "string" },
                },
                required: [
                  "question",
                  "options",
                  "correctAnswer",
                  "explanation",
                ],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const prompt = `Generate exactly ${count} JAMB-standard MCQs based on: ${content}`;
    const result = await model.generateContent(prompt);
    const responseBody = JSON.parse(result.response.text());

    return responseBody.questions || [];
  } catch (e) {
    console.error("Quiz Generation Error:", e);
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
      Explain: "${specificConcept}"
      Role: Experienced Teacher. Format: Max 3 short sentences. Use **bold**.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    return "Network error. Please try again!";
  }
};
