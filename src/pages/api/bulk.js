import formidable from "formidable";
import fs from "fs";
import path from "path";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const uploadDir = path.join(process.cwd(), "/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const form = formidable({ uploadDir, keepExtensions: true, multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Failed to parse form" });

    const resumes = Array.isArray(files.resumes) ? files.resumes : (files.resumes ? [files.resumes] : []);
    const requirementFile = files.requirement && files.requirement[0] ? files.requirement[0] : (files.requirement || null);
    const jobRole = (fields.jobrole && (Array.isArray(fields.jobrole) ? fields.jobrole[0] : fields.jobrole)) || "";

    if (!resumes.length) return res.status(400).json({ error: "No resumes provided" });

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let requirementData = null;
    try {
      if (requirementFile?.filepath) {
        requirementData = fs.readFileSync(requirementFile.filepath);
      }
    } catch {}

    async function scoreOne(fileObj) {
      try {
        const resumeData = fs.readFileSync(fileObj.filepath);

        const messages = [
          {
            role: "user",
            content: [
              { type: "text", text: `You are ranking candidates strictly for role: ${jobRole || "(not specified)"}. Return compact JSON: {name, score, summary}. Score 0-100.` },
              { type: "file", mimeType: "application/pdf", data: resumeData },
            ].concat(requirementData ? [{ type: "file", mimeType: "application/pdf", data: requirementData }] : []),
          },
        ];

        const out = await generateText({ model: google("gemini-2.0-flash-exp"), apiKey, messages });

        let parsed = null;
        try { parsed = JSON.parse(out.text); } catch {
          parsed = { name: fileObj.originalFilename || fileObj.newFilename, score: null, summary: out.text?.slice(0, 600) };
        }
        return parsed;
      } catch (e) {
        return { name: fileObj.originalFilename || fileObj.newFilename, score: null, summary: "Failed to score." };
      } finally {
        try { if (fileObj?.filepath && fs.existsSync(fileObj.filepath)) fs.unlinkSync(fileObj.filepath); } catch {}
      }
    }

    const results = [];
    for (const file of resumes) {
      const arr = Array.isArray(file) ? file : [file];
      for (const f of arr) {
        // normalize formidable v3 shape
        const fileObj = f.filepath ? f : (f[0] || f);
        // eslint-disable-next-line no-await-in-loop
        const r = await scoreOne(fileObj);
        results.push({ ...r, fileName: fileObj.originalFilename || fileObj.newFilename });
      }
    }

    if (requirementFile?.filepath) {
      try { if (fs.existsSync(requirementFile.filepath)) fs.unlinkSync(requirementFile.filepath); } catch {}
    }

    results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    res.status(200).json({ results });
  });
}


