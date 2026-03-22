import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "../hooks/useToast";
import { supabase } from "../services/questionsEngine";

export const useNotes = () => {
  const showToast = useToast();
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use a ref to prevent double-syncing in Strict Mode
  const isSyncing = useRef(false);

  const syncToLocal = (notes) => {
    localStorage.setItem("study_notes", JSON.stringify(notes));
  };

  // 1. Fetch Cloud Notes
  const fetchNotes = useCallback(async (isMounted) => {
    try {
      const { data, error } = await supabase
        .from("user_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (isMounted) {
        setSavedNotes(data || []);
        syncToLocal(data || []);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      const localData = localStorage.getItem("study_notes");
      if (isMounted && localData) setSavedNotes(JSON.parse(localData));
    }
  }, []);

  // 2. Migration Logic (Fixed to prevent duplicates)
  const syncLegacyNotesToCloud = useCallback(
    async (userId, notes, isMounted) => {
      if (isSyncing.current || notes.length === 0) return;
      isSyncing.current = true;

      // STEP 1: Immediately remove from localStorage so second render sees nothing
      localStorage.removeItem("study_notes");

      if (isMounted) showToast("Syncing offline notes... 🔄");

      const formattedNotes = notes.map((note) => ({
        user_id: userId,
        content: note.content || "",
        title: note.title || note.topic || "Legacy Note",
        subject: note.subject || "General",
        topic: note.topic || "Revision",
        created_at: note.created_at || new Date().toISOString(),
      }));

      try {
        const { error } = await supabase
          .from("user_notes")
          .insert(formattedNotes);
        if (error) throw error;

        // STEP 2: Now that they are safe in cloud, fetch the official list
        await fetchNotes(isMounted);
        if (isMounted) showToast("Cloud sync complete! ☁️");
      } catch (error) {
        console.error("Migration error:", error.message);
        // If it actually failed, restore the notes to local storage
        localStorage.setItem("study_notes", JSON.stringify(notes));
        isSyncing.current = false;
      }
    },
    [fetchNotes, showToast],
  );

  // 3. Initialization
  useEffect(() => {
    let isMounted = true;
    const initializeNotes = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (!isMounted) return;

        if (user) {
          const localData = localStorage.getItem("study_notes");
          const legacyNotes = localData ? JSON.parse(localData) : [];

          // Only sync if there are "Guest" notes (numeric IDs)
          const hasLocalOnly = legacyNotes.some(
            (n) => typeof n.id === "number",
          );

          if (hasLocalOnly) {
            await syncLegacyNotesToCloud(user.id, legacyNotes, isMounted);
          } else {
            await fetchNotes(isMounted);
          }
        } else {
          const localData = localStorage.getItem("study_notes");
          setSavedNotes(localData ? JSON.parse(localData) : []);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeNotes();
    return () => {
      isMounted = false;
    };
  }, [fetchNotes, syncLegacyNotesToCloud]);

  // 4. Save Logic
  const saveNote = async (content, metadata) => {
    if (!content?.trim()) return;

    // Use an optimistic ID so we can show "Syncing..." in UI
    const tempId = Date.now();
    const baseNote = {
      id: tempId, // Temporary
      content,
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
      created_at: new Date().toISOString(),
      isSyncing: true, // Visual flag
    };

    // Update UI immediately (Optimistic)
    setSavedNotes((prev) => [baseNote, ...prev]);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      const finalNote = { ...baseNote, isSyncing: false };
      const updated = [finalNote, ...savedNotes];
      setSavedNotes(updated);
      syncToLocal(updated);
      showToast("Saved locally. 🔐");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_notes")
        .insert([
          {
            user_id: user.id,
            content: baseNote.content,
            title: baseNote.title,
            subject: baseNote.subject,
            topic: baseNote.topic,
          },
        ])
        .select();

      if (error) throw error;

      // Replace the temp optimistic note with the real DB note
      setSavedNotes((prev) => prev.map((n) => (n.id === tempId ? data[0] : n)));
      // Sync the whole list to cache
      const { data: allNotes } = await supabase
        .from("user_notes")
        .select("*")
        .order("created_at", { ascending: false });
      syncToLocal(allNotes);
      showToast("Saved to cloud! ☁️");
    } catch (error) {
      // Keep it as a local note if cloud fails
      setSavedNotes((prev) =>
        prev.map((n) => (n.id === tempId ? { ...n, isSyncing: false } : n)),
      );
      showToast("Cloud failed, saved locally. ⚠️");
    }
  };

  // 5. Delete Logic
  const deleteNote = async (id) => {
    const originalNotes = [...savedNotes];
    const filtered = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(filtered);
    syncToLocal(filtered);

    if (typeof id === "string") {
      try {
        const { error } = await supabase
          .from("user_notes")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (error) {
        setSavedNotes(originalNotes);
        syncToLocal(originalNotes);
        showToast("Delete failed. Note restored. ❌");
      }
    }
  };

  return { savedNotes, saveNote, deleteNote, loading };
};
