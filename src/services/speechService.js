import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";

let currentUtterance = null; // Track the active utterance

const sanitizeForSpeech = (text) => {
  if (!text) return "";
  return text
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1 over $2")
    .replace(/\\sqrt\{([^}]*)\}/g, "square root of $1")
    .replace(/[#*`~_$]/g, "")
    .replace(/\bwaec\b/gi, "W-A-E-C")
    .replace(/\bjamb\b/gi, "JAMB")
    .replace(/\bna\b/gi, "nah")
    .replace(/\s+/g, " ")
    .trim();
};

const getWebVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.name.includes("Google UK English Male")) ||
    voices.find((v) => v.lang.startsWith("en-GB")) ||
    voices[0]
  );
};

export const speak = async (text) => {
  const cleanText = sanitizeForSpeech(text);

  if (Capacitor.isNativePlatform()) {
    try {
      await TextToSpeech.stop();
      return await TextToSpeech.speak({
        text: cleanText,
        lang: "en-GB",
        rate: 0.85,
        category: "ambient",
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    return new Promise((resolve) => {
      // 1. Clear any existing speech and current reference
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      currentUtterance = utterance; // Store reference to prevent garbage collection

      utterance.voice = getWebVoice();
      utterance.lang = "en-GB";
      utterance.rate = 0.95;

      // 2. Prevent Chrome from "interrupting" long text (The Heartbeat)
      const heartbeat = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(heartbeat);
        }
      }, 14000); // Every 14 seconds

      utterance.onend = () => {
        clearInterval(heartbeat);
        currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        clearInterval(heartbeat);
        currentUtterance = null;
        // Ignore "interrupted" errors in the console as they are usually manual cancels
        if (event.error !== "interrupted") {
          console.error("TTS Error:", event.error);
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
};

export const stopSpeech = async () => {
  if (Capacitor.isNativePlatform()) {
    await TextToSpeech.stop();
  } else {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};
