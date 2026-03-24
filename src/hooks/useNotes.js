import { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/useToast";
import { supabase } from "../services/questionsEngine";

export const useNotes = () => {
  const showToast = useToast();
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Notes - Sorted by updated_at
  const fetchNotes = useCallback(
    async (isMounted = true) => {
      try {
        const { data, error } = await supabase
          .from("user_notes")
          .select("*")
          .order("updated_at", { ascending: false }); // Updated sorting column

        if (error) throw error;
        if (isMounted) setSavedNotes(data || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
        showToast("Could not load notes from cloud. ☁️❌");
      }
    },
    [showToast],
  );

  // 2. Initialization
  useEffect(() => {
    let isMounted = true;

    const initializeNotes = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && isMounted) {
        await fetchNotes(isMounted);
      } else if (isMounted) {
        setSavedNotes([]);
      }

      if (isMounted) setLoading(false);
    };

    initializeNotes();
    return () => {
      isMounted = false;
    };
  }, [fetchNotes]);

  // 3. Save/Update Logic (Upsert)
  const saveNote = async (content, metadata, sessionId = null) => {
    if (!content?.trim()) return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      showToast("Please log in to save notes. 🔐");
      return null;
    }

    const isUpdate = !!sessionId;
    const tempId = sessionId || `temp_${Date.now()}`;

    // Optimistic UI Update
    const baseNote = {
      id: tempId,
      content,
      title: metadata?.title || metadata?.topic || "New Study Note",
      subject: metadata?.subject || "General",
      topic: metadata?.topic || "Revision",
      updated_at: new Date().toISOString(), // This drives the sort
    };

    setSavedNotes((prev) => {
      const exists = prev.find((n) => n.id === tempId);
      let updatedList;

      if (exists) {
        updatedList = prev.map((n) =>
          n.id === tempId ? { ...n, ...baseNote } : n,
        );
      } else {
        updatedList = [
          { ...baseNote, created_at: new Date().toISOString() },
          ...prev,
        ];
      }

      // Re-sort immediately so the edited note jumps to the top
      return [...updatedList].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );
    });

    try {
      const payload = {
        user_id: session.user.id,
        ...baseNote,
      };

      if (!isUpdate || tempId.toString().startsWith("temp_")) {
        delete payload.id;
      } else {
        payload.id = sessionId;
      }

      const { data, error } = await supabase
        .from("user_notes")
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSavedNotes((prev) => {
          const newList = prev.map((n) => (n.id === tempId ? data : n));
          return newList.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
          );
        });
        return data.id;
      }
    } catch (error) {
      console.error("Save Error:", error.message);
      fetchNotes(); // Revert on error
      return null;
    }
  };

  // 4. Delete Logic
  const deleteNote = async (id) => {
    const originalNotes = [...savedNotes];
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));

    try {
      const { error } = await supabase.from("user_notes").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      setSavedNotes(originalNotes);
      showToast("Delete failed. Note restored. ❌");
    }
  };

  return {
    savedNotes,
    saveNote,
    deleteNote,
    loading,
    refreshNotes: fetchNotes,
  };
};
