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
  Fade,
} from "@mui/material";
import {
  History,
  DeleteOutline,
  School,
  Book,
  Science,
  MenuBook,
  Calculate,
  Search,
  Clear,
  SettingsSuggest,
  PlayArrow,
  Close,
  ArrowForwardIos,
  AutoAwesome,
  AutoFixHigh,
} from "@mui/icons-material";

// Enhanced styles with vibrant Nigerian education-themed colors
const getSubjectStyle = (subject = "General") => {
  const map = {
    Biology: {
      color: "#10b981",
      icon: <Science />,
      bg: "rgba(16, 185, 129, 0.08)",
    },
    Physics: {
      color: "#3b82f6",
      icon: <Science />,
      bg: "rgba(59, 130, 246, 0.08)",
    },
    Maths: {
      color: "#f59e0b",
      icon: <Calculate />,
      bg: "rgba(245, 158, 11, 0.08)",
    },
    Chemistry: {
      color: "#6366f1",
      icon: <Science />,
      bg: "rgba(99, 102, 241, 0.08)",
    },
    Government: {
      color: "#8b5cf6",
      icon: <School />,
      bg: "rgba(139, 92, 246, 0.08)",
    },
    Economics: {
      color: "#ec4899",
      icon: <MenuBook />,
      bg: "rgba(236, 72, 153, 0.08)",
    },
    English: {
      color: "#06b6d4",
      icon: <Book />,
      bg: "rgba(6, 182, 212, 0.08)",
    },
  };
  return (
    map[subject] || {
      color: "#6366F1",
      icon: <AutoFixHigh />,
      bg: "rgba(99, 102, 241, 0.08)",
    }
  );
};

const LibraryTab = ({
  savedNotes,
  setSummary,
  setTab,
  deleteNote,
  handleLaunchQuiz,
}) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [questionCount, setQuestionCount] = useState(10); // Standard JAMB unit

  const subjects = ["All", ...new Set(savedNotes.map((n) => n.subject))];
  const filteredNotes = savedNotes.filter((note) => {
    const matchesFilter = filter === "All" || note.subject === filter;
    const matchesSearch =
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- FIX: Define the missing function ---
  const handleOpenNote = (note) => {
    // 1. Update the summary state with the saved note's content
    setSummary(note.content);
    // 2. Switch the tab back to the Scanner/Study view
    setTab(0);
  };

  const openQuizSetup = (e, note) => {
    e.stopPropagation(); // Prevent the Paper onClick (opening the note) from firing
    setActiveNote(note);
    setSetupOpen(true);
  };

  const startFinalQuiz = () => {
    setSetupOpen(false);
    handleLaunchQuiz(activeNote, questionCount);
  };

  return (
    <Box sx={{ pb: 6, mt: 2 }}>
      {/* Search Bar */}

      {/* Library Grid/List */}
      {filteredNotes.length > 0 ? (
        <div>
          {" "}
          <Paper
            elevation={0}
            sx={{
              p: 0.5,
              mb: 4,
              borderRadius: "100px",
              border: "1px solid #e2e8f0",
              bgcolor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search by topic, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 2 }}>
                    <Search sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ mr: 1 }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ py: 1 }}
            />
          </Paper>
          {/* Subject Filter Chips */}
          <Box
            sx={{
              overflowX: "auto",
              py: 1,
              mb: 3,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Stack direction="row" spacing={1.5}>
              {subjects.map((subj) => (
                <Chip
                  key={subj}
                  label={subj}
                  onClick={() => setFilter(subj)}
                  sx={{
                    px: 1,
                    py: 2.5,
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    bgcolor: filter === subj ? "#6366F1" : "white",
                    color: filter === subj ? "white" : "#64748B",
                    border: "1px solid",
                    borderColor: filter === subj ? "#6366F1" : "#e2e8f0",
                    "&:hover": {
                      bgcolor: filter === subj ? "#4f46e5" : "#f8fafc",
                    },
                    transition: "0.2s",
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Stack direction="column" spacing={2}>
            {filteredNotes.map((note) => {
              const style = getSubjectStyle(note.subject);
              return (
                <Fade in key={note.id}>
                  <Paper
                    elevation={0}
                    onClick={() => handleOpenNote(note)}
                    sx={{
                      p: 2,
                      borderRadius: "24px",
                      bgcolor: "white",
                      border: "1px solid #f1f5f9",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.04)",
                        borderColor: alpha(style.color, 0.4),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexGrow: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: style.bg,
                          color: style.color,
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          fontSize: "1.5rem",
                        }}
                      >
                        {style.icon}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            color: "#1E293B",
                            lineHeight: 1.2,
                            mb: 0.5,
                          }}
                        >
                          {note.title.trim().slice(0, 14) + "...." ||
                            "Quick Scan"}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: style.color,
                              bgcolor: alpha(style.color, 0.1),
                              px: 1,
                              borderRadius: "6px",
                            }}
                          >
                            {note.subject}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", fontWeight: 600 }}
                          >
                            {note.date}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="PrepFlow Quiz">
                        <IconButton
                          size="small"
                          onClick={(e) => openQuizSetup(e, note)}
                          sx={{
                            bgcolor: alpha("#6366F1", 0.05),
                            color: "#6366F1",
                            "&:hover": { bgcolor: "#6366F1", color: "#fff" },
                            transition: "0.2s",
                          }}
                        >
                          <AutoAwesome fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        sx={{
                          color: "#cbd5e1",
                          "&:hover": {
                            color: "#ef4444",
                            bgcolor: alpha("#ef4444", 0.08),
                          },
                        }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                </Fade>
              );
            })}
          </Stack>
        </div>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pt: { xs: 14, md: 8 },
            pb: { xs: 6, md: 6 },
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#FFFFFF",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
            }}
          >
            <MenuBook sx={{ fontSize: 40, color: "#cbd5e1" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#1E293B", mb: 1 }}
          >
            Library is empty?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", maxWidth: 400, mb: 4 }}
          >
            Scan your first note to start building your library.
          </Typography>
        </Box>
      )}

      {/* --- EXAM CONFIGURATION MODAL --- */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{
          sx: {
            mx: 2,
            borderRadius: "32px",
            p: 2,
            maxWidth: 450,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, px: 1 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: alpha("#6366F1", 0.1), color: "#6366F1" }}>
              <SettingsSuggest />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              PrepFlow Exam
            </Typography>
          </Stack>
          <IconButton onClick={() => setSetupOpen(false)}>
            <Close />
          </IconButton>
        </Stack>

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
            Select question density for <b>{activeNote?.title}</b>. PrepFlow
            will simulate JAMB/WAEC patterns.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            {[5, 10, 20].map((num) => (
              <Box
                key={num}
                onClick={() => setQuestionCount(num)}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: "20px",
                  cursor: "pointer",
                  border: "2px solid",
                  textAlign: "center",
                  transition: "0.2s",
                  borderColor: questionCount === num ? "#6366F1" : "#F1F5F9",
                  bgcolor:
                    questionCount === num ? alpha("#6366F1", 0.05) : "white",
                  "&:hover": { borderColor: "#6366F1" },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    color: questionCount === num ? "#6366F1" : "#1E293B",
                  }}
                >
                  {num}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "#94A3B8" }}
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
              py: 2,
              borderRadius: "16px",
              fontWeight: 900,
              textTransform: "none",
              bgcolor: "#6366F1",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Generate Quiz
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LibraryTab;
