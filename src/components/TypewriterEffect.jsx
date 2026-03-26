import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  alpha,
  useTheme,
  keyframes,
} from "@mui/material";
import { KeyboardDoubleArrowRight, AutoAwesome } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const TypewriterEffect = ({ text, speed = 15 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Gemini Branding Constants
  const brandBlue = isDark ? "#a8c7fa" : "#1a73e8";
  const textPrimary = isDark ? "#e3e3e3" : "#1f1f1f";
  const textSecondary = isDark ? "#c4c7c5" : "#444746";

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

    const isAppending = text.startsWith(displayedText) && displayedText !== "";
    let i = isAppending ? displayedText.length : 0;

    setIsFinished(false);
    clearExistingTimer();

    timerRef.current = setInterval(() => {
      if (i < text.length) {
        const remaining = text.length - i;
        const increment = remaining > 1000 ? 8 : remaining > 300 ? 3 : 1;
        i += increment;
        setDisplayedText(text.slice(0, i));
      } else {
        setDisplayedText(text);
        clearExistingTimer();
        setIsFinished(true);
      }
    }, speed);

    return () => clearExistingTimer();
  }, [text, speed]);

  const handleSkip = () => {
    clearExistingTimer();
    setDisplayedText(text);
    setIsFinished(true);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* 1. STATUS BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {!isFinished && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesome
              sx={{
                fontSize: 16,
                color: brandBlue,
                animation: "spin 4s linear infinite",
                "@keyframes spin": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: textSecondary,
                fontSize: "0.75rem",
              }}
            >
              PrepFlow is thinking...
            </Typography>
          </Box>
        )}

        {!isFinished && displayedText.length > 50 && (
          <Button
            size="small"
            onClick={handleSkip}
            endIcon={<KeyboardDoubleArrowRight sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: "100px",
              textTransform: "none",
              fontSize: "0.7rem",
              color: textSecondary,
            }}
          >
            Skip
          </Button>
        )}
      </Box>

      {/* 2. MAIN MARKDOWN CONTENT */}
      <Box
        sx={{
          lineHeight: 1.8,
          fontSize: "1.05rem",
          color: textPrimary, // PURE NEUTRAL TEXT
          fontFamily: theme.typography.fontFamily,

          /* Add these styles inside the Box sx in TypewriterEffect.jsx */

          "& blockquote": {
            /* 1. Alignment & Shape */
            alignSelf: "flex-end",
            width: "fit-content",
            maxWidth: "85%",
            margin: "24px 0 24px auto", // Pushes it to the right
            padding: "12px 20px",
            borderRadius: "24px 24px 4px 24px", // Gemini's signature "User Bubble" rounding

            /* 2. Gemini Exact Colors */
            bgcolor: isDark ? "#1e1f20" : "#e1e5eb",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,

            /* 3. Typography within bubble */
            "& p": {
              margin: 0,
              fontSize: "1rem",
              color: "text.primary",
              fontWeight: 400,
              lineHeight: 1.5,
            },

            /* Optional: Add a small "You" label above the bubble like Gemini */
          },
          /* THE CURSOR: The only bright blue element in the text flow */
          "&::after": !isFinished
            ? {
                content: '""',
                display: "inline-block",
                width: "8px",
                height: "1.2em",
                bgcolor: brandBlue,
                borderRadius: "2px",
                ml: 0.5,
                verticalAlign: "middle",
                animation: `${blink} 0.8s infinite`,
                boxShadow: `0 0 10px ${alpha(brandBlue, 0.4)}`,
              }
            : {},

          /* HEADERS: Large, Bold, but Neutral */
          "& h1, & h2, & h3": {
            fontWeight: 600,
            color: textPrimary,
            mt: 4,
            mb: 1.5,
          },
          "& h1": { fontSize: "1.6rem" },
          "& h2": { fontSize: "1.4rem" },
          "& h3": { fontSize: "1.2rem" },

          /* STRONG: No more blue bolding. High-contrast neutral instead. */
          "& strong": { fontWeight: 700, color: textPrimary },

          /* LISTS: Clean, muted bullets */
          "& ul": { listStyleType: "none", pl: 0, mb: 3 },
          "& li": {
            mb: 1.5,
            pl: 3,
            position: "relative",
            "&::before": {
              content: '"•"',
              position: "absolute",
              left: 8,
              color: textSecondary,
              fontWeight: "bold",
            },
          },

          /* BLOCKS: Subtly elevated surfaces */
          "& .katex-display": {
            my: 4,
            p: 2,
            bgcolor: isDark ? alpha("#fff", 0.03) : "#f8f9fa",
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
          },

          /* LINKS: The functional blue */
          "& a": {
            color: brandBlue,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
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
