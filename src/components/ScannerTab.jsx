import { useState, useRef, useCallback, useEffect } from "react";
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
  alpha,
  LinearProgress,
  Avatar,
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
  AutoAwesome,
} from "@mui/icons-material";

import "katex/dist/katex.min.css";
import { speak, stopSpeech } from "../services/speechService";
import { explainFurther, processNotes } from "../services/aiService";
import { downloadNoteAsPDF } from "../services/downloadService";
import TypewriterEffect from "./TypewriterEffect";
import { keyframes } from "@mui/system";

// 1. Define the subtle pulse and shift animation
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

// 1. Gemini-style "Thinking" shimmer animation
const aurora = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const scanMove = keyframes`
  0% { top: 10%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 90%; opacity: 0; }
`;

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
        sx={{ mb: 2, mt: 1 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              background: "linear-gradient(135deg, #6366F1 0%, #a855f7 100%)",
              p: 1,
              borderRadius: "14px",
              display: "flex",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            }}
          >
            <AutoAwesome sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, color: "#1e293b", lineHeight: 1 }}
            >
              PrepFlow Lens
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 600 }}
            >
              AI-Note Analysis
            </Typography>
          </Box>
        </Stack>

        {metadata && (
          <Chip
            label={metadata.subject}
            sx={{
              fontWeight: 700,
              bgcolor: alpha("#6366F1", 0.1),
              color: "#6366F1",
              border: "1px solid",
              borderColor: alpha("#6366F1", 0.2),
              borderRadius: "10px",
              "& .MuiChip-label": { px: 2 },
            }}
          />
        )}
      </Stack>

      {/* 2. CAMERA PORTAL REFACTOR */}
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
            {/* Viewfinder Corners Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: "10% 5%",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "24px",
                zIndex: 1,
                pointerEvents: "none",
                "&::before": {
                  // The Animated Scan Line
                  content: '""',
                  position: "absolute",
                  width: "100%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #6366F1, transparent)",
                  boxShadow: "0 0 15px #6366F1",
                  animation: `${scanMove} 3s infinite ease-in-out`,
                },
              }}
            />

            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Top Controls */}
            <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
              <IconButton
                onClick={() => setIsCapturing(false)}
                sx={{
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Bottom Shutter Area */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "150px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pb: 4,
                zIndex: 2,
              }}
            >
              <Box
                onClick={capturePhoto}
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  border: "4px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:active": { transform: "scale(0.9)" },
                  "&::after": {
                    content: '""',
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                  },
                }}
              />
            </Box>
          </Box>
        </Portal>
      )}
      {/* Main Viewport */}
      <Box sx={{ position: "relative", minHeight: "70vh" }}>
        {isAnalyzing ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              py: 12,
              animation: `${pulse} 2s infinite ease-in-out`,
            }}
          >
            {/* Replacing standard spinner with a floating Gemini "Orb" */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #4285F4, #9B51E0, #EA4335)",
                backgroundSize: "200% 200%",
                animation: `${shimmer} 2s infinite linear`,
                mb: 4,
                boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoAwesome sx={{ color: "white", fontSize: 40 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #1E293B, #6366F1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PrepFlow AI is reading your notes...
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
              Synthesizing high-yield study points
            </Typography>
          </Stack>
        ) : summary ? (
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "32px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              }}
            >
              <TypewriterEffect text={summary} />
              <div ref={scrollRef} />

              {/* Deep Diving indicator stays docked at the bottom of the content */}
              {isDeepDiving && (
                <Fade in>
                  <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #f1f5f9" }}>
                    {/* Use the previously built Aurora thinking indicator here */}
                  </Box>
                </Fade>
              )}
            </Paper>
          </Fade>
        ) : (
          /* --- NEW EMPTY STATE: THE GEMINI PORTAL --- */
          <Fade in>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "65vh",
                textAlign: "center",
                px: 3,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mb: 4,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background:
                      "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255,255,255,0) 70%)",
                    zIndex: -1,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "white",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <Description sx={{ fontSize: 50, color: "#6366F1" }} />
                </Avatar>
              </Box>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "#1E293B", mb: 1 }}
              >
                Ready to flow?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748b", maxWidth: 400, mb: 4 }}
              >
                Scan your handwritten notes or textbooks. PrepFlow AI will
                handle the organization.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => setIsCapturing(true)}
                startIcon={<PhotoCamera />}
                sx={{
                  borderRadius: "30px",
                  px: 6,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  bgcolor: "#6366F1",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)",
                  "&:hover": { bgcolor: "#4f46e5", transform: "scale(1.02)" },
                }}
              >
                {pages.length < 1
                  ? "Start Scanning"
                  : `Snap Page ${pages.length + 1}`}
              </Button>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Control Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          pt: 1.5,
          pb: { xs: 4, md: 5 }, // Extra breathing room for modern mobile displays
          px: 2,
          zIndex: 1000,
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="md" disableGutters>
          {/* 2. TOP ACTION ROW (Floating Pills) */}
          {summary && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 2,
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {[
                {
                  label: "PDF",
                  icon: <Download />,
                  action: () => downloadNoteAsPDF(summary, metadata),
                },
                {
                  label: "Save",
                  icon: <Save />,
                  action: () => saveSummary(summary, metadata),
                },
              ].map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  onClick={item.action}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "white",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                    px: 1,
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                />
              ))}
              <Chip
                icon={isSpeaking ? <Stop /> : <VolumeUp />}
                label={isSpeaking ? "Stop" : "Listen"}
                onClick={handleSpeech}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 700,
                  bgcolor: isSpeaking
                    ? alpha("#ef4444", 0.08)
                    : alpha("#6366F1", 0.08),
                  color: isSpeaking ? "#ef4444" : "#6366F1",
                  border: "1px solid",
                  borderColor: isSpeaking
                    ? alpha("#ef4444", 0.2)
                    : alpha("#6366F1", 0.2),
                }}
              />
            </Stack>
          )}

          {/* 3. THE "GEMINI" INPUT CONTAINER */}
          <Box sx={{ position: "relative" }}>
            {/* Aurora Loading Bar (Hidden when not thinking) */}
            {isDeepDiving && (
              <Box
                sx={{
                  position: "absolute",
                  top: -4,
                  left: "5%",
                  right: "5%",
                  height: "4px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, #4285F4, #9B51E0, #EA4335, #FBBC05)",
                  backgroundSize: "300% 300%",
                  animation: `${aurora} 3s ease infinite`,
                  zIndex: 1,
                }}
              />
            )}

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#F0F4F9",
                  borderRadius: "32px", // Maximum pill roundness
                  px: 3,
                  py: 0.8,
                  transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid transparent",
                  "&:focus-within": {
                    bgcolor: "#fff",
                    borderColor: "#6366F1",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.12)",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder={
                    summary ? "Ask PrepFlow AI..." : "Scan notes to begin"
                  }
                  disabled={!summary || isDeepDiving}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ py: 1 }}
                />

                {/* Contextual Action Button */}
                {summary ? (
                  <IconButton
                    onClick={handleExplain}
                    disabled={!userQuery.trim() || isDeepDiving}
                    sx={{
                      color: userQuery.trim() ? "#6366F1" : "#94a3b8",
                      bgcolor: userQuery.trim()
                        ? alpha("#6366F1", 0.05)
                        : "transparent",
                    }}
                  >
                    <Send />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    onClick={onFinishAndSummarize}
                    disabled={pages.length < 1}
                    sx={{
                      borderRadius: "24px",
                      textTransform: "none",
                      fontWeight: 800,
                      px: 3,
                      bgcolor: "#6366F1",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#4f46e5", boxShadow: "none" },
                    }}
                  >
                    Scan
                  </Button>
                )}
              </Box>

              {/* Floating Camera Button */}
              {summary && (
                <IconButton
                  onClick={() => setIsCapturing(true)}
                  sx={{
                    bgcolor: "#F0F4F9",
                    width: 54,
                    height: 54,
                    "&:hover": { bgcolor: "#E2E8F0" },
                  }}
                >
                  <PhotoCamera sx={{ color: "#444746" }} />
                </IconButton>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ScannerTab;
