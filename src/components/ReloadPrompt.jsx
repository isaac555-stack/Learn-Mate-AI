import { useRegisterSW } from "virtual:pwa-register/react";
import { Snackbar, Button, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("PWA Registered", r);
    },
  });

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Toast for New Content / Updates */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert
          severity="info"
          variant="filled"
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={() => updateServiceWorker(true)}
                sx={{ fontWeight: "bold" }}
              >
                RELOAD
              </Button>
              <IconButton size="small" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          New version available!
        </Alert>
      </Snackbar>

      {/* Optional: Toast for Offline Readiness */}
      <Snackbar
        open={offlineReady}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          App is ready to work offline!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ReloadPrompt;
