import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider";
import Scanner from "./components/Scanner";
import ReloadPrompt from "./components/ReloadPrompt";
import { Analytics } from "@vercel/analytics/react";
import Legal from "./pages/Legal";

import { Box } from "@mui/material";

function App() {
  return (
    <Router>
      <ToastProvider>
        <Analytics />
        <ReloadPrompt />

        {/* Main wrapper to push footer to bottom */}
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Scanner />} />
              <Route path="/legal" element={<Legal />} />
            </Routes>
          </Box>
        </Box>
      </ToastProvider>
    </Router>
  );
}

export default App;
