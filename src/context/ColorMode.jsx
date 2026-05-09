import { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getDesignTokens } from "../theme.js";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ToggleColorMode({ children }) {
  // 1. Initialize state by checking localStorage first, fallback to 'dark'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("prepflow-theme-mode");
    return savedMode ? savedMode : "dark";
  });

  // 2. Persist to localStorage whenever 'mode' changes
  useEffect(() => {
    localStorage.setItem("prepflow-theme-mode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
