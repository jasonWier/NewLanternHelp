/// netlify/functions/ask.js
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

export async function handler(event) {
  const { question } = JSON.parse(event.body);

  // Path to your Word document
  const docxPath = path.resolve("data/NewLanternHelp.docx");

  // Convert .docx to plain text
  const buffer = fs.readFileSync(docxPath);
  const { value: companyText } = await mammoth.extractRawText({ buffer });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that answers questions based only on the following company document:\n\n${companyText}\n\nIf the answer isn't found in this document, say "I'm not sure based on the provided information."`,
        },
        { role: "user", content: question },
      ],
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ answer: data.choices[0].message.content }),
  };
}
