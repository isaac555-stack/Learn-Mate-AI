import { useEffect, useRef } from "react";
import {
  Box,
  Stack,
  IconButton,
  TextField,
  Tooltip,
  alpha,
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
  const inputRef = useRef(null);
  const isProcessing = isAnalyzing || isDeepDiving;

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
        bottom: { xs: 8, md: 24 },
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "95%", md: "100%" },
        maxWidth: "800px",
        px: 2,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          boxShadow: "0 1px 2px rgba(32,33,36,.28)",
          borderRadius: "28px",
          p: "12px 16px",
          transition: "all 0.2s ease-in-out",
          border: "1px solid transparent",
          "&:focus-within": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Attachment Preview Area */}
        <PagesPreview pages={pages} setPages={setPages} />

        <Stack spacing={1}>
          <Stack direction="row" alignItems="flex-end" spacing={1}>
            {/* Middle: The Input */}
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
                    px: 1,
                    py: 1,
                    color: "#1f1f1f",
                    fontFamily: "'Google Sans', Roboto, sans-serif",
                  },
                },
              }}
            />

            {/* Right: The Dynamic Action Button */}
            <Box sx={{ mb: 0.5 }}>
              {!summary && pages.length > 0 ? (
                // Summarize Mode
                <IconButton
                  onClick={onFinishAndSummarize}
                  disabled={isAnalyzing}
                  sx={{
                    bgcolor: "#1a73e8",
                    color: "#fff",
                    width: 40,
                    height: 40,
                    "&:hover": { bgcolor: "#1557b0" },
                    "&.Mui-disabled": { bgcolor: "#c4c7c5" },
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              ) : (
                // Chat Mode
                <IconButton
                  onClick={handleExplain}
                  disabled={!userQuery.trim() || isProcessing}
                  sx={{
                    color: userQuery.trim() ? "#1a73e8" : "#c4c7c5",
                    p: 1.2,
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Stack>

          {/* Bottom Toolbar: Utilities */}
          {summary && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between" // Pushes groups to opposite ends
              sx={{
                pt: 1,
                mt: 0.5,
                borderTop: "1px solid",
                borderColor: alpha("#000", 0.04), // Very subtle divider
              }}
            >
              {/* Left Side: Output/Management Tools */}
              <Stack direction="row" spacing={1}>
                <Tooltip title={isSpeaking ? "Stop" : "Listen"}>
                  <IconButton
                    onClick={handleSpeech}
                    size="small"
                    sx={{
                      color: isSpeaking ? "#1a73e8" : "#444746",
                      bgcolor: isSpeaking
                        ? alpha("#1a73e8", 0.1)
                        : "transparent",
                      p: 1,
                      "&:hover": {
                        bgcolor: isSpeaking
                          ? alpha("#1a73e8", 0.15)
                          : alpha("#444746", 0.08),
                      },
                    }}
                  >
                    {isSpeaking ? (
                      <Stop sx={{ fontSize: 20 }} />
                    ) : (
                      <VolumeUp sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
              {/* Right Side: Creation/Input Tools */}
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Add more pages">
                  <IconButton
                    onClick={onOpenCamera}
                    size="small"
                    sx={{
                      color: "#444746",
                      p: 1,
                      "&:hover": { bgcolor: alpha("#444746", 0.08) },
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ControlBar;
