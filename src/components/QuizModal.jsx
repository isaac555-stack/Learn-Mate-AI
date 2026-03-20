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
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const QuizModal = ({ open, onClose, topic, questions = [] }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [showReview, setShowReview] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userChoices, setUserChoices] = useState([]); // Track answers for review

  const currentQuestion = questions?.[currentIdx];

  const MarkdownRenderer = ({ content, uniqueKey }) => (
    <ReactMarkdown
      key={uniqueKey}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ ...props }) => <Typography sx={{ mb: 1 }} {...props} />,
        li: ({ ...props }) => <li style={{ marginBottom: 6 }} {...props} />,
      }}
    >
      {safeMarkdown(content)}
    </ReactMarkdown>
  );

  const safeMarkdown = (text) => {
    if (!text) return "";
    if (typeof text !== "string") return String(text);

    return text
      .replace(/\\n/g, "\n") // fix escaped newlines
      .replace(/\r/g, "")
      .trim();
  };

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

      if (index === currentQuestion?.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    },
    [selectedAnswer, currentQuestion],
  );

  // Timer Logic
  useEffect(() => {
    if (!open || isFinished || selectedAnswer !== null || showReview) return;

    if (timeLeft === 0) {
      handleSelect(-1); // Mark as incorrect/skipped
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
        {/* HEADER */}
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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: alpha("#6366F1", 0.1),
                display: "flex",
              }}
            >
              <HistoryEdu sx={{ color: "#6366F1" }} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                PrepFlow Quiz
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}
              >
                {topic}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} sx={{ bgcolor: "#F1F5F9" }}>
            <Close />
          </IconButton>
        </Box>

        <Container maxWidth="md" sx={{ py: 6 }}>
          {!isFinished ? (
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                sx={{ mb: 2 }}
              >
                <Chip
                  label={`Question ${currentIdx + 1} of ${questions.length}`}
                  sx={{
                    bgcolor: "#1E293B",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: "8px",
                  }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Timer
                    sx={{
                      color: timeLeft <= 10 ? "#EF4444" : "#6366F1",
                      fontSize: 22,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 900,
                      color: timeLeft <= 10 ? "#EF4444" : "#1E293B",
                      fontSize: "1.1rem",
                      fontFamily: "monospace",
                    }}
                  >
                    0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </Typography>
                </Stack>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={((currentIdx + 1) / questions.length) * 100}
                sx={{
                  mb: 4,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha("#6366F1", 0.1),
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#6366F1",
                    borderRadius: 5,
                  },
                }}
              />

              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: "32px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                  bgcolor: "white",
                }}
              >
                <Box
                  sx={{
                    fontSize: "1.25rem",
                    color: "#1E293B",
                    fontWeight: 500,
                    mb: 4,
                  }}
                >
                  <MarkdownRenderer
                    content={currentQuestion?.question}
                    uniqueKey={`q-${currentIdx}`}
                  />
                </Box>

                <Stack spacing={2}>
                  {currentQuestion?.options.map((option, i) => {
                    const isCorrect = i === currentQuestion.correctAnswer;
                    const isSelected = i === selectedAnswer;

                    let btnBorder = "#E2E8F0";
                    let btnBg = "white";
                    if (selectedAnswer !== null) {
                      if (isSelected) {
                        btnBorder = isCorrect ? "#10B981" : "#EF4444";
                        btnBg = isCorrect
                          ? alpha("#10B981", 0.08)
                          : alpha("#EF4444", 0.08);
                      } else if (isCorrect) {
                        btnBorder = "#10B981"; // Show correct answer if user missed it
                      }
                    }

                    return (
                      <Button
                        key={i}
                        fullWidth
                        onClick={() => handleSelect(i)}
                        disabled={selectedAnswer !== null}
                        sx={{
                          p: 2.5,
                          borderRadius: "16px",
                          justifyContent: "flex-start",
                          textTransform: "none",
                          border: "2px solid",
                          borderColor: btnBorder,
                          bgcolor: btnBg,
                          color: "#334155",
                          transition: "0.2s all",
                          "&:hover": {
                            bgcolor: "#F8FAFC",
                            borderColor: "#6366F1",
                          },
                          "&.Mui-disabled": { color: "#334155" },
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
                              width: 36,
                              height: 36,
                              borderRadius: "10px",
                              bgcolor: isSelected
                                ? isCorrect
                                  ? "#10B981"
                                  : "#EF4444"
                                : selectedAnswer !== null && isCorrect
                                  ? "#10B981"
                                  : "#F1F5F9",
                              color:
                                isSelected ||
                                (selectedAnswer !== null && isCorrect)
                                  ? "white"
                                  : "#64748B",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
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
                          <Box sx={{ textAlign: "left", flex: 1 }}>
                            <MarkdownRenderer
                              content={option}
                              uniqueKey={`opt-${currentIdx}-${i}`}
                            />
                          </Box>
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>

                {selectedAnswer !== null && (
                  <Fade in>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 4,
                        py: 2,
                        borderRadius: "14px",
                        fontWeight: 800,
                        bgcolor: "#6366F1",
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      {currentIdx < questions.length - 1
                        ? "Next Question"
                        : "Finish Quiz"}
                    </Button>
                  </Fade>
                )}
              </Paper>
            </Box>
          ) : (
            <Box>
              {showReview ? (
                <Zoom in>
                  <Box>
                    <Button
                      startIcon={<Replay />}
                      onClick={() => setShowReview(false)}
                      sx={{ mb: 3, fontWeight: 700, color: "#6366F1" }}
                    >
                      Back to Result
                    </Button>
                    {questions.map((q, qIdx) => (
                      <Paper
                        key={qIdx}
                        sx={{
                          p: 4,
                          mb: 3,
                          borderRadius: "24px",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, mb: 2, color: "#1E293B" }}
                        >
                          Question {qIdx + 1}
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                          <MarkdownRenderer
                            content={q.question}
                            uniqueKey={`review-q-${qIdx}`}
                          />
                        </Box>

                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          {q.options.map((opt, i) => {
                            const isCorrect = i === q.correctAnswer;
                            const wasSelected = i === userChoices[qIdx];
                            return (
                              <Box
                                key={i}
                                sx={{
                                  p: 2,
                                  borderRadius: "12px",
                                  border: "1px solid",
                                  borderColor: isCorrect
                                    ? "#10B981"
                                    : wasSelected
                                      ? "#EF4444"
                                      : "#F1F5F9",
                                  bgcolor: isCorrect
                                    ? alpha("#10B981", 0.05)
                                    : wasSelected
                                      ? alpha("#EF4444", 0.05)
                                      : "transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {isCorrect ? (
                                  <CheckCircle sx={{ color: "#10B981" }} />
                                ) : wasSelected ? (
                                  <Cancel sx={{ color: "#EF4444" }} />
                                ) : (
                                  <Box sx={{ width: 24 }} />
                                )}
                                <MarkdownRenderer
                                  content={opt}
                                  uniqueKey={`review-opt-${qIdx}-${i}`}
                                />
                              </Box>
                            );
                          })}
                        </Stack>

                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#F0F9FF",
                            borderRadius: "16px",
                            border: "1px dashed #0EA5E9",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mb: 1, color: "#0369A1" }}
                          >
                            <AssignmentTurnedIn fontSize="small" />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 800 }}
                            >
                              Explanation
                            </Typography>
                          </Stack>
                          <Box sx={{ color: "#0C4A6E", lineHeight: 1.6 }}>
                            <MarkdownRenderer
                              content={q.explanation}
                              uniqueKey={`exp-${qIdx}`}
                            />
                          </Box>
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
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <EmojiEvents
                      sx={{ fontSize: 100, color: "#F59E0B", mb: 2 }}
                    />
                    <Typography
                      variant="h2"
                      sx={{ fontWeight: 900, color: "#1E293B", mb: 1 }}
                    >
                      {Math.round((score / questions.length) * 100)}%
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#64748B", mb: 4 }}>
                      You scored {score} out of {questions.length} questions
                    </Typography>

                    <Stack spacing={2} sx={{ maxWidth: 320, mx: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setShowReview(true)}
                        startIcon={<AssignmentTurnedIn />}
                        sx={{
                          py: 2,
                          borderRadius: "16px",
                          bgcolor: "#6366F1",
                          fontWeight: 800,
                          textTransform: "none",
                        }}
                      >
                        Review Answers
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={resetExam}
                        startIcon={<Replay />}
                        sx={{
                          py: 2,
                          borderRadius: "16px",
                          fontWeight: 800,
                          textTransform: "none",
                          color: "#64748B",
                          borderColor: "#E2E8F0",
                        }}
                      >
                        Try Again
                      </Button>
                    </Stack>
                  </Paper>
                </Zoom>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default QuizModal;
