import { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, alpha } from "@mui/material";
import { KeyboardDoubleArrowRight, AutoAwesome } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const TypewriterEffect = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  const clearExistingTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsFinished(false);
      return;
    }

    // 1. APPEND LOGIC
    if (text.startsWith(displayedText) && displayedText !== "") {
      setIsFinished(false);
      clearExistingTimer();

      let i = displayedText.length;

      timerRef.current = setInterval(() => {
        if (i < text.length) {
          const increment = text.length - i > 500 ? 3 : 1;
          i += increment;
          setDisplayedText(text.slice(0, i));
        } else {
          setDisplayedText(text);
          clearExistingTimer();
          setIsFinished(true);
        }
      }, speed);
    }
    // 2. FRESH START LOGIC
    else {
      setDisplayedText("");
      setIsFinished(false);
      clearExistingTimer();

      let i = 0;
      timerRef.current = setInterval(() => {
        if (i < text.length) {
          const increment = text.length > 500 ? 3 : 1;
          i += increment;
          setDisplayedText(text.slice(0, i));
        } else {
          setDisplayedText(text);
          clearExistingTimer();
          setIsFinished(true);
        }
      }, speed);
    }

    return () => clearExistingTimer();
  }, [text, speed]); // FIX 1: Added 'speed' to dependency array

  const handleSkip = () => {
    clearExistingTimer();
    setDisplayedText(text);
    setIsFinished(true);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100px" }}>
      {!isFinished && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: "primary.main",
            animation: "pulse 2s infinite",
          }}
        >
          <AutoAwesome sx={{ fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, letterSpacing: 1 }}
          >
            FORMATTING...
          </Typography>
        </Box>
      )}

      {!isFinished && displayedText.length > 20 && (
        <Button
          size="small"
          onClick={handleSkip}
          endIcon={<KeyboardDoubleArrowRight />}
          sx={{
            position: "absolute",
            right: 0,
            top: -45,
            zIndex: 10,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            bgcolor: alpha("#6366F1", 0.05),
            color: "#6366F1",
            "&:hover": { bgcolor: alpha("#6366F1", 0.1) },
          }}
        >
          Skip
        </Button>
      )}

      <Box
        sx={{
          lineHeight: 1.7,
          fontSize: "1.0rem",
          display: "flex",
          flexDirection: "column",

          /* --- 1. USER QUESTION BUBBLE (BLOCKQUOTE) --- */
          "& blockquote": {
            bgcolor: "#E9EEF6",
            px: 2.5,
            py: 1.5,
            mx: 0,
            my: 2,
            borderRadius: "24px 24px 4px 24px",
            border: "none",
            alignSelf: "flex-end",
            maxWidth: "85%",
            display: "inline-block",
            "& p": { m: 0, fontWeight: 500, lineHeight: 1.5 },
          },

          /* --- 2. LISTS (THE CLEAN FIX) --- */
          "& ul, & ol": {
            paddingLeft: "1.5rem",
            margin: "0.5rem 0 1.5rem 0",
          },
          // FIX 2a: Only target unordered list items for custom bullets
          "& ul > li": {
            mb: 1.5,
            display: "list-item",
            listStyleType: "none",
            position: "relative",
            pl: 0.5,
            "&::before": {
              content: '"•"',
              color: "#070707",
              fontWeight: "bold",
              fontSize: "1.0rem",
              position: "absolute",
              left: "-1.2rem",
              top: "-0.1rem",
            },
            "& p": { display: "inline", m: 0, fontSize: "1.0rem" },
          },
          // FIX 2b: Target ordered list items separately to preserve numbers
          "& ol > li": {
            mb: 1.5,
            display: "list-item",
            pl: 0.5,
            "& p": { display: "inline", m: 0, fontSize: "1.0rem" },
          },

          /* --- 3. HEADERS & DIVIDERS --- */
          "& h2": {
            color: "#1f1f1f",
            mt: 3,
            mb: 1.5,
            fontWeight: 700,
            fontSize: "1.0rem",
          },
          "& h3": {
            color: "#0d0e10",
            mt: 2,
            mb: 1,
            fontSize: "1.0rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05rem",
          },
          "& h1": {
            mt: 2,
            mb: 1,
            fontSize: "1.0rem",
            fontWeight: 900,
            textTransform: "uppercase",
          },
          "& hr": { border: "none", borderTop: "1px solid #e2e8f0", my: 3 },

          /* --- 4. EXAM ALERTS & STRONG TEXT --- */
          "& strong": { fontWeight: 700, color: "#000000" },

          /* --- 5. LATEX SPACING --- */
          "& .katex-display": { my: 2, overflowX: "auto", overflowY: "hidden" },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {displayedText}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default TypewriterEffect;
