// netlify/functions/ask.js
import { Buffer } from "buffer";
import mammoth from "mammoth";

export const handler = async (event) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { fileBase64, question } = JSON.parse(event.body || "{}");

    if (!fileBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "No file provided" }) };
    }

    // Convert Base64 to ArrayBuffer
    const arrayBuffer = Uint8Array.from(Buffer.from(fileBase64, "base64"));

    // Extract text from the .docx using Mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    // Simple AI simulation (replace with real AI call)
    // For example, you could integrate OpenAI API here
    const answer = `You asked: "${question}"\n\nBased on the document content:\n${text.substring(0, 500)}...`;

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
