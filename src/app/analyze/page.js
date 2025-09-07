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
        <h1 className="gradient-text fade-in-up">Single Resume Analyzer</h1>
        <p className="muted fade-in-up" style={{animationDelay:'120ms'}}>Upload a resume with optional JD and get strict ATS scoring.</p>
      </section>

      <div className="grid-2 smooth-gap" style={{marginTop:16}}>
        <div className="upload-card card-hover fade-in-up">
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
        <div className="upload-target dropzone" onClick={()=>document.getElementById('fileInput')?.click()}>
          {fileName ? `Selected: ${fileName}` : 'Drop your resume here or click to upload'}
        </div>
        </div>

        <div className="upload-card card-hover fade-in-up" style={{animationDelay:'120ms'}}>
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Requirement (optional)</strong>
            <span className="pill">PDF</span>
          </div>
          <input type="file" id="fileInput1" onChange={handleFileChange2} style={{ display: "none" }} />
          <div className="upload-target dropzone" onClick={()=>document.getElementById('fileInput1')?.click()}>
            {fileName1 ? `Selected: ${fileName1}` : 'Drop requirement here or click to upload'}
          </div>
        </div>
      </div>

      <div className="actions-row fade-in-up" style={{animationDelay:'160ms'}}>
        <input
          type="text"
          placeholder="Specify The Job Role..."
          className="text-input-1"
          onChange={(e) => { setText(e.target.value); }}
        />
        <button onClick={change} className="btn btn-modern pulse">Analyze</button>
      </div>

      {(isLoading || response) && (
        <div className="cards" style={{ marginTop: 20 }}>
          {isLoading && (
            <article className="result-card shimmer"><div className="muted">Analyzing...</div></article>
          )}
          {error && <article className="result-card"><div className="muted">{error}</div></article>}
          {response && (
            <article className="result-card rise-in">
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
          <div className="criterion fade-in-up"><div className="icon">🧠</div><h4>ATS Parse Rate</h4><p>Proper headings, layout and ATS-friendly structure.</p><div className="bar"><span style={{"--w":"78%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'90ms'}}><div className="icon">📊</div><h4>Quantifying Impact</h4><p>Accomplishments with clear, measurable results.</p><div className="bar"><span style={{"--w":"65%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'180ms'}}><div className="icon">✍️</div><h4>Spelling & Grammar</h4><p>Language quality and consistency.</p><div className="bar"><span style={{"--w":"88%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'270ms'}}><div className="icon">🧱</div><h4>Essential Sections</h4><p>Experience, Skills, Education and more.</p><div className="bar"><span style={{"--w":"72%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'360ms'}}><div className="icon">⚙️</div><h4>Hard Skills</h4><p>Role-aligned technical and domain skills.</p><div className="bar"><span style={{"--w":"80%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'450ms'}}><div className="icon">💬</div><h4>Soft Skills</h4><p>Clarity and specificity of interpersonal skills.</p><div className="bar"><span style={{"--w":"60%"}} /></div></div>
        </div>
        <Accordion
          items={[
            { icon: "🧠", title: "ATS Parse Rate", desc: "We ensure your resume structure is ATS-friendly.", points: ["Standard headings", "Simple layout", "Machine readable"] },
            { icon: "📊", title: "Quantifying Impact", desc: "Metrics make achievements stand out.", points: ["Include numbers", "Outcomes over duties"] },
            { icon: "✍️", title: "Spelling & Grammar", desc: "Language quality and consistency improves screening.", points: ["No typos", "Consistent tense"] },
          ]}
        />
        <div className="timeline-fancy timeline-animated" style={{textAlign:'left'}}>
          <div className="tl-step"><div className="tl-emoji">📤</div><div className="tl-title">Upload</div><div className="tl-desc">Add resume and optional JD.</div></div>
          <div className="tl-step"><div className="tl-emoji">⚙️</div><div className="tl-title">Analyze</div><div className="tl-desc">Strict scoring across all criteria.</div></div>
          <div className="tl-step"><div className="tl-emoji">✅</div><div className="tl-title">Results</div><div className="tl-desc">Actionable insights and improvements.</div></div>
        </div>

        <div className="showcase">
          <div className="highlight floaty"><h4>Keyword Tips</h4><p>Suggested terms to add for the role.</p></div>
          <div className="highlight floaty" style={{animationDelay:'120ms'}}><h4>Design Hints</h4><p>Make your resume more ATS-friendly.</p></div>
          <div className="highlight floaty" style={{animationDelay:'240ms'}}><h4>Action Verbs</h4><p>Improve clarity with powerful verbs.</p></div>
        </div>
        <div className="collage fade-in-up" style={{marginTop: 24}}>
          <div className="chip" title="Clarity">✨ Clarity</div>
          <div className="chip" title="Impact">📈 Impact</div>
          <div className="chip" title="Structure">🧱 Structure</div>
          <div className="chip" title="ATS">🧠 ATS</div>
          <div className="chip" title="Grammar">✍️ Grammar</div>
          <div className="chip" title="Keywords">🔎 Keywords</div>
        </div>
      </section>
      <style jsx>{`
        .smooth-gap { gap: 18px; }
        .fade-in-up { opacity: 0; transform: translateY(8px); animation: fadeUp .5s ease forwards; }
        .rise-in { opacity: 0; transform: translateY(10px) scale(.98); animation: rise .45s ease forwards; }
        .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,.08); }
        .dropzone { border: 2px dashed rgba(0,0,0,.1); border-radius: 12px; padding: 14px; transition: background .2s ease, border-color .2s ease; }
        .dropzone:hover { background: rgba(0,0,0,.03); border-color: rgba(0,0,0,.2); }
        .pulse { position: relative; }
        .pulse:after { content: ""; position: absolute; inset: -4px; border-radius: 12px; border: 2px solid currentColor; opacity: 0; animation: pulse 1.6s ease infinite; pointer-events: none; }
        .shimmer { position: relative; overflow: hidden; }
        .shimmer:before { content: ""; position: absolute; inset: 0; background: linear-gradient(110deg, rgba(0,0,0,0) 20%, rgba(0,0,0,.04) 45%, rgba(0,0,0,0) 70%); transform: translateX(-100%); animation: shimmer 1.2s linear infinite; }
        .actions-row { display: flex; flex-direction: column; gap: 10px; align-items: center; margin-top: 10px; }
        .actions-row .text-input-1 { width: clamp(260px, 40vw, 420px); padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(0,0,0,.12); background: linear-gradient(180deg, #fff, #fafafa); box-shadow: 0 2px 8px rgba(0,0,0,.04) inset; transition: box-shadow .2s ease, border-color .2s ease; }
        .actions-row .text-input-1:focus { outline: none; border-color: rgba(99,102,241,.6); box-shadow: 0 0 0 4px rgba(99,102,241,.15), 0 2px 8px rgba(0,0,0,.04) inset; }
        .actions-row .btn-modern { width: clamp(180px, 30vw, 420px); padding: 12px 16px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: 1px solid rgba(0,0,0,.08); color: #fff; box-shadow: 0 8px 18px rgba(99,102,241,.25); transition: transform .15s ease, box-shadow .2s ease, filter .2s ease; }
        .actions-row .btn-modern:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(99,102,241,.3); filter: brightness(1.02); }
        .actions-row .btn-modern:active { transform: translateY(0); }
        .actions-row .btn-modern:disabled { opacity: .8; filter: grayscale(.1); }
        .collage { display: grid; grid-template-columns: repeat(6, minmax(80px, 1fr)); gap: 10px; }
        .chip { background: linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.02)); border: 1px solid rgba(0,0,0,.08); padding: 10px 12px; border-radius: 999px; text-align: center; font-weight: 600; box-shadow: 0 6px 16px rgba(0,0,0,.05); animation: pop .5s ease both; }
        .chip:nth-child(1) { animation-delay: 0ms; }
        .chip:nth-child(2) { animation-delay: 60ms; }
        .chip:nth-child(3) { animation-delay: 120ms; }
        .chip:nth-child(4) { animation-delay: 180ms; }
        .chip:nth-child(5) { animation-delay: 240ms; }
        .chip:nth-child(6) { animation-delay: 300ms; }
        .timeline-animated .tl-step { position: relative; opacity: 0; transform: translateY(6px); animation: fadeUp .5s ease forwards; }
        .timeline-animated .tl-step:nth-child(1) { animation-delay: 0ms; }
        .timeline-animated .tl-step:nth-child(2) { animation-delay: 120ms; }
        .timeline-animated .tl-step:nth-child(3) { animation-delay: 240ms; }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes rise { to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pop { 0% { transform: scale(.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0% { opacity: .45; transform: scale(1); } 100% { opacity: 0; transform: scale(1.15); } }
        @keyframes shimmer { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }
        @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </main>
  );
}


