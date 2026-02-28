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
  LightbulbCircle,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const QuizModal = ({ open, onClose, topic, questions = [] }) => {
  // --- Game State ---
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [showReview, setShowReview] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions?.[currentIdx];

  // Handle Moving to Next Question
  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(40);
    } else {
      setIsFinished(true);
    }
  }, [currentIdx, questions.length]);

  // Timer Logic
  useEffect(() => {
    if (!open || isFinished || selectedAnswer !== null || showReview) return;

    if (timeLeft === 0) {
      handleSelect(-1); // Auto-fail the question on timeout
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, open, isFinished, selectedAnswer, showReview]);

  const handleSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === currentQuestion?.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Smooth transition to next question
    setTimeout(handleNext, 1200);
  };

  const resetExam = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(40);
    setShowReview(false);
    setIsFinished(false);
  };

  if (!open || !questions.length) return null;

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "#F1F5F9",
          zIndex: 9999,
          overflowY: "auto",
        }}
      >
        {/* --- FIXED HEADER --- */}
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
                variant="subtitle2"
                sx={{
                  color: "#64748B",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                }}
              >
                Oga Tutor CBT
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1 }}
              >
                {topic}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Container maxWidth="md" sx={{ py: 4 }}>
          {!isFinished ? (
            <Box>
              {/* Progress & Timer */}
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Chip
                  label={`Question ${currentIdx + 1} of ${questions.length}`}
                  sx={{ bgcolor: "white", fontWeight: 700 }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Timer
                    sx={{
                      color: timeLeft <= 10 ? "#EF4444" : "#6366F1",
                      fontSize: 20,
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: timeLeft <= 10 ? "#EF4444" : "#1E293B",
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
                  height: 8,
                  borderRadius: 5,
                  bgcolor: alpha("#6366F1", 0.1),
                  "& .MuiLinearProgress-bar": { bgcolor: "#6366F1" },
                }}
              />

              {/* Question Card */}
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, mb: 4, color: "#0F172A" }}
                >
                  <ReactMarkdown
                    remarkPlugins={[rehypeKatex]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {" "}
                    {currentQuestion?.question}
                  </ReactMarkdown>
                </Typography>
                <Stack spacing={2}>
                  {currentQuestion?.options.map((option, i) => {
                    const isCorrect = i === currentQuestion.correctAnswer;
                    const isSelected = i === selectedAnswer;

                    return (
                      <Button
                        key={i}
                        fullWidth
                        onClick={() => handleSelect(i)}
                        disabled={selectedAnswer !== null}
                        sx={{
                          p: 2.5,
                          borderRadius: 4,
                          justifyContent: "flex-start",
                          textTransform: "none",
                          border: "2px solid",
                          borderColor: isSelected ? "#6366F1" : "#F1F5F9",
                          bgcolor: isSelected
                            ? alpha("#6366F1", 0.04)
                            : "white",
                          "&:hover": { bgcolor: "#F8FAFC" },
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
                              borderRadius: 1.5,
                              bgcolor: isSelected ? "#6366F1" : "#F1F5F9",
                              color: isSelected ? "white" : "#64748B",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                            }}
                          >
                            {String.fromCharCode(65 + i)}
                          </Box>
                          <Typography
                            sx={{
                              flexGrow: 1,
                              fontWeight: 600,
                              textAlign: "left",
                              color: "#1E293B",
                            }}
                          >
                            <ReactMarkdown
                              remarkPlugins={[rehypeKatex]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {" "}
                              {option}
                            </ReactMarkdown>
                          </Typography>
                        </Stack>
                      </Button>
                    );
                  })}
                </Stack>
              </Paper>
            </Box>
          ) : (
            /* --- RESULTS VIEW --- */
            <Box>
              {showReview ? (
                <Zoom in={true}>
                  <Box>
                    <Button
                      startIcon={<Replay />}
                      onClick={() => setShowReview(false)}
                      sx={{ mb: 3, fontWeight: 700 }}
                    >
                      Back to Result
                    </Button>
                    {questions.map((q, qIdx) => (
                      <Paper
                        key={qIdx}
                        sx={{
                          p: 3,
                          mb: 3,
                          borderRadius: 4,
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, mb: 2 }}
                        >
                          {qIdx + 1}. {q.question}
                        </Typography>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#F0F9FF",
                            borderRadius: 3,
                            border: "1px dashed #0EA5E9",
                            display: "flex",
                            gap: 1.5,
                          }}
                        >
                          <LightbulbCircle sx={{ color: "#0EA5E9" }} />
                          <Typography variant="body2">
                            {q.explanation}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Zoom>
              ) : (
                <Zoom in={true}>
                  <Paper
                    sx={{
                      p: 6,
                      borderRadius: 8,
                      textAlign: "center",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <EmojiEvents
                      sx={{ fontSize: 80, color: "#F59E0B", mb: 2 }}
                    />
                    <Typography
                      variant="h2"
                      sx={{ fontWeight: 900, color: "#1E293B" }}
                    >
                      {Math.round((score / questions.length) * 100)}%
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="center"
                      sx={{ my: 4 }}
                    >
                      <Chip
                        label={`${score} Correct`}
                        color="success"
                        sx={{ fontWeight: 800 }}
                      />
                      <Chip
                        label={`${questions.length} Total`}
                        sx={{ fontWeight: 800 }}
                      />
                    </Stack>
                    <Stack spacing={2} sx={{ maxWidth: 300, mx: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setShowReview(true)}
                        startIcon={<AssignmentTurnedIn />}
                        sx={{
                          py: 2,
                          borderRadius: 4,
                          bgcolor: "#6366F1",
                          fontWeight: 800,
                          textTransform: "none",
                        }}
                      >
                        Review Performance
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={resetExam}
                        startIcon={<Replay />}
                        sx={{
                          py: 2,
                          borderRadius: 4,
                          fontWeight: 800,
                          textTransform: "none",
                        }}
                      >
                        Retake Exam
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
