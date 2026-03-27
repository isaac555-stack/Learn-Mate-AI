import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Paper,
  alpha,
  IconButton,
} from "@mui/material";
import {
  ArrowForward,
  School,
  MenuBook,
  Psychology,
  Bolt,
  ArrowBackIosNew,
  RocketLaunch,
  BusinessCenter,
  ColorLens,
} from "@mui/icons-material";

// 🔹 Constants & Styles
const INDIGO = "#090b29";
const ACCENT = "#6366F1";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: alpha("#FFF", 0.05),
    color: "#FFF",
    "& fieldset": { borderColor: alpha("#FFF", 0.1) },
    "&:hover fieldset": { borderColor: alpha(ACCENT, 0.5) },
    "&.Mui-focused fieldset": { borderColor: ACCENT },
  },
  "& .MuiInputBase-input::placeholder": { color: alpha("#FFF", 0.4) },
};

const toggleGroupStyle = {
  gap: 2,
  "& .MuiToggleButton-root": {
    border: `1px solid ${alpha("#FFF", 0.1)}`,
    borderRadius: "16px !important",
    flexDirection: "column",
    py: 3,
    textTransform: "none",
    color: alpha("#FFF", 0.5),
    "&.Mui-selected": {
      color: "#FFF",
      bgcolor: alpha(ACCENT, 0.2),
      borderColor: ACCENT,
    },
  },
};

// 🔹 Sub-Components
const GoalCard = ({ selected, onClick, icon, label }) => (
  <Box
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: "16px",
      border: "1px solid",
      borderColor: selected ? ACCENT : alpha("#FFF", 0.1),
      bgcolor: selected ? alpha(ACCENT, 0.1) : alpha("#FFF", 0.02),
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 2,
      transition: "0.2s",
      "&:hover": {
        bgcolor: alpha(ACCENT, 0.05),
        transform: "translateY(-2px)",
      },
    }}
  >
    {icon}
    <Typography fontWeight={500} color="#FFF">
      {label}
    </Typography>
  </Box>
);

const ProgressBar = ({ current, total }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
    {[...Array(total)].map((_, i) => (
      <Box
        key={i}
        sx={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: i <= current ? ACCENT : alpha("#FFF", 0.1),
          transition: "0.4s",
        }}
      />
    ))}
  </Box>
);

