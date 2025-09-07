import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const out = await generateText({
      model: google("gemini-2.0-flash-exp"),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      messages: [
        { role: "system", content: "You are an assistant for an ATS resume tool. Be concise and helpful. Focus on resumes, ATS, keyword gaps, bulk shortlisting, and role matching." },
        { role: "user", content: message }
      ]
    });
    res.status(200).json({ reply: out.text });
  } catch (e) {
    res.status(200).json({ reply: "I couldn't process that just now. Please try again." });
  }
}


