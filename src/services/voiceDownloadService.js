export const downloadVoiceNote = (text, fileName = "Study_Voice_Note") => {
  try {
    // 1. Clean the text (remove markdown symbols)
    const cleanText = text.replace(/[#*_-]/g, "").substring(0, 200); // Google TTS limit for this endpoint

    // 2. Build the URL
    const encodedText = encodeURIComponent(cleanText);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=en-ng&client=tw-ob`;

    // 3. Bypass CORS by using a direct window download instead of fetch
    // We create an invisible anchor tag and trigger it
    const link = document.createElement("a");
    link.href = audioUrl;
    link.target = "_blank"; // Opens in a new tab if download fails to trigger
    link.download = `${fileName.replace(/\s+/g, "_")}.mp3`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Note: Some browsers will open the audio in a new tab instead of downloading.
    // The student can then just click the "three dots" on the player to save.
    alert(
      "Voice Note opening! If it plays in a new tab, just tap the ⋮ menu to Download. 🎧",
    );
  } catch (error) {
    console.error("Audio download failed", error);
    alert(
      "Omo, browser blocked the download. Try using the 'Listen' button instead.",
    );
  }
};
