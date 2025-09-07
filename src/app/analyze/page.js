"use client";
import "../home.css";
import { useState } from "react";
import { marked } from "marked";
import Accordion from "../shared/Accordion";

export default function AnalyzePage() {
  const [fileName, setFileName] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [text, setText] = useState("Not Specified");

  const criteria = [
    "ATS Parse Rate: Assess how well the resume adheres to ATS standards.",
    "Quantifying Impact: Check if achievements are measurable with quantifiable results.",
    "Repetition: Identify repeated phrases or overused terms.",
    "Spelling & Grammar: Highlight any errors in spelling or grammar.",
    "File Format & Size: Determine whether the resume is compatible with ATS systems.",
    "Resume Length: Evaluate if the length is appropriate (e.g., 1-2 pages for most jobs).",
    "Long Bullet Points: Check if bullet points are concise and action-oriented.",
    "Contact Information: Verify the presence and accuracy of essential details (email, phone, LinkedIn).",
    "Essential Sections: Confirm if standard sections like Skills, Experience, and Education are included.",
    "Hard Skills: Evaluate the relevance of hard skills listed (e.g., technical proficiencies).",
    "Soft Skills: Assess the clarity and relevance of soft skills included.",
    "Active Voice: Check if bullet points use active voice instead of passive voice.",
    "Buzzwords & Clichés: Identify overused buzzwords or vague terms and suggest replacements.",
    "Design: Review the design for readability and ATS compatibility.",
  ];

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileName("");
      setError("No file selected.");
      return;
    }
    setFileName(file.name);
    setError("");
    setResponse("");
    setFile1(file);
  };

  const handleFileChange2 = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileName1("");
      setError("No file selected.");
      return;
    }
    setFileName1(file.name);
    setError("");
    setResponse("");
    setFile2(file);
  };

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("resume", file1);
    if (file2) formData.append("requirement", file2);
    else formData.append("requirement", "Not Specified Here");
    formData.append("jobrole", text);

    try {
      setIsLoading(true);
      const res = await fetch("/api/server", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload the file.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let result = '';

      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        result += decoder.decode(value, { stream: true });
        setIsLoading(false);
        setResponse(result);
      }
      
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process your resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const change = async () => {
    handleSubmit();
  };

  function handle_request() {
    setCheck(!check);
  }

  return (
    <main className="container">
      <section className="page-hero">
        <h1 className="gradient-text">Single Resume Analyzer</h1>
        <p>Upload a resume with optional JD and get strict ATS scoring.</p>
      </section>

      <div className="grid-2" style={{marginTop:16}}>
        <div className="upload-card">
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Resume</strong>
            <span className="pill">PDF</span>
          </div>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="upload-target" onClick={()=>document.getElementById('fileInput')?.click()}>
          {fileName ? `Selected: ${fileName}` : 'Drop your resume here or click to upload'}
        </div>
        </div>

        <div className="upload-card">
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Requirement (optional)</strong>
            <span className="pill">PDF</span>
          </div>
          <input type="file" id="fileInput1" onChange={handleFileChange2} style={{ display: "none" }} />
          <div className="upload-target" onClick={()=>document.getElementById('fileInput1')?.click()}>
            {fileName1 ? `Selected: ${fileName1}` : 'Drop requirement here or click to upload'}
          </div>
          <div className="actions">
            <input
              type="text"
              placeholder="Specify The Job Role..."
              className="text-input-1"
              onChange={(e) => { setText(e.target.value); }}
            />
            <button onClick={change} className="btn">Analyze</button>
          </div>
        </div>
      </div>

      {(isLoading || response) && (
        <div className="cards" style={{ marginTop: 20 }}>
          {isLoading && (
            <article className="result-card"><div className="muted">Analyzing...</div></article>
          )}
          {error && <article className="result-card"><div className="muted">{error}</div></article>}
          {response && (
            <article className="result-card">
              <div
                className="success"
                dangerouslySetInnerHTML={{ __html: marked(response) }}
              />
            </article>
          )}
        </div>
      )}

      <section className="section section-centered">
        <h2>Criteria We Check</h2>
        <div className="criteria">
          <div className="criterion"><div className="icon">🧠</div><h4>ATS Parse Rate</h4><p>Proper headings, layout and ATS-friendly structure.</p><div className="bar"><span style={{"--w":"78%"}} /></div></div>
          <div className="criterion"><div className="icon">📊</div><h4>Quantifying Impact</h4><p>Accomplishments with clear, measurable results.</p><div className="bar"><span style={{"--w":"65%"}} /></div></div>
          <div className="criterion"><div className="icon">✍️</div><h4>Spelling & Grammar</h4><p>Language quality and consistency.</p><div className="bar"><span style={{"--w":"88%"}} /></div></div>
          <div className="criterion"><div className="icon">🧱</div><h4>Essential Sections</h4><p>Experience, Skills, Education and more.</p><div className="bar"><span style={{"--w":"72%"}} /></div></div>
          <div className="criterion"><div className="icon">⚙️</div><h4>Hard Skills</h4><p>Role-aligned technical and domain skills.</p><div className="bar"><span style={{"--w":"80%"}} /></div></div>
          <div className="criterion"><div className="icon">💬</div><h4>Soft Skills</h4><p>Clarity and specificity of interpersonal skills.</p><div className="bar"><span style={{"--w":"60%"}} /></div></div>
        </div>
        <Accordion
          items={[
            { icon: "🧠", title: "ATS Parse Rate", desc: "We ensure your resume structure is ATS-friendly.", points: ["Standard headings", "Simple layout", "Machine readable"] },
            { icon: "📊", title: "Quantifying Impact", desc: "Metrics make achievements stand out.", points: ["Include numbers", "Outcomes over duties"] },
            { icon: "✍️", title: "Spelling & Grammar", desc: "Language quality and consistency improves screening.", points: ["No typos", "Consistent tense"] },
          ]}
        />
        <div className="timeline-fancy" style={{textAlign:'left'}}>
          <div className="tl-step"><div className="tl-emoji">📤</div><div className="tl-title">Upload</div><div className="tl-desc">Add resume and optional JD.</div></div>
          <div className="tl-step"><div className="tl-emoji">⚙️</div><div className="tl-title">Analyze</div><div className="tl-desc">Strict scoring across all criteria.</div></div>
          <div className="tl-step"><div className="tl-emoji">✅</div><div className="tl-title">Results</div><div className="tl-desc">Actionable insights and improvements.</div></div>
        </div>

        <div className="showcase">
          <div className="highlight"><h4>Keyword Tips</h4><p>Suggested terms to add for the role.</p></div>
          <div className="highlight"><h4>Design Hints</h4><p>Make your resume more ATS-friendly.</p></div>
          <div className="highlight"><h4>Action Verbs</h4><p>Improve clarity with powerful verbs.</p></div>
        </div>
      </section>
    </main>
  );
}


