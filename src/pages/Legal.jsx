import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Link,
  Button,
  alpha,
  Stack,
} from "@mui/material";
import { ArrowBack, Security, Gavel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Legal = () => {
  const navigate = useNavigate();
  const ACCENT = "#6366F1";
  const INDIGO = "#050614";

  return (
    <Box sx={{ bgcolor: INDIGO, minHeight: "100vh", color: "#FFF", pb: 10 }}>
      {/* --- TOP NAVIGATION --- */}
      <Container maxWidth="md" sx={{ pt: 4, mb: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{
            color: alpha("#FFF", 0.6),
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Back to PrepFlow
        </Button>
      </Container>

      <Container maxWidth="md">
        {/* --- PRIVACY POLICY SECTION --- */}
        <Box component="section" sx={{ mb: 10 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Security sx={{ color: ACCENT, fontSize: 32 }} />
            <Typography variant="h3" component="h1" fontWeight={900}>
              Privacy Policy
            </Typography>
          </Stack>

          <Typography
            variant="subtitle2"
            sx={{ color: alpha("#FFF", 0.4), mb: 4 }}
          >
            Last Updated: March 12, 2026
          </Typography>

          <Box
            sx={{
              pl: { md: 6 },
              borderLeft: `2px solid ${alpha(ACCENT, 0.2)}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mt: 3, fontWeight: 800, color: ACCENT }}
            >
              1. Data Collection
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              PrepFlow AI processes images and text uploaded by users to
              generate AI study aids. We do not store your original images
              longer than necessary to process the request. Your handwritten
              notes remain your property.
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 4, fontWeight: 800, color: ACCENT }}
            >
              2. Google AdSense & Cookies
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              We use Google AdSense to serve advertisements. Google uses cookies
              to serve ads based on your previous visits to our website. You may
              opt out of personalized advertising by visiting{" "}
              <Link
                href="https://www.google.com/settings/ads"
                target="_blank"
                sx={{ color: ACCENT }}
              >
                Google Ads Settings
              </Link>
              .
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 4, fontWeight: 800, color: ACCENT }}
            >
              3. Third-Party AI Services
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              Content is processed using secure AI models. By using PrepFlow,
              you acknowledge that your study data is processed by these
              providers to generate summaries and questions.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 8, borderColor: alpha("#FFF", 0.1) }} />

        {/* --- TERMS OF SERVICE SECTION --- */}
        <Box component="section">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Gavel sx={{ color: ACCENT, fontSize: 32 }} />
            <Typography variant="h3" component="h2" fontWeight={900}>
              Terms of Service
            </Typography>
          </Stack>

          <Box
            sx={{
              pl: { md: 6 },
              borderLeft: `2px solid ${alpha(ACCENT, 0.2)}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mt: 3, fontWeight: 800, color: ACCENT }}
            >
              1. Educational Disclaimer
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              PrepFlow AI is a study assistant. While we strive for 100%
              accuracy, AI-generated content should be cross-referenced with
              official JAMB/WAEC syllabuses.{" "}
              <b>AI is not a substitute for official textbooks.</b>
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 4, fontWeight: 800, color: ACCENT }}
            >
              2. User Conduct
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              Users are responsible for the content they upload. You must ensure
              you have the rights to any textbooks or notes you scan using our
              service.
            </Typography>

            <Typography
              variant="h6"
              sx={{ mt: 4, fontWeight: 800, color: ACCENT }}
            >
              3. Limitation of Liability
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: alpha("#FFF", 0.7), lineHeight: 1.8 }}
            >
              PrepFlow AI is not liable for any academic outcomes or exam
              results. We provide tools to assist your study process, not a
              guarantee of success. Practice makes perfect!
            </Typography>
          </Box>
        </Box>

        {/* --- FOOTER-ESQUE CTA --- */}
        <Box
          sx={{
            mt: 15,
            textAlign: "center",
            p: 4,
            bgcolor: alpha(ACCENT, 0.05),
            borderRadius: 4,
          }}
        >
          <Typography variant="body2" sx={{ color: alpha("#FFF", 0.5) }}>
            Have questions about your data? Contact our support team.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Legal;
