import { useState } from "react";
import {
  Container,
  Box,
  Fade,
  Stack,
  Backdrop,
  CircularProgress,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import { useNotes } from "../hooks/useNotes";
import HeaderSection from "./HeaderSection";
import ScannerTab from "./ScannerTab";
import LibraryTab from "./LibraryTab";
import QuizModal from "./QuizModal";
import { generateQuiz } from "../services/aiService";

const Scanner = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // --- UI States ---
  const [tab, setTab] = useState(0);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  // --- Data States ---
  const [summary, setSummary] = useState("");
  const [pages, setPages] = useState([]);
  const [cards, setCards] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [scanSessionId, setScanSessionId] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [quizTopic, setQuizTopic] = useState("");

  const { savedNotes, saveNote, deleteNote, refreshNotes } = useNotes();

  const startQuiz = async (note, count) => {
    setIsQuizLoading(true);
    try {
      const questions = await generateQuiz(note.content, count);
      setActiveQuiz(questions);
      setQuizTopic(note.title || note.topic || "Quiz");
      setQuizOpen(true);
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* Loading Overlay */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 999,
          backdropFilter: "blur(8px)",
          bgcolor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
          color: "text.primary",
        }}
        open={isQuizLoading}
      >
        <Stack alignItems="center" spacing={3}>
          <Box sx={{ position: "relative", display: "flex" }}>
            <CircularProgress
              size={100}
              thickness={2}
              sx={{ color: "primary.main" }}
            />
            <Avatar
              src="https://api.dicebear.com/9.x/adventurer/svg?flip=true&seed=Sara"
              sx={{
                width: 50,
                height: 50,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: `3px solid ${theme.palette.background.paper}`,
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: -0.5 }}
          >
            Analyzing content...
          </Typography>
        </Stack>
      </Backdrop>

      <HeaderSection tab={tab} setTab={setTab} />

      <Container maxWidth="md" sx={{ pt: { xs: 12, md: 15 }, pb: 8 }}>
        {/* Animated Tab Switcher */}
        <Box sx={{ minHeight: "60vh" }}>
          {tab === 0 ? (
            <Fade in={tab === 0} timeout={400}>
              <Box>
                <ScannerTab
                  summary={summary}
                  setSummary={setSummary}
                  saveSummary={saveNote}
                  pages={pages}
                  setPages={setPages}
                  metadata={metadata}
                  setMetadata={setMetadata}
                  cards={cards}
                  setCards={setCards}
                  scanSessionId={scanSessionId}
                  setScanSessionId={setScanSessionId}
                />
              </Box>
            </Fade>
          ) : (
            <Fade in={tab === 1} timeout={400}>
              <Box>
                <LibraryTab
                  savedNotes={savedNotes}
                  refreshNotes={refreshNotes}
                  deleteNote={deleteNote}
                  handleLaunchQuiz={startQuiz}
                  setSummary={setSummary}
                  setMetadata={setMetadata}
                  setScanSessionId={setScanSessionId}
                  setTab={setTab}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Container>

      {/* Quiz Modal Integration */}
      {quizOpen && (
        <QuizModal
          open={quizOpen}
          questions={activeQuiz}
          topic={quizTopic}
          onClose={() => {
            setQuizOpen(false);
            setActiveQuiz([]);
          }}
        />
      )}
    </Box>
  );
};

export default Scanner;
