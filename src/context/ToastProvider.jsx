import React, { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";

import { Snackbar, Alert, Slide, useMediaQuery, useTheme } from "@mui/material";

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        autoHideDuration={3000}
        onClose={handleClose}
        // This is the magic part:
        sx={{
          mt: isMobile ? 2 : 0,
          // If it's closed, don't let it block clicks
          pointerEvents: open ? "auto" : "none",
          zIndex: 9999, // Ensure it's high, but only when open
        }}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
        TransitionComponent={(props) => (
          <Slide {...props} direction={isMobile ? "down" : "up"} />
        )}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "16px",
            fontWeight: 700,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
