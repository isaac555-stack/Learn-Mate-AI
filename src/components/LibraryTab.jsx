import React, { useState, useMemo, useCallback } from "react";
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
  useTheme,
} from "@mui/material";
import {
  DeleteOutline,
  Science,
  Calculate,
  Search,
  Clear,
  AutoAwesome,
  AutoFixHigh,
  AccessTime,
  MoreVert,
  Sync,
  Psychology,
  HistoryEdu,
  Draw,
} from "@mui/icons-material";

// Helper for normalized subject styling
const getSubjectStyle = (theme, subject = "General") => {
  const isDark = theme.palette.mode === "dark";
  const normalizedSubject = subject?.trim().toLowerCase() || "general";

  const map = {
    biology: { color: "#34A853", icon: <Science fontSize="small" /> },
    physics: { color: "#4285F4", icon: <Psychology fontSize="small" /> },
    mathematics: { color: "#FBBC04", icon: <Calculate fontSize="small" /> },
    chemistry: { color: "#A142F4", icon: <AutoFixHigh fontSize="small" /> },
    english: { color: "#EA4335", icon: <HistoryEdu fontSize="small" /> },
    art: { color: "#F06292", icon: <Draw fontSize="small" /> },
  };

  const choice = map[normalizedSubject] || {
    color: theme.palette.primary.main,
    icon: <AutoAwesome fontSize="small" />,
  };

  return {
    ...choice,
    bg: alpha(choice.color, isDark ? 0.15 : 0.1),
  };
};

const LibraryTab = ({
  savedNotes = [],
  setSummary,
  setTab,
  deleteNote,
  setMetadata,
  setScanSessionId,
  handleLaunchQuiz,
  refreshNotes,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // State Management
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized derived data
  const subjects = useMemo(
    () => ["All", ...new Set(savedNotes.map((n) => n.subject).filter(Boolean))],
    [savedNotes],
  );

  const filteredNotes = useMemo(() => {
    return savedNotes.filter((note) => {
      const matchesFilter = filter === "All" || note.subject === filter;
      const query = searchQuery.toLowerCase();
      return (
        matchesFilter &&
        (note.title?.toLowerCase().includes(query) ||
          note.subject?.toLowerCase().includes(query))
      );
    });
  }, [savedNotes, filter, searchQuery]);

  // Handlers
  const handleRefresh = async () => {
    if (isRefreshing || !refreshNotes) return;
    setIsRefreshing(true);
    await refreshNotes();
    setIsRefreshing(false);
  };

  const handleOpenNote = (note) => {
    if (note.isSyncing) return;
    setSelectedNote(note); // Ensure state is hydrated
    setSummary(note.content);
    setScanSessionId(note.id);
    setMetadata({
      title: note.title,
      subject: note.subject,
      topic: note.topic,
    });
    setTab(0);
  };

  const handleMenuAction = (action, note) => {
    setSelectedNote(note);
    setAnchorEl(null);
    if (action === "quiz") setSetupOpen(true);
    if (action === "delete") setDeleteConfirmOpen(true);
  };

  const onConfirmDelete = () => {
    if (selectedNote) {
      deleteNote(selectedNote.id);
      setDeleteConfirmOpen(false);
      setSelectedNote(null);
    }
  };

  return (
    <Box sx={{ pb: 10, mt: 1 }}>
      {/* Search & Sync Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 11,
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(12px)",
          pt: 2,
          pb: 1,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: "4px 12px",
              borderRadius: "100px",
              border: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              flex: 1,
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.5)
                : "#fff",
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
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <Clear fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Paper>
          <Tooltip title="Refresh Library">
            <IconButton
              onClick={handleRefresh}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "16px",
                p: 1.5,
              }}
            >
              <Sync
                sx={{
                  color: "primary.main",
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Filter Chips */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: "auto",
            pb: 1,
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          {subjects.map((subj) => (
            <Chip
              key={subj}
              label={subj}
              onClick={() => setFilter(subj)}
              sx={{
                fontWeight: 600,
                borderRadius: "100px",
                bgcolor: filter === subj ? "text.primary" : "transparent",
                color: filter === subj ? "background.paper" : "text.secondary",
                border:
                  filter === subj
                    ? "none"
                    : `1px solid ${theme.palette.divider}`,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Notes List */}
      <Stack spacing={2} sx={{ mt: 3 }}>
        {filteredNotes.map((note) => {
          const style = getSubjectStyle(theme, note.subject);
          return (
            <Fade in key={note.id}>
              <Paper
                elevation={0}
                onClick={() => handleOpenNote(note)}
                sx={{
                  p: 2,
                  borderRadius: "24px",
                  bgcolor: isDark ? "#1E1F20" : "#fff",
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  cursor: note.isSyncing ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: style.color,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 20px ${alpha(style.color, 0.1)}`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: style.bg,
                    color: style.color,
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    mr: 2,
                  }}
                >
                  {style.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{ fontWeight: 700 }}
                  >
                    {note.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: style.color,
                        bgcolor: alpha(style.color, 0.1),
                        px: 1,
                        borderRadius: "4px",
                      }}
                    >
                      {note.subject || "General"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} />
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString()
                        : "Recent"}
                    </Typography>
                  </Stack>
                </Box>
                {note.isSyncing ? (
                  <CircularProgress size={20} />
                ) : (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget);
                      setSelectedNote(note);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                )}
              </Paper>
            </Fade>
          );
        })}
      </Stack>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 10, opacity: 0.5 }}>
          <AutoAwesome sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6">Nothing here yet</Typography>
        </Box>
      )}

      {/* Menus & Dialogs */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: "16px", minWidth: 160 } }}
      >
        <MenuItem onClick={() => handleMenuAction("quiz", selectedNote)}>
          <ListItemIcon>
            <AutoAwesome fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Generate Quiz" />
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuAction("delete", selectedNote)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete Note" />
        </MenuItem>
      </Menu>

      {/* Quiz Dialog */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{ sx: { borderRadius: "28px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Quiz Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select the number of questions:
          </Typography>
          <Stack direction="row" spacing={1}>
            {[5, 10, 15].map((n) => (
              <Button
                key={n}
                fullWidth
                variant={questionCount === n ? "contained" : "outlined"}
                onClick={() => setQuestionCount(n)}
                sx={{ borderRadius: "12px" }}
              >
                {n}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setSetupOpen(false);
              handleLaunchQuiz(selectedNote, questionCount);
            }}
            sx={{ borderRadius: "100px" }}
          >
            Start Learning
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete this note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the study guide and all associated quiz
            data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={onConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: "100px" }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LibraryTab;
