import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Typography,
  Box,
  CircularProgress,
  Fab,
  Button,
  Fade,
  Stack,
  TextField,
  IconButton,
  Chip,
  Container,
  Paper,
  Badge,
  Portal,
} from "@mui/material";
import {
  Save,
  PhotoCamera,
  VolumeUp,
  Stop,
  Description,
  Close,
  Send,
  Download,
  AutoFixHigh,
  HistoryEdu,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { speak, stopSpeech } from "../services/speechService";
import { explainFurther, processNotes } from "../services/aiService";
import { downloadNoteAsPDF } from "../services/downloadService";

// --- FIXED TYPEWRITER COMPONENT ---
const TypewriterEffect = ({ text, speed = 2 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const lastTextRef = useRef("");
  const timerRef = useRef(null);

  const clearExistingTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      lastTextRef.current = "";
      setIsFinished(false);
      return;
    }

    // Determine starting point for appending new text
    let i =
      text.startsWith(lastTextRef.current) && lastTextRef.current !== ""
        ? lastTextRef.current.length
        : 0;

    if (i === 0) {
      setDisplayedText("");
      setIsFinished(false);
    }

    clearExistingTimer();

    timerRef.current = setInterval(() => {
      i++;
      const currentSlice = text.slice(0, i);
      setDisplayedText(currentSlice);
      lastTextRef.current = currentSlice;

      if (i >= text.length) {
        clearExistingTimer();
        setIsFinished(true);
      }
    }, speed);

    return () => clearExistingTimer();
  }, [text, speed]);

  const handleSkip = () => {
    clearExistingTimer();
    setDisplayedText(text);
    lastTextRef.current = text;
    setIsFinished(true);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "150px" }}>
      {!isFinished && (
        <Button
          size="small"
          variant="contained"
          onClick={handleSkip}
          sx={{
            position: "absolute",
            right: 0,
            top: -45,
            zIndex: 10,
            textTransform: "none",
            bgcolor: "white",
            color: "text.secondary",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
          startIcon={<KeyboardDoubleArrowRight />}
        >
          Skip animation
        </Button>
      )}
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "#1f1f1f",
          lineHeight: 1.6,
          fontSize: "0.95rem",
          display: "flex",
          flexDirection: "column", // Stack items vertically

          /* --- GEMINI-STYLE USER BUBBLE (ALIGNED RIGHT) --- */
          "& blockquote": {
            bgcolor: "#f0f4f9", // Gemini light blue-gray
            px: "6px", // Compact
            py: 0,
            mx: 0,
            my: 1.5,
            borderRadius: "20px", // Pill shape
            border: "none",
            color: "#444746",
            fontStyle: "normal",
            alignSelf: "flex-end", // Pushes bubble to the right side
            maxWidth: "80%", // Prevents full-width stretching
            display: "inline-block",
            "& p": {
              m: 0,
              p: 0,
              fontWeight: 500,
              lineHeight: 1.4,
            },
          },

          /* --- AI RESPONSE SECTION (ALIGNED LEFT) --- */
          "& h3": {
            color: "#1a73e8", // Google Blue
            mt: 3,
            mb: 1,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          },

          /* --- MARKDOWN DEFAULTS --- */
          "& h2": {
            color: "#1f1f1f",
            mt: 3,
            mb: 1.5,
            fontWeight: 700,
            fontSize: "1.3rem",
          },
          "& p": { mb: 1.5, width: "100%" }, // Ensure text takes full width
          "& li": {
            display: "flex",
            mb: 0.5,
            "&::before": {
              content: '"•"',
              color: "#1a73e8",
              fontWeight: "bold",
              width: "1.2em",
              flexShrink: 0,
            },
          },
          "& hr": {
            border: "none",
            borderTop: "1px solid #f1f5f9",
            my: 2,
            width: "100%",
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {displayedText}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

// --- MAIN SCANNER COMPONENT ---
const ScannerTab = ({ summary, setSummary, saveSummary }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeepDiving, setIsDeepDiving] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [pages, setPages] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const webcamRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom as the "chat" grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [summary]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const base64Clean = imageSrc.split(",")[1];
      setPages((prev) => [...prev, base64Clean]);
      setIsCapturing(false);
      if (summary) {
        setSummary("");
        setMetadata(null);
      }
    }
  }, [summary, setSummary]);

  const onFinishAndSummarize = async () => {
    if (pages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await processNotes(pages);
      if (result) {
        // Initial Note - Wrapped in a base container
        setSummary(result.summaryText);
        setMetadata(result.metadata);
        setPages([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExplain = async () => {
    if (!userQuery.trim() || !summary) return;

    const currentQuery = userQuery;
    setUserQuery(""); // Clear input immediately

    // 1. PHASE ONE: Append the user message immediately
    // This makes it appear on screen while the AI is still "Deep Diving"
    const userBubble = `\n\n---\n\n> ${currentQuery}\n\n`;
    setSummary((prev) => prev + userBubble);

    setIsDeepDiving(true);

    try {
      // 2. PHASE TWO: Call the AI service
      const deepDive = await explainFurther(summary, currentQuery);

      // 3. PHASE THREE: Append the AI response
      const aiResponse = `\n${deepDive}`;
      setSummary((prev) => prev + aiResponse);
    } catch (err) {
      console.error("Deep dive failed", err);
      // Optional: add an error message to the chat
      setSummary(
        (prev) =>
          prev +
          "\n\n*Sorry, I had trouble processing that. Please try again.*",
      );
    } finally {
      setIsDeepDiving(false);
    }
  };

  const handleSpeech = async () => {
    if (isSpeaking) {
      await stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        const cleanText = summary
          .replace(/<[^>]*>?/gm, "")
          .replace(/[#*_-]/g, "")
          .trim();
        await speak(cleanText);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 12 }}>
      {/* Branding Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              bgcolor: "primary.main",
              p: 0.8,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <HistoryEdu sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Smart Scanner
          </Typography>
        </Stack>
        {metadata && (
          <Fade in>
            <Chip
              icon={<AutoFixHigh />}
              label={metadata.subject}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          </Fade>
        )}
      </Stack>

      {/* Camera Portal (logic remains the same) */}
      {isCapturing && (
        <Portal>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "#000",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                px: 4,
              }}
            >
              <IconButton
                onClick={() => setIsCapturing(false)}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", p: 2 }}
              >
                <Close fontSize="large" />
              </IconButton>
              <Fab
                color="primary"
                onClick={capturePhoto}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#fff",
                  color: "#000",
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <PhotoCamera sx={{ fontSize: 40 }} />
              </Fab>
            </Box>
          </Box>
        </Portal>
      )}

      {/* Main Viewport */}
      <Box sx={{ minHeight: "60vh" }}>
        {isAnalyzing ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#6366F1", mb: 3 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Oga Tutor is reading...
            </Typography>
          </Stack>
        ) : summary ? (
          <Fade in>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: 5,
                border: "1px solid #e2e8f0",
                bgcolor: "white",
              }}
            >
              <TypewriterEffect text={summary} />
              <div ref={scrollRef} /> {/* Auto-scroll target */}
              {isDeepDiving && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                    color: "primary.main",
                  }}
                >
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Thinking...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        ) : (
          <Box
            sx={{
              py: 12,
              bgcolor: "#f8fafc",
              textAlign: "center",
              border: "2px dashed #e2e8f0",
              borderRadius: 8,
            }}
          >
            <Description sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#64748b" }}>
              Ready to scan
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsCapturing(true)}
              startIcon={<PhotoCamera />}
              sx={{ mt: 4, borderRadius: "12px", px: 4 }}
            >
              {pages.length < 1
                ? "Open Camera"
                : `Snap Page ${pages.length + 1} ?`}
            </Button>
          </Box>
        )}
      </Box>

      {/* Control Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          p: 2,
          zIndex: 1000,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <Container maxWidth="md" disableGutters>
          {summary && (
            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => downloadNoteAsPDF(summary, metadata)}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={() => saveSummary(summary, metadata)}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color={isSpeaking ? "error" : "primary"}
                startIcon={isSpeaking ? <Stop /> : <VolumeUp />}
                onClick={handleSpeech}
              >
                {isSpeaking ? "Stop" : "Read"}
              </Button>
            </Stack>
          )}

          <Stack direction="column">
            <Stack direction="row" alignItems="flex-start">
              {pages.length > 0 && !summary && (
                <Badge badgeContent={pages.length} color="error">
                  <Chip label="Pages" size="small" sx={{ fontWeight: 800 }} />
                </Badge>
              )}
            </Stack>
            <Stack direction="row">
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  bgcolor: "#f1f5f9",
                  borderRadius: "20px",
                  px: 2,
                  py: 0.5,
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder={
                    summary ? "Ask Oga Tutor..." : "Scan notes first"
                  }
                  disabled={!summary}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ py: 1 }}
                />
                <IconButton
                  onClick={handleExplain}
                  disabled={!userQuery.trim() || isDeepDiving}
                >
                  <Send color={!summary ? "disabled" : "primary"} />
                </IconButton>
              </Box>

              {!summary && (
                <Button
                  variant={pages.length < 1 ? "disabled" : "contained"}
                  onClick={onFinishAndSummarize}
                  sx={{ borderRadius: "15px" }}
                >
                  Scan
                </Button>
              )}

              {summary && (
                <IconButton onClick={() => setIsCapturing(true)}>
                  <PhotoCamera color="primary" />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default ScannerTab;
