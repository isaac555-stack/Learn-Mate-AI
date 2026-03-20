import {
  Box,
  Button,
  Container,
  Chip,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Download,
  Save,
  VolumeUp,
  Stop,
  Send,
  PhotoCamera,
} from "@mui/icons-material";
import { alpha } from "@mui/system";
import PagesPreview from "./PagesPreview";

const ControlBar = ({
  summary,
  saveSummary,
  metadata,
  isSpeaking,
  handleSpeech,
  userQuery,
  setUserQuery,
  handleExplain,
  onFinishAndSummarize,
  pages,
  onOpenCamera,
  setPages,
  isAnalyzing,
}) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 0,
      right: 0,
      bgcolor: "#FFFFFF",
      backdropFilter: "blur(20px)",
      left: "50%",
      transform: "translateX(-50%)",
      width: { xs: "85%", md: "auto" }, // Auto width for desktop creates a sleeker "Pill"
      minWidth: { md: "750px" },
      py: 1.0,
      mb: { xs: 2, md: 2 },
      px: 1,
      zIndex: 1000,
      border: "0.7px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "30px",
    }}
  >
    <Container maxWidth="md" disableGutters>
      <PagesPreview
        pages={pages}
        setPages={setPages}
        onSelect={(idx) => console.log("Selected page:", idx)}
      />

      {/* Input / Ask Box */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",

            borderRadius: "32px",
            px: 2,
            py: 0.8,
            transition: "0.3s cubic-bezier(0.4,0,0.2,1)",
            border: "1px solid transparent",
            "&:focus-within": {
              bgcolor: "#fff",
            },
          }}
        >
          <TextField
            fullWidth
            multiline={true}
            maxRows={5}
            variant="standard"
            placeholder={summary ? "Ask PrepFlow..." : "Scan notes to begin"}
            disabled={!summary}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ py: 1, color: "#000000" }}
          />
          {summary ? (
            <IconButton onClick={handleExplain} disabled={!userQuery.trim()}>
              <Send sx={{ color: userQuery.trim() ? "#6366F1" : "#94a3b8" }} />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              onClick={onFinishAndSummarize}
              disabled={pages.length < 1 || isAnalyzing}
              sx={{
                borderRadius: "15px",
                textTransform: "none",
                fontWeight: 800,
                px: 3,
                bgcolor: "#6366F1",
              }}
            >
              Scan
            </Button>
          )}
        </Box>
      </Stack>
      {summary && (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            overflowX: "auto",
            mb: 0,
            mt: 2,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-around", alignItems: "center" }}
          >
            {[
              {
                label: "Save",
                icon: <Save />,
                action: () => saveSummary(summary, metadata),
              },
            ].map((item) => (
              <Chip
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={item.action}
                sx={{
                  borderRadius: "12px",
                  bgcolor: "white",
                  border: "1px solid #e2e8f0",
                  fontWeight: 700,
                  px: 1,
                  mr: 1,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              />
            ))}
            <Chip
              icon={isSpeaking ? <Stop /> : <VolumeUp />}
              label={isSpeaking ? "Stop" : "Listen"}
              onClick={handleSpeech}
              sx={{
                borderRadius: "12px",
                fontWeight: 700,
                bgcolor: isSpeaking
                  ? alpha("#ef4444", 0.08)
                  : alpha("#6366F1", 0.08),
                color: isSpeaking ? "#ef4444" : "#6366F1",
                border: "1px solid",
                borderColor: isSpeaking
                  ? alpha("#ef4444", 0.2)
                  : alpha("#6366F1", 0.2),
              }}
            />
          </Stack>

          <IconButton
            onClick={onOpenCamera}
            sx={{
              bgcolor: "#F0F4F9",
              width: 50,
              height: 50,

              "&:hover": { bgcolor: "#E2E8F0" },
            }}
          >
            <PhotoCamera sx={{ color: "#444746" }} />
          </IconButton>
        </Stack>
      )}
    </Container>
  </Box>
);

export default ControlBar;