// 🔹 Main Component
const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    stream: "",
    goal: "exam",
    learning_style: "summaries",
  });

  const updateProfile = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const steps = useMemo(
    () => [
      {
        id: "name",
        label: "What's your name?",
        sub: "Let's personalize your PrepFlow.",
        isValid: profile.name.trim().length > 1,
        component: (
          <TextField
            fullWidth
            placeholder="Enter your name"
            value={profile.name}
            onChange={(e) => updateProfile("name", e.target.value)}
            autoFocus
            sx={inputStyle}
          />
        ),
      },
      {
        id: "age",
        label: "How old are you?",
        sub: "Difficulty will be adjusted to your level.",
        isValid: profile.age > 5 && profile.age < 100,
        component: (
          <TextField
            fullWidth
            type="number"
            placeholder="e.g. 17"
            value={profile.age}
            onChange={(e) => updateProfile("age", e.target.value)}
            sx={inputStyle}
          />
        ),
      },
      {
        id: "stream",
        label: "Your Focus Area",
        sub: "Choose your academic department.",
        isValid: !!profile.stream,
        component: (
          <ToggleButtonGroup
            value={profile.stream}
            exclusive
            onChange={(_, val) => val && updateProfile("stream", val)}
            fullWidth
            sx={toggleGroupStyle}
          >
            {[
              { id: "Science", icon: <School />, label: "Science" },
              { id: "Art", icon: <ColorLens />, label: "Arts" },
              { id: "Commerce", icon: <BusinessCenter />, label: "Commerce" },
            ].map((item) => (
              <ToggleButton key={item.id} value={item.id}>
                {item.icon}
                <Typography fontWeight={700} mt={1}>
                  {item.label}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        ),
      },
      {
        id: "goal",
        label: "What's the goal?",
        sub: "Tailoring your practice logic.",
        isValid: true,
        component: (
          <Stack spacing={2}>
            {[
              {
                id: "exam",
                label: "Ace an exam (JAMB/WAEC)",
                icon: <MenuBook sx={{ color: ACCENT }} />,
              },
              {
                id: "mastery",
                label: "Deep Mastery",
                icon: <Psychology sx={{ color: "#4ADE80" }} />,
              },
              {
                id: "quick",
                label: "Quick Homework Help",
                icon: <Bolt sx={{ color: "#FB923C" }} />,
              },
            ].map((g) => (
              <GoalCard
                key={g.id}
                label={g.label}
                icon={g.icon}
                selected={profile.goal === g.id}
                onClick={() => updateProfile("goal", g.id)}
              />
            ))}
          </Stack>
        ),
      },
      {
        id: "style",
        label: "Learning Style",
        sub: "How do you prefer to review content?",
        isValid: true,
        component: (
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {["Summaries", "Deep Dive", "Step-by-Step", "Examples"].map(
              (style) => {
                const id = style.toLowerCase().replace(/ /g, "_");
                const isSelected = profile.learning_style === id;
                return (
                  <Box
                    key={id}
                    onClick={() => updateProfile("learning_style", id)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: isSelected ? ACCENT : alpha("#FFF", 0.1),
                      bgcolor: isSelected ? ACCENT : alpha("#FFF", 0.05),
                      color: "#fff",
                      cursor: "pointer",
                      transition: "0.2s",
                      fontWeight: 600,
                      opacity: isSelected ? 1 : 0.7,
                      "&:hover": { opacity: 1, borderColor: ACCENT },
                    }}
                  >
                    {style}
                  </Box>
                );
              },
            )}
          </Stack>
        ),
      },
    ],
    [profile],
  );

  const handleNext = () => {
    step === steps.length - 1 ? onComplete(profile) : setStep((s) => s + 1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: INDIGO,
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          width: "100%",
          p: 4,
          borderRadius: 3,
          bgcolor: alpha("#FFF", 0.02),
          border: `1px solid ${alpha("#FFF", 0.08)}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, color: ACCENT }}>
            PrepFlow
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: alpha("#FFF", 0.3), fontWeight: 700 }}
          >
            {step + 1} / {steps.length}
          </Typography>
        </Stack>

        <ProgressBar current={step} total={steps.length} />

        {step > 0 && (
          <IconButton
            onClick={() => setStep(step - 1)}
            size="small"
            sx={{
              mb: 2,
              color: alpha("#FFF", 0.5),
              border: `1px solid ${alpha("#FFF", 0.1)}`,
            }}
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        )}

        <Fade in key={step} timeout={400}>
          <Box
            onKeyDown={(e) =>
              e.key === "Enter" && steps[step].isValid && handleNext()
            }
          >
            <Typography variant="h4" fontWeight={900} color="#FFF" gutterBottom>
              {steps[step].label}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: alpha("#FFF", 0.6), mb: 4 }}
            >
              {steps[step].sub}
            </Typography>
            <Box sx={{ minHeight: 240 }}>{steps[step].component}</Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!steps[step].isValid}
              onClick={handleNext}
              sx={{
                mt: 4,
                py: 2,
                borderRadius: "12px",
                bgcolor: ACCENT,
                fontWeight: 800,
                textTransform: "none",
                fontSize: "1.1rem",
                "&:hover": { bgcolor: alpha(ACCENT, 0.8) },
                "&.Mui-disabled": {
                  bgcolor: alpha(ACCENT, 0.2),
                  color: alpha("#FFF", 0.1),
                },
              }}
              endIcon={
                step === steps.length - 1 ? <RocketLaunch /> : <ArrowForward />
              }
            >
              {step === steps.length - 1 ? "Launch My Prep" : "Continue"}
            </Button>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default OnboardingFlow;
