import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Fade,
  alpha,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  MenuBook,
  ChevronLeft,
  ChevronRight,
  Replay,
  AutoAwesome,
  Celebration,
} from "@mui/icons-material";
import { generateFlashcards } from "../services/aiService";
import { pulse } from "../services/animation";

const CARD_COLORS = [
  { light: "#EEF2FF", main: "#6366F1", text: "#4338CA" },
  { light: "#F0FDF4", main: "#22C55E", text: "#15803D" },
  { light: "#FFF7ED", main: "#F97316", text: "#9A3412" },
  { light: "#FAF5FF", main: "#A855F7", text: "#7E22CE" },
];

const FlashcardSection = ({
  summary,
  scanSessionId,
  isDeepDiving,
  cards,
  setCards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // 1. Reset everything when the session ID changes (new subject/scan)
  useEffect(() => {
    setCards([]);
    setCurrentIndex(0);
    setIsFinished(false);
    setFlipped(false);
  }, [scanSessionId]);

  // 2. Handle Generation Logic
  useEffect(() => {
    // Exit if no content or currently in a deep dive
    if (!summary || summary.trim().length < 20 || isDeepDiving) return;

    // Guard: Don't re-run if we already have cards for this session
    if (cards.length > 0) return;

    const loadCards = async () => {
      setLoading(true);
      try {
        const result = await generateFlashcards(summary);

        // Ensure result is an array (service should handle parsing)
        const parsedCards = Array.isArray(result) ? result : [];

        if (parsedCards.length > 0) {
          setCards(parsedCards);
          setCurrentIndex(0);
          setFlipped(false);
          setIsFinished(false);
        }
      } catch (e) {
        console.error("Flashcard generation error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
    // Added isDeepDiving to deps so it checks again once the AI stops talking
  }, [summary, scanSessionId, isDeepDiving, cards.length]);

  const resetDeck = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setIsFinished(false);
  };

  const shuffleCards = () => {
    setCards([...cards].sort(() => Math.random() - 0.5));
    resetDeck();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (currentIndex === cards.length - 1) {
      setIsFinished(true);
    } else {
      setFlipped(false);
      // Short delay so the card flips back before text changes
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => Math.max(0, prev - 1)), 150);
  };

  // --- Render States ---

  if (loading)
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "#6366F1",
            animation: `${pulse} 2s infinite`,
            fontWeight: 700,
          }}
        >
          <AutoAwesome sx={{ mr: 1 }} /> Creating Study Cards...
        </Typography>
        <LinearProgress
          sx={{ maxWidth: 300, mx: "auto", borderRadius: 5, height: 6 }}
        />
      </Box>
    );

  if (!cards.length) return null;

  const currentColor = CARD_COLORS[currentIndex % CARD_COLORS.length];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  if (isFinished)
    return (
      <Fade in>
        <Paper
          sx={{
            mt: 4,
            p: 4,
            textAlign: "center",
            borderRadius: "32px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <Celebration sx={{ fontSize: 60, color: "#6366F1", mb: 2 }} />
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Deck Complete!
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>
            You've mastered these concepts.
          </Typography>
          <Button
            variant="contained"
            onClick={resetDeck}
            startIcon={<Replay />}
            sx={{ borderRadius: 10, bgcolor: "#6366F1", px: 4, py: 1.5 }}
          >
            Study Again
          </Button>
        </Paper>
      </Fade>
    );

  return (
    <Box sx={{ mt: 4, width: "100%", maxWidth: 420, mx: "auto" }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2, px: 1 }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            flexGrow: 1,
            height: 8,
            borderRadius: 5,
            bgcolor: alpha(currentColor.main, 0.1),
            "& .MuiLinearProgress-bar": { bgcolor: currentColor.main },
          }}
        />
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, color: currentColor.text }}
        >
          {currentIndex + 1} / {cards.length}
        </Typography>
      </Stack>

      <Box
        sx={{ perspective: "1500px", aspectRatio: "4/3", position: "relative" }}
      >
        <Box
          onClick={() => setFlipped(!flipped)}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            cursor: "pointer",
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <Paper
            elevation={0}
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              borderRadius: "32px",
              border: `2px solid ${alpha(currentColor.main, 0.2)}`,
              bgcolor: "white",
              textAlign: "center",
            }}
          >
            <MenuBook sx={{ color: currentColor.main, mb: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1E293B", lineHeight: 1.3 }}
            >
              {cards[currentIndex].question}
            </Typography>
          </Paper>

          {/* Back */}
          <Paper
            elevation={0}
            sx={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              borderRadius: "32px",
              bgcolor: currentColor.light,
              transform: "rotateY(180deg)",
              border: `2px solid ${currentColor.main}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: currentColor.text,
                fontSize: "1.15rem",
              }}
            >
              {cards[currentIndex].Q}
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Button
          onClick={shuffleCards}
          startIcon={<Replay />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Shuffle
        </Button>
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            sx={{ bgcolor: "white", boxShadow: 1, border: "1px solid #E2E8F0" }}
          >
            <ChevronLeft />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              borderRadius: 4,
              px: 4,
              bgcolor: currentColor.main,
              fontWeight: 700,
              "&:hover": { bgcolor: currentColor.text },
            }}
          >
            {currentIndex === cards.length - 1 ? "Finish" : "Next"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FlashcardSection;
