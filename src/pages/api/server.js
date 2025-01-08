import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure the upload directory exists
    }

    const form = formidable({
      uploadDir, // Set the upload directory
      keepExtensions: true, // Keep file extensions
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing file:", err);
        return res.status(500).json({ error: "Failed to parse file." });
      }

      // Debugging: Log the files object
      console.log('Files object:', files);

      // Ensure that files.resume is an array, and access the first element
      const filePath = files.resume && files.resume[0] ? files.resume[0].filepath : undefined;

      if (!filePath) {
        return res.status(400).json({ error: "File path is missing" });
      }

      try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const fileData = fs.readFileSync(filePath);

        const prompt="Analyze the following resume for a specific job position and provide a detailed report based on these criteria: 1. ATS Parse Rate: Assess how well the resume adheres to ATS standards. 2. Quantifying Impact: Check if achievements are measurable with quantifiable results. 3. Repetition: Identify repeated phrases or overused terms. 4. Spelling & Grammar: Highlight any errors in spelling or grammar. 5. File Format & Size: Determine whether the resume is compatible with ATS systems. 6. Resume Length: Evaluate if the length is appropriate (e.g., 1-2 pages for most jobs). 7. Long Bullet Points: Check if bullet points are concise and action-oriented. 8. Contact Information: Verify the presence and accuracy of essential details (email, phone, LinkedIn). 9. Essential Sections: Confirm if standard sections like Skills, Experience, and Education are included. 10. Hard Skills: Evaluate the relevance of hard skills listed (e.g., technical proficiencies). 11. Soft Skills: Assess the clarity and relevance of soft skills included. 12. Active Voice: Check if bullet points use active voice instead of passive voice. 13. Buzzwords & Clichés: Identify overused buzzwords or vague terms and suggest replacements. 14. Design: Review the design for readability and ATS compatibility. For each criterion, assign a score out of 100, explain the evaluation, and provide actionable recommendations for improvement. Ensure your feedback is clear, professional, and tailored to maximize the candidate's chances of passing ATS scans and impressing recruiters.And Give Overall perforamnace Out Of 100 in Front of the Response And Give Perfect Analyse  Score"



        const result = await generateText({
          model: google("gemini-1.5-pro-latest"),
          apiKey: apiKey,
          system: "You are a highly skilled professional Resume Sort sortlister specializing in resume build advice. Only respond to queries related to Resume topics, and ignore anything unrelated.",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "file",
                  mimeType: "application/pdf",
                  data: fileData,
                },
              ],
            },
          ],
          
        });

        res.status(200).json({ message: result.text });
      } catch (error) {
        console.error("Error in text generation:", error);
        res.status(500).json({ error: "Failed to process file." });
      } finally {
        // Clean up uploaded file
        if (filePath) {
          fs.unlinkSync(filePath); // Clean up uploaded file
        }
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
