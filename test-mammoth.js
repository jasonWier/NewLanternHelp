import fs from "fs";
import mammoth from "mammoth";

async function extractText() {
  try {
    // Path to your Word document
    const docxPath = "/Users/jason/NewLanternHelp/data/NewLanternHelp.docx";

    // Read file
    const buffer = fs.readFileSync(docxPath);

    // Convert to plain text
    const { value: text } = await mammoth.extractRawText({ buffer });

    console.log("✅ Extracted text from .docx file:\n");
    console.log(text.slice(0, 1000)); // Print first 1000 characters
  } catch (error) {
    console.error("❌ Error reading .docx file:", error);
  }
}

extractText();
