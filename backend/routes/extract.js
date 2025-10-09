const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("documents"), async (req, res) => {
  try {
    const files = req.files;
    let extractedText = "";

    for (const file of files) {
      if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText += result.value;
      } else {
        extractedText += "\nUnsupported file type.\n";
      }
    }

    // Regex-based field extraction
    const ageMatch = extractedText.match(/age:\s*(\d{2})/i);
    const incomeMatch = extractedText.match(/income:\s*(\d{5,7})/i);
    const occupationMatch = extractedText.match(/occupation:\s*(\w+)/i);
    const stateMatch = extractedText.match(/state:\s*(Tamil Nadu|Karnataka|Kerala|Delhi|Maharashtra)/i);
    const genderMatch = extractedText.match(/gender:\s*(male|female|other)/i);

    const extracted = {
      age: ageMatch?.[1]?.trim() || "",
      income: incomeMatch?.[1]?.trim() || "",
      occupation: occupationMatch?.[1]?.trim().toLowerCase() || "",
      state: stateMatch?.[1]?.trim() || "",
      gender: genderMatch?.[1]?.trim().toLowerCase() || "",
    };

    res.json(extracted);
  } catch (err) {
    console.error("Extraction error:", err);
    res.status(500).json({ message: "Failed to extract details." });
  }
});

module.exports = router;