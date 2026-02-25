import { useState, useEffect } from "react";

export const useNotes = () => {
  const [savedNotes, setSavedNotes] = useState([]);

  // Load notes from LocalStorage on mount
  useEffect(() => {
    const loadNote = () => {
      const notes = JSON.parse(localStorage.getItem("study_notes") || "[]");
      setSavedNotes(notes);
    };
    return loadNote;
  }, []);

  /**
   * Saves a new note with metadata.
   * Prioritizes topic as the title if title is missing.
   */
  const saveNote = (content, metadata) => {
    // Ensure we don't save empty content
    if (!content) return;

    const newNote = {
      id: Date.now(),
      content: content,
      // FIX: If metadata.title is missing, use metadata.topic.
      // If both are missing, use "New Study Note"
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
      date: new Date().toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Update state and LocalStorage
    const updatedNotes = [newNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem("study_notes", JSON.stringify(updatedNotes));

    alert(`Saved ${newNote.title} to ${newNote.subject}! 📚`);
  };

  const deleteNote = (id) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem("study_notes", JSON.stringify(updated));
  };

  return { savedNotes, saveNote, deleteNote };
};
