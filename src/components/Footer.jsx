import { Instagram, Twitter, LinkedIn, Facebook } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  alpha,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const ACCENT = "#6366F1";

  return (
    <Box
      component="footer"
      sx={{
        py: 10,
        borderTop: `1px solid ${alpha("#FFF", 0.05)}`,
        bgcolor: "rgb(2, 3, 39)", // Slightly darker than INDIGO for depth
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, color: ACCENT, mb: 2 }}
            >
              PrepFlow
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha("#FFF", 0.5),
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 280,
              }}
            >
              Empowering WAEC and JAMB candidates with AI-driven active recall.
              Turn your notes into top scores.
            </Typography>
            <Stack direction="row" spacing={2}>
              {[<Twitter />, <Instagram />, <LinkedIn />].map((icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: alpha("#FFF", 0.3),
                    "&:hover": { color: ACCENT },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Links Columns */}

          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3 }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              <Link
                href="#"
                color="inherit"
                underline="none"
                sx={{ color: alpha("#FFF", 0.5), "&:hover": { color: "#FFF" } }}
              >
                Study Tips
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="none"
                sx={{ color: alpha("#FFF", 0.5), "&:hover": { color: "#FFF" } }}
              >
                JAMB Guide
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="none"
                sx={{ color: alpha("#FFF", 0.5), "&:hover": { color: "#FFF" } }}
              >
                WAEC Syllabus
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3 }}>
              Legal & Trust
            </Typography>
            <Stack spacing={1}>
              <Link
                onClick={() => navigate("/legal")}
                sx={{
                  cursor: "pointer",
                  color: alpha("#FFF", 0.5),
                  "&:hover": { color: "#FFF" },
                }}
                underline="none"
              >
                Privacy Policy
              </Link>
              <Link
                onClick={() => navigate("/legal")}
                sx={{
                  cursor: "pointer",
                  color: alpha("#FFF", 0.5),
                  "&:hover": { color: "#FFF" },
                }}
                underline="none"
              >
                Terms of Service
              </Link>
              <Link
                onClick={() => navigate("/contact")}
                sx={{
                  cursor: "pointer",
                  color: alpha("#FFF", 0.5),
                  "&:hover": { color: "#FFF" },
                }}
                underline="none"
              >
                Contact Our Team
              </Link>
              <Typography
                variant="caption"
                sx={{ color: alpha("#FFF", 0.3), mt: 2, display: "block" }}
              >
                PrepFlow is an independent study tool and is not affiliated with
                JAMB or WAEC official bodies.
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha("#FFF", 0.05), mb: 4 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ color: alpha("#FFF", 0.5) }}>
            © {new Date().getFullYear()} PrepFlow. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: alpha("#FFF", 0.5) }}>
            Powered by Ziko Technologies⚡
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
