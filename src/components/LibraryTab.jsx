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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  DeleteOutline,
  Science,
  Book,
  Calculate,
  Search,
  Clear,
  PlayArrow,
  AutoAwesome,
  AutoFixHigh,
  CloudDone,
  CloudOff,
  AccessTime,
  MoreVert,
  MenuBook,
  Sync,
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
  setMetadata, // Correctly received from Parent
  setScanSessionId, // Correctly received from Parent
  handleLaunchQuiz,
  refreshNotes,
}) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toTitle = (str) =>
    !str
      ? ""
      : str
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

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

  const handleRefresh = async () => {
    if (!refreshNotes) return;
    setIsRefreshing(true);
    await refreshNotes();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  /**
   * Refactored: Opens a note and hydrates all necessary session state
   */
  const handleOpenNote = (note) => {
    if (note.isSyncing) return;

    // 1. Load the text content
    setSummary(note.content);

    // 2. Load the Supabase UUID so Deep Dives know which row to update
    setScanSessionId(note.id);

    // 3. Load metadata so the ControlBar and AI have context
    setMetadata({
      title: note.title,
      subject: note.subject,
      topic: note.topic,
    });

    // 4. Switch to the Scanner/Viewer tab
    setTab(0);
  };

  const handleMenuOpen = (e, note) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => setAnchorEl(null);
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
      <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 0.5,
            borderRadius: "100px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            flex: 1,
            bgcolor: "white",
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
        <Tooltip title="Refresh Cloud Library">
          <IconButton
            onClick={handleRefresh}
            sx={{
              bgcolor: "white",
              border: "1px solid #e2e8f0",
              p: 1.5,
              transition: "0.3s",
            }}
          >
            <Sync
              sx={{
                color: "#64748B",
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

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

      <Stack spacing={2}>
        {filteredNotes.map((note) => {
          const style = getSubjectStyle(note.subject);
          const isLocalOnly = typeof note.id === "number";
          const isSyncing = note.isSyncing;

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
                  cursor: isSyncing ? "default" : "pointer",
                  transition: "0.3s",
                  display: "flex",
                  alignItems: "center",
                  opacity: isSyncing ? 0.6 : 1,
                  "&:hover": {
                    transform: isSyncing ? "none" : "translateY(-3px)",
                    boxShadow: isSyncing
                      ? "none"
                      : "0 10px 20px rgba(0,0,0,0.03)",
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
                      noWrap
                      sx={{
                        fontWeight: 800,
                        color: style.color,
                        bgcolor: alpha(style.color, 0.1),
                        px: 1,
                        borderRadius: "6px",
                        maxWidth: "100px",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} />
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString()
                        : "Recent"}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ mr: 1 }}>
                  {isSyncing ? (
                    <CircularProgress
                      size={16}
                      thickness={5}
                      sx={{ color: "#6366F1" }}
                    />
                  ) : isLocalOnly ? (
                    <Tooltip title="Local Save (Not Synced)">
                      <CloudOff sx={{ fontSize: 16, color: "#cbd5e1" }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Synced to Cloud">
                      <CloudDone sx={{ fontSize: 16, color: "#10b981" }} />
                    </Tooltip>
                  )}
                </Box>

                <IconButton
                  onClick={(e) => handleMenuOpen(e, note)}
                  disabled={isSyncing}
                >
                  <MoreVert />
                </IconButton>
              </Paper>
            </Fade>
          );
        })}

        {filteredNotes.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8, opacity: 0.6 }}>
            <MenuBook sx={{ fontSize: 48, mb: 2, color: "#6366F1" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No Notes Found
            </Typography>
            <Typography variant="body2">
              Try a different search or create a new note.
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={triggerQuizSetup}>
          <ListItemIcon>
            <AutoAwesome fontSize="small" sx={{ color: "#6366F1" }} />
          </ListItemIcon>
          <ListItemText
            primary="Take AI Quiz"
            primaryTypographyProps={{ fontWeight: 700 }}
          />
        </MenuItem>
        <MenuItem onClick={triggerDeleteConfirm} sx={{ color: "#ef4444" }}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete Note"
            primaryTypographyProps={{ fontWeight: 700 }}
          />
        </MenuItem>
      </Menu>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Delete this note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove "{selectedNote?.title}" from your
            library.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Setup Dialog */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{ sx: { borderRadius: "32px", p: 2 } }}
      >
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Quiz Density
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {[5, 10, 20].map((num) => (
            <Button
              key={num}
              variant={questionCount === num ? "contained" : "outlined"}
              onClick={() => setQuestionCount(num)}
              sx={{ flex: 1, borderRadius: "16px", py: 2, fontWeight: 800 }}
            >
              {num} Qs
            </Button>
          ))}
        </Stack>
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
