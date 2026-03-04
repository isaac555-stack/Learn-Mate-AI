import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const PagesPreview = ({ pages, setPages, onSelect }) => {
  if (!pages || pages.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        py: 1,
        px: 2,
        gap: 1,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {pages.map((page, idx) => (
        <Box key={idx} sx={{ position: "relative", flex: "0 0 auto" }}>
          <Box
            component="img"
            src={`data:image/jpeg;base64,${page}`}
            onClick={() => onSelect(idx)}
            sx={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: "12px",
              cursor: "pointer",
              border: "2px solid #e2e8f0",
              transition: "0.2s",
              "&:hover": { transform: "scale(1.05)", borderColor: "#6366F1" },
            }}
          />
          <IconButton
            size="small"
            onClick={() => setPages((prev) => prev.filter((_, i) => i !== idx))}
            sx={{
              position: "absolute",
              top: -6,
              right: -6,
              bgcolor: "rgb(241, 241, 241)",
              "&:hover": { bgcolor: "#f87171", color: "white" },
              color: "#ef4444",
              p: 0.5,
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};
export default PagesPreview;
