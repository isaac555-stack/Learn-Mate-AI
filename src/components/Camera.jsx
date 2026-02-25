{
  /* 3. CHAT & CONTROL DOCK */
}
import React, { useState } from "react";
import {
  Save,
  PhotoCamera,
  VolumeUp,
  Stop,
  Send,
  Download,
} from "@mui/icons-material";
import {
  Box,
  Fab,
  Button,
  Stack,
  TextField,
  IconButton,
  Chip,
  Container,
  Tooltip,
  Badge,
} from "@mui/material";
import { speak, stopSpeech } from "../services/speechService";
import { explainFurther, processNotes } from "../services/aiService";
import { downloadNoteAsPDF } from "../services/downloadService";

const InputField = (summary, saveSummary, setSummary) => {
  const [isDeepDiving, setIsDeepDiving] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [metadata, setMetadata] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onFinishAndSummarize = async () => {
    if (pages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await processNotes(pages);
      if (result) {
        setSummary(result.summaryText);
        setMetadata(result.metadata);
        setPages([]);
      }
    } catch (error) {
      console.error(error);
      alert("Omo, network is acting up. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExplain = async () => {
    if (!userQuery.trim()) return;
    setIsDeepDiving(true);
    try {
      const deepDive = await explainFurther(summary, userQuery);
      setSummary(
        (prev) => `${prev}\n\n---\n\n### 💡 Teacher's Deep Dive\n${deepDive}`,
      );
    } finally {
      setIsDeepDiving(false);
      setUserQuery("");
    }
  };

  const handleSpeech = async () => {
    if (isSpeaking) {
      await stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        const cleanText = summary.replace(/[#*_-]/g, "").trim();
        await speak(cleanText);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSpeaking(false);
      }
    }
  };
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        p: 2,
        zIndex: 1100,
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <Container maxWidth="md" disableGutters>
        {/* Action Buttons Row */}
        {summary && (
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Tooltip title="Download PDF">
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download />}
                onClick={() => downloadNoteAsPDF(summary, metadata)}
                sx={{ borderRadius: "10px" }}
              >
                PDF
              </Button>
            </Tooltip>
            <Tooltip title="Save to Notebook">
              <Button
                size="small"
                variant="outlined"
                startIcon={<Save />}
                onClick={() => saveSummary(summary, metadata)}
                sx={{ borderRadius: "10px" }}
              >
                Save
              </Button>
            </Tooltip>
            <Button
              size="small"
              variant="contained"
              color={isSpeaking ? "error" : "primary"}
              startIcon={isSpeaking ? <Stop /> : <VolumeUp />}
              onClick={handleSpeech}
              sx={{ borderRadius: "10px", px: 2 }}
            >
              {isSpeaking ? "Stop" : "Read Aloud"}
            </Button>
          </Stack>
        )}

        {/* Input Area */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {pages.length > 0 && !summary && (
            <Badge badgeContent={pages.length} color="error">
              <Chip label="Pages" size="small" sx={{ fontWeight: 800 }} />
            </Badge>
          )}

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              bgcolor: "#f1f5f9",
              borderRadius: "20px",
              px: 2.5,
              py: 0.5,
              border: "1px solid #e2e8f0",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              variant="standard"
              placeholder={
                summary
                  ? "Ask Oga Tutor a question..."
                  : "Scan notes to unlock chat"
              }
              disabled={!summary}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleExplain())
              }
              InputProps={{ disableUnderline: true }}
              sx={{ py: 1, fontSize: "0.95rem" }}
            />
            <IconButton
              onClick={handleExplain}
              disabled={!userQuery.trim() || isDeepDiving}
              color="primary"
            >
              <Send />
            </IconButton>
          </Box>

          {!isCapturing && (
            <Fab
              color="primary"
              onClick={() => setIsCapturing(true)}
              size="medium"
              sx={{ boxShadow: "0 10px 20px rgba(99,102,241,0.3)" }}
            >
              <PhotoCamera />
            </Fab>
          )}

          {pages.length > 0 && !summary && (
            <Button
              variant="contained"
              onClick={onFinishAndSummarize}
              sx={{
                height: "48px",
                borderRadius: "14px",
                px: 4,
                fontWeight: 700,
              }}
            >
              Analyze
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};


