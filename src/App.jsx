import "./App.css";
import { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Box, CircularProgress, Typography, alpha } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

// Services & Context
import { supabase } from "./services/questionsEngine.js";
import { ToastProvider } from "./context/ToastProvider";
import { UserProvider, useUser } from "./context/UserContext.jsx";

// Pages & Components
import Scanner from "./components/Scanner";
import LandingPage from "./pages/LandingPage";
import ReloadPrompt from "./components/ReloadPrompt";
import Legal from "./pages/Legal";
import ContactSection from "./pages/ContactPage.jsx";
import OnboardingFlow from "./components/UserInfo.jsx";

/**
 * 1. LOADING OVERLAY
 * Extracted to keep the main logic clean.
 */
const LoadingScreen = ({ message = "PrepFlow is igniting..." }) => (
  <Box
    sx={{
      bgcolor: "#050614",
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
        mb: 2,
      }}
    >
      <CircularProgress
        size={80}
        thickness={2}
        sx={{ color: "#6366F1", position: "absolute" }}
      />
      <RocketLaunch sx={{ color: "#FFF", fontSize: 32, opacity: 0.8 }} />
    </Box>
    <Typography
      variant="h4"
      sx={{
        color: alpha("#FFF", 0.6),
        fontWeight: 800,
        letterSpacing: 2,
        textTransform: "uppercase",
        fontSize: "1.2rem",
      }}
    >
      {message}
    </Typography>
  </Box>
);

function AppContent() {
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { profile, refreshProfile, loading: isProfileLoading } = useUser();

  // Handle Authentication State
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) refreshProfile(session.user.id);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) refreshProfile(session.user.id);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  const handleOnboardingComplete = async (profileData) => {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: session.user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await refreshProfile(session.user.id);
    } catch (error) {
      console.error("Onboarding Error:", error.message);
    }
  };

  // Determine if we are still "Waiting" for the full user state
  const isGlobalLoading = isAuthLoading || (session && isProfileLoading);

  if (isGlobalLoading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#050614",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              !session ? <LandingPage /> : <Navigate to="/onboarding" replace />
            }
          />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<ContactSection />} />

          {/* Onboarding Logic */}
          <Route
            path="/onboarding"
            element={
              session ? (
                profile ? (
                  <Navigate to="/app" replace />
                ) : (
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Main App Protected Route */}
          <Route
            path="/app"
            element={
              session && profile ? (
                <Scanner />
              ) : (
                <Navigate to={session ? "/onboarding" : "/"} replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <ToastProvider>
          <Analytics />
          <ReloadPrompt />
          <AppContent />
        </ToastProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
