import React from "react";
import { Container, Typography, Box, Divider, Link } from "@mui/material";

const Legal = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* --- PRIVACY POLICY SECTION --- */}
      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Last Updated: March 12, 2026
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          1. Data Collection
        </Typography>
        <Typography variant="body1" paragraph>
          PrepFlow AI processes images and text uploaded by users to generate AI
          study aids. We do not store your original images longer than necessary
          to process the request.
        </Typography>

        <Typography variant="h6">2. Google AdSense & Cookies</Typography>
        <Typography variant="body1" paragraph>
          We use Google AdSense to serve advertisements. Google uses cookies to
          serve ads based on your previous visits to our website. You may opt
          out of personalized advertising by visiting{" "}
          <Link href="https://www.google.com/settings/ads" target="_blank">
            Google Ads Settings
          </Link>
          .
        </Typography>

        <Typography variant="h6">3. Third-Party AI Services</Typography>
        <Typography variant="body1" paragraph>
          Content is processed using secure AI models. By using PrepFlow, you
          acknowledge that your study data is processed by these providers to
          generate summaries and questions.
        </Typography>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* --- TERMS OF SERVICE SECTION --- */}
      <Box component="section">
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          Terms of Service
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          1. Educational Disclaimer
        </Typography>
        <Typography variant="body1" paragraph>
          PrepFlow AI is a study assistant. While we strive for 100% accuracy,
          AI-generated content should be cross-referenced with official
          JAMB/WAEC syllabuses.
        </Typography>

        <Typography variant="h6">2. User Conduct</Typography>
        <Typography variant="body1" paragraph>
          Users are responsible for the content they upload. You must ensure you
          have the rights to any textbooks or notes you scan using our service.
        </Typography>

        <Typography variant="h6">3. Limitation of Liability</Typography>
        <Typography variant="body1" paragraph>
          PrepFlow AI is not liable for any academic outcomes or exam results.
          We provide tools to assist your study process, not a guarantee of
          success.
        </Typography>
      </Box>
    </Container>
  );
};

export default Legal;
