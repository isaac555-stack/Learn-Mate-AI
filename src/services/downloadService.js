import { jsPDF } from "jspdf";

export const downloadNoteAsPDF = (note, metadata) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = metadata.title || "Study Note";

  // --- Styling ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title.toUpperCase(), margin, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text(`Subject: ${metadata.subject} | Date: ${metadata.date}`, margin, 35);

  doc.setLineWidth(0.5);
  doc.line(margin, 38, pageWidth - margin, 38); // Horizontal line

  // --- Content Handling ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0);

  // Clean the text: remove Markdown symbols for the PDF
  const cleanText = note
    .replace(/[#*]/g, "")
    .replace(/---/g, "_________________________________");

  // Wrap text so it doesn't go off the page
  const splitText = doc.splitTextToSize(cleanText, pageWidth - margin * 2);

  doc.text(splitText, margin, 50);

  // --- Save File ---
  const fileName = `${title.replace(/\s+/g, "_")}_Notes.pdf`;
  doc.save(fileName);
};
