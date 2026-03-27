import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { supabase } from "./services/questionsEngine.js";
import { useUser } from "./context/UserContext.jsx";

// Components
import LoadingScreen from "./components/LoadingScreen";
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

  // Memoize syncUser so it doesn't change on every render
  const syncUser = useCallback(
    async (currentSession, isMounted) => {
      if (!isMounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        // Fetch profile and wait for it
        await refreshProfile(currentSession.user.id);
      }

      if (isMounted) setIsAuthLoading(false);
    },
    [refreshProfile],
  );

  useEffect(() => {
    let mounted = true;

    // 1. Initial Session Check
    const getInitialSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      await syncUser(initialSession, mounted);
    };

    getInitialSession();

    // 2. Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      syncUser(newSession, mounted);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncUser]);

  const handleOnboardingComplete = async (profileData) => {
    try {
      if (!session?.user) return;

      const { error } = await supabase.from("user_profiles").upsert({
        id: session.user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Force refresh profile so the UI updates and redirects to /app
      await refreshProfile(session.user.id);
    } catch (error) {
      console.error("Onboarding Error:", error.message);
    }
  };

  // Determine global loading state
  // We only care about isProfileLoading IF we have a session
  const isGlobalLoading = isAuthLoading || (session && isProfileLoading);

  if (isGlobalLoading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
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

          {/* Logic: Need Session? -> Need Profile? -> Go to Onboarding or App */}
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

          {/* Wildcard Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default AppContent;
