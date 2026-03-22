import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  IconButton,
  Stack,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  alpha,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  DeleteOutline,
  Science,
  Book,
  Calculate,
  Search,
  Clear,
  PlayArrow,
  Close,
  AutoAwesome,
  AutoFixHigh,
  CloudDone,
  CloudOff,
  AccessTime,
  MoreVert,
  MenuBook,
} from "@mui/icons-material";

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
    Mathematics: {
      color: "#f59e0b",
      icon: <Calculate />,
      bg: "rgba(245, 158, 11, 0.08)",
    },
    Chemistry: {
      color: "#6366f1",
      icon: <Science />,
      bg: "rgba(99, 102, 241, 0.08)",
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
  savedNotes = [],
  setSummary,
  setTab,
  deleteNote,
  handleLaunchQuiz,
}) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const toTitle = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const subjects = [
    "All",
    ...new Set(savedNotes.map((n) => n.subject).filter(Boolean)),
  ];

  const filteredNotes = savedNotes.filter((note) => {
    const matchesFilter = filter === "All" || note.subject === filter;
    const query = searchQuery.toLowerCase();
    return (
      matchesFilter &&
      (note.title?.toLowerCase().includes(query) ||
        note.subject?.toLowerCase().includes(query))
    );
  });

  const handleMenuOpen = (e, note) => {
    e.stopPropagation(); // Stops the Paper's onClick from firing
    setAnchorEl(e.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const triggerQuizSetup = () => {
    handleMenuClose();
    setSetupOpen(true);
  };
  const triggerDeleteConfirm = () => {
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteNote(selectedNote.id);
    setDeleteConfirmOpen(false);
    setSelectedNote(null);
  };

  return (
    <Box sx={{ pb: 6, mt: 2 }}>
      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 0.5,
          mb: 4,
          borderRadius: "100px",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search your library..."
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
              <IconButton size="small" onClick={() => setSearchQuery("")}>
                <Clear fontSize="small" />
              </IconButton>
            ),
          }}
          sx={{ py: 1 }}
        />
      </Paper>

      {/* Subject Chips */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          overflowX: "auto",
          mb: 3,
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
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
              bgcolor: filter === subj ? "#6366F1" : "white",
              color: filter === subj ? "white" : "#64748B",
              border: "1px solid",
              borderColor: filter === subj ? "#6366F1" : "#e2e8f0",
            }}
          />
        ))}
      </Stack>

      {/* Notes List */}
      <Stack spacing={2}>
        {filteredNotes.map((note) => {
          const style = getSubjectStyle(note.subject);
          const isLocal = typeof note.id === "number";

          return (
            <Fade in key={note.id}>
              <Paper
                elevation={0}
                onClick={() => {
                  setSummary(note.content);
                  setTab(0);
                }}
                sx={{
                  p: 2,
                  borderRadius: "24px",
                  bgcolor: "white",
                  border: "1px solid #f1f5f9",
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
                    borderColor: alpha(style.color, 0.3),
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: style.bg,
                    color: style.color,
                    width: 52,
                    height: 52,
                    borderRadius: "16px",
                    mr: 2,
                  }}
                >
                  {style.icon}
                </Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{
                      fontWeight: 800,
                      color: "#1E293B",
                      fontSize: "0.95rem",
                    }}
                  >
                    {note.title}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        color: style.color,
                        bgcolor: alpha(style.color, 0.1),
                        px: 1,
                        borderRadius: "6px",
                        maxWidth: "120px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {toTitle(note.subject || "General")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} />{" "}
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString()
                        : "Recent"}
                    </Typography>
                  </Stack>
                </Box>

                {isLocal ? (
                  <CloudOff sx={{ fontSize: 14, color: "#cbd5e1", mx: 1 }} />
                ) : (
                  <CloudDone sx={{ fontSize: 14, color: "#10b981", mx: 1 }} />
                )}

                <IconButton onClick={(e) => handleMenuOpen(e, note)}>
                  <MoreVert />
                </IconButton>
              </Paper>
            </Fade>
          );
        })}

        {filteredNotes.length === 0 && (
          <Fade in timeout={600}>
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 3,
                bgcolor: alpha("#6366F1", 0.03),
                borderRadius: "32px",
                border: "2px dashed",
                borderColor: alpha("#6366F1", 0.1),
                mt: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "white",
                  color: "#6366F1",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.1)",
                  margin: "0 auto 24px",
                }}
              >
                <MenuBook sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: "#1E293B", mb: 1 }}
              >
                {searchQuery ? "No matching notes" : "Your library is empty"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748B", mb: 4, maxWidth: 280, mx: "auto" }}
              >
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Start creating study notes to build your library!"}
              </Typography>
            </Box>
          </Fade>
        )}
      </Stack>

      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            mt: 1,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={triggerQuizSetup} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AutoAwesome fontSize="small" sx={{ color: "#6366F1" }} />
          </ListItemIcon>
          <ListItemText
            primary="Take AI Quiz"
            primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
          />
        </MenuItem>
        <MenuItem
          onClick={triggerDeleteConfirm}
          sx={{ py: 1.5, color: "#ef4444" }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete Note"
            primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
          />
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Delete note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove <b>{selectedNote?.title}</b>? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ color: "#64748b", fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#ef4444",
              borderRadius: "12px",
              fontWeight: 800,
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{ sx: { borderRadius: "32px", p: 2, maxWidth: 400 } }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Quiz Density
          </Typography>
          <IconButton onClick={() => setSetupOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2}>
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
                  transform: questionCount === num ? "scale(1.05)" : "scale(1)",
                  borderColor: questionCount === num ? "#6366F1" : "#F1F5F9",
                  bgcolor:
                    questionCount === num ? alpha("#6366F1", 0.05) : "white",
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
        </Box>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={() => {
            setSetupOpen(false);
            handleLaunchQuiz(selectedNote, questionCount);
          }}
          sx={{
            py: 2,
            borderRadius: "16px",
            fontWeight: 900,
            bgcolor: "#6366F1",
          }}
        >
          Generate Quiz
        </Button>
      </Dialog>
    </Box>
  );
};

export default LibraryTab;
