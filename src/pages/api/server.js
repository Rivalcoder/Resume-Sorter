import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const config = {
  api: {
    bodyParser: false, //Because It Only Validate message String Not Files So Turned off 
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing file:", err);
        return res.status(500).json({ error: "Failed to parse file." });
      }
      console.log('Files object:', files);

      const filePath = files.resume && files.resume[0] ? files.resume[0].filepath : undefined;
      const requirementPath = files.requirement && files.requirement[0] ? files.requirement[0].filepath:undefined;
      const jobRole = files.jobrole || "No job role specified";


      if (!filePath) {
        return res.status(400).json({ error: "File path is missing" });
      }

      try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const fileData = fs.readFileSync(filePath);
        const fileData2=undefined;
        if(requirementPath)
          {const fileData2=fs.readFileSync(requirementPath);}
      
        

        const prompt = `
        **If the document is not a resume **
           Reply About the Program is for Resume Not For Others like that and close in 2-3 lines
        
        "Resume is For Specified Job Role:${jobRole}"Give and Validate Accordingly response accordingly if nil Validate From the Resume Data Alone
        And First Document is Resume and If Second One IS Found then it IS Requirements for the Job.
        if the document is a resume or job-related document continue below Intruction
        
        Analyze the following document and provide a detailed report based on the following criteria:
        
        1. ATS Parse Rate: Assess how well the document adheres to ATS standards.
        2. Quantifying Impact: Check if achievements or key points are measurable with quantifiable results.
        3. Repetition: Identify repeated phrases or overused terms.
        4. Spelling & Grammar: Highlight any errors in spelling or grammar.
        5. File Format & Size: Determine whether the document is compatible with ATS systems.
        6. Document Length: Evaluate if the length is appropriate (e.g., a concise document for most professional applications).
        7. Long Bullet Points: Check if bullet points are concise and action-oriented.
        8. Contact Information: Verify the presence and accuracy of essential details (email, phone, LinkedIn, etc.).
        9. Essential Sections: Confirm if the document includes critical sections (such as Skills, Experience, and Education).
        10. Hard Skills: Evaluate the relevance of technical proficiencies or hard skills listed.
        11. Soft Skills: Assess the clarity and relevance of soft skills included.
        12. Active Voice: Check if bullet points use active voice rather than passive voice.
        13. Buzzwords & Clichés: Identify overused buzzwords or vague terms and suggest improvements.
        14. Design: Review the document design for readability and ATS compatibility.
        Use Additional ATS check also and Add Result in Overall Score And verify Resume in Mode To Get Get Correct Score.
        And Add Advance Checks To Verify Resume Get Roles and Data From The Resume Itself
        For each criterion, assign a score out of 100, explain the evaluation, and provide actionable recommendations for improvement.
        
        and Give Overall score in the Top of the Response
        And Address the Resume Person in Above of the Response like Hi with bold h1 tag
        Use headers, emojis, and a friendly tone in your response.

        `;

        const messages= [
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
          
        ]



        
        if (fileData2) {
          messages.push({
            role: "user",
            content: {
              type: "file",
              mimeType: "application/pdf",
              data: fileData2,
            },
          });
        }

        const result = await generateText({
          model: google("gemini-1.5-pro-latest"),
          apiKey: apiKey,
          system: "You are a highly skilled professional Resume Sort sortlister specializing in resume build advice. Only respond to queries related to Resume topics, and ignore anything unrelated.",
          messages,
          
        });

        res.status(200).json({ message: result.text });
      } catch (error) {
        console.error("Error in text generation:", error);
        res.status(500).json({ error: "Failed to process file." });
      } finally {
        if (filePath) {
          fs.unlinkSync(filePath);
        }
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
