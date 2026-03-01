import { useState } from "react";
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import { AutoAwesome, LibraryBooks, School } from "@mui/icons-material";

const HeaderSection = ({ tab, setTab }) => (
  <Box
    sx={{
      position: "fixed",
      top: { xs: 12, md: 24 },
      left: "50%",
      transform: "translateX(-50%)",
      width: { xs: "94%", md: "auto" }, // Auto width for desktop creates a sleeker "Pill"
      minWidth: { md: "720px" },
      zIndex: 1200,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: "32px", // Matches our app-wide pill theme
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px) saturate(180%)", // More "Glassy" feel
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 1, sm: 4 }}
        sx={{ px: 1 }}
      >
        {/* LOGO GROUP */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              // Using a cleaner profile look or your actual logo
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=Sara&backgroundColor=b6e3f4&flip=true"
              sx={{
                width: 42,
                height: 42,
                border: "2px solid #fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            {/* Online Sparkle Badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#10B981",
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              display: { xs: "none", sm: "block" },
              // Using your specific Brand Gradient
              background: "linear-gradient(135deg, #6366F1 0%, #9B51E0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PrepFlow AI
          </Typography>
        </Stack>

        {/* NAVIGATION TABS */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            bgcolor: "#F1F5F9",
            borderRadius: "24px",
            p: 0.5,
            minHeight: "48px",
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: "20px",
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            },
            "& .MuiTab-root": {
              minHeight: "44px",
              minWidth: { xs: 80, sm: 120 },
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#64748B",
              transition: "0.2s",
              zIndex: 1,
              gap: 1,
              "&.Mui-selected": {
                color: "#6366F1",
              },
              "&:hover": {
                color: "#475569",
              },
            },
          }}
        >
          <Tab
            icon={<AutoAwesome sx={{ fontSize: 20 }} />} // "Sparkle" icon for AI Scanner
            iconPosition="start"
            label="Scanner"
          />
          <Tab
            icon={<LibraryBooks sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Library"
          />
        </Tabs>

        {/* QUICK ACTION / STATUS (Desktop Only) */}
        <Box sx={{ display: { xs: "none", md: "block" }, pr: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                bgcolor: alpha("#6366F1", 0.1),
                color: "#6366F1",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              PRO
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  </Box>
);

export default HeaderSection;
