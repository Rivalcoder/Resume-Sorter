"use client";
import { useState } from "react";
import Accordion from "../shared/Accordion";

export default function BulkPage() {
  const [files, setFiles] = useState([]);
  const [requirement, setRequirement] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function onFilesChange(e) {
    setFiles(Array.from(e.target.files || []));
  }

  async function handleBulk() {
    if (!files.length) { setError("Please select at least one resume."); return; }
    setIsLoading(true); setError(""); setResults([]);

    const formData = new FormData();
    files.forEach((f) => formData.append("resumes", f));
    if (requirement) formData.append("requirement", requirement);
    if (jobRole) formData.append("jobrole", jobRole);

    const res = await fetch("/api/bulk", { method: "POST", body: formData });
    if (!res.ok) { setIsLoading(false); setError("Bulk processing failed"); return; }
    const json = await res.json();
    setResults(json.results || []);
    setIsLoading(false);
  }

  return (
    <main className="container">
      <section className="page-hero">
        <h1 className="gradient-text">Bulk Shortlisting</h1>
        <p>Upload multiple resumes and get ranked results.</p>
      </section>

      <div className="grid-2" style={{marginTop:16}}>
        <div className="upload-card">
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Resumes</strong>
            <span className="pill">Multiple PDFs</span>
          </div>
          <div className="upload-target">
            <input type="file" multiple accept="application/pdf" onChange={onFilesChange} />
            <div className="muted">Select or drop files</div>
          </div>
        </div>

        <div className="upload-card">
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Requirement (optional)</strong>
            <span className="pill">PDF</span>
          </div>
          <div className="upload-target">
            <input type="file" accept="application/pdf" onChange={(e)=>setRequirement(e.target.files?.[0]||null)} />
            <div className="muted">Select or drop file</div>
          </div>
          <div className="actions">
            <input className="text-input-1" placeholder="Job role (optional)" value={jobRole} onChange={(e)=>setJobRole(e.target.value)} />
            <button className="btn" onClick={handleBulk} disabled={isLoading}>{isLoading?"Processing...":"Process"}</button>
          </div>
        </div>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {results.length>0 && (
        <section className="section">
          <h2>Ranked Candidates</h2>
          <div className="cards">
            {results.map((r, idx)=>(
              <article key={idx} className="result-card">
                <div className="inline" style={{justifyContent:'space-between'}}>
                  <strong>{r.name || r.fileName || `Candidate ${idx+1}`}</strong>
                  <span className="pill">Score</span>
                </div>
                <div className="score" style={{marginTop:8}}><span style={{"--w": `${Math.max(0, Math.min(100, r.score || 0))}%`}} /></div>
                {r.summary && <p className="muted" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{r.summary}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section section-centered">
        <h2>How We Rank</h2>
        <div className="criteria">
          <div className="criterion"><div className="icon">🔑</div><h4>Keyword Match</h4><p>Required skills and domain terms found in resume.</p><div className="bar"><span style={{"--w":"86%"}} /></div></div>
          <div className="criterion"><div className="icon">🎯</div><h4>Role Fit</h4><p>Experience relevancy to the target job role.</p><div className="bar"><span style={{"--w":"74%"}} /></div></div>
          <div className="criterion"><div className="icon">🏗️</div><h4>Structure</h4><p>Clear sections and ATS friendly formatting.</p><div className="bar"><span style={{"--w":"70%"}} /></div></div>
          <div className="criterion"><div className="icon">📈</div><h4>Impact</h4><p>Quantified achievements and outcomes.</p><div className="bar"><span style={{"--w":"68%"}} /></div></div>
        </div>
        <Accordion
          items={[
            { icon: "🔑", title: "Keyword Match", desc: "We look for high-signal skills in the JD.", points: ["Tech/domain keywords", "Certifications", "Tooling experience"] },
            { icon: "🎯", title: "Role Fit", desc: "Experience aligned to responsibilities.", points: ["Relevant projects", "Impact on similar domains"] },
            { icon: "📈", title: "Impact", desc: "Quantified results and clear outcomes.", points: ["% improvements", "Revenue/time savings"] },
          ]}
        />
        <div className="timeline-fancy" style={{textAlign:'left'}}>
          <div className="tl-step"><div className="tl-emoji">📥</div><div className="tl-title">Ingest</div><div className="tl-desc">Upload resumes and JD.</div></div>
          <div className="tl-step"><div className="tl-emoji">🧮</div><div className="tl-title">Score</div><div className="tl-desc">Strict evaluation across criteria.</div></div>
          <div className="tl-step"><div className="tl-emoji">🏁</div><div className="tl-title">Rank</div><div className="tl-desc">Sorted list with summaries.</div></div>
        </div>

        <div className="showcase">
          <div className="highlight"><h4>Fast Batches</h4><p>Upload 100+ resumes per run.</p></div>
          <div className="highlight"><h4>Share Results</h4><p>Export CSV or share with your team.</p></div>
          <div className="highlight"><h4>Role Presets</h4><p>Start with templates for common roles.</p></div>
        </div>
      </section>
    </main>
  );
}


