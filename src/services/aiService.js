import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Stable models for reliability
const MAIN_MODEL = "gemini-2.5-flash";
const LITE_MODEL = "gemini-2.5-flash-lite";

/**
 * UTILITY: Compress base64 images to reduce payload
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
      resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
    };
  });
};

const OFFICIAL_SUBJECTS = [
  "English",
  "Mathematics",
  "Civic",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature",
  "Agriculture",
  "Geography",
  "Commerce",
  "Financial Accounting",
  "Christian Religious Studies",
  "Islamic Studies",
  "Further Mathematics",
  "History",
  "Computer Studies",
  "Data Processing",
  "Marketing",
  "T.D",
  "General",
];

/**
 * 1. Process Notes (Refactored for Personalization)
 */
export const processNotes = async (images, profile = {}) => {
  const {
    name = "Student",
    stream = "science",
    learningStyle = "summaries",
    goal = "exam",
    age = "Senior Secondary",
  } = profile;

  try {
    const model = genAI.getGenerativeModel({
      model: MAIN_MODEL,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are PrepFlow, a personalized AI tutor for ${name}, a ${age} year old student in the ${stream} stream.
          
          MISSION:
          Transform messy notes into a Master Study Guide specifically optimized for ${name}'s goal: ${goal === "exam" ? "Acing WAEC/JAMB" : "Subject Mastery"}.
          
          PEDAGOGICAL STYLE:
          - Style Preference: Follow the '${learningStyle.replace("_", " ")}' format strictly.
          - Context: Use ${stream === "science" ? "logical/scientific" : "creative/historical"} West African analogies.
          - Use 💡, 🎯, and ⚠️ emojis to highlight critical exam insights.
          - Use LaTeX for ALL mathematical or scientific formulas (e.g., $E = mc^2$).
          
        - If the topic involves a cycle, process, or hierarchy, EXPLICITLY include a Mermaid diagram.
         MERMAID RULES:
          1. Always start with 'graph TD' or 'flowchart TD'.
          2. Do NOT use comments (%%) inside the mermaid block.
          3. Always use double quotes for labels with special characters: e.g., A["Energy (kJ)"].
          4. Ensure every opening bracket [ has a matching closing bracket ].
  
          SAFETY:
          - If images are non-academic, provide a friendly mentor response.`,
          },
        ],
      },
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
                subject: { type: "string", enum: OFFICIAL_SUBJECTS },
                topic: { type: "string" },
              },
              required: ["title", "subject", "topic"],
            },
          },
          required: ["summaryText", "metadata"],
        },
      },
    });

    const imagesArray = Array.isArray(images) ? images : [images];
    const compressedImages = await Promise.all(
      imagesArray.map((img) => compressImage(img)),
    );

    const imageParts = compressedImages.map((base64Data) => ({
      inlineData: { data: base64Data, mimeType: "image/jpeg" },
    }));

    const prompt = `
Analyze the attached notes for ${name}. Generate a structured Study Guide using the ${learningStyle} learning preference.

### STRUCTURE:
1. # 📚 [SUBJECT]
   # 📖 [TOPIC]
2. ### 🌟 THE BIG PICTURE
   - Why this matters for a ${stream} student.
3. ### 🧠 CORE CONCEPTS
   - Detailed breakdown using **bold** terms.
4. ### 🍎 RELATABLE ANALOGY
   - A West African market or daily life analogy suited for a ${age} year old.
5. ### 🎯 EXAM FOCUS (${goal === "exam" ? "High Priority" : "General Knowledge"})
   - WAEC/JAMB high-yield facts.
`;

    const result = await model.generateContent([prompt, ...imageParts]);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("AI Processing Error:", error);
    return {
      summaryText:
        "⚠️ **Connection Error:** I couldn't process these notes. Please check your internet.",
      metadata: { title: "Error", subject: "General", topic: "N/A" },
    };
  }
};

/**
 * 2. Explain Further (Refactored for Personalization)
 */
export const explainFurther = async (
  originalSummary,
  specificConcept,
  profile = {},
) => {
  const {
    name = "Student",
    stream = "science",
    learningStyle = "summaries",
  } = profile;

  try {
    const model = genAI.getGenerativeModel({
      model: LITE_MODEL,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are PrepFlow, the personal mentor for ${name}.
          - The student is in the ${stream} stream and prefers ${learningStyle.replace("_", " ")}.
          - Explain "Why" before "What". 
          - Use West African scaffolding (relatable local examples).
          - Focus on WAEC/JAMB application.
          - Explain concepts using text AND Mermaid.js diagrams where visuals help (e.g., flowcharts, sequence diagrams).
          - Use LaTeX for all formulas (e.g., $F = ma$).
          MERMAID RULES:
          1. Always start with 'graph TD' or 'flowchart TD'.
          2. Do NOT use comments (%%) inside the mermaid block.
          3. Always use double quotes for labels with special characters: e.g., A["Energy (kJ)"].
          4. Ensure every opening bracket [ has a matching closing bracket ].
  `,
          },
        ],
      },
      generationConfig: {
        temperature: 0.6,
        topP: 0.95,
      },
    });

    const prompt = `
      LESSON CONTEXT: ${originalSummary}
      STUDENT QUESTION FROM ${name}: ${specificConcept}
    `;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (e) {
    console.error("Explanation Error:", e);
    return "I'm having trouble connecting to the study module.";
  }
};

/**
 * Remaining functions left as is
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

    const prompt = `You are a WAEC/JAMB examiner. Generate ${count} MCQs for: ${content}. Return JSON only.`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text()).questions || [];
  } catch (e) {
    console.error("Quiz Error:", e);
    return [];
  }
};

export const generateLikelyQuestions = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: MAIN_MODEL });
    const prompt = `Expert WAEC examiner: generate 10 likely exam questions for this content: ${content}. Numbered list only.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error(e);
    return "Error generating likely questions.";
  }
};

export const analyzePerformance = async (quizResults) => {
  try {
    const model = genAI.getGenerativeModel({ model: LITE_MODEL });
    const prompt = `AI Tutor: Analyze these results and suggest next steps: ${JSON.stringify(quizResults)}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error(e);
    return "Error analyzing performance.";
  }
};

export const generateFlashcards = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: LITE_MODEL });
    const prompt = `Convert to flashcards Q: A: format: ${content}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const flashcards = [];
    const regex = /Q:\s*(.+?)\s*A:\s*(.+?)(?=\nQ:|$)/gs;
    let match;
    while ((match = regex.exec(text)) !== null) {
      flashcards.push({ question: match[1].trim(), answer: match[2].trim() });
    }
    return flashcards;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const explainSimple = async (concept) => {
  try {
    const model = genAI.getGenerativeModel({ model: LITE_MODEL });
    const prompt = `Explain like I'm 5 with a real-life example (max 4 sentences): ${concept}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error(e);
    return "Error explaining concept.";
  }
};

export const generateSimilarQuestions = async (question) => {
  try {
    const model = genAI.getGenerativeModel({ model: LITE_MODEL });
    const prompt = `Generate 3 questions similar to: ${question}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error(e);
    return [];
  }
};
