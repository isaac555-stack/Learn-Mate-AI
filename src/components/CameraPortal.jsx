import Webcam from "react-webcam";
import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { scanMove } from "../services/animation";

const CameraPortal = ({ onClose, onCapture, webcamRef }) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      bgcolor: "#000",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: "10% 5%",
        border: "2px solid rgba(255,255,255,0.2)",
        borderRadius: "24px",
        zIndex: 1,
        pointerEvents: "none",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #6366F1, transparent)",
          boxShadow: "0 0 15px #6366F1",
          animation: `${scanMove} 3s infinite ease-in-out`,
        },
      }}
    />
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: "environment" }}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
      <IconButton
        onClick={onClose}
        sx={{
          bgcolor: "rgba(0,0,0,0.5)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        }}
      >
        <Close />
      </IconButton>
    </Box>
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "150px",
        background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pb: 4,
        zIndex: 2,
      }}
    >
      <Box
        onClick={onCapture}
        sx={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          border: "4px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.2s",
          "&:active": { transform: "scale(0.9)" },
          "&::after": {
            content: '""',
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "#fff",
          },
        }}
      />
    </Box>
  </Box>
);

export default CameraPortal;
