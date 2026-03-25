import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/questionsEngine";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows found"
      setProfile(data || null);
    } catch (err) {
      console.error("Context Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ profile, setProfile, refreshProfile, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
