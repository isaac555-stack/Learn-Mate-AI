import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Box } from "@mui/material";

// Context & Theme
import { UserProvider } from "./context/UserContext.jsx";
import { ToastProvider } from "./context/ToastProvider";
import ColorModeProvider from "./context/ColorMode"; // The Gemini-style theme provider
import AppContent from "./AppContent.jsx";

function App() {
  return (
    <Router>
      <ColorModeProvider>
        <UserProvider>
          <ToastProvider>
            <Analytics />
            <AppContent />
          </ToastProvider>
        </UserProvider>
      </ColorModeProvider>
    </Router>
  );
}

export default App;
