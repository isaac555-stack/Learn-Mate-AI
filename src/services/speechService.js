import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";

/**
 * Normalizes text for better Nigerian accent pronunciation.
 */
const prepareNaijaText = (text) => {
  return text
    .replace(/[#*$_/-]/g, "") // Remove Markdown
    .replace(/\bwaec\b/gi, "W-A-E-C")
    .replace(/\bjamb\b/gi, "JAMB")
    .replace(/\bto\b/gi, "to")
    .replace(/\bna\b/gi, "nah")
    .replace(/o\b/g, "oh")
    .trim();
};

/**
 * MAIN SPEAK FUNCTION
 * Detects if on native mobile or web browser
 */
export const speak = async (text) => {
  const cleanText = prepareNaijaText(text);

  if (Capacitor.isNativePlatform()) {
    // --- MOBILE LOGIC (Capacitor) ---
    try {
      await TextToSpeech.stop();
      return await TextToSpeech.speak({
        text: cleanText,
        lang: "en-GB",
        rate: 0.9,
        pitch: 1.0,
        volume: 1.0,
        category: "ambient",
      });
    } catch (error) {
      console.warn("Capacitor TTS failed, falling back...", error);
    }
  } else {
    // --- WEB LOGIC (Browser) ---
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-GB";
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
};

/**
 * STOP SPEECH
 */
export const stopSpeech = async () => {
  if (Capacitor.isNativePlatform()) {
    await TextToSpeech.stop();
  } else {
    window.speechSynthesis.cancel();
  }
};

/**
 * DOWNLOAD AUDIO (Google Cloud TTS)
 */
export const downloadAudio = async (text) => {
  const cleanText = prepareNaijaText(text);
  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  const requestBody = {
    input: { text: cleanText },
    voice: {
      languageCode: "en-GB",
      name: "en-GB-Neural2-B",
      ssmlGender: "MALE",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify(requestBody),
      },
    );

    const data = await response.json();
    if (!data.audioContent) throw new Error("No audio content returned");

    const audioBlob = new Blob(
      [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" },
    );

    const url = window.URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Oga_Tutor_Lesson.mp3");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Audio Download Error:", error);
    alert("Omo, couldn't generate the MP3. Check your API key!");
  }
};
