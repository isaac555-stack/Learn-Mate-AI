import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
  alpha,
  keyframes,
} from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import image from "../assets/Picsart logo transpa.webp";

// Subtle floating for the rocket
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const LoadingScreen = ({ message = "Preparing to get you prepped..." }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 3,
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        {/* The Progress Spinner */}
        <CircularProgress
          size={80}
          thickness={2}
          sx={{
            color: "primary.main",
            filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))",
          }}
        />

        {/* The Rocket Icon Centered */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            src={image}
            fetchPriority="high"
            sx={{
              width: 60,
              height: 60,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.15rem",
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            opacity: 0.7,
          }}
        >
          Please wait a moment
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
