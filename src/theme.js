import { alpha } from "@mui/material";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      // Adaptive Blue: Standard for light, slightly desaturated/lighter for dark
      main: mode === "dark" ? "#8AB4F8" : "#1b6ef3",
    },
    background: {
      default: mode === "dark" ? "#131314" : "#f0f4f9", // Gemini exact page bg
      paper: mode === "dark" ? "#1e1f20" : "#ffffff", // Gemini exact card bg
    },
    text: {
      primary: mode === "dark" ? "#e3e3e3" : "#393939",
      secondary: mode === "dark" ? "#c4c7c5" : "#444746",
    },
    divider: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  },
  typography: {
    // Google Sans is the secret sauce. Fallback to Inter or Roboto.
    fontFamily:
      '"Google Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 400, letterSpacing: "0em" },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: {
    borderRadius: 16, // Global baseline
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // Gemini buttons ARE actually pills, but very clean
          padding: "10px 24px",
          boxShadow: "none",
          fontWeight: 500,
          "&:hover": {
            boxShadow: "none",
            backgroundColor:
              mode === "dark"
                ? "rgba(138, 180, 248, 0.08)"
                : "rgba(27, 110, 243, 0.04)",
          },
        },
        contained: {
          backgroundColor: mode === "dark" ? "#8AB4F8" : "#1b6ef3",
          color: mode === "dark" ? "#000" : "#fff",
          "&:hover": {
            backgroundColor: mode === "dark" ? "#aecbfa" : "#1967d2",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 10, // Cards in Gemini are slightly rounder than buttons
          border: mode === "dark" ? "1px solid rgba(255,255,255,0.05)" : "none",
          boxShadow: "none", // Gemini relies on subtle borders or background contrast
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 28, // The search/input bar is always a full pill
            backgroundColor: mode === "dark" ? "#1e1f20" : "#ffffff",
            padding: "4px 12px",
            "& fieldset": {
              border: `1px solid ${mode === "dark" ? "#444746" : "#c4c7c5"}`,
            },
            "&:hover fieldset": {
              borderColor: mode === "dark" ? "#e3e3e3" : "#1f1f1f",
            },
            "&.Mui-focused fieldset": {
              border: `2px solid ${mode === "dark" ? "#8AB4F8" : "#1b6ef3"}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor:
            mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          "&:hover": {
            backgroundColor:
              mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          },
        },
      },
    },
  },
});
