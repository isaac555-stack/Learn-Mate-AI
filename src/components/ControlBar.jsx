import {
  Box,
  Button,
  Container,
  Chip,
  Stack,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Save,
  VolumeUp,
  Stop,
  Send,
  PhotoCamera,
  AddCircleOutline,
} from "@mui/icons-material";
import { alpha } from "@mui/system";
import PagesPreview from "./PagesPreview";

const ControlBar = ({
  summary,
  saveSummary,
  metadata,
  isSpeaking,
  handleSpeech,
  userQuery,
  setUserQuery,
  handleExplain,
  onFinishAndSummarize,
  pages,
  onOpenCamera,
  setPages,
  isAnalyzing,
  isDeepDiving,
  scanSessionId, // CRITICAL: Received from ScannerTab
}) => {
  // Refactored to pass the scanSessionId (the Supabase UUID)
  const handleManualSave = () => {
    if (saveSummary && summary) {
      // The third argument ensures Supabase performs an UPDATE (Upsert)
      saveSummary(summary, metadata, scanSessionId);
    }
  };

  const isProcessing = isAnalyzing || isDeepDiving;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        bgcolor: "#FFFFFF",
        backdropFilter: "blur(20px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "85%", md: "auto" },
        minWidth: { md: "700px" },
        py: 1.2,
        mb: { xs: 2, md: 3 },

        px: 2,
        zIndex: 1000,
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "35px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <Container maxWidth="md" disableGutters>
        <PagesPreview pages={pages} setPages={setPages} />

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: "32px",
              px: 2,
              py: 0.5,
              transition: "0.3s",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="standard"
              placeholder={
                summary
                  ? "Ask a follow-up question..."
                  : "Snap your notes to start"
              }
              disabled={!summary || isProcessing}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && userQuery.trim()) {
                  e.preventDefault();
                  handleExplain();
                }
              }}
              InputProps={{ disableUnderline: true }}
              sx={{ py: 1, fontSize: "0.95rem" }}
            />

            {summary ? (
              <IconButton
                onClick={handleExplain}
                disabled={!userQuery.trim() || isProcessing}
                sx={{
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <Send
                  sx={{ color: userQuery.trim() ? "#6366F1" : "#cbd5e1" }}
                />
              </IconButton>
            ) : (
              <Button
                variant="contained"
                onClick={onFinishAndSummarize}
                disabled={pages.length < 1 || isAnalyzing}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 900,
                  px: 4,
                  bgcolor: "#000",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                {isAnalyzing ? "Reading..." : "Summarize"}
              </Button>
            )}
          </Box>

          {!summary && (
            <IconButton
              onClick={onOpenCamera}
              disabled={isAnalyzing}
              sx={{
                bgcolor: "#000",
                color: "#fff",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              <PhotoCamera />
            </IconButton>
          )}
        </Stack>

        {summary && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid #f1f5f9" }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<Save sx={{ fontSize: "18px !important" }} />}
                label={isProcessing ? "Syncing..." : "Save Sync"}
                onClick={handleManualSave}
                disabled={isProcessing}
                sx={{
                  borderRadius: "12px",
                  bgcolor: "white",
                  border: "1px solid #e2e8f0",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              />

              <Chip
                icon={isSpeaking ? <Stop /> : <VolumeUp />}
                label={isSpeaking ? "Stop" : "Listen"}
                onClick={handleSpeech}
                disabled={isProcessing}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 700,
                  bgcolor: isSpeaking
                    ? alpha("#ef4444", 0.1)
                    : alpha("#6366F1", 0.1),
                  color: isSpeaking ? "#ef4444" : "#6366F1",
                  border: "1px solid",
                  borderColor: isSpeaking
                    ? alpha("#ef4444", 0.2)
                    : alpha("#6366F1", 0.2),
                }}
              />
            </Stack>

            <Tooltip title="Start New Scan">
              <IconButton
                onClick={onOpenCamera}
                disabled={isProcessing}
                sx={{
                  bgcolor: alpha("#64748b", 0.1),
                  color: "#475569",
                  "&:hover": { bgcolor: alpha("#64748b", 0.2) },
                }}
              >
                <AddCircleOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ControlBar;
