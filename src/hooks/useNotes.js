import { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/useToast";
import { supabase } from "../services/questionsEngine";

export const useNotes = () => {
  const showToast = useToast();
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to sync state to local storage
  const syncToLocal = (notes) => {
    localStorage.setItem("study_notes", JSON.stringify(notes));
  };

  // 1. Fetch Cloud Notes & Update Cache
  const fetchNotes = useCallback(
    async (isMounted) => {
      try {
        const { data, error } = await supabase
          .from("user_notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (isMounted) {
          setSavedNotes(data || []);
          syncToLocal(data || []); // Update cache with fresh cloud data
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        // Fallback to cache if cloud fails
        const localData = localStorage.getItem("study_notes");
        if (isMounted && localData) {
          setSavedNotes(JSON.parse(localData));
        }
        if (isMounted) showToast("Offline mode: using cached notes. 📶");
      }
    },
    [showToast],
  );

  // 2. Migration Logic
  const syncLegacyNotesToCloud = useCallback(
    async (userId, notes, isMounted) => {
      if (isMounted) showToast("Syncing offline notes to cloud... 🔄");

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
        // We don't clear local storage here; fetchNotes will overwrite it anyway
        if (isMounted) showToast("Cloud sync complete! ☁️");
      } catch (error) {
        console.error("Migration error:", error.message);
      }
    },
    [showToast],
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

          // Check if there are local-only notes (IDs are numbers)
          const hasLocalOnly = legacyNotes.some(
            (n) => typeof n.id === "number",
          );

          if (hasLocalOnly) {
            await syncLegacyNotesToCloud(user.id, legacyNotes, isMounted);
          }
          await fetchNotes(isMounted);
        } else {
          const localData = localStorage.getItem("study_notes");
          setSavedNotes(localData ? JSON.parse(localData) : []);
        }
      } catch (err) {
        console.error("Init error:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeNotes();
    return () => {
      isMounted = false;
    };
  }, [fetchNotes, syncLegacyNotesToCloud]);

  // 4. Save Logic (Cloud + Local)
  const saveNote = async (content, metadata) => {
    if (!content?.trim()) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    const baseNote = {
      content,
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
      created_at: new Date().toISOString(),
    };

    if (!user) {
      // Guest: Save Local Only
      const tempNote = { id: Date.now(), ...baseNote };
      const updated = [tempNote, ...savedNotes];
      setSavedNotes(updated);
      syncToLocal(updated);
      showToast("Saved locally. 🔐");
    } else {
      // User: Save Cloud then Cache
      try {
        const { data, error } = await supabase
          .from("user_notes")
          .insert([{ ...baseNote, user_id: user.id }])
          .select();

        if (error) throw error;

        const updated = [data[0], ...savedNotes];
        setSavedNotes(updated);
        syncToLocal(updated);
        showToast("Saved to cloud & local! ☁️");
      } catch (error) {
        // Fallback: If cloud fails, save as temporary local note
        const tempNote = { id: Date.now(), ...baseNote };
        const updated = [tempNote, ...savedNotes];
        setSavedNotes(updated);
        syncToLocal(updated);
        showToast("Cloud failed, saved locally. ⚠️");
      }
    }
  };

  // 5. Delete Logic (Optimistic)
  const deleteNote = async (id) => {
    const originalNotes = [...savedNotes];

    // UI Update immediately
    const filtered = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(filtered);
    syncToLocal(filtered);

    if (typeof id === "string") {
      // Cloud Delete
      try {
        const { error } = await supabase
          .from("user_notes")
          .delete()
          .eq("id", id);
        if (error) throw error;
        showToast("Note deleted. 🗑️");
      } catch (error) {
        // Rollback UI if cloud delete fails
        setSavedNotes(originalNotes);
        syncToLocal(originalNotes);
        showToast("Delete failed. Note restored. ❌");
      }
    } else {
      // Simple Local Delete
      showToast("Local note removed. 🗑️");
    }
  };

  return { savedNotes, saveNote, deleteNote, loading };
};
