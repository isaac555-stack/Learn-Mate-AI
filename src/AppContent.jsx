import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { supabase } from "./services/questionsEngine.js";
import { useUser } from "./context/UserContext.jsx";

// Components
import LoadingScreen from "./components/LoadingScreen"; // Move that pretty Rocket component here
import Scanner from "./components/Scanner";
import LandingPage from "./pages/LandingPage";
import ReloadPrompt from "./components/ReloadPrompt";
import Legal from "./pages/Legal";
import ContactSection from "./pages/ContactPage.jsx";
import OnboardingFlow from "./components/UserInfo.jsx";
import StudentProfile from "./components/Settings.jsx";

function AppContent() {
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { profile, refreshProfile, loading: isProfileLoading } = useUser();

  useEffect(() => {
    let mounted = true;

    // Helper to sync user data
    const syncUser = async (currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        await refreshProfile(currentSession.user.id);
      }
      if (mounted) setIsAuthLoading(false);
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // Listen for Auth changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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

  // Determine if we show the rocket ship
  const isGlobalLoading = isAuthLoading || (session && isProfileLoading);
  if (isGlobalLoading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default", // Uses theme color
        color: "text.primary",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              !session ? <LandingPage /> : <Navigate to="/app" replace />
            }
          />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<ContactSection />} />

          {/* Protected Onboarding */}
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

          {/* Protected Main App */}
          <Route
            path="/app"
            element={
              session ? (
                profile ? (
                  <>
                    <ReloadPrompt />
                    <Scanner />
                  </>
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected Settings/Profile */}
          <Route
            path="/profile"
            element={
              session ? (
                profile ? (
                  <StudentProfile />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default AppContent;
