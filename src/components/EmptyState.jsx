import { Box, Avatar, Typography, Button, Fade } from "@mui/material";
import {
  Description,
  PhotoCamera,
  Book,
  DescriptionSharp,
} from "@mui/icons-material";

import image from "../assets/PrepFlowIconCool.png";

const EmptyState = ({ onStartScan, pages }) => (
  <Fade in>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "65vh",
        textAlign: "center",
        px: 3,
      }}
    >
      <Avatar
        src={image}
        sx={{
          width: 100,
          height: 100,
          bgcolor: "#ffffff00",
          p: 0,
          mb: 4,
        }}
      ></Avatar>
      <Typography
        variant="h5"
        sx={{ fontWeight: 900, color: "#1E293B", mb: 1 }}
      >
        Ready to Dive?
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#64748b", maxWidth: 400, mb: 4 }}
      >
        Scan your handwritten notes or textbooks.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onStartScan}
        startIcon={<PhotoCamera />}
        sx={{
          borderRadius: "30px",
          px: 6,
          py: 1.5,
          textTransform: "none",
          fontSize: "1.1rem",
          fontWeight: 700,
          bgcolor: "#6366F1",
          "&:hover": { bgcolor: "#4f46e5", transform: "scale(1.02)" },
        }}
      >
        {pages.length < 1 ? "Start Scanning" : `Snap Page ${pages.length + 1}`}
      </Button>
    </Box>
  </Fade>
);

export default EmptyState;
