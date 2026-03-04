import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Fade,
  Avatar,
  Stack,
  Backdrop,
  CircularProgress,
  alpha,
} from "@mui/material";
import HeaderSection from "./HeaderSection";
import ScannerTab from "./ScannerTab";
import LibraryTab from "./LibraryTab";
import QuizModal from "./QuizModal";
import { useNotes } from "../hooks/useNotes";
import { generateQuiz } from "../services/aiService";

const Scanner = () => {
  const [tab, setTab] = useState(0);
  const [summary, setSummary] = useState("");
  const { savedNotes, saveNote, deleteNote } = useNotes();

  // --- Quiz States ---
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [quizTopic, setQuizTopic] = useState("");

  const startQuiz = async (note, count) => {
    setIsQuizLoading(true);
    try {
      const questions = await generateQuiz(note.content, count);

      setActiveQuiz(questions);
      setQuizTopic(note.title || note.topic || "Quiz");
      setQuizOpen(true);
    } catch (err) {
      console.error("Failed to generate quiz:", err);
      // Peer tip: Always good to reset loading even on error
    } finally {
      setIsQuizLoading(false);
    }
  };
  return (
    <Box
      sx={{
        bgcolor: "#fbfbfb",
        minHeight: "100vh",

        m: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, ${alpha("#6366F1", 0.05)} 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, ${alpha("#EC4899", 0.05)} 0%, transparent 20%)
        `,
      }}
    >
      {/* Immersive AI Loader */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 999,
          backdropFilter: "blur(15px)",
          background: "rgba(255, 255, 255, 0.8)",
          color: "#1E293B",
        }}
        open={isQuizLoading}
      >
        <Stack alignItems="center" spacing={3}>
          <Box sx={{ position: "relative" }}>
            <CircularProgress
              size={100}
              sx={{ color: "#6366F1" }}
              thickness={2}
            />
            <Avatar
              src="https://api.dicebear.com/9.x/adventurer/svg?flip=true&seed=Sara"
              sx={{
                width: 45,
                height: 45,
                border: "2px solid white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Analyzing content...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            PrepFlow AI is generating your questions.
          </Typography>
        </Stack>
      </Backdrop>

      <HeaderSection tab={tab} setTab={setTab} />

      <Container
        maxWidth="md"
        sx={{ pt: { xs: 14, md: 16 }, pb: { xs: 6, md: 6 } }}
      >
        <Box sx={{ position: "relative" }}>
          {tab === 0 ? (
            <Fade in={tab === 0}>
              <Box>
                <ScannerTab
                  summary={summary}
                  setSummary={setSummary}
                  saveSummary={saveNote}
                />
              </Box>
            </Fade>
          ) : (
            <Fade in={tab === 1}>
              <Box>
                <LibraryTab
                  savedNotes={savedNotes}
                  deleteNote={deleteNote}
                  setSummary={(content) => {
                    setSummary(content);
                    setTab(0);
                  }}
                  // Connect LibraryTab's internal modal to the startQuiz logic
                  handleLaunchQuiz={startQuiz}
                />
              </Box>
            </Fade>
          )}
        </Box>

        {/* The Quiz CBT Experience */}
        {quizOpen && (
          <QuizModal
            open={quizOpen}
            questions={activeQuiz} // activeQuiz is now the array [{}, {}, ...]
            topic={quizTopic}
            onClose={() => {
              setQuizOpen(false);
              setActiveQuiz([]); // Clear quiz when closed to free up memory
            }}
          />
        )}
      </Container>
    </Box>
  );
};

export default Scanner;
