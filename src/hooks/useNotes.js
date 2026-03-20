import { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/useToast";
import { supabase } from "../services/questionsEngine";

export const useNotes = () => {
  const showToast = useToast();
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Cloud Notes
  const fetchNotes = useCallback(
    async (isMounted) => {
      try {
        const { data, error } = await supabase
          .from("user_notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (isMounted) setSavedNotes(data || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
        if (isMounted) showToast("Failed to load cloud notes. ❌");
      }
    },
    [showToast],
  );

  // 2. Migration Logic
  const syncLegacyNotesToCloud = useCallback(
    async (userId, notes, isMounted) => {
      if (isMounted) showToast("Syncing your old notes to the cloud... 🔄");

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

        localStorage.removeItem("prepflow_notes");
        if (isMounted)
          showToast("All your old notes are now safe in the cloud! ☁️");
      } catch (error) {
        console.error("Migration error:", error.message);
        if (isMounted) showToast("Migration failed. We'll try again later. ⚠️");
      }
    },
    [showToast],
  );

  // 3. Main Initialization Logic
  useEffect(() => {
    let isMounted = true;

    const initializeNotes = async () => {
      if (!isMounted) return;
      setLoading(true);

      try {
        // 1. Use getSession instead of getUser to avoid the lock-fight
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        const user = session?.user;

        if (!isMounted) return;

        if (user) {
          // Logic for logged in user (Sync & Fetch)
          const localData = localStorage.getItem("prepflow_notes");
          const legacyNotes = localData ? JSON.parse(localData) : [];
          if (legacyNotes.length > 0) {
            await syncLegacyNotesToCloud(user.id, legacyNotes, isMounted);
          }
          await fetchNotes(isMounted);
        } else {
          // Logic for guest user
          const localData = localStorage.getItem("prepflow_notes");
          setSavedNotes(localData ? JSON.parse(localData) : []);
        }
      } catch (err) {
        // Ignore the specific "Lock" error in console if it still chirps
        if (!err.message.includes("Lock")) {
          console.error("Init error:", err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeNotes();

    return () => {
      isMounted = false; // Cleanup to prevent AbortError state updates
    };
  }, [fetchNotes, syncLegacyNotesToCloud]);

  // 4. Save Logic
  const saveNote = async (content, metadata) => {
    if (!content?.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const tempNote = {
        id: Date.now(),
        content,
        ...metadata,
        created_at: new Date().toISOString(),
      };
      const existing = JSON.parse(
        localStorage.getItem("prepflow_notes") || "[]",
      );
      localStorage.setItem(
        "prepflow_notes",
        JSON.stringify([tempNote, ...existing]),
      );
      setSavedNotes((prev) => [tempNote, ...prev]);
      showToast("Saved locally. Log in to sync! 🔐");
      return;
    }

    const newNote = {
      user_id: user.id,
      content,
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
    };

    try {
      const { data, error } = await supabase
        .from("user_notes")
        .insert([newNote])
        .select();
      if (error) throw error;
      setSavedNotes((prev) => [data[0], ...prev]);
      showToast(`Saved to Cloud! ☁️`);
    } catch (error) {
      showToast("Cloud save failed. ❌");
    }
  };

  // 5. Delete Logic
  const deleteNote = async (id) => {
    if (typeof id === "number") {
      const existing = JSON.parse(
        localStorage.getItem("prepflow_notes") || "[]",
      );
      const filtered = existing.filter((n) => n.id !== id);
      localStorage.setItem("prepflow_notes", JSON.stringify(filtered));
      setSavedNotes((prev) => prev.filter((note) => note.id !== id));
      showToast("Local note removed. 🗑️");
      return;
    }

    try {
      const { error } = await supabase.from("user_notes").delete().eq("id", id);
      if (error) throw error;
      setSavedNotes((prev) => prev.filter((note) => note.id !== id));
      showToast("Note deleted from cloud. 🗑️");
    } catch (error) {
      showToast("Could not delete note. ❌");
    }
  };

  return { savedNotes, saveNote, deleteNote, loading };
};
