import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const QuizModal = ({ open, onClose, topic, questions = [] }) => {
  const theme = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [showReview, setShowReview] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userChoices, setUserChoices] = useState([]);

  const currentQuestion = useMemo(
    () => questions?.[currentIdx],
    [questions, currentIdx],
  );

  // Unified Markdown Renderer for Questions/Options/Explanations
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

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(40);
    } else {
      setIsFinished(true);
    }
  }, [currentIdx, questions.length]);

  const handleSelect = useCallback(
    (index) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(index);
      setUserChoices((prev) => [...prev, index]);
      if (index === currentQuestion?.correctAnswer)
        setScore((prev) => prev + 1);
    },
    [selectedAnswer, currentQuestion],
  );

  // Timer Logic
  useEffect(() => {
    if (!open || isFinished || selectedAnswer !== null || showReview) return;
    if (timeLeft === 0) {
      handleSelect(-1); // Auto-fail on timeout
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, open, isFinished, selectedAnswer, showReview, handleSelect]);

  const resetExam = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(40);
    setShowReview(false);
    setIsFinished(false);
    setUserChoices([]);
  };

  if (!open || !questions.length) return null;

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "#F8FAFC",
          zIndex: 9999,
          overflowY: "auto",
        }}
      >
        {/* HEADER SECTION */}
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <HistoryEdu sx={{ color: "primary.main", fontSize: 32 }} />
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                PrepFlow Assessment
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1 }}
              >
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

        <Container maxWidth="md" sx={{ py: 4 }}>
          {!isFinished ? (
            <Box>
              {/* PROGRESS BAR & TIMER */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Chip
                  label={`Q${currentIdx + 1} / ${questions.length}`}
                  sx={{
                    fontWeight: 900,
                    bgcolor: "text.primary",
                    color: "white",
                  }}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: timeLeft <= 10 ? "error.main" : "primary.main" }}
                >
                  <Timer className={timeLeft <= 10 ? "pulse-animation" : ""} />
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontFamily: "monospace",
                      fontSize: "1.2rem",
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
                  height: 8,
                  borderRadius: 4,
                  mb: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              />

              {/* QUESTION CARD */}
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: "32px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 4, color: "text.primary" }}
                >
                  <MarkdownRenderer content={currentQuestion?.question} />
                </Typography>

                <Stack spacing={2}>
                  {currentQuestion?.options.map((option, i) => {
                    const isCorrect = i === currentQuestion.correctAnswer;
                    const isSelected = i === selectedAnswer;
                    const isDisabled = selectedAnswer !== null;

                    // State-based Styling
                    const stateColor = isSelected
                      ? isCorrect
                        ? "success"
                        : "error"
                      : isCorrect && isDisabled
                        ? "success"
                        : "default";

                    return (
                      <Button
                        key={i}
                        fullWidth
                        onClick={() => handleSelect(i)}
                        disabled={isDisabled}
                        sx={{
                          p: 3,
                          borderRadius: "20px",
                          justifyContent: "flex-start",
                          textTransform: "none",
                          border: "2px solid",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          borderColor:
                            stateColor === "success"
                              ? "success.main"
                              : stateColor === "error"
                                ? "error.main"
                                : "#E2E8F0",
                          bgcolor:
                            stateColor === "success"
                              ? alpha(theme.palette.success.main, 0.05)
                              : stateColor === "error"
                                ? alpha(theme.palette.error.main, 0.05)
                                : "white",
                          "&:hover": {
                            bgcolor: "#F8FAFC",
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                          "&.Mui-disabled": {
                            color: "text.primary",
                            opacity: 1,
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
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              bgcolor:
                                stateColor === "success"
                                  ? "success.main"
                                  : stateColor === "error"
                                    ? "error.main"
                                    : "#F1F5F9",
                              color:
                                stateColor !== "default"
                                  ? "white"
                                  : "text.secondary",
                            }}
                          >
                            {isSelected ? (
                              isCorrect ? (
                                <CheckCircle fontSize="small" />
                              ) : (
                                <Cancel fontSize="small" />
                              )
                            ) : (
                              String.fromCharCode(65 + i)
                            )}
                          </Box>
                          <MarkdownRenderer content={option} />
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>

                {selectedAnswer !== null && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 4,
                      py: 2,
                      borderRadius: "16px",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    {currentIdx < questions.length - 1
                      ? "Next Challenge"
                      : "See My Results"}
                  </Button>
                )}
              </Paper>
            </Box>
          ) : (
            /* RESULTS & REVIEW SECTION */
            <Box>
              {showReview ? (
                <Zoom in>
                  <Box>
                    <Button
                      startIcon={<Replay />}
                      onClick={() => setShowReview(false)}
                      sx={{ mb: 3, fontWeight: 700 }}
                    >
                      Back to Summary
                    </Button>
                    {questions.map((q, qIdx) => (
                      <Paper
                        key={qIdx}
                        sx={{
                          p: 4,
                          mb: 3,
                          borderRadius: "24px",
                          border: "1px solid #E2E8F0",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Status Ribbon */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "6px",
                            height: "100%",
                            bgcolor:
                              userChoices[qIdx] === q.correctAnswer
                                ? "success.main"
                                : "error.main",
                          }}
                        />

                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.secondary", mb: 1 }}
                        >
                          QUESTION {qIdx + 1}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ mb: 3, fontWeight: 600 }}
                        >
                          <MarkdownRenderer content={q.question} />
                        </Typography>

                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: "12px",
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ color: "primary.main", mb: 1 }}
                          >
                            <LightbulbCircle />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 800 }}
                            >
                              CONCEPT EXPLANATION
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            <MarkdownRenderer content={q.explanation} />
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Zoom>
              ) : (
                <Zoom in>
                  <Paper
                    sx={{
                      p: 8,
                      borderRadius: "40px",
                      textAlign: "center",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <EmojiEvents
                      sx={{ fontSize: 100, color: "#F59E0B", mb: 2 }}
                    />
                    <Typography variant="h2" sx={{ fontWeight: 900 }}>
                      {Math.round((score / questions.length) * 100)}%
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "text.secondary", mb: 4 }}
                    >
                      {score === questions.length
                        ? "Perfect Score! You've mastered this topic."
                        : `You answered ${score}/${questions.length} correctly.`}
                    </Typography>

                    <Stack spacing={2} sx={{ maxWidth: 300, mx: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setShowReview(true)}
                        startIcon={<AssignmentTurnedIn />}
                        sx={{ py: 2, borderRadius: "14px", fontWeight: 800 }}
                      >
                        Review Performance
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={resetExam}
                        startIcon={<Replay />}
                        sx={{ py: 2, borderRadius: "14px", fontWeight: 800 }}
                      >
                        Retake Assessment
                      </Button>
                    </Stack>
                  </Paper>
                </Zoom>
              )}
            </Box>
          )}
        </Container>

        <style>{`
          @keyframes pulse-red { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
          .pulse-animation { animation: pulse-red 1s infinite; }
        `}</style>
      </Box>
    </Fade>
  );
};

export default QuizModal;
