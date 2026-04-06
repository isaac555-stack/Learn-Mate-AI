import { useEffect, useRef, useState } from "react";
import {
  Box,
  Fade,
  Typography,
  Chip,
  Stack,
  alpha,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Psychology,
  CloudDone,
  CloudSync,
  AutoAwesome,
} from "@mui/icons-material";
import TypewriterEffect from "./TypewriterEffect";
import MermaidDiagram from "./Mermaid";

const SummaryView = ({
  summary,
  metadata,
  isDeepDiving,
  scanSessionId,
  isSyncing = false,
}) => {
  const theme = useTheme();

  // Refs for Gemini-style viewport control
  const topOfMessageRef = useRef(null); // Anchor for the start of the interaction
  const messagesEndRef = useRef(null); // Anchor for the typewriter progress
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);

  // 1. GEMINI FLOW: Snap to top when a new question/session starts
  useEffect(() => {
    if (summary) {
      topOfMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [scanSessionId]); // Fires only when the ID changes (new interaction)

  // 2. AUTO-SCROLL: Follow the typewriter as it types
  const scrollToBottom = () => {
    if (!userHasScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Small timeout to ensure the DOM has updated with new typewriter text
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [summary, isDeepDiving]);

  // 3. SCROLL DETECTION: Don't hijack the screen if the user is looking at something else
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 150;
      setUserHasScrolledUp(!isAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fade in timeout={800}>
      {/* minHeight ensures that the "Deep Diving" state doesn't feel cramped */}
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        {/* THE TOP ANCHOR: Pushes previous summaries out of view */}
        <div ref={topOfMessageRef} style={{ height: "1px" }} />

        {/* STICKY HEADER */}
        {metadata && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              bgcolor: alpha(theme.palette.background.default, 0.9),
              backdropFilter: "blur(8px)",
              py: 1.5,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<AutoAwesome sx={{ fontSize: "14px !important" }} />}
                  label={metadata.subject || "General Study"}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  {metadata.topic}
                </Typography>
              </Stack>

              <Box>
                {isSyncing ? (
                  <CloudSync
                    className="pulse-animation"
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                ) : (
                  <CloudDone sx={{ fontSize: 18, color: "success.main" }} />
                )}
              </Box>
            </Stack>
          </Box>
        )}

        {/* CONTENT AREA */}
        <Box sx={{ px: 1, pb: 10 }}>
          <Box sx={{ "& strong": { color: "primary.main" }, lineHeight: 1.8 }}>
            <TypewriterEffect key={scanSessionId} text={summary} />
          </Box>

          {isDeepDiving && (
            <Fade in>
              <Box
                sx={{
                  p: 3,
                  mt: 4,
                  borderRadius: "20px",
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CircularProgress size={32} />
                  <Psychology
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 18,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Deep Diving...
                </Typography>
              </Box>
            </Fade>
          )}

          {/* BOTTOM ANCHOR: For typewriter auto-scrolling */}
          <div ref={messagesEndRef} style={{ height: "50px" }} />
        </Box>

        <style>{`
          @keyframes pulse-soft {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
          .pulse-animation { animation: pulse-soft 2s infinite; }
        `}</style>
      </Box>
    </Fade>
  );
};

export default SummaryView;
