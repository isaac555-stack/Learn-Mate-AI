import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
  MenuItem,
  Stack,
  Fade,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  School,
  Brightness4,
  Brightness7,
  Logout,
  ArrowBackIosNew,
  CheckCircle,
} from "@mui/icons-material";
import { useUser } from "../context/UserContext";
import { supabase } from "../services/questionsEngine";
import { ColorModeContext } from "../context/ColorMode";

// 🔹 Constants: These must match your DB constraints exactly.
const STREAMS = ["Science", "Art", "Commerce"];
const GOALS = [
  { id: "exam", label: "Ace an exam (JAMB/WAEC)" },
  { id: "mastery", label: "Deep Mastery" },
  { id: "quick", label: "Quick Homework Help" },
];

const StudentProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const { profile, refreshProfile, loading } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    stream: "",
    goal: "",
  });

  useEffect(() => {
    if (profile) {
      /**
       * 💡 NORMALIZATION LAYER
       * Fixes "out-of-range" errors by mapping old DB labels to current IDs
       */
      const normalizeGoal = (val) => {
        if (!val) return "";
        if (val === "Ace Jamb/Waec" || val.includes("Ace an exam"))
          return "exam";
        if (val === "Deep Mastery") return "mastery";
        if (val === "Quick Homework Help") return "quick";
        return val; // Returns the ID if it's already correct
      };

      setFormData({
        name: profile.name || "",
        age: profile.age || "",
        stream: profile.stream,
        goal: normalizeGoal(profile.goal),
      });
    }
  }, [profile]);

  const displayGoalLabel = useMemo(
    () => GOALS.find((g) => g.id === formData.goal)?.label || "Not specified",
    [formData.goal],
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (success) setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(formData)
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile(profile.id);
      setSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Update failed:", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress thickness={5} size={50} />
      </Box>
    );

  // Modular Info Row for cleaner JSX
  const InfoRow = ({ label, value, editingComponent }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="caption"
        sx={{
          color: "primary.main",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        {isEditing ? (
          editingComponent
        ) : (
          <Typography variant="body1" fontWeight={600} color="text.primary">
            {value || "—"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", mt: { xs: 2, md: 4 }, p: 2, pb: 8 }}>
      {/* --- HEADER NAV --- */}
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }}
        >
          <ArrowBackIosNew fontSize="small" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Settings
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* --- THEME TOGGLE --- */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700 }}
            >
              Appearance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toggle dark/light mode
            </Typography>
          </Box>
          <IconButton
            onClick={colorMode.toggleColorMode}
            sx={{ border: "1px solid", borderColor: "divider" }}
            color="primary"
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* --- PROFILE SUMMARY --- */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 56,
                height: 56,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {formData.name?.charAt(0) || <School />}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {isEditing ? "Editing Profile" : formData.name || "Student"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.email}
              </Typography>
            </Box>
          </Stack>
          <Button
            startIcon={isEditing ? <Cancel /> : <Edit />}
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "text" : "outlined"}
            color={isEditing ? "error" : "primary"}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </Stack>

        {/* --- FIELDS --- */}
        <Box>
          <InfoRow
            label="Full Name"
            value={formData.name}
            editingComponent={
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="small"
              />
            }
          />

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <InfoRow
                label="Age"
                value={formData.age ? `${formData.age} years old` : "—"}
                editingComponent={
                  <TextField
                    fullWidth
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    size="small"
                  />
                }
              />
            </Box>
            <Box sx={{ flex: 2 }}>
              <InfoRow
                label="Academic Stream"
                value={formData.stream}
                editingComponent={
                  <TextField
                    select
                    fullWidth
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    size="small"
                  >
                    {STREAMS.map((s) => (
                      <MenuItem
                        key={s}
                        value={s}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                }
              />
            </Box>
          </Stack>

          <InfoRow
            label="Learning Goal"
            value={displayGoalLabel}
            editingComponent={
              <TextField
                select
                fullWidth
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                size="small"
              >
                {GOALS.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.label}
                  </MenuItem>
                ))}
              </TextField>
            }
          />

          {isEditing && (
            <Fade in>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || success}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  color: "#f0f0f0",
                  fontWeight: 800,
                  borderRadius: 2,
                }}
                startIcon={
                  saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : success ? (
                    <CheckCircle />
                  ) : (
                    <Save />
                  )
                }
              >
                {success ? "Success!" : "Save Profile"}
              </Button>
            </Fade>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* --- DANGER ZONE --- */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.error.main, 0.05),
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            Sign Out
          </Typography>
          <Button
            color="error"
            startIcon={<Logout />}
            onClick={() => supabase.auth.signOut()}
            sx={{ fontWeight: 700 }}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default StudentProfile;
