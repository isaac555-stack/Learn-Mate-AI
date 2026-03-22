import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  CircularProgress,
  Zoom,
  Fade,
  alpha,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";

import {
  Email,
  VpnKey,
  CheckCircle,
  ExpandMore,
  AutoAwesome,
  MobileFriendly,
  Security,
  Psychology,
  MenuBook,
  RocketLaunch,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import LandingIcon from "../assets/image.png"; // Your generated image
import { supabase } from "../services/questionsEngine";
import Footer from "../components/Footer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("email");
  const [resendTimer, setResendTimer] = useState(0);
  const INDIGO = "#090b29";
  const ACCENT = "#6366F1";

  const TESTIMONIALS = [
    {
      name: "Amaka Opara",
      text: "I stopped failing Chemistry after I started using PrepFlow. It caught the tiny details I kept missing in my Biology diagrams.",
      score: "JAMB 2024 • 315 Score",
      initials: "AO",
    },
    {
      name: "Chidi Kalu",
      text: "The WAEC-style questions are so accurate. It felt like I had the marking scheme while I was studying at home.",
      score: "WAEC 2025 • 7 A1s",
      initials: "CK",
    },
    {
      name: "Blessing Ifeanyi",
      text: "I used to hate revising my handwritten notes. Now I just snap a photo and PrepFlow turns it into a game.",
      score: "JAMB Candidate",
      initials: "BI",
    },
  ];

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("success");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Effect to handle the countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = (e) => {
    setResendTimer(60); // Start 60s cooldown
    handleSendOtp(e);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin + "/app",
      },
    });
    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("idle");
      setStep("check-email");
    }
  };

  const FeatureCard = ({ icon, title, desc, tag }) => (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Box
        sx={{
          p: 4,
          height: "100%",
          borderRadius: 5,
          bgcolor: alpha("#FFF", 0.03),
          border: `1px solid ${alpha("#FFF", 0.08)}`,
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            bgcolor: alpha("#FFF", 0.05),
            borderColor: alpha(ACCENT, 0.4),
            boxShadow: `0 20px 40px ${alpha("#000", 0.4)}`,
          },
        }}
      >
        {/* Background Decorative Glow */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${alpha(ACCENT, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha("#FFF", 0.05),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Chip
              label={tag}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 900,
                bgcolor: alpha(ACCENT, 0.1),
                color: ACCENT,
                mb: 1,
                border: `1px solid ${alpha(ACCENT, 0.2)}`,
              }}
            />
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: alpha("#FFF", 0.5), lineHeight: 1.6 }}
            >
              {desc}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ bgcolor: INDIGO, color: "#FFF", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: alpha(INDIGO, 0.8),
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${alpha("#FFF", 0.1)}`, // Subtle border
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{ justifyContent: "space-between", py: { xs: 1, md: 0.5 } }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, color: ACCENT, letterSpacing: -0.5 }}
            >
              PrepFlow
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body1"
                sx={{
                  color: alpha("#FFF", 0.7),
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "default",
                  display: { sm: "block" },
                }}
              >
                BLOG
              </Typography>
              <Chip
                label="Coming Soon"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.5rem",
                  fontWeight: 900,
                  bgcolor: alpha(ACCENT, 0.1),
                  color: ACCENT,
                  border: `1px solid ${alpha(ACCENT, 0.2)}`,
                  textTransform: "uppercase",
                }}
              />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO SECTION */}
      <Container maxWidth="lg" sx={{ pt: { xs: 16, md: 8 }, pb: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "3rem", md: "4rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Turn Notes into <br />
                <Box component="span" sx={{ color: ACCENT }}>
                  Perfect Practice.
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: alpha("#FFF", 0.7), mb: 5, fontWeight: 400 }}
              >
                Snap a photo of your handwritten notes and let our AI generate
                WAEC/JAMB style practice questions in seconds.
              </Typography>

              {status === "success" ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Welcome Back!
                  </Typography>
                </Stack>
              ) : step === "email" ? (
                /* --- INPUT STATE --- */
                <Stack
                  component="form"
                  onSubmit={handleSendOtp}
                  spacing={2}
                  sx={{ maxWidth: 450 }}
                >
                  <TextField
                    fullWidth
                    required
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      bgcolor: "#FFF",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={status === "sending"}
                    sx={{
                      bgcolor: ACCENT,
                      height: 56,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      "&:hover": { bgcolor: alpha(ACCENT, 0.9) },
                    }}
                  >
                    {status === "sending" ? (
                      <CircularProgress size={24} sx={{ color: "#FFF" }} />
                    ) : (
                      "Get Started for Free"
                    )}
                  </Button>
                </Stack>
              ) : (
                /* --- MAGIC LINK SENT STATE --- */
                <Fade in>
                  <Box sx={{ maxWidth: 450 }}>
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: alpha(ACCENT, 0.1),
                        borderRadius: 3,
                        border: `1px solid ${alpha(ACCENT, 0.3)}`,
                        mb: 2,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <AutoAwesome sx={{ color: ACCENT, mt: 0.5 }} />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            gutterBottom
                          >
                            Check your inbox!
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: alpha("#FFF", 0.7) }}
                          >
                            We sent a magic link to <b>{email}</b>. Click it to
                            sign in instantly.
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ ml: 1 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleResend}
                        disabled={resendTimer > 0 || status === "sending"}
                        sx={{
                          color: ACCENT,
                          fontWeight: 700,
                          textTransform: "none",
                          minWidth: 120,
                        }}
                      >
                        {resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : "Resend Link"}
                      </Button>

                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setStep("email");
                          setStatus("idle");
                        }}
                        sx={{
                          color: alpha("#FFF", 0.5),
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { color: "#FFF" },
                        }}
                      >
                        Wrong email?
                      </Button>
                    </Stack>
                  </Box>
                </Fade>
              )}
            </motion.div>
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: { xs: "block", md: "block" } }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Box
                component="img"
                src={LandingIcon}
                sx={{
                  width: "100%",
                  filter: `drop-shadow(0 0 50px ${alpha(ACCENT, 0.3)})`,
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES SECTION */}
      <Box sx={{ py: 10, bgcolor: alpha("#00000000", 0.1) }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight={800} mb={8}>
            Why Students Love PrepFlow
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeatureCard
                icon={<AutoAwesome sx={{ color: "#FFF" }} />}
                title="WAEC/JAMB Logic"
                desc="Questions aren't just random. Our AI formats them to match actual past paper standards (Objectives & Theory)."
                tag="Exam Ready"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeatureCard
                icon={<Psychology sx={{ color: ACCENT }} />}
                title="Beat Forgetfulness"
                desc="Use Active Recall to lock in hard topics like Organic Chemistry or Physics formulas before exam day."
                tag="3x Retention"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeatureCard
                icon={<MenuBook sx={{ color: "#4ADE80" }} />}
                title="Messy Ink Scanner"
                desc="Snap your school notebook. Even if your handwriting is 'doctor-style', our neural engine reads it perfectly."
                tag="Smart Scan"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FeatureCard
                icon={<RocketLaunch sx={{ color: "#FB923C" }} />}
                title="Study on the Go"
                desc="Review your Physics Formulas on the bus or in the class. Your entire locker is now in your pocket."
                tag="Always Syncing"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box
        sx={{
          py: 15,
          bgcolor: alpha(ACCENT, 0.02),
          borderY: `1px solid ${alpha("#FFF", 0.05)}`,
          // Styles for the Swiper dots to match your theme
          "& .swiper-pagination-bullet": { bgcolor: alpha("#FFF", 0.3) },
          "& .swiper-pagination-bullet-active": { bgcolor: ACCENT },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="overline"
                sx={{ color: ACCENT, fontWeight: 900, letterSpacing: 2 }}
              >
                Success Stories
              </Typography>
              <Typography
                variant="h4"
                fontWeight={900}
                sx={{ mt: 2, mb: 4, lineHeight: 1.2 }}
              >
                From "I can't" <br /> to "I just did."
              </Typography>
              <Typography sx={{ color: alpha("#FFF", 0.6), mb: 4 }}>
                Join thousands of Nigerian students who are turning their messy
                notebooks into high-score reality.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                style={{ paddingBottom: "50px" }} // Space for dots
              >
                {TESTIMONIALS.map((t, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 8,
                        bgcolor: alpha("#FFF", 0.03),
                        border: `1px solid ${alpha(ACCENT, 0.2)}`,
                        position: "relative",
                        boxShadow: `0 5px 10px ${alpha("#000", 0.5)}`,
                        minHeight: { md: 350 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          fontStyle: "italic",
                          mb: 4,
                          lineHeight: 1.4,
                          fontSize: { xs: "1.5rem", md: "2.1rem" },
                        }}
                      >
                        "{t.text}"
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: ACCENT,
                            width: 56,
                            height: 56,
                            fontWeight: 800,
                          }}
                        >
                          {t.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>
                            {t.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: ACCENT, fontWeight: 700 }}
                          >
                            {t.score}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Decorative Quote Icon */}
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 50,
                          right: 40,
                          fontSize: "8rem",
                          color: alpha(ACCENT, 0.1),
                          fontFamily: "serif",
                          lineHeight: 0,
                          userSelect: "none",
                        }}
                      >
                        ”
                      </Typography>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ SECTION */}
      <Container id="faq" maxWidth="md" sx={{ py: 15 }}>
        <Stack alignItems="center" spacing={2} sx={{ mb: 8 }}>
          <Chip
            label="FAQ"
            sx={{ bgcolor: alpha(ACCENT, 0.1), color: ACCENT, fontWeight: 900 }}
          />
          <Typography variant="h4" textAlign="center" fontWeight={900}>
            Got Questions?
          </Typography>
        </Stack>

        <Box sx={{ borderTop: `1px solid ${alpha("#FFF", 0.1)}` }}>
          {[
            {
              q: "How accurate is the handwriting recognition?",
              a: "Very accurate. Our AI is trained to handle different handwriting styles, including typical student notes, and continuously improves as more data is processed.",
            },
            {
              q: "Is it really free for WAEC/JAMB candidates?",
              a: "Yes, it's completely free to use. Our goal is to make exam preparation accessible to every student without barriers.",
            },
            {
              q: "Does it cover all subjects?",
              a: "Yes. PrepFlow supports all major subjects, from sciences to arts, and adapts to the content in your notes automatically.",
            },
            {
              q: "Can I use it without data?",
              a: "You only need an internet connection to upload your notes and generate content. After that, you can study your generated materials anytime.",
            },
          ].map((item, i) => (
            <Accordion
              key={i}
              elevation={0}
              sx={{
                bgcolor: "transparent",
                color: "#FFF",
                borderBottom: `1px solid ${alpha("#FFF", 0.1)}`,
                borderRadius: "0 !important",
                "&:before": { display: "none" }, // Removes default MUI line
                py: 1,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: ACCENT, fontSize: 30 }} />}
                sx={{ px: 0 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontSize: "1.1rem" }}
                >
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 3 }}>
                <Typography
                  sx={{
                    color: alpha("#FFF", 0.6),
                    lineHeight: 1.8,
                    maxWidth: "90%",
                  }}
                >
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
