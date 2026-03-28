import React, { useState, useMemo } from "react";
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
  Psychology,
  HistoryEdu,
  Draw,
} from "@mui/icons-material";

// Enhanced Subject Mapping with Gemini Palette
const getSubjectStyle = (theme, subject = "General") => {
  const isDark = theme.palette.mode === "dark";
  const map = {
    Biology: { color: "#34A853", icon: <Science fontSize="small" /> },
    Physics: { color: "#4285F4", icon: <Psychology fontSize="small" /> },
    Mathematics: { color: "#FBBC04", icon: <Calculate fontSize="small" /> },
    Chemistry: { color: "#A142F4", icon: <AutoFixHigh fontSize="small" /> },
    English: { color: "#EA4335", icon: <HistoryEdu fontSize="small" /> },
    Art: { color: "#F06292", icon: <Draw fontSize="small" /> },
  };

  const choice = map[subject] || {
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

  // States
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized Subjects
  const subjects = useMemo(
    () => ["All", ...new Set(savedNotes.map((n) => n.subject).filter(Boolean))],
    [savedNotes],
  );

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
    <Box sx={{ pb: 10, mt: 1 }}>
      {/* Sticky Glassmorphism Header */}
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
              p: "4px 8px",
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
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1.5 }}>
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
          <Tooltip title="Sync">
            <IconButton
              onClick={handleRefresh}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "16px",
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
                "&:hover": {
                  bgcolor:
                    filter === subj
                      ? "text.primary"
                      : alpha(theme.palette.divider, 0.1),
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Notes Container */}
      <Stack spacing={2.0} sx={{ mt: 3 }}>
        {filteredNotes.map((note) => {
          const style = getSubjectStyle(theme, note.subject);
          return (
            <Fade in key={note.id}>
              <Paper
                elevation={0}
                onClick={() => !note.isSyncing && handleOpenNote(note)}
                sx={{
                  p: 2.5,
                  borderRadius: "24px",
                  bgcolor: isDark ? "#1E1F20" : "#fff",
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  cursor: note.isSyncing ? "default" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    borderColor: style.color,
                    boxShadow: `0 8px 24px ${alpha(style.color, isDark ? 0.2 : 0.1)}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: style.bg,
                    color: style.color,
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    mr: 2.5,
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
                      {note.subject || "General"}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} />
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString()
                        : "Recent"}
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {note.isSyncing ? (
                    <CircularProgress size={20} sx={{ color: style.color }} />
                  ) : (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, note)}
                      sx={{ color: "text.secondary" }}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Stack>
              </Paper>
            </Fade>
          );
        })}
      </Stack>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <Box sx={{ textAlign: "center", py: 15 }}>
          <AutoAwesome
            sx={{ fontSize: 60, mb: 2, color: "primary.main", opacity: 0.2 }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            Your library is clear
          </Typography>
          <Typography variant="body2" color="text.disabled">
            No notes match your current filters.
          </Typography>
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minWidth: 180,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setSetupOpen(true);
          }}
        >
          <ListItemIcon>
            <AutoAwesome fontSize="small" sx={{ color: "#6366F1" }} />
          </ListItemIcon>
          <ListItemText
            primary="Generate Quiz"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setDeleteConfirmOpen(true);
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>

      {/* Gemini Style Dialogs */}
      <Dialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{ sx: { borderRadius: "28px", p: 1, maxWidth: 320 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Configure Quiz
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            How many questions should the AI generate for this session?
          </Typography>
          <Stack direction="row" spacing={1}>
            {[5, 10, 15].map((n) => (
              <Button
                key={n}
                fullWidth
                variant={questionCount === n ? "contained" : "outlined"}
                onClick={() => setQuestionCount(n)}
                sx={{ borderRadius: "12px", py: 1.5 }}
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
            onClick={() => handleLaunchQuiz(selectedNote, questionCount)}
            sx={{ borderRadius: "100px" }}
          >
            Start Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LibraryTab;
