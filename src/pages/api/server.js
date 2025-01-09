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
            'If the document is not a resume:

    Reply: "This program is designed for resumes related to job roles. Please ensure the document is a resume for proper evaluation." End with a concise statement like: "This program evaluates resumes specifically. Please upload a resume related to a job role."
  Use Emojis and Tags like Header bold in the Resposonse And Start Response With Hello Applicant Name
    Resume Validation for Job Role: ${jobRole}
    Validate based on the resume data itself. If the first document is the resume, proceed to the next steps. If the second document is found, consider it as requirements for the job.
    give Criteria Recommation in Detail And Give Hard Score
    If the document is a resume or job-related document:

    Analyze the document and generate a detailed report based on the following criteria:

    1. ATS Parse Rate
    Evaluation: Assess how well the document adheres to ATS standards.
    Score: [Out of 100]
    Recommendation: Ensure proper use of standard headings (e.g., "Experience," "Skills") and simple formatting to enhance ATS parsing.
    2. Quantifying Impact
    Evaluation: Check if achievements are measurable with quantifiable results (e.g., “increased sales by 20%”).
    Score: [Out of 100]
    Recommendation: Include quantifiable metrics to demonstrate the impact clearly.
    3. Repetition
    Evaluation: Identify overused phrases or repeated terms throughout the document.
    Score: [Out of 100]
    Recommendation: Avoid redundancy by varying phrasing.
    4. Spelling & Grammar
    Evaluation: Identify spelling or grammatical errors that could affect professionalism.
    Score: [Out of 100]
    Recommendation: Use a grammar checker and proofread the document carefully.
    5. File Format & Size
    Evaluation: Confirm whether the document is in an ATS-compatible file format (e.g., .docx, .pdf) and if the size is optimal.
    Score: [Out of 100]
    Recommendation: Use standard file formats and ensure the file is not too large (generally under 2MB).
    6. Document Length
    Evaluation: Ensure the resume length is appropriate (concise for most professional applications, generally 1-2 pages).
    Score: [Out of 100]
    Recommendation: Keep the document concise, focusing on the most relevant experience and skills.
    7. Long Bullet Points
    Evaluation: Evaluate if bullet points are concise and action-oriented.
    Score: [Out of 100]
    Recommendation: Keep bullet points clear and to the point, ideally under two lines.
    8. Contact Information
    Evaluation: Verify the presence and accuracy of key contact details (e.g., email, phone number, LinkedIn).
    Score: [Out of 100]
    Recommendation: Double-check that contact information is up-to-date and prominently displayed.
    9. Essential Sections
    Evaluation: Ensure critical sections are present (Skills, Experience, Education, etc.).
    Score: [Out of 100]
    Recommendation: Make sure your resume includes essential sections and follows a clean layout.
    10. Hard Skills
    Evaluation: Assess the relevance and clarity of technical skills listed.
    Score: [Out of 100]
    Recommendation: List relevant hard skills that match the job description.
    11. Soft Skills
    Evaluation: Assess if soft skills are clearly defined and relevant.
    Score: [Out of 100]
    Recommendation: Focus on specific soft skills that align with the job role.
    12. Active Voice
    Evaluation: Ensure bullet points are written in active voice (e.g., “Managed a team” instead of “Was responsible for managing a team”).
    Score: [Out of 100]
    Recommendation: Use active language to demonstrate ownership of tasks.
    13. Buzzwords & Clichés
    Evaluation: Identify overused buzzwords or clichés that may weaken the resume.
    Score: [Out of 100]
    Recommendation: Replace buzzwords with concrete examples of skills and achievements.
    14. Design
    Evaluation: Review the document design for readability and ATS compatibility.
    Score: [Out of 100]
    Recommendation: Use a simple and clean design with clear sections, avoiding overly complex formatting.
    Additional ATS Checks:

    Evaluate Keyword Usage: Verify if the document includes relevant job-specific keywords that will help it pass through ATS filters.
    Resume Optimization for Job Roles: Compare the resume content against common keywords and requirements for the specified job role to ensure maximum relevance.
    Overall Score: [Total Score / 100]
    Hi [Applicant's Name],
    Here's your ATS evaluation based on the document you provided. Below are the detailed findings and actionable recommendations to enhance your resume’s chances of passing through ATS software and impressing recruiters.

    Feel free to reach out if you need further clarification or additional help optimizing your resume!'
    Give Like Above and Give Very Hard TestScores
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
