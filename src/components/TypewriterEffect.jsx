import { useState, useRef, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Ensure LaTeX styles are loaded

const TypewriterEffect = ({ text, speed = 5 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const lastTextRef = useRef("");
  const timerRef = useRef(null);

  const clearExistingTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      lastTextRef.current = "";
      setIsFinished(false);
      return;
    }

    // Smart appending: finds where the new text differs from the old to avoid flickering
    let i =
      text.startsWith(lastTextRef.current) && lastTextRef.current !== ""
        ? lastTextRef.current.length
        : 0;

    if (i === 0) {
      setDisplayedText("");
      setIsFinished(false);
    }

    clearExistingTimer();

    timerRef.current = setInterval(() => {
      if (i < text.length) {
        i++;
        const currentSlice = text.slice(0, i);
        setDisplayedText(currentSlice);
        lastTextRef.current = currentSlice;
      } else {
        clearExistingTimer();
        setIsFinished(true);
      }
    }, speed);

    return () => clearExistingTimer();
  }, [text, speed]);

  const handleSkip = () => {
    clearExistingTimer();
    setDisplayedText(text);
    lastTextRef.current = text;
    setIsFinished(true);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100px", mt: 2 }}>
      {/* Skip Button */}
      {!isFinished && displayedText.length > 10 && (
        <Button
          size="small"
          onClick={handleSkip}
          startIcon={<KeyboardDoubleArrowRight />}
          sx={{
            position: "absolute",
            right: 0,
            top: -40,
            zIndex: 10,
            textTransform: "none",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            color: "text.secondary",
            borderRadius: "20px",
            fontSize: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
        >
          Skip
        </Button>
      )}

      {/* Markdown Content Area */}
      <Box
        sx={{
          color: "#1f1f1f",
          lineHeight: 1.7,
          fontSize: "0.95rem",
          display: "flex",
          flexDirection: "column",

          /* --- 1. USER QUESTION BUBBLE (BLOCKQUOTE) --- */
          "& blockquote": {
            bgcolor: "#f0f4f9",
            px: 2.5,
            py: 1.5,
            mx: 0,
            my: 2,
            borderRadius: "24px 24px 4px 24px", // Chat bubble shape
            border: "none",
            color: "#444746",
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
          "& li": {
            display: "list-item",
            listStyleType: "none",
            position: "relative",
            mb: 1.2,
            pl: 0.5,
            "&::before": {
              content: '"•"',
              color: "#1a73e8",
              fontWeight: "bold",
              fontSize: "1.2rem",
              position: "absolute",
              left: "-1.2rem",
              top: "-0.1rem",
            },
            "& p": { display: "inline", m: 0 }, // Keeps text on same line as bullet
          },

          /* --- 3. HEADERS & DIVIDERS --- */
          "& h2": {
            color: "#1f1f1f",
            mt: 3,
            mb: 1.5,
            fontWeight: 700,
            fontSize: "1.25rem",
          },
          "& h3": {
            color: "#1a73e8",
            mt: 2,
            mb: 1,
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05rem",
          },
          "& hr": { border: "none", borderTop: "1px solid #e2e8f0", my: 3 },

          /* --- 4. JAMB EXAM ALERTS --- */
          "& strong": { fontWeight: 700, color: "#000000" }, // Reddish tint for emphasis

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
