import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Fade,
  Typography,
  Chip,
  Stack,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  MenuBook,
  Psychology,
  CloudDone,
  CloudSync,
} from "@mui/icons-material";
import TypewriterEffect from "./TypewriterEffect";

const SummaryView = ({
  summary,
  metadata,
  isDeepDiving,
  scanSessionId,
  isLoadingQuestions,
  // Pass this down if you want to show a 'Saved' vs 'Saving' state
  isSyncing = false,
}) => {
  const scrollRef = useRef(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  // Auto-scroll logic: Keep the newest AI response in view
  useEffect(() => {
    if (!userIsScrolling && isDeepDiving) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [summary, isDeepDiving, userIsScrolling]);

  const handleWheel = () => {
    setUserIsScrolling(true);
    // Resume auto-scroll after 5 seconds of inactivity
    const timer = setTimeout(() => setUserIsScrolling(false), 5000);
    return () => clearTimeout(timer);
  };

  return (
    <Fade in timeout={800}>
      <Box onWheel={handleWheel} sx={{ position: "relative" }}>
        {/* 1. TOP METADATA & STATUS BAR */}
        {metadata && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: { xs: 1, md: 3 }, mb: 2, alignItems: "center" }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Chip
                label={metadata.subject || "General Study"}
                size="small"
                sx={{
                  fontWeight: 900,
                  color: "#64748b",
                  letterSpacing: 1,
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: 700 }}
              >
                {metadata.topic || "Exam Prep"}
              </Typography>
            </Stack>

            {/* SYNC INDICATORS */}
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Cloud Sync State */}
              <Stack direction="row" spacing={0.5} alignItems="center">
                {isDeepDiving || isSyncing ? (
                  <>
                    <CloudSync sx={{ fontSize: 16, color: "#6366F1" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "#6366F1", fontWeight: 800 }}
                    >
                      Syncing...
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudDone sx={{ fontSize: 16, color: "#10B981" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "#10B981", fontWeight: 800 }}
                    >
                      Saved
                    </Typography>
                  </>
                )}
              </Stack>

              {/* JAMB Syncing */}
              {isLoadingQuestions && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress
                    size={12}
                    thickness={6}
                    sx={{ color: "#6366F1" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#6366F1", fontWeight: 800 }}
                  >
                    JAMB Sync
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: "32px",
            bgcolor: alpha("#F8FAFC", 0.5), // Subtle off-white background

            minHeight: "60vh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 2. THE CONTENT (Typewriter creates the 'AI is typing' feel) */}
          <TypewriterEffect key={scanSessionId} text={summary} />

          {/* 3. DEEP DIVE LOADING STATE */}
          {isDeepDiving && (
            <Fade in>
              <Box
                sx={{
                  p: 3,
                  mt: 4,
                  borderRadius: "20px",
                  bgcolor: alpha("#6366F1", 0.05),
                  border: "1px dashed",
                  borderColor: alpha("#6366F1", 0.3),
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Psychology
                  className="pulse-animation"
                  sx={{ color: "#6366F1", fontSize: 32 }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800, color: "#6366F1" }}
                  >
                    PrepFlow is Deep-Diving...
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6366F1", opacity: 0.8 }}
                  >
                    Connecting your notes to the exam syllabus
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Scroll Anchor */}
          <div ref={scrollRef} style={{ height: "40px" }} />
        </Paper>
      </Box>
    </Fade>
  );
};

export default SummaryView;
