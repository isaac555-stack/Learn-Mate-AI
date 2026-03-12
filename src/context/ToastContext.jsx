import React, { createContext, useState, useContext, useCallback } from "react";
import { Snackbar, Alert, Slide, useMediaQuery, useTheme } from "@mui/material";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // useCallback prevents unnecessary re-renders of components using showToast
  const showToast = useCallback((msg, type = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000} // Slightly faster for a snappier feel
        onClose={handleClose}
        // Moves toast to the top on mobile so it's not hidden by the keyboard/thumbs
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
        TransitionComponent={(props) => (
          <Slide {...props} direction={isMobile ? "down" : "up"} />
        )}
        sx={{ mt: isMobile ? 2 : 0 }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          elevation={6} // Adds a nice shadow for a "floating" look
          sx={{
            width: "100%",
            borderRadius: "16px", // Matches your Library cards
            fontWeight: 700,
            fontSize: "0.9rem",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
