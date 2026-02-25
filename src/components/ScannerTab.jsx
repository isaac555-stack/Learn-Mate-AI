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

// --- STABLE TYPEWRITER COMPONENT ---
const TypewriterEffect = ({ text, speed = 5 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsFinished(false);
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsFinished(true);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "150px" }}>
      {!isFinished && (
        <Button
          size="small"
          variant="text"
          onClick={handleSkip}
          sx={{
            position: "absolute",
            right: 0,
            top: -35,
            textTransform: "none",
            color: "text.secondary",
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
          color: "#334155",
          lineHeight: 1.6,
          "& h2": {
            color: "#1e293b",
            mt: 4,
            mb: 2,
            fontWeight: 800,
            fontSize: "1.5rem",
            borderBottom: "2px solid #f1f5f9",
            pb: 1,
          },
          "& h3": {
            color: "#4f46e5",
            mt: 3,
            mb: 1.5,
            fontWeight: 700,
            fontSize: "1.2rem",
          },
          "& p": { mb: 2 },
          "& ul, & ol": { mb: 2, pl: 0, listStyle: "none" },
          "& li": {
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            "&::before": {
              content: '"•"',
              color: "#0c0c0c",
              fontWeight: "800",
              display: "inline-block",
              width: "1.5em",
              flexShrink: 0,
            },
          },
          "& li > p": { display: "inline", margin: 0 },
          "& blockquote": {
            mx: 0,
            my: 3,
            p: 2,
            bgcolor: "#fff7ed",
            borderLeft: "4px solid #f97316",
            borderRadius: "0 8px 8px 0",
            "& strong": { color: "#c2410c" },
          },
          "& hr": { my: 4, border: 0, borderTop: "2px solid #e2e8f0" },
          "& .katex-display": { my: 2, textAlign: "center" },
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
  }, [webcamRef, summary, setSummary]);

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
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* 1. BRANDING HEADER */}
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

      {/* 2. FULL SCREEN CAMERA PORTAL */}
      {isCapturing && (
        <Portal>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Camera Controls Overlay */}
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

              {/* Placeholder for symmetry */}
              <Box sx={{ width: 64 }} />
            </Box>

            {/* Counter Badge for multiple pages */}
            {pages.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 40,
                  right: 20,
                  bgcolor: "primary.main",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                {pages.length} Pages Scanned
              </Box>
            )}
          </Box>
        </Portal>
      )}

      {/* 3. MAIN CONTENT VIEWPORT */}
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
              }}
            >
              <TypewriterEffect text={summary} />
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
              {pages.length < 1 ? "Open Camera" : "Scan Multiple Pages"}
            </Button>
          </Box>
        )}
      </Box>

      {/* 4. DOCKING CONTROL BAR */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "rgb(255, 255, 255)",
          backdropFilter: "blur(12px)",
          p: 1,
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

          <Stack direction="column" spacing={1.5}>
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
