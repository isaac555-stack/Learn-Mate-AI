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
import remarkGfm from "remark-gfm";
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
          color: textPrimary,
          fontFamily: theme.typography.fontFamily,

          /* 🔹 TABLE STYLING (Added here) */
          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            my: 3,
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            fontSize: "0.95rem",
          },
          "& th": {
            bgcolor: isDark ? alpha("#fff", 0.05) : "#f8f9fa",
            color: textPrimary,
            fontWeight: 700,
            textAlign: "left",
            p: 1.5,
            borderBottom: `2px solid ${theme.palette.divider}`,
          },
          "& td": {
            p: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: textSecondary,
          },
          "& tr:last-child td": {
            borderBottom: "none",
          },
          "& tr:hover": {
            bgcolor: isDark ? alpha("#fff", 0.02) : alpha("#000", 0.01),
          },

          /* 🔹 BLOCKQUOTE / USER BUBBLE */
          "& blockquote": {
            alignSelf: "flex-end",
            width: "fit-content",
            maxWidth: "85%",
            margin: "24px 0 24px auto",
            padding: "12px 20px",
            borderRadius: "24px 24px 4px 24px",
            bgcolor: isDark ? "#1e1f20" : "#e1e5eb",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
            "& p": {
              margin: 0,
              fontSize: "1rem",
              color: "text.primary",
              fontWeight: 400,
              lineHeight: 1.5,
            },
          },

          /* THE CURSOR */
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

          /* HEADERS */
          "& h1, & h2, & h3": {
            fontWeight: 600,
            color: textPrimary,
            mt: 4,
            mb: 1.5,
          },
          "& h1": { fontSize: "1.6rem" },
          "& h2": { fontSize: "1.4rem" },
          "& h3": { fontSize: "1.2rem" },

          /* STRONG */
          "& strong": { fontWeight: 700, color: textPrimary },

          /* LISTS */
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

          /* BLOCKS */
          "& .katex-display": {
            my: 4,
            p: 2,
            bgcolor: isDark ? alpha("#fff", 0.03) : "#f8f9fa",
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
          },

          /* LINKS */
          "& a": {
            color: brandBlue,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {displayedText}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default TypewriterEffect;
