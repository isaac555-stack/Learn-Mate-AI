import { useState, useEffect } from "react";

export const useNotes = () => {
  // 1. LAZY INITIALIZER: Loads data immediately before the first render.
  // This prevents the "empty array" overwrite bug on reload.
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const notes = localStorage.getItem("study_notes");
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error("LocalStorage load error:", error);
      return [];
    }
  });

  // 2. SYNCHRONIZED STORAGE: Watches for state changes and updates LocalStorage.
  // This removes the need to manually call localStorage.setItem in every function.
  useEffect(() => {
    localStorage.setItem("study_notes", JSON.stringify(savedNotes));
  }, [savedNotes]);

  /**
   * Saves a new note with automatic title fallback.
   */
  const saveNote = (content, metadata) => {
    if (!content || content.trim() === "") return;

    const newNote = {
      id: Date.now(),
      content: content,
      // Metadata Fallback logic: Title -> Topic -> Default String
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
      date: new Date().toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Functional update ensures we have the most current list
    setSavedNotes((prev) => [newNote, ...prev]);

    alert(`Saved ${newNote.title} to ${newNote.subject}! 📚`);
  };

  /**
   * Deletes a note by ID.
   */
  const deleteNote = (id) => {
    setSavedNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return { savedNotes, saveNote, deleteNote };
};
