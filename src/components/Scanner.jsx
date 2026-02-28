import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Fade,
  Avatar,
  Stack,
  Backdrop,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  AutoStories,
  LibraryBooks,
  School,
  AutoAwesome,
} from "@mui/icons-material";
import ScannerTab from "./ScannerTab";
import LibraryTab from "./LibraryTab";
import QuizModal from "./QuizModal";
import { useNotes } from "../hooks/useNotes";
import { generateQuiz } from "../services/aiService";

const Scanner = () => {
  const [tab, setTab] = useState(0);
  const [summary, setSummary] = useState("");
  const { savedNotes, saveNote, deleteNote } = useNotes();
  const theme = useTheme();

  // --- Quiz States ---
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState([]);
  const [quizTopic, setQuizTopic] = useState("");

  /**
   * Refactored StartQuiz
   * Now accepts 'count' from the LibraryTab configuration modal
   */
  const startQuiz = async (note, count) => {
    setIsQuizLoading(true);
    try {
      // Pass the note content AND the user-selected count to the AI service
      const questions = await generateQuiz(note.content, count);

      setActiveQuiz({ questions });
      setQuizTopic(note.title || note.topic || "Quiz");
      setQuizOpen(true);
    } catch (err) {
      console.error("Failed to generate quiz:", err);
      // Optional: Add a toast notification here to tell the user something went wrong
    } finally {
      setIsQuizLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#F0F2F5",
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
            Generating your challenge...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Oga Tutor is generating your questions.
          </Typography>
        </Stack>
      </Backdrop>

      <HeaderSection tab={tab} setTab={setTab} />

      <Container maxWidth="md" sx={{ pt: { xs: 16, md: 16 }, pb: 0 }}>
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
            questions={activeQuiz}
            topic={quizTopic}
            onClose={() => setQuizOpen(false)}
          />
        )}
      </Container>
    </Box>
  );
};

const HeaderSection = ({ tab, setTab }) => (
  <Box
    sx={{
      position: "fixed",
      top: { xs: 15, md: 30 },
      left: "50%",
      transform: "translateX(-50%)",
      width: { xs: "90%", md: "700px" },
      zIndex: 1200,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ px: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src="https://api.dicebear.com/9.x/adventurer/svg?flip=true&seed=Sara"
            sx={{ width: 45, height: 45, border: "2px solid white" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              display: { xs: "none", sm: "block" },
              color: "#3e4856",
            }}
          >
            Learn Mate
          </Typography>
        </Stack>

        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          centered
          sx={{
            bgcolor: "#F1F5F9",
            borderRadius: "16px",
            p: 0.5,
            minHeight: "44px",
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: "12px",
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            },
            "& .MuiTab-root": {
              minHeight: "40px",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "0.90rem",
              color: "#64748B",
              zIndex: 1,
              "&.Mui-selected": { color: "#6366F1" },
            },
          }}
        >
          <Tab
            icon={<AutoStories sx={{ fontSize: 30 }} />}
            iconPosition="start"
            label="Scanner"
          />
          <Tab
            icon={<LibraryBooks sx={{ fontSize: 30 }} />}
            iconPosition="start"
            label="Library"
          />
        </Tabs>
      </Stack>
    </Paper>
  </Box>
);

export default Scanner;
