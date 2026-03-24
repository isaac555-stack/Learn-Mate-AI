import { useState, useRef, useCallback } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import CameraPortal from "./CameraPortal";
import SummaryView from "./SummaryView";
import ControlBar from "./ControlBar";
import EmptyState from "./EmptyState";
import { speak, stopSpeech } from "../services/speechService";
import { explainFurther, processNotes } from "../services/aiService";
import { getQuestionsForSubject } from "../services/questionsEngine";
import { pulse, shimmer } from "../services/animation";

const ScannerTab = ({
  summary,
  setSummary,
  saveSummary,
  pages,
  setPages,
  metadata,
  setMetadata,
  cards,
  setCards,
  // 1. Receive shared state from Parent (Scanner.jsx)
  scanSessionId,
  setScanSessionId,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeepDiving, setIsDeepDiving] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userQuery, setUserQuery] = useState("");

  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const webcamRef = useRef(null);

  /**
   * ACTION: Capture and Reset
   */
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    const base64Clean = imageSrc.split(",")[1];
    setPages((prev) => [...prev, base64Clean]);
    setIsCapturing(false);

    // 2. Clear previous session data if starting a brand new scan
    if (summary) {
      setSummary("");
      setMetadata(null);
      setQuestions([]);
      setScanSessionId(null); // Critical: Tells the app this is a new note
    }
  }, [summary, setPages, setSummary, setMetadata, setScanSessionId]);

  /**
   * ACTION: Primary AI Analysis & Initial Save
   */
  const onFinishAndSummarize = async () => {
    if (pages.length === 0) return;
    setIsAnalyzing(true);

    try {
      const result = await processNotes(pages);

      if (result) {
        setSummary(result.summaryText);
        setMetadata(result.metadata);
        setPages([]);

        // 3. Save to DB and store the returned UUID for future Deep Dives
        const realId = await saveSummary(
          result.summaryText,
          result.metadata,
          null, // Passing null tells saveSummary to "INSERT"
        );

        if (realId) {
          setScanSessionId(realId);
        }

        // Fetch suggested questions in background
        setIsLoadingQuestions(true);
        try {
          const fetchedQuestions = await getQuestionsForSubject(
            result.metadata.subject,
            result.summaryText,
          );
          setQuestions(fetchedQuestions);
        } catch (quizErr) {
          console.error("Quiz Engine Error:", quizErr);
        } finally {
          setIsLoadingQuestions(false);
        }
      }
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * ACTION: AI Deep Dive & Incremental Update
   */
  const handleExplain = async () => {
    // 4. Validation: Deep Dive only works if we have a valid DB ID
    if (!userQuery.trim() || !summary || !scanSessionId) {
      console.warn("Deep Dive blocked: Missing data or Session ID");
      return;
    }

    const currentQuery = userQuery;
    const currentSummary = summary;
    const currentId = scanSessionId;
    setUserQuery("");

    const updatedWithQuestion = `${currentSummary}\n\n>${currentQuery}\n\n`;
    setSummary(updatedWithQuestion);
    setIsDeepDiving(true);

    try {
      const deepDiveResponse = await explainFurther(
        currentSummary,
        currentQuery,
      );
      const finalContent = `${updatedWithQuestion}${deepDiveResponse}\n`;
      setIsDeepDiving(false);
      setSummary(finalContent);

      // 5. Update the existing record in Supabase using the Session ID
      await saveSummary(finalContent, metadata, currentId);
    } catch (error) {
      setIsDeepDiving(false);
      console.error("Deep Dive Error:", error);
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
      await speak(summary.replace(/[#*_-]/g, "").trim());
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 12 }}>
      {isCapturing && (
        <CameraPortal
          onClose={() => setIsCapturing(false)}
          onCapture={capturePhoto}
          webcamRef={webcamRef}
        />
      )}

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
                background: "linear-gradient(135deg, #000, #4285F4, #000)",
                backgroundSize: "200% 200%",
                animation: `${shimmer} 2s infinite linear`,
                mb: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <AutoAwesome sx={{ color: "white", fontSize: 40 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              PrepFlow is reading...
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 1 }}>
              Identifying subject and syncing past questions
            </Typography>
          </Stack>
        ) : summary ? (
          <SummaryView
            summary={summary}
            metadata={metadata}
            isDeepDiving={isDeepDiving}
            scanSessionId={scanSessionId}
            cards={cards}
            setCards={setCards}
            questions={questions}
            isLoadingQuestions={isLoadingQuestions}
          />
        ) : (
          <EmptyState onStartScan={() => setIsCapturing(true)} pages={pages} />
        )}
      </Box>

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
        isDeepDiving={isDeepDiving}
        handleExplain={handleExplain}
        onFinishAndSummarize={onFinishAndSummarize}
        pages={pages}
        onOpenCamera={() => setIsCapturing(true)}
        scanSessionId={scanSessionId}
      />
    </Box>
  );
};

export default ScannerTab;
