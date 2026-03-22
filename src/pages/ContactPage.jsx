import { ArrowBack, Send } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  Typography,
  alpha,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ContactSection = () => {
  const navigate = useNavigate();
  const ACCENT = "#6366F1";
  const INDIGO = "#090b29";

  return (
    <Box sx={{ py: 8, bgcolor: INDIGO, color: "white" }}>
      <Container maxWidth="lg">
        <Container maxWidth="lg" sx={{ mb: 4, p: 0 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              color: alpha("#FFF", 0.6),
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back to Home
          </Button>
        </Container>
        <Grid container spacing={8}>
          {/* --- LEFT SIDE: INFO --- */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: ACCENT, fontWeight: 900, letterSpacing: 2 }}
            >
              Get in Touch
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ mt: 2, mb: 3 }}>
              We're here to help <br /> you smash your goals.
            </Typography>
            <Typography
              sx={{ color: alpha("#FFF", 0.6), mb: 6, fontSize: "1.1rem" }}
            >
              Have questions about technical issues, or just want to say hi? Our
              team is a message away.
            </Typography>
          </Grid>

          {/* --- RIGHT SIDE: FORM --- */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              sx={{
                p: { xs: 2, md: 6 },
                bgcolor: alpha("#FFF", 0.02),

                borderRadius: 6,
                border: `1px solid ${alpha("#FFF", 0.08)}`,
                backdropFilter: "blur(10px)",
              }}
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="filled"
                    placeholder="e.g. Tunde Azikiwe"
                    sx={{
                      bgcolor: alpha("#FFF", 0.05),
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 500,
                      },
                      borderRadius: 2,
                      input: { color: "#FFF" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="filled"
                    placeholder="tunde@email.com"
                    sx={{
                      bgcolor: alpha("#FFF", 0.05),
                      borderRadius: 2,
                      input: { color: "#FFF" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="filled"
                    placeholder="How can we help?"
                    sx={{
                      bgcolor: alpha("#FFF", 0.05),
                      borderRadius: 2,
                      input: { color: "#FFF" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Message"
                    variant="filled"
                    placeholder="Tell us more..."
                    sx={{
                      bgcolor: alpha("#FFF", 0.05),
                      borderRadius: 2,
                      textarea: { color: "#FFF" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<Send />}
                    sx={{
                      bgcolor: ACCENT,
                      py: 2,
                      fontWeight: 800,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      "&:hover": { bgcolor: alpha(ACCENT, 0.8) },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
