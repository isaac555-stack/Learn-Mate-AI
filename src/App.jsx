import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./services/questionsEngine.js";
import { ToastProvider } from "./context/ToastProvider";
import Scanner from "./components/Scanner";
import LandingPage from "./pages/LandingPage";
import ReloadPrompt from "./components/ReloadPrompt";
import { Analytics } from "@vercel/analytics/react";
import Legal from "./pages/Legal";
import ContactSection from "./pages/ContactPage.jsx";

import { Box, CircularProgress, Typography, alpha } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const INDIGO = "#050614";
  const ACCENT = "#6366F1";

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- TOP-NOTCH LOADING SCREEN ---
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: INDIGO,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={80}
            thickness={2}
            sx={{ color: ACCENT, position: "absolute" }}
          />
          <RocketLaunch sx={{ color: "#FFF", fontSize: 32, opacity: 0.8 }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: alpha("#FFF", 0.6),
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          PrepFlow
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: alpha("#FFF", 0.6),
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: "0.8rem",
          }}
        >
          Preparing your Flow...
        </Typography>
      </Box>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <Analytics />
        <ReloadPrompt />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: INDIGO,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route
                path="/"
                element={
                  !session ? <LandingPage /> : <Navigate to="/app" replace />
                }
              />

              <Route
                path="/app"
                element={session ? <Scanner /> : <Navigate to="/" replace />}
              />

              <Route path="/legal" element={<Legal />} />
              <Route path="/contact" element={<ContactSection />} />
              {/* Catch-all sends back to landing or dashboard depending on auth */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </ToastProvider>
    </Router>
  );
}

export default App;
