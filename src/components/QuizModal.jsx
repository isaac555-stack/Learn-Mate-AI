import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Stack,
  Box,
  LinearProgress,
  IconButton,
  Zoom,
  Container,
  Paper,
  alpha,
  Fade,
  Chip,
  useTheme,
  Dialog,
} from "@mui/material";
import {
  Close,
  EmojiEvents,
  Timer,
  HistoryEdu,
  AssignmentTurnedIn,
  Replay,
  CheckCircle,
  Cancel,
  ArrowForward,
  LightbulbCircle,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// --- Sub-Components ---

const MarkdownRenderer = ({ content }) => (
  <Box
    sx={{
      "& p": { m: 0, display: "inline" },
      "& .katex": { fontSize: "1.1em" },
    }}
  >
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {content || ""}
    </ReactMarkdown>
  </Box>
);

const OptionButton = ({ index, label, state, disabled, onClick }) => {
  const theme = useTheme();

  // Mapping states to Gemini-inspired adaptive colors
  const colors = {
    success: {
      main: theme.palette.success.main,
      bg: alpha(
        theme.palette.success.main,
        theme.palette.mode === "dark" ? 0.15 : 0.08,
      ),
      border: theme.palette.success.main,
    },
    error: {
      main: theme.palette.error.main,
      bg: alpha(
        theme.palette.error.main,
        theme.palette.mode === "dark" ? 0.15 : 0.08,
      ),
      border: theme.palette.error.main,
    },
    default: {
      main: theme.palette.divider,
      bg: theme.palette.background.paper,
      border: theme.palette.divider,
    },
  };

  const activeColor = colors[state] || colors.default;

  return (
    <Button
      fullWidth
      onClick={() => onClick(index)}
      disabled={disabled}
      sx={{
        p: 2,
        borderRadius: "12px", // Slightly less than global pill for options
        justifyContent: "flex-start",
        border: `1px solid ${activeColor.border}`,
        bgcolor: activeColor.bg,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-disabled": {
          color: theme.palette.text.primary,
          opacity: 1,
          borderColor: activeColor.border,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            bgcolor:
              state === "default"
                ? alpha(theme.palette.text.secondary, 0.1)
                : activeColor.main,
            color: state === "default" ? theme.palette.text.secondary : "white",
          }}
        >
          {state === "success" ? (
            <CheckCircle sx={{ fontSize: 18 }} />
          ) : state === "error" ? (
            <Cancel sx={{ fontSize: 18 }} />
          ) : (
            String.fromCharCode(65 + index)
          )}
        </Box>

        <MarkdownRenderer content={label} />
      </Stack>
    </Button>
  );
};

// --- Main Component ---

const QuizModal = ({ open, onClose, topic, questions = [] }) => {
  const theme = useTheme();

  const [gameState, setGameState] = useState({
    currentIdx: 0,
    selectedAnswer: null,
    score: 0,
    timeLeft: 40,
    isFinished: false,
    showReview: false,
    userChoices: [],
  });

  const {
    currentIdx,
    selectedAnswer,
    score,
    timeLeft,
    isFinished,
    showReview,
    userChoices,
  } = gameState;
  const currentQuestion = questions[currentIdx];

  const handleSelect = useCallback(
    (index) => {
      if (selectedAnswer !== null) return;
      setGameState((prev) => ({
        ...prev,
        selectedAnswer: index,
        userChoices: [...prev.userChoices, index],
        score:
          index === questions[prev.currentIdx].correctAnswer
            ? prev.score + 1
            : prev.score,
      }));
    },
    [selectedAnswer, questions],
  );

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentIdx: prev.currentIdx + 1,
        selectedAnswer: null,
        timeLeft: 40,
      }));
    } else {
      setGameState((prev) => ({ ...prev, isFinished: true }));
    }
  };

  const resetExam = () =>
    setGameState({
      currentIdx: 0,
      selectedAnswer: null,
      score: 0,
      timeLeft: 40,
      isFinished: false,
      showReview: false,
      userChoices: [],
    });

  useEffect(() => {
    if (!open || isFinished || selectedAnswer !== null || showReview) return;
    if (timeLeft === 0) {
      handleSelect(-1);
      return;
    }
    const timer = setInterval(
      () => setGameState((p) => ({ ...p, timeLeft: p.timeLeft - 1 })),
      1000,
    );
    return () => clearInterval(timer);
  }, [timeLeft, open, isFinished, selectedAnswer, showReview, handleSelect]);

  if (!open || !questions.length) return null;

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Fade}>
      {/* Sticky Header */}
      <Box
        sx={{
          p: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <HistoryEdu sx={{ color: "primary.main", fontSize: 28 }} />
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: 0.5,
              }}
            >
              PREPFLOW ASSESSMENT
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
              {topic}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.05),
            color: "error.main",
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        {!isFinished ? (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Chip
                label={`${currentIdx + 1} / ${questions.length}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                }}
              />
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  color: timeLeft <= 10 ? "error.main" : "text.secondary",
                }}
              >
                <Timer sx={{ fontSize: 20 }} />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontFamily: "monospace",
                    fontSize: "1rem",
                  }}
                >
                  0:{timeLeft.toString().padStart(2, "0")}
                </Typography>
              </Stack>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={((currentIdx + 1) / questions.length) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                mb: 5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            />

            <MarkdownRenderer content={currentQuestion?.question} />

            <Stack spacing={1.5} mt={3}>
              {currentQuestion?.options.map((opt, i) => {
                const isCorrect = i === currentQuestion.correctAnswer;
                const isSelected = i === selectedAnswer;
                let state = "default";
                if (isSelected) state = isCorrect ? "success" : "error";
                else if (selectedAnswer !== null && isCorrect)
                  state = "success";

                return (
                  <OptionButton
                    key={i}
                    index={i}
                    label={opt}
                    state={state}
                    disabled={selectedAnswer !== null}
                    onClick={handleSelect}
                  />
                );
              })}
            </Stack>

            {selectedAnswer !== null && (
              <Zoom in>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{ mt: 4, py: 1.8 }}
                >
                  {currentIdx < questions.length - 1
                    ? "Next Question"
                    : "View Results"}
                </Button>
              </Zoom>
            )}
          </Box>
        ) : (
          /* Results View */
          <Zoom in>
            <Box>
              {showReview ? (
                <Box>
                  <Button
                    startIcon={<Replay />}
                    onClick={() =>
                      setGameState((p) => ({ ...p, showReview: false }))
                    }
                    sx={{ mb: 3 }}
                  >
                    Back to Summary
                  </Button>
                  {questions.map((q, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 3,
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.main", fontWeight: 700 }}
                      >
                        QUESTION {idx + 1}
                      </Typography>

                      <MarkdownRenderer content={q.question} />

                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          borderRadius: 2,
                          mt: 2,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ color: "primary.main", mb: 0.5 }}
                        >
                          <LightbulbCircle sx={{ fontSize: 20 }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700 }}
                          >
                            EXPLANATION
                          </Typography>
                        </Stack>

                        <MarkdownRenderer content={q.explanation} />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 64, color: "#F59E0B", mb: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 500, mb: 1 }}>
                    {Math.round((score / questions.length) * 100)}%
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 4 }}
                  >
                    You scored {score} out of {questions.length}
                  </Typography>
                  <Stack spacing={2} direction="column">
                    <Button
                      variant="contained"
                      onClick={() =>
                        setGameState((p) => ({ ...p, showReview: true }))
                      }
                    >
                      Review Answers
                    </Button>
                    <Button
                      variant="text"
                      onClick={resetExam}
                      sx={{ color: "text.secondary" }}
                    >
                      Try Again
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Box>
          </Zoom>
        )}
      </Container>
    </Dialog>
  );
};

export default QuizModal;
