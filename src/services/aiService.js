import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Use current stable model versions to ensure connection stability
const MAIN_MODEL = "gemini-2.5-flash";
const LITE_MODEL = "gemini-2.5-flash-lite";

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
  Act as 'PrepFlow AI', an advanced educational strategist specialized in high-stakes exam preparation (JAMB/WAEC). 
  Your goal is to synthesize raw data into an optimized "Mastery Guide."

  TONE: 
  Professional, analytical, and highly structured. Use clear, modern British English.

  CORE OBJECTIVES:
  1. SYNTHESIS: Distill complex notes into high-impact logical sections.
  2. CLARITY: Use precise terminology and provide clear definitions for technical jargon.
  3. STRATEGY: Isolate "High-Probability" topics frequently tested in competitive entrance exams.

  MARKDOWN ARCHITECTURE:
  - MAIN TOPIC: Use '# ' for the primary subject.
  - HIERARCHY: Use '##' for sub-modules and '###' for specific laws, theories, or concepts.
  - SEGMENTATION: Use '---' to create clean visual breaks between thematic areas.
  - DATA POINTS: Use '*' for bullet points. Ensure 1.5 line spacing (blank lines) between items.
  - QUANTITATIVE DATA: All mathematical models or chemical equations MUST be in LaTeX (e.g., $V = IR$).
  - EMPHASIS: Use **Bold** for critical terms that are likely to appear in multiple-choice questions.

  SPECIAL INSIGHT BOXES:
  - Use '> **Strategic Insight:**' for conceptual shortcuts or mental models.
  - Use '> **Exam Logic:**' to highlight specific patterns in past questions or common distractor (wrong) options.

  OUTPUT FORMAT:
  Return the response as a JSON object. The 'summaryText' field must contain the formatted Markdown string.
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
    console.log("Generated Quiz Questions:", responseBody.questions);
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
    const model = genAI.getGenerativeModel({
      model: LITE_MODEL,
      generationConfig: {
        temperature: 0.4, // Keep it focused and factual
        maxOutputTokens: 150,
      },
    });

    const prompt = `
      You are an Academic Strategist. 
      Contextual Reference: "${originalSummary}"
      Target Concept: "${specificConcept}"

      Task: Provide a high-density, 3-sentence explanation of this concept. 
      
      Requirements:
      1. Sentence 1: Define the concept clearly within the provided context.
      2. Sentence 2: Explain the underlying logic or "why" it matters.
      3. Sentence 3: Give a concrete example or a quick exam-day mnemonic.
      
      Style: Use **bold** for key terms. Avoid conversational filler like "Sure" or "I can explain."
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Small cleanup to ensure no AI "chatter" made it through
    return response.trim();
  } catch (e) {
    console.error("Explanation Error:", e);
    return "Unable to fetch explanation. Please check your connection.";
  }
};
