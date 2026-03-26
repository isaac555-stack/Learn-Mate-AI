import {
  Box,
  Avatar,
  Typography,
  Button,
  Fade,
  alpha,
  useTheme,
} from "@mui/material";
import { PhotoCamera, AddAPhoto } from "@mui/icons-material";
import { keyframes } from "@emotion/react";

import image from "../assets/Picsart logo transpa.webp";

// Subtle floating animation for the icon
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const EmptyState = ({ onStartScan, pages = [] }) => {
  const theme = useTheme();
  const isFirstPage = pages.length === 0;

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "65vh",
          textAlign: "center",
          px: 3,
          position: "relative",
        }}
      >
        <Avatar
          src={image}
          fetchPriority="high"
          sx={{
            width: 120,
            height: 120,
            bgcolor: "transparent",
            mb: 4,

            filter: "drop-shadow(0px 10px 20px rgba(99, 102, 241, 0.2))",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,

            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {isFirstPage ? "Ready to Dive?" : "Keep it Rolling!"}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#778aa5",
            maxWidth: 420,
            mb: 5,
            lineHeight: 1.6,
            fontSize: "1.1rem",
          }}
        >
          {isFirstPage
            ? "Scan your handwritten notes, diagrams, or textbooks to generate instant summaries and quizzes."
            : `You've captured ${pages.length} ${pages.length === 1 ? "page" : "pages"} so far. Add more to build a deeper study guide.`}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onStartScan}
          startIcon={isFirstPage ? <PhotoCamera /> : <AddAPhoto />}
          sx={{
            borderRadius: "50px",
            px: 6,
            py: 2,
            textTransform: "none",
            fontSize: "1.1rem",
            color: "#fff",
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px) scale(1.02)",
              boxShadow: "0 15px 30px -5px rgba(99, 102, 241, 0.5)",
              background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          {isFirstPage ? "Start Scanning" : `Snap Page ${pages.length + 1}`}
        </Button>
      </Box>
    </Fade>
  );
};

export default EmptyState;
