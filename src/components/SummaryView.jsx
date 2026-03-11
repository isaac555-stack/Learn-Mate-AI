import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Fade,
  Typography,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import { MenuBook, Psychology, AutoAwesome } from "@mui/icons-material";
import TypewriterEffect from "./TypewriterEffect";
import { aurora } from "../services/animation";

const SummaryView = ({ summary, metadata, isDeepDiving, scanSessionId }) => {
  const scrollRef = useRef(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  // Auto-scroll to bottom as text generates, unless the student scrolls up to read
  useEffect(() => {
    if (!userIsScrolling) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [summary]);

  // Detect manual scroll to stop auto-scrolling
  const handleWheel = () => {
    setUserIsScrolling(true);
    // Reset auto-scroll after 3 seconds of inactivity
    setTimeout(() => setUserIsScrolling(false), 3000);
  };

  return (
    <Fade in timeout={800}>
      <Box onWheel={handleWheel} sx={{ position: "relative" }}>
        {/* 1. TOP METADATA BAR - Gives student immediate context */}
        {metadata && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, px: { xs: 1, md: 3 }, alignItems: "center" }}
          >
            <Chip
              icon={
                <MenuBook sx={{ fontSize: "1rem !important", fill: "#FFF" }} />
              }
              label={metadata.subject || "General Study"}
              size="small"
              sx={{
                fontWeight: 900,
                bgcolor: "#6366F1",
                color: "white",
                letterSpacing: 1,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              {metadata.topic || "Exam Prep"}
            </Typography>
          </Stack>
        )}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: "32px",
            bgcolor: "rgba(255, 255, 255, 0)",

            minHeight: "60vh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 2. THE CONTENT */}
          <TypewriterEffect key={scanSessionId} text={summary} />

          <div ref={scrollRef} style={{ height: "20px" }} />

          {/* 3. DEEP DIVE / THINKING ANIMATION */}
          {isDeepDiving && (
            <Fade in>
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: "20px",
                  bgcolor: alpha("#6366F1", 0.03),
                  border: "1px dashed",
                  borderColor: alpha("#6366F1", 0.2),
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ position: "relative", display: "flex" }}>
                  <Psychology
                    sx={{ color: "#6366F1", animation: `pulse 2s infinite` }}
                  />
                  <AutoAwesome
                    sx={{
                      fontSize: 12,
                      position: "absolute",
                      top: -5,
                      right: -5,
                      color: "#FBBC05",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#6366F1" }}
                >
                  PrepFlow is reading the user prompt...
                </Typography>
              </Box>
            </Fade>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default SummaryView;
