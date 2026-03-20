import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Paper,
  Fade,
  LinearProgress,
  alpha,
} from "@mui/material";
import {
  CheckCircleOutline,
  CancelOutlined,
  AccessTime,
} from "@mui/icons-material";
import { green, red, grey } from "@mui/material/colors";
const QuizSection = ({ questions, isLoading, subject }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question for practice
  const timerRef = useRef(null);

  // Reset quiz when questions change (e.g., new scan)
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setTimeLeft(60);
    if (questions.length > 0) startTimer();
    return () => clearInterval(timerRef.current);
  }, [questions]);

  // Timer logic
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion(); // Auto-move if time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading && questions.length === 0) {
    return (
      <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" color="text.secondary">
          Finding top {subject} questions for you...
        </Typography>
      </Stack>
    );
  }

  if (questions.length === 0 && !isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No practice questions found for this topic yet.
          <br /> Try scanning another note!
        </Typography>
      </Box>
    );
  }

  const handleOptionClick = (optionKey) => {
    if (isAnswered) return; // Prevent changing answer after submission
    setSelectedOption(optionKey);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return; // Don't submit if no option selected
    setIsAnswered(true);
    clearInterval(timerRef.current); // Stop timer on answer
    if (selectedOption === currentQuestion.correct_option) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60); // Reset timer for next question
      startTimer();
    } else {
      setShowResults(true); // End of quiz
      clearInterval(timerRef.current);
    }
  };

  // Helper to get option text based on key (e.g., 'A' -> 'option_a')
  const getOptionText = (q, key) => {
    switch (key) {
      case "A":
        return q.option_a;
      case "B":
        return q.option_b;
      case "C":
        return q.option_c;
      case "D":
        return q.option_d;
      default:
        return "";
    }
  };

  if (showResults) {
    return (
      <Fade in timeout={500}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: "16px",
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Quiz Complete!
          </Typography>
          <Typography variant="h4" sx={{ mb: 3 }}>
            You scored: {score} / {questions.length}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              /* Implement a retry or new quiz logic */
            }}
            sx={{ mr: 2 }}
          >
            Practice Again
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
          >
            Share Score 🚀
          </Button>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, md: 4 }, mt: 4, borderRadius: "16px" }}
      >
        {/* Progress Bar & Timer */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ minWidth: "70px" }}
          >
            <AccessTime color="action" fontSize="small" />
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              {timeLeft}s
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {currentQuestion.question}
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {["A", "B", "C", "D"].map((optionKey) => (
            <Button
              key={optionKey}
              variant="outlined"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                borderColor: isAnswered
                  ? optionKey === currentQuestion.correct_option
                    ? green[600]
                    : selectedOption === optionKey
                      ? red[600]
                      : grey[400]
                  : selectedOption === optionKey
                    ? "primary.main"
                    : grey[400],
                color: isAnswered
                  ? optionKey === currentQuestion.correct_option
                    ? green[800]
                    : selectedOption === optionKey
                      ? red[800]
                      : grey[800]
                  : "text.primary",
                bgcolor: isAnswered
                  ? optionKey === currentQuestion.correct_option
                    ? alpha(green[100], 0.3)
                    : selectedOption === optionKey
                      ? alpha(red[100], 0.3)
                      : "inherit"
                  : "inherit",
                "&:hover": {
                  borderColor: isAnswered ? "inherit" : "primary.dark",
                  bgcolor: isAnswered ? "inherit" : alpha("primary.main", 0.05),
                },
                pointerEvents: isAnswered ? "none" : "auto", // Disable clicks after answering
              }}
              onClick={() => handleOptionClick(optionKey)}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: selectedOption === optionKey ? "bold" : "normal",
                  mr: 1,
                }}
              >
                {optionKey}.
              </Typography>
              <Typography variant="body1">
                {getOptionText(currentQuestion, optionKey)}
              </Typography>
              {isAnswered && optionKey === currentQuestion.correct_option && (
                <CheckCircleOutline sx={{ color: green[600], ml: "auto" }} />
              )}
              {isAnswered &&
                selectedOption === optionKey &&
                selectedOption !== currentQuestion.correct_option && (
                  <CancelOutlined sx={{ color: red[600], ml: "auto" }} />
                )}
            </Button>
          ))}
        </Stack>

        {isAnswered && (
          <Fade in timeout={300}>
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: alpha(green[50], 0.4),
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: green[800], mb: 1 }}
              >
                Explanation:
              </Typography>
              <Typography variant="body2" sx={{ color: grey[800] }}>
                {currentQuestion.explanation}
              </Typography>
            </Box>
          </Fade>
        )}

        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={handleSubmitAnswer}
            disabled={!selectedOption || isAnswered}
            sx={{ px: 4 }}
          >
            Submit Answer
          </Button>
          <Button
            variant="outlined"
            onClick={handleNextQuestion}
            disabled={!isAnswered && !showResults} // Disable if not answered or not showing results
            sx={{ px: 4 }}
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </Stack>
      </Paper>
    </Fade>
  );
};

export default QuizSection;
