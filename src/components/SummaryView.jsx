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
  AutoAwesome,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import FlashcardSection from "./Flashcard";
import QuizSection from "./QuizSection"; // We will build this next
import TypewriterEffect from "./TypewriterEffect";
import { aurora } from "../services/animation";

const SummaryView = ({
  summary,
  metadata,
  isDeepDiving,
  scanSessionId,

  isLoadingQuestions,
}) => {
  const scrollRef = useRef(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  useEffect(() => {
    if (!userIsScrolling) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [summary]);

  const handleWheel = () => {
    setUserIsScrolling(true);
    setTimeout(() => setUserIsScrolling(false), 3000);
  };

  return (
    <Fade in timeout={800}>
      <Box onWheel={handleWheel} sx={{ position: "relative" }}>
        {/* 1. TOP METADATA BAR */}
        {metadata && (
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: { xs: 1, md: 3 }, alignItems: "center" }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Chip
                icon={
                  <MenuBook
                    sx={{ fontSize: "1rem !important", fill: "#FFF" }}
                  />
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

            {/* SYNC INDICATOR: Tells student we are fetching JAMB questions */}
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
                  Syncing JAMB Questions...
                </Typography>
              </Stack>
            )}
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

          {/* 3. FLASHCARDS */}

          {/* 4. THE QUIZ SECTION (The Market Dominator)
          {(questions.length > 0 || isLoadingQuestions) && (
            <Box sx={{ mt: 4 }}>
              <QuizSection
                questions={questions}
                isLoading={isLoadingQuestions}
                subject={metadata?.subject}
              />
            </Box>
          )} */}

          <div ref={scrollRef} style={{ height: "20px" }} />

          {/* 5. DEEP DIVE ANIMATION */}
          {isDeepDiving && (
            <Fade in>
              <Box
                sx={{
                  p: 2,
                  mb: 5,
                  borderRadius: "20px",
                  bgcolor: alpha("#6366F1", 0.03),
                  border: "1px dashed",
                  borderColor: alpha("#6366F1", 0.2),
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Psychology sx={{ color: "#6366F1" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#6366F1" }}
                >
                  PrepFlow is deep-diving into your question...
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
