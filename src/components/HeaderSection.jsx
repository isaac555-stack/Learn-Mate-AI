import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Avatar,
  Stack,
  alpha,
  useTheme,
  IconButton,
} from "@mui/material";
import { AutoAwesome, LibraryBooks, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HeaderSection = ({ tab, setTab }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 12, md: 24 },
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "94%", md: "auto" },
        minWidth: { md: "720px" },
        zIndex: 1200,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: "40px",
          // Dynamic glass effect
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(20px) saturate(180%)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: isDarkMode
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1, sm: 4 }}
          sx={{ px: 1 }}
        >
          {/* LOGO & PROFILE GROUP */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              <Avatar
                src="https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&flip=true"
                sx={{
                  width: 40,
                  height: 40,

                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "#10B981",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.03em",
                display: { xs: "none", sm: "block" },
                background: "linear-gradient(135deg, #6366F1 0%, #9B51E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PrepFlow
            </Typography>
          </Stack>

          {/* NAVIGATION TABS - The "Segmented Control" Look */}
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.05),
              borderRadius: "30px",
              p: 0.5,
              minHeight: "44px",
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: "25px",
                bgcolor: theme.palette.background.paper,
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              },
              "& .MuiTab-root": {
                minHeight: "40px",
                minWidth: { xs: 80, sm: 110 },
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: theme.palette.text.secondary,
                zIndex: 1,
                transition: "0.2s",
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab
              icon={<AutoAwesome sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Scanner"
            />
            <Tab
              icon={<LibraryBooks sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Library"
            />
          </Tabs>

          {/* SETTINGS ICON (Quick Access) */}
          <IconButton
            onClick={() => navigate("/profile")}
            sx={{
              color: theme.palette.text.secondary,
              display: { xs: "flex", md: "flex" },
            }}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HeaderSection;
