import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  IconButton,
  Stack,
  Chip,
  Avatar,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  Dialog,
  Button,
  alpha,
} from "@mui/material";
import {
  History,
  DeleteOutline,
  School,
  Book,
  Science,
  MenuBook,
  Calculate,
  Psychology,
  Search,
  Clear,
  SettingsSuggest,
  PlayArrow,
  Close,
} from "@mui/icons-material";

// Helper to pick colors and icons based on subject
const getSubjectStyle = (subject = "General") => {
  const map = {
    Biology: { color: "#10b981", icon: <Science /> },
    Physics: { color: "#3b82f6", icon: <Science /> },
    Maths: { color: "#f59e0b", icon: <Calculate /> },
    Chemistry: { color: "#6366f1", icon: <Science /> },
    Government: { color: "#8b5cf6", icon: <School /> },
    Economics: { color: "#ec4899", icon: <MenuBook /> },
    English: { color: "#06b6d4", icon: <Book /> },
  };
  return map[subject] || { color: "#64748b", icon: <History /> };
};

const LibraryTab = ({
  savedNotes,
  setSummary,
  setTab,
  deleteNote,
  handleLaunchQuiz, // This is the function from your parent that opens the Quiz Modal
}) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Quiz Setup States ---
  const [setupOpen, setSetupOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);

  // Filter logic
  const subjects = ["All", ...new Set(savedNotes.map((n) => n.subject))];
  const filteredNotes = savedNotes.filter((note) => {
    const matchesFilter = filter === "All" || note.subject === filter;
    const matchesSearch =
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openQuizSetup = (note) => {
    setActiveNote(note);
    setSetupOpen(true);
  };

  const startFinalQuiz = () => {
    setSetupOpen(false);
    // Pass the note content and the selected count back to the parent
    handleLaunchQuiz(activeNote, questionCount);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              bgcolor: "primary.main",
              p: 0.8,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <History sx={{ color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Library
          </Typography>
        </Stack>
        <Chip
          label={`${filteredNotes.length} Notes`}
          size="small"
          sx={{ fontWeight: 800, bgcolor: "#e2e8f0" }}
        />
      </Stack>

      {/* Search & Filters */}
      {savedNotes.length > 0 && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <Clear />
                </IconButton>
              ),
              sx: { borderRadius: 4, bgcolor: "white" },
            }}
          />
          <Box sx={{ overflowX: "auto", display: "flex" }}>
            <ToggleButtonGroup
              color="primary"
              value={filter}
              exclusive
              onChange={(e, val) => val && setFilter(val)}
              sx={{ gap: 1 }}
            >
              {subjects.map((subj) => (
                <ToggleButton
                  key={subj}
                  value={subj}
                  sx={{
                    borderRadius: "12px !important",
                    border: "none",

                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  {subj}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Stack>
      )}

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <Stack spacing={2}>
          {filteredNotes.map((note) => {
            const style = getSubjectStyle(note.subject);
            return (
              <Paper
                key={note.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 5,
                  border: "1px solid #f1f5f9",
                  transition: "0.2s",
                  "&:hover": {
                    borderColor: style.color,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Stack direction="column" spacing={1} alignItems="flex-start">
                  <Stack direction="row" sx={{ flexGrow: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${style.color}15`,
                        color: style.color,
                        borderRadius: 3,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {style.icon}
                    </Avatar>
                    <Stack
                      direction="column"
                      spacing={0.5}
                      sx={{ ml: 1, flexGrow: 1 }}
                    >
                      {" "}
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {note.title || "Untitled Note"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                        {note.topic} • {note.date}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Tooltip
                      title="Practice Quiz"
                      onClick={() => openQuizSetup(note)}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "#f0fdf4",
                          color: "#16a34a",
                          "&:hover": { bgcolor: "#16a34a", color: "white" },
                        }}
                      >
                        <Psychology fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="caption"
                        sx={{ color: "#16a34a", fontWeight: 700 }}
                      >
                        Practice Quiz
                      </Typography>
                    </Tooltip>
                    <Tooltip title="View Note">
                      <IconButton
                        onClick={() => {
                          setSummary(note.content);
                          setTab(0);
                        }}
                        sx={{
                          bgcolor: "#f8fafc",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        <History fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      onClick={() => deleteNote(note.id)}
                      sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444" } }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            border: "2px dashed #e2e8f0",
            borderRadius: 8,
          }}
        >
          <MenuBook sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
          <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
            No notes found
          </Typography>
        </Box>
      )}

      {/* --- EXAM CONFIGURATION MODAL --- */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{ sx: { borderRadius: 6, p: 2, maxWidth: 400 } }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsSuggest color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Quiz Setup
            </Typography>
          </Stack>
          <IconButton onClick={() => setSetupOpen(false)}>
            <Close />
          </IconButton>
        </Stack>

        <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
          How many JAMB-style questions should Oga Tutor generate for{" "}
          <b>{activeNote?.title}</b>?
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {[5, 10, 15].map((num) => (
            <Box
              key={num}
              onClick={() => setQuestionCount(num)}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 4,
                cursor: "pointer",
                border: "2px solid",
                textAlign: "center",
                borderColor: questionCount === num ? "primary.main" : "#F1F5F9",
                bgcolor:
                  questionCount === num ? alpha("#6366F1", 0.05) : "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: questionCount === num ? "primary.main" : "#1E293B",
                }}
              >
                {num}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#94A3B8" }}
              >
                QUES
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={startFinalQuiz}
          sx={{
            py: 1.5,
            borderRadius: 4,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          Start Examination
        </Button>
      </Dialog>
    </Box>
  );
};

export default LibraryTab;
