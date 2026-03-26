import { useEffect, useRef } from "react";
import {
  Box,
  Stack,
  IconButton,
  TextField,
  Tooltip,
  alpha,
  useTheme,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import { Save, VolumeUp, Stop, Send, PhotoCamera } from "@mui/icons-material";
import PagesPreview from "./PagesPreview";

const ControlBar = ({
  summary,
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
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const isProcessing = isAnalyzing || isDeepDiving;
  const isDarkMode = theme.palette.mode === "dark";

  // Auto-focus input when summary is ready
  useEffect(() => {
    if (summary && !isProcessing && inputRef.current) {
      const timer = setTimeout(() => inputRef.current.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [summary, isProcessing]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 12, md: 24 },
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "96%", md: "100%" },
        maxWidth: "800px",
        px: 2,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper", // Theme aware
          backgroundImage: isDarkMode
            ? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
            : "none",
          boxShadow: isDarkMode
            ? "0 4px 20px rgba(0,0,0,0.5)"
            : "0 2px 12px rgba(0,0,0,0.08)",
          borderRadius: "28px",
          p: "10px 14px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* Attachment Preview Area */}
        <PagesPreview pages={pages} setPages={setPages} />

        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="flex-end" spacing={1}>
            <TextField
              fullWidth
              inputRef={inputRef}
              disabled={!summary || isProcessing}
              multiline
              maxRows={10}
              variant="standard"
              placeholder={
                summary ? "Ask PrepFlow..." : "Snap notes to start..."
              }
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && userQuery.trim()) {
                  e.preventDefault();
                  handleExplain();
                }
              }}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontSize: "1rem",
                    px: 1.5,
                    py: 1,
                    color: "text.primary",
                    fontWeight: 400,
                  },
                },
              }}
            />

            {/* Action Button */}
            <Box sx={{ mb: 0.5 }}>
              {!summary && pages.length > 0 ? (
                <IconButton
                  onClick={onFinishAndSummarize}
                  disabled={isAnalyzing}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 44,
                    height: 44,
                    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": {
                      bgcolor: alpha(theme.palette.text.disabled, 0.1),
                    },
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleExplain}
                  disabled={!userQuery.trim() || isProcessing}
                  sx={{
                    color: userQuery.trim() ? "primary.main" : "text.disabled",
                    transition: "color 0.2s",
                    p: 1.5,
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Stack>

          {/* Bottom Toolbar Utilities */}
          {summary && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between" // 👈 Pushes Speak to left and Camera to right
              sx={{
                pt: 1.5,
                mt: 1.5,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              }}
            >
              {/* LEFT SIDE: Speech */}
              <Tooltip title={isSpeaking ? "Stop" : "Listen to Summary"}>
                <IconButton
                  onClick={handleSpeech}
                  size="small"
                  sx={{
                    color: isSpeaking ? "primary.main" : "text.secondary",
                    bgcolor: isSpeaking
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {isSpeaking ? (
                    <Stop fontSize="small" />
                  ) : (
                    <VolumeUp fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              {/* CENTER: Processing Indicator */}
              {isProcessing && (
                <Fade in={isProcessing}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={12} thickness={6} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        color: "primary.main",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Thinking...
                    </Typography>
                  </Stack>
                </Fade>
              )}

              {/* RIGHT SIDE: Camera */}
              <Tooltip title="Add more pages">
                <IconButton
                  onClick={onOpenCamera}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ControlBar;
