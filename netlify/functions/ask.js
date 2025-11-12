import OpenAI from "openai";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handler(event) {
  try {
    const { question } = JSON.parse(event.body || "{}");

    // Load the backend Word document
    const docPath = path.resolve("./netlify/functions/reference.docx");
    const buffer = fs.readFileSync(docPath);
    const result = await mammoth.extractRawText({ buffer });
    const fileText = result.value;

    const prompt = `Answer the question based on this document:\n${fileText}\nQuestion: ${question}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: completion.choices[0].message.content })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
