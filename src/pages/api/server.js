import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import formidable from "formidable";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";


dotenv.config({ path: ".env" });

export const config = {
  api: {
    bodyParser: false, 
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
      const jobRole = fields.jobrole || "Not Specified JobRole";


      if (!filePath) {
        return res.status(400).json({ error: "File path is missing" });
      }

      try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const fileData = fs.readFileSync(filePath);
        var fileData2=fs.readFileSync(path.join(process.cwd(), "public/blank-req.pdf"))
        if(requirementPath)
          {var fileData2=fs.readFileSync(requirementPath);}


        const prompt = `
            'If the document is not a resume:

    Reply: "This program is designed for resumes related to job roles. Please ensure the document is a resume for proper evaluation." End with a concise statement like: "This program evaluates resumes specifically. Please upload a resume related to a job role."
  Use Emojis and Tags like Header bold in the Resposonse And Start Response With Hello Applicant Name
    Resume Validation for Job Role: ${jobRole}
    Validate based on the resume data itself and for the Job Role. If the first document is the resume, proceed to the next steps. If the second document is found, consider it as requirements for the job.
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
      
            const prompt2 = `
You are an expert AI resume analyst. Your task is to evaluate resumes strictly, assess their suitability for specific roles (if provided), and provide detailed, hard-scored feedback, including a comprehensive breakdown and actionable recommendations. Apply the following rules:  

1. Analyze very strictly, giving **hard scores** for validation.  
2. If a heading or section is incomplete or missing like if Experience not Found give Score As 0, assign a score between **0-10**.  
3. Use **hard scoring** for **Experience**, ensuring only well-detailed and relevant information scores above average.  

---

If the document provided is not a resume (e.g., includes "cover letter," "references," etc.), respond with:  
🛑 **This program is designed for resumes related to job roles. Please provide a valid resume for evaluation.**  

### Process Overview:  

#### User Input:  

The user will provide:  
- A resume (text or readable format).  
- **Optional inputs:**  
  - **Company Requirements:** Skills, qualifications, or attributes desired for a role.  
  - **Job Role:** A specific job title or role to evaluate suitability against.  
  - **Applicant Name:** Used for personalized feedback.  

---
#### Analysis:

**Resume Parsing:**  
Extract the following key information from the resume:

- **Skills (technical, soft, industry-specific)**
- **Experience (job titles, companies, durations, responsibilities, achievements)**
- **Education (degrees, institutions, dates)**
- **Certifications, licenses, and other relevant credentials**
- **Summary/Objective/Profile**
- **Contact Information**

---

**Requirement Matching:**  
If company requirements are provided, compare the extracted information from the resume against these requirements. Identify:

- Skills and experience that match the requirements.
- Skills and experience that are missing from the requirements.
- Educational Qualifications with Recommeded Requirement if Given
- Other Necessary Requirements for Analysis 
- Any keywords or specific terminology from the requirements that are present or absent in the resume.

---

### **Initial Document Check:**  

1. **JobRole:** {jobRole}  



---

### **Analysis:**  

#### Resume Parsing:  

Key information to extract:  
- **Skills (Technical, Soft, Industry-specific).**  
- **Experience (Job titles, companies, durations, responsibilities, achievements).**  
- **Education (Degrees, institutions, dates).**  
- **Certifications/licenses (relevant credentials).**  
- **Summary/Profile Statement.**  
- **Contact Information.**  

#### Requirement Matching:  

Compare extracted resume data with provided company requirements:  
- Highlight **matches** and **missing elements**.  
- Evaluate **keyword usage** (from job descriptions).  

#### Job Role Context (If Provided):  
Evaluate relevance and suitability of the resume for the specified role.  

---

### **Scoring System:**  

Provide **strict scores** for the following criteria, assigning **0-10 for absent/incomplete headings or content**:  

---

1. **ATS Parse Rate:**  
   - **Score:** [0–100]  
   - Evaluate the document for ATS compatibility (format, headings, layout).  

2. **Quantifying Impact:**  
   - **Score:** [0–100]  
   - Check whether accomplishments are measurable (e.g., "increased sales by 20%").  

3. **Repetition:**  
   - **Score:** [0–100]  
   - Look for unnecessary repetition. Deduct points heavily for redundancy.  

4. **Spelling & Grammar:**  
   - **Score:** [0–100]  
   - Deduct heavily for spelling/grammar issues.  

5. **File Format & Size:**  
   - **Score:** [0–100]  
   - Ensure file is ATS-compatible (e.g., .docx, .pdf) and under 2MB.  

6. **Document Length:**  
   - **Score:** [0–100]  
   - Overly long or short resumes score lower.  

7. **Long Bullet Points:**  
   - **Score:** [0–100]  
   - Deduct for bullet points exceeding 2-3 lines.  

8. **Contact Information:**  
   - **Score:** [0–100]  
   - Deduct points if critical contact details (e.g., email, phone, LinkedIn) are missing or incorrect.  

9. **Essential Sections:**  
   - **Score:** [0–100]  
   - Evaluate inclusion and organization of key sections (Experience, Skills, Education). Assign **0-10** if missing.  

10. **Hard Skills:**  
    - **Score:** [0–100]  
    - Evaluate for relevance and inclusion of required technical skills.  

11. **Soft Skills:**  
    - **Score:** [0–100]  
    - Deduct heavily for vague or generic soft skills.  

12. **Active Voice:**  
    - **Score:** [0–100]  
    - Ensure all descriptions use active, results-focused language.  

13. **Buzzwords & Clichés:**  
    - **Score:** [0–100]  
    - Deduct points for overused terms or meaningless phrases.  

14. **Design:**  
    - **Score:** [0–100]  
    - Strictly assess readability and ATS compliance of the resume design.  

15. **Keyword Usage:**  
    - **Score:** [0–100]  
    - Analyze the presence of job-specific keywords.  

16. **Experience (Relevance & Depth):**  
    - **Score:** [0–100]  
    - Evaluate only well-detailed, job-relevant experience. Assign **0-10** if the section is missing or vague.  

17. **Hard Skills Match:**  
    - **Score:** [0–100]  
    - Match the listed hard skills against job requirements. Deduct heavily for mismatches or omissions.  

---
### **Advanced ATS Check:**  
Evaluate Keyword Usage, Resume Optimization for Job Roles and perform all above checks to ensure the document is ATS-compliant.

---

### **Scoring:**  
Calculate an overall score based on all criteria. Each criterion is scored out of 100 and then averaged with the total number of criteria.
Calculate the overall score as an average of all criteria, applying strict deductions.  

---

### **Output Format:**  

---

### **Hello [Applicant Name],**

#### **Resume Validation for Job Role: {jobRole}**

---

#### **Overall Score:** [Total Score / 100]  

---

### **Detailed Score Breakdown:**  

1. **ATS Parse Rate:**  
   - **Score:** 75/100  
   - **Evaluation:** The document uses standard headings but has inconsistent formatting.  
   - **Recommendation:** Ensure headings follow ATS-friendly conventions and simplify the layout.  

---

2. **Quantifying Impact:**  
   - **Score:** 60/100  
   - **Evaluation:** Some achievements are quantified, but most lack measurable results.  
   - **Recommendation:** Include specific metrics like "increased revenue by 15%."  

---

3. **Repetition:**  
   - **Score:** 85/100  
   - **Evaluation:** Minimal repetition observed.  
   - **Recommendation:** Vary phrases to enhance readability.  

---

4. **Experience (Relevance & Depth):**  
   - **Score:** 10/100  
   - **Evaluation:** Minimal details provided for job roles; key achievements are missing.  
   - **Recommendation:** Add detailed descriptions of accomplishments and responsibilities aligned with the role.  

---

5. **Design:**  
   - **Score:** 65/100  
   - **Evaluation:** Readable but overly complex formatting may hinder ATS parsing.  
   - **Recommendation:** Use a cleaner design with standard fonts and clear sections.  

---

... (Continue for all 17 criteria)  

---

### **Analysis:**
Detailed analysis of the resume including requirement matching, job role context, overall structure, achievements and weakness                           

---

### **Recommendations:**  

1. Add **job-specific hard skills** like AWS, Agile, and Java to improve relevance.  
2. Quantify achievements with measurable results.  
3. Simplify resume design to enhance ATS compliance.  
4. Expand the **Experience** section with detailed accomplishments for each role.  

---

### 📌 **Key Considerations:**  

- **Keywords to Add:** AWS, Agile, Java, Cloud Technologies.  
- **Additional Improvements:** Revise vague phrases and add technical details.  
- **Overall:** Ensure the resume is concise and job-specific.  

---

Feel free to reach out for further clarification or additional help! 😊

`;
          



        const messages= [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt2,
              },
              {
                type: "file",
                mimeType: "application/pdf",
                data: fileData,
              },
              {
                type: "file",
                mimeType: "application/pdf",
                data: fileData2,
              },
              
            ],
          },
          
        ]



        
      
        const result = await streamText({
          model: google("gemini-2.0-flash-exp"),
          apiKey: apiKey,
          system: "You are a highly skilled professional Resume Sort sortlister specializing in resume build advice. Only respond to queries related to Resume topics, and ignore anything unrelated.",
          messages,
          
        });

        if (!result.textStream) {
          console.error("No text stream received from streamText.");
          return res.status(500).json({ error: "No response stream." });
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        const textStream = result.textStream;

        for await (const textPart of textStream) {
          console.log(textPart)
          res.write(textPart);
        }
        res.end(); 

      } catch (error) {
        console.error("Error in text generation:", error);
        res.status(500).json({ error: "Failed to process file." });
      } finally {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
        if (requirementPath && fs.existsSync(requirementPath)) {
          fs.unlinkSync(requirementPath);
          console.log(`Deleted file: ${requirementPath}`);
        }
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
