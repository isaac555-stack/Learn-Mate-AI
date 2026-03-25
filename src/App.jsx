import "./App.css";
import { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import {
  Box,
  CircularProgress,
  Typography,
  alpha,
  keyframes,
} from "@mui/material";
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

// Create a subtle floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const LoadingScreen = ({ message = "PrepFlow is preparing your flow..." }) => (
  <Box
    sx={{
      bgcolor: "#050614",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4, // Increased gap slightly for breathing room
      px: 2,
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
      {/* Outer Glow Effect */}
      <Box
        sx={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: alpha("#6366F1", 0.15),
          filter: "blur(20px)",
        }}
      />

      <CircularProgress
        size={90}
        thickness={1.5} // Thinner lines often look more "premium"
        sx={{
          color: "#6366F1",
          position: "absolute",
          filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))",
        }}
      />

      <RocketLaunch
        sx={{
          color: "#FFF",
          fontSize: 36,
          opacity: 0.9,
          animation: `${float} 2s ease-in-out infinite`, // Applying the animation
        }}
      />
    </Box>

    <Typography
      variant="h6"
      sx={{
        color: alpha("#FFF", 0.7),
        fontWeight: 600,
        letterSpacing: "0.1em",
        textAlign: "center",
        textTransform: "uppercase", // Gives it a "system loading" feel
        fontSize: "0.875rem",
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
                <div>
                  {" "}
                  <ReloadPrompt />
                  <Scanner />
                </div>
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

          <AppContent />
        </ToastProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
