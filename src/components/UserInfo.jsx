import React, { useState } from "react";
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
  CheckCircle,
  School,
  Brush,
  MenuBook,
  Psychology,
  Bolt,
  ArrowBackIosNew,
  RocketLaunch,
} from "@mui/icons-material";

// 🔹 Constants matching Landing Page
const INDIGO = "#090b29";
const ACCENT = "#6366F1";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: alpha("#FFF", 0.05),
    color: "#FFF",
    transition: "0.3s",
    "& fieldset": { borderColor: alpha("#FFF", 0.1) },
    "&:hover fieldset": { borderColor: alpha(ACCENT, 0.5) },
    "&.Mui-focused fieldset": { borderColor: ACCENT },
  },
  "& .MuiInputBase-input::placeholder": {
    color: alpha("#FFF", 0.4),
    opacity: 1,
  },
};

const selectableCard = (selected) => ({
  p: 2.5,
  borderRadius: "16px",
  border: "1px solid",
  borderColor: selected ? ACCENT : alpha("#FFF", 0.1),
  bgcolor: selected ? alpha(ACCENT, 0.1) : alpha("#FFF", 0.02),
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 2,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: ACCENT,
    bgcolor: alpha(ACCENT, 0.05),
    transform: "translateY(-2px)",
  },
});

// 🔹 Sub-Components
const NameStep = ({ value, onChange }) => (
  <TextField
    fullWidth
    placeholder="What should we call you?"
    value={value}
    onChange={(e) => onChange("name", e.target.value)}
    autoFocus
    sx={inputStyle}
  />
);

const AgeStep = ({ value, onChange }) => (
  <TextField
    fullWidth
    type="number"
    placeholder="Your age"
    value={value}
    onChange={(e) => onChange("age", e.target.value)}
    sx={inputStyle}
  />
);

const StreamStep = ({ value, onChange }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    onChange={(_, val) => val && onChange("stream", val)}
    fullWidth
    sx={{
      gap: 2,
      "& .MuiToggleButtonGroup-grouped": {
        border: "none",
        borderRadius: "16px !important",
      },
    }}
  >
    {[
      { id: "science", label: "Science", icon: <School fontSize="large" /> },
      { id: "art", label: "Arts", icon: <Brush fontSize="large" /> },
    ].map((item) => (
      <ToggleButton
        key={item.id}
        value={item.id}
        sx={{
          py: 4,
          flexDirection: "column",
          textTransform: "none",
          bgcolor: value === item.id ? alpha(ACCENT, 0.2) : alpha("#FFF", 0.03),
          color: value === item.id ? "#FFF" : alpha("#FFF", 0.5),
          border: "1px solid",
          borderColor: value === item.id ? ACCENT : "transparent",
          "&:hover": { bgcolor: alpha(ACCENT, 0.1) },
          "&.Mui-selected": { color: "#FFF", bgcolor: alpha(ACCENT, 0.2) },
          "&.Mui-selected:hover": { bgcolor: alpha(ACCENT, 0.3) },
        }}
      >
        {item.icon}
        <Typography fontWeight={700} sx={{ mt: 1 }}>
          {item.label}
        </Typography>
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

const GoalStep = ({ value, onChange }) => {
  const goals = [
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
  ];

  return (
    <Stack spacing={2}>
      {goals.map((g) => (
        <Box
          key={g.id}
          onClick={() => onChange("goal", g.id)}
          sx={selectableCard(value === g.id)}
        >
          {g.icon}
          <Typography fontWeight={500} color="#FFF">
            {g.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

const LearningStep = ({ value, onChange }) => {
  const styles = ["Summaries", "Deep Dive", "Step-by-Step", "Examples"];
  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5}>
      {styles.map((style) => {
        const id = style.toLowerCase().replace(/ /g, "_");
        const selected = value === id;
        return (
          <Box
            key={id}
            onClick={() => onChange("learning_style", id)}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: selected ? ACCENT : alpha("#FFF", 0.1),
              bgcolor: selected ? ACCENT : alpha("#FFF", 0.05),
              color: "#fff",
              cursor: "pointer",
              transition: "0.2s",
              fontWeight: 600,
              opacity: selected ? 1 : 0.7,
              "&:hover": { borderColor: ACCENT, opacity: 1 },
            }}
          >
            {style}
          </Box>
        );
      })}
    </Stack>
  );
};

// 🔹 Main Component
const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    stream: "science",
    goal: "exam",
    learning_style: "summaries",
  });

  const updateProfile = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const steps = [
    {
      label: "What's your name?",
      sub: "Let's personalize your PrepFlow.",
      component: <NameStep value={profile.name} onChange={updateProfile} />,
    },
    {
      label: "How old are you?",
      sub: "We'll adjust question difficulty.",
      component: <AgeStep value={profile.age} onChange={updateProfile} />,
    },
    {
      label: "Your Focus Area",
      sub: "Science or Arts?",
      component: <StreamStep value={profile.stream} onChange={updateProfile} />,
    },
    {
      label: "What's the goal?",
      sub: "Tailoring your practice logic.",
      component: <GoalStep value={profile.goal} onChange={updateProfile} />,
    },
    {
      label: "Learning Style",
      sub: "How do you prefer to review?",
      component: (
        <LearningStep value={profile.learning_style} onChange={updateProfile} />
      ),
    },
  ];

  const canContinue = () => {
    if (step === 0) return profile.name.length > 1;
    if (step === 1) return profile.age > 5 && profile.age < 100;
    return true;
  };

  const handleNext = () => {
    step === steps.length - 1 ? onComplete(profile) : setStep(step + 1);
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
          borderRadius: 6,
          bgcolor: alpha("#FFF", 0.02),
          border: "1px solid",
          borderColor: alpha("#FFF", 0.08),
          backdropFilter: "blur(10px)",
        }}
      >
        {/* PrepFlow Branding */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, color: ACCENT, letterSpacing: -0.5 }}
          >
            PrepFlow
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: alpha("#FFF", 0.3), fontWeight: 700 }}
          >
            STEP {step + 1} OF {steps.length}
          </Typography>
        </Stack>

        {/* Progress Bar */}
        <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
          {steps.map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: i <= step ? ACCENT : alpha("#FFF", 0.1),
                transition: "0.4s",
              }}
            />
          ))}
        </Box>

        {step > 0 && (
          <IconButton
            onClick={() => setStep(step - 1)}
            size="small"
            sx={{
              mb: 2,
              color: alpha("#FFF", 0.5),
              border: "1px solid",
              borderColor: alpha("#FFF", 0.1),
            }}
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        )}

        <Fade in key={step} timeout={400}>
          <Box
            onKeyDown={(e) =>
              e.key === "Enter" && canContinue() && handleNext()
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

            <Box sx={{ minHeight: 220 }}>{steps[step].component}</Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!canContinue()}
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
                  color: alpha("#FFF", 0.3),
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
