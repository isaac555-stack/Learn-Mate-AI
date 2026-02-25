import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Stack,
  Box,
  LinearProgress,
  IconButton,
  Zoom,
} from "@mui/material";
import { Close, CheckCircle, Cancel, EmojiEvents } from "@mui/icons-material";

const QuizModal = ({ open, questions, onClose, topic }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Safety check: if Gemini returns empty or fails
  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;

  const handleSelect = (index) => {
    if (selectedAnswer !== null) return; // Prevent clicking multiple times
    setSelectedAnswer(index);
    if (index === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetAndClose = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isFinished ? "Quiz Results" : topic}
        <IconButton onClick={resetAndClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!isFinished ? (
          <Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 3, borderRadius: 2, height: 8, bgcolor: "#f1f5f9" }}
            />

            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 3, lineHeight: 1.3, color: "#1e293b" }}
            >
              {currentQuestion.question}
            </Typography>

            <Stack spacing={1.5}>
              {currentQuestion.options.map((option, i) => {
                const isCorrect = i === currentQuestion.correctAnswer;
                const isSelected = i === selectedAnswer;

                let borderColor = "#e2e8f0";
                let bgColor = "transparent";

                // Logic for showing Green/Red feedback after an answer is picked
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    borderColor = "#10b981";
                    bgColor = "#ecfdf5";
                  } else if (isSelected) {
                    borderColor = "#ef4444";
                    bgColor = "#fef2f2";
                  }
                }

                return (
                  <Button
                    key={i}
                    variant="outlined"
                    fullWidth
                    onClick={() => handleSelect(i)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: 3,
                      textTransform: "none",
                      justifyContent: "flex-start",
                      borderColor: borderColor,
                      bgcolor: bgColor,
                      borderWidth:
                        isSelected || (selectedAnswer !== null && isCorrect)
                          ? 2
                          : 1,
                      color: "#1e293b",
                      "&:hover": {
                        borderColor:
                          selectedAnswer === null
                            ? "primary.main"
                            : borderColor,
                        bgcolor: selectedAnswer === null ? "#f8fafc" : bgColor,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography sx={{ fontWeight: 700, mr: 1 }}>
                        {String.fromCharCode(65 + i)}.
                      </Typography>
                      <Typography sx={{ flexGrow: 1, textAlign: "left" }}>
                        {option}
                      </Typography>
                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                      )}
                      {selectedAnswer !== null && isSelected && !isCorrect && (
                        <Cancel sx={{ color: "#ef4444", fontSize: 20 }} />
                      )}
                    </Stack>
                  </Button>
                );
              })}
            </Stack>

            <Button
              fullWidth
              variant="contained"
              disabled={selectedAnswer === null}
              onClick={handleNext}
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              {currentIdx === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </Box>
        ) : (
          <Zoom in={true}>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <EmojiEvents sx={{ fontSize: 80, color: "#f59e0b", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "#1e293b" }}
              >
                {score} / {questions.length}
              </Typography>
              <Typography
                sx={{ color: "#64748b", mt: 1, mb: 4, fontWeight: 500 }}
              >
                {score === questions.length
                  ? "Perfect Score! You are JAMB-ready! 🔥"
                  : "Good effort! Review the summary to get 100% next time."}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={resetAndClose}
                sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
              >
                Back to Library
              </Button>
            </Box>
          </Zoom>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
