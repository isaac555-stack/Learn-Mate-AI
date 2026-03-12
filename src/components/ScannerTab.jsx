import { useState, useRef, useCallback } from "react";

import { Box, Stack, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import CameraPortal from "./CameraPortal";
import SummaryView from "./SummaryView";
import ControlBar from "./ControlBar";
import EmptyState from "./EmptyState";
import { speak, stopSpeech } from "../services/speechService";
import { explainFurther, processNotes } from "../services/aiService";
import { pulse, shimmer } from "../services/animation";
/* --- MAIN SCANNER TAB --- */
const ScannerTab = ({
  summary,
  setSummary,
  saveSummary,
  pages,
  setPages,
  metadata,
  setMetadata,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeepDiving, setIsDeepDiving] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuery, setUserQuery] = useState("");

  // const [metadata, setMetadata] = useState(null);
  const [scanSessionId, setScanSessionId] = useState("initial");

  const webcamRef = useRef(null);

  const generateScanId = () =>
    window.crypto?.randomUUID?.() || Date.now().toString(36);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    const base64Clean = imageSrc.split(",")[1];
    setPages((prev) => [...prev, base64Clean]);
    setIsCapturing(false);
    if (summary) {
      setSummary("");
      setMetadata(null);
    }
  }, [summary]);

  const onFinishAndSummarize = async () => {
    if (pages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await processNotes(pages);

      if (result) {
        setSummary(result.summaryText);
        setMetadata(result.metadata);
        setScanSessionId(generateScanId());
        setPages([]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExplain = async () => {
    if (!userQuery.trim() || !summary) return;
    const currentQuery = userQuery;
    setUserQuery("");
    setSummary((prev) => prev + `\n\n---\n\n> ${currentQuery}\n\n`);
    setIsDeepDiving(true);
    try {
      const deepDive = await explainFurther(summary, currentQuery);
      setSummary((prev) => prev + `\n${deepDive}`);
    } finally {
      setIsDeepDiving(false);
    }
  };

  const handleSpeech = async () => {
    if (isSpeaking) {
      await stopSpeech();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    try {
      await speak(
        summary
          .replace(/<[^>]*>?/gm, "")
          .replace(/[#*_-]/g, "")
          .trim(),
      );
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 12 }}>
      {/* Camera Portal */}
      {isCapturing && (
        <CameraPortal
          onClose={() => setIsCapturing(false)}
          onCapture={capturePhoto}
          webcamRef={webcamRef}
        />
      )}

      {/* Main View */}
      <Box sx={{ position: "relative", minHeight: "70vh" }}>
        {isAnalyzing ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: 12, animation: `${pulse} 2s infinite ease-in-out` }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #4285F4, #9B51E0, #EA4335)",
                backgroundSize: "200% 200%",
                animation: `${shimmer} 2s infinite linear`,
                mb: 4,
                boxShadow: "0 20px 40px rgba(99,102,241,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoAwesome sx={{ color: "white", fontSize: 40 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #1E293B, #6366F1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PrepFlow is reading...
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
              Synthesizing high-yield study points
            </Typography>
          </Stack>
        ) : summary ? (
          <SummaryView
            summary={summary}
            metadata={metadata}
            isDeepDiving={isDeepDiving}
            scanSessionId={scanSessionId}
          />
        ) : (
          <EmptyState onStartScan={() => setIsCapturing(true)} pages={pages} />
        )}
      </Box>

      {/* Control Bar */}
      <ControlBar
        summary={summary}
        setPages={setPages}
        saveSummary={saveSummary}
        metadata={metadata}
        isSpeaking={isSpeaking}
        handleSpeech={handleSpeech}
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        isAnalyzing={isAnalyzing}
        handleExplain={handleExplain}
        onFinishAndSummarize={onFinishAndSummarize}
        pages={pages}
        onOpenCamera={() => setIsCapturing(true)}
      />
    </Box>
  );
};

export default ScannerTab;
