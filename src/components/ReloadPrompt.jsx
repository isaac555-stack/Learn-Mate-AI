import { useRegisterSW } from "virtual:pwa-register/react";
import {
  Snackbar,
  Button,
  Alert,
  IconButton,
  Box,
  Slide,
  alpha,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon, Update, CloudDone } from "@mui/icons-material";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function ReloadPrompt() {
  const theme = useTheme();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("PrepFlow Service Worker Active");
    },
    onRegisterError(error) {
      console.error("SW Registration failed", error);
    },
  });

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const alertStyles = {
    borderRadius: "16px",
    fontWeight: 600,
    boxShadow: "0 12px 32px -4px " + alpha(theme.palette.common.black, 0.2),
    backdropFilter: "blur(10px)",
    width: "100%",
    "& .MuiAlert-icon": {
      fontSize: 28,
      alignItems: "center",
    },
  };

  return (
    <>
      {/* 1. NEW VERSION / UPDATE TOAST */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        sx={{ mb: { xs: 2, md: 4 }, px: 2 }}
      >
        <Alert
          severity="info"
          sx={{
            ...alertStyles,
            bgcolor: alpha(theme.palette.info.dark, 0.9),
            color: "white",
          }}
          action={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => updateServiceWorker(true)}
                sx={{
                  fontWeight: 900,
                  borderRadius: "10px",
                  bgcolor: alpha("#fff", 0.15),
                  px: 2,
                  "&:hover": { bgcolor: alpha("#fff", 0.25) },
                }}
              >
                UPDATE NOW
              </Button>
              <IconButton size="small" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          A new version of PrepFlow is ready!
        </Alert>
      </Snackbar>

      {/* 2. OFFLINE READY TOAST */}
      <Snackbar
        open={offlineReady}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={TransitionUp}
        sx={{ mb: { xs: 2, md: 4 }, px: 2 }}
      >
        <Alert
          severity="success"
          icon={<CloudDone fontSize="inherit" />}
          sx={{
            ...alertStyles,
            bgcolor: alpha(theme.palette.success.dark, 0.9),
            color: "white",
          }}
          onClose={handleClose}
        >
          Offline mode enabled! Study anywhere.
        </Alert>
      </Snackbar>
    </>
  );
}

export default ReloadPrompt;
