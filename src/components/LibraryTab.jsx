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
    DigitalTech: { color: "" },
  };
  return map[subject] || { color: "#64748b", icon: <History /> };
};

const LibraryTab = ({
  savedNotes,
  setSummary,
  setTab,
  deleteNote,
  startQuiz,
}) => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Get unique subjects for the filter bar (dynamically generated from saved notes)
  const subjects = ["All", ...new Set(savedNotes.map((n) => n.subject))];

  // 2. Filter logic: Combines Subject Toggle + Search Input
  const filteredNotes = savedNotes.filter((note) => {
    const matchesFilter = filter === "All" || note.subject === filter;
    const matchesSearch =
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topic?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <Box>
      {/* Header & Note Count */}
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
            Your Library
          </Typography>
        </Stack>
        <Chip
          label={`${filteredNotes.length} Notes`}
          size="small"
          sx={{ fontWeight: 800, bgcolor: "#e2e8f0", color: "#475569" }}
        />
      </Stack>

      {/* --- Search & Filter Bar Section --- */}
      {savedNotes.length > 0 && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {/* Search Box */}
          <TextField
            fullWidth
            placeholder="Search titles, topics or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 4, bgcolor: "white" },
            }}
          />

          {/* Subject Filter Bar */}
          <Box sx={{ overflowX: "auto", display: "flex", pb: 1 }}>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, val) => val && setFilter(val)}
              sx={{
                gap: 1,
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: "12px !important",
                  bgcolor: "#f1f5f9",
                  px: 2,
                  whiteSpace: "nowrap",
                },
              }}
            >
              {subjects.map((subj) => (
                <ToggleButton
                  key={subj}
                  value={subj}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  }}
                >
                  {subj}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Stack>
      )}

      {/* --- Results Section --- */}
      {filteredNotes.length > 0 ? (
        <Stack spacing={2.5}>
          {filteredNotes.map((note) => {
            const style = getSubjectStyle(note.subject);
            return (
              <Paper
                key={note.id}
                elevation={0}
                sx={{
                  p: 1,
                  borderRadius: 5,
                  position: "relative",
                  border: "1px solid #f1f5f9",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
                    borderColor: style.color,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Subject Icon */}
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

                  <Box sx={{ flexGrow: 1, pr: 12 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          lineHeight: 1.2,
                        }}
                      >
                        {note.title || "Untitled Note"}
                      </Typography>
                    </Stack>
                    <Chip
                      label={note.subject || "General"}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: `${style.color}15`,
                        color: style.color,
                        border: `1px solid ${style.color}30`,
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{ color: "#94a3b8", display: "block", mb: 1 }}
                    >
                      {note.date} • {note.topic || "General Revision"}
                    </Typography>
                  </Box>
                </Stack>

                {/* Actions (Floating Right) */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Read Note">
                    <IconButton
                      sx={{
                        bgcolor: "#f8fafc",
                        color: "primary.main",
                        "&:hover": { bgcolor: "primary.main", color: "white" },
                      }}
                      onClick={() => {
                        setSummary(note.content);
                        setTab(0);
                      }}
                    >
                      <History fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Take Quiz">
                    <IconButton
                      sx={{
                        bgcolor: "#f0fdf4",
                        color: "#16a34a",
                        "&:hover": { bgcolor: "#16a34a", color: "white" },
                      }}
                      onClick={() => startQuiz(note)}
                    >
                      <Psychology fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      sx={{
                        color: "#94a3b8",
                        "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
                      }}
                      onClick={() => deleteNote(note.id)}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        /* Empty State */
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            bgcolor: "#f8fafc",
            borderRadius: 8,
            border: "2px dashed #e2e8f0",
          }}
        >
          {savedNotes.length === 0 ? (
            <>
              <MenuBook sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
              <Typography sx={{ fontWeight: 700, color: "#64748b" }}>
                Your shelf is empty
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Snap your first note to see it here!
              </Typography>
            </>
          ) : (
            <>
              <Search sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
              <Typography sx={{ fontWeight: 700, color: "#64748b" }}>
                No matches found
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Try a different keyword or subject filter.
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LibraryTab;
