import { useState, useRef, useCallback, useEffect } from "react";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";

import { Box, Button } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const TypewriterEffect = ({ text, speed = 2 }) => {
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

    // Determine starting point for appending new text
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
      i++;
      const currentSlice = text.slice(0, i);
      setDisplayedText(currentSlice);
      lastTextRef.current = currentSlice;

      if (i >= text.length) {
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
    <Box sx={{ position: "relative", minHeight: "150px" }}>
      {!isFinished && (
        <Button
          size="small"
          variant="contained"
          onClick={handleSkip}
          sx={{
            position: "absolute",
            right: 0,
            top: -30,
            zIndex: 10,
            textTransform: "none",
            bgcolor: "white",
            color: "text.secondary",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "#f8fafc" },
          }}
          startIcon={<KeyboardDoubleArrowRight />}
        >
          Skip animation
        </Button>
      )}
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "#1f1f1f",
          lineHeight: 1.6,
          fontSize: "0.95rem",
          display: "flex",
          flexDirection: "column", // Stack items vertically

          /* --- GEMINI-STYLE USER BUBBLE (ALIGNED RIGHT) --- */
          "& blockquote": {
            bgcolor: "#f0f4f9", // Gemini light blue-gray
            px: 2, // Compact
            py: 0,
            mx: 0,
            my: 1.5,
            borderRadius: "20px", // Pill shape
            border: "none",
            color: "#444746",
            fontStyle: "normal",
            alignSelf: "flex-end", // Pushes bubble to the right side
            maxWidth: "80%", // Prevents full-width stretching
            display: "inline-block",
            "& p": {
              m: 0,
              p: 0,
              fontWeight: 500,
              lineHeight: 1.4,
            },
          },

          /* --- AI RESPONSE SECTION (ALIGNED LEFT) --- */
          "& h3": {
            color: "#1a73e8", // Google Blue
            mt: 3,
            mb: 1,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          },

          /* --- MARKDOWN DEFAULTS --- */
          "& h2": {
            color: "#1f1f1f",
            mt: 3,
            mb: 1.5,
            fontWeight: 700,
            fontSize: "1.3rem",
          },
          "& li": {
            display: "flex",
            alignItems: "flex-start", // Ensures bullet and text align at the top
            mb: 0.5,
            gap: 1, // Adds space between the bullet and the text
            "&::before": {
              content: '"•"',
              color: "#1a73e8",
              fontWeight: "bold",
              width: "1.2em",
              flexShrink: 0,
              textAlign: "center", // Center-aligns the dot in its box
            },
            // This is the critical part: Ensure p tags inside li don't create block-level spacing
            "& p": {
              m: 0,
              mb: 0,
              display: "inline", // Prevents the paragraph from pushing to a new line
              width: "auto",
            },
          },
          "& hr": {
            border: "none",
            borderTop: "1px solid #f1f5f9",
            my: 2,
            width: "100%",
          },
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
