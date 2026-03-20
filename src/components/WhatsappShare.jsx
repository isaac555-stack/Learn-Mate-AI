import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Button } from "@mui/material";

const WhatsAppShare = () => {
  const siteUrl = "https://prepflow-ai.vercel.app/";

  // This message is crafted for JAMB/WAEC students
  const message = `Guys, check out PrepFlow! 🚀 I'm using it to scan my handwritten notes and get AI summaries for JAMB. It's a game changer for real. Check it out here: ${siteUrl}`;

  const handleShare = () => {
    // encodeURIComponent ensures the spaces and links don't break
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      variant="contained"
      startIcon={<WhatsAppIcon />}
      onClick={handleShare}
      sx={{
        backgroundColor: "#25D366", // WhatsApp Green
        "&:hover": { backgroundColor: "#128C7E" },
        borderRadius: "24px",
        fontWeight: "bold",
        textTransform: "none",
        px: 4,
        py: 1.5,
        boxShadow: "0 4px 14px 0 rgba(37, 211, 102, 0.39)",
      }}
    >
      Share with Classmates
    </Button>
  );
};

export default WhatsAppShare;
