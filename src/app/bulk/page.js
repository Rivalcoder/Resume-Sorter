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
        <h1 className="gradient-text fade-in-up">Bulk Shortlisting</h1>
        <p className="muted fade-in-up" style={{animationDelay:'120ms'}}>Upload multiple resumes and get ranked results.</p>
      </section>

      <div className="grid-2 smooth-gap" style={{marginTop:16}}>
        <div className="upload-card card-hover fade-in-up">
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Resumes</strong>
            <span className="pill">Multiple PDFs</span>
          </div>
          <div className="upload-target dropzone">
            <input type="file" multiple accept="application/pdf" onChange={onFilesChange} />
            <div className="muted">Select or drop files</div>
          </div>
        </div>

        <div className="upload-card card-hover fade-in-up" style={{animationDelay:'120ms'}}>
          <div className="inline" style={{justifyContent:'space-between'}}>
            <strong>Requirement (optional)</strong>
            <span className="pill">PDF</span>
          </div>
          <div className="upload-target dropzone">
            <input type="file" accept="application/pdf" onChange={(e)=>setRequirement(e.target.files?.[0]||null)} />
            <div className="muted">Select or drop file</div>
          </div>
        </div>
      </div>

      <div className="actions-row fade-in-up" style={{animationDelay:'160ms'}}>
        <input className="text-input-1" placeholder="Job role (optional)" value={jobRole} onChange={(e)=>setJobRole(e.target.value)} />
        <button className="btn btn-modern pulse" onClick={handleBulk} disabled={isLoading}>{isLoading?"Processing...":"Process"}</button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {results.length>0 && (
        <section className="section">
          <h2>Ranked Candidates</h2>
          <div className="cards">
            {results.map((r, idx)=>(
              <article key={idx} className="result-card rise-in" style={{animationDelay: `${idx*60}ms`}}>
                <div className="inline" style={{justifyContent:'space-between'}}>
                  <strong>{r.name || r.fileName || `Candidate ${idx+1}`}</strong>
                  <span className="pill">Score</span>
                </div>
                <div className="score" style={{marginTop:8}}><span style={{"--w": `${Math.max(0, Math.min(100, r.score || 0))}%`}} /></div>
                {r.summary && <p className="muted" style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{r.summary}</p>}
              </article>
            ))}
          </div>

          <div className="collage fade-in-up" style={{marginTop: 24}}>
            <div className="chip" title="Fast">⚡ Speed</div>
            <div className="chip" title="Accuracy">🎯 Accuracy</div>
            <div className="chip" title="ATS">🧠 ATS</div>
            <div className="chip" title="Share">🔗 Share</div>
            <div className="chip" title="Export">📄 Export</div>
            <div className="chip" title="Rank">🏁 Rank</div>
          </div>
        </section>
      )}

      <section className="section section-centered">
        <h2>How We Rank</h2>
        <div className="criteria">
          <div className="criterion fade-in-up"><div className="icon">🔑</div><h4>Keyword Match</h4><p>Required skills and domain terms found in resume.</p><div className="bar"><span style={{"--w":"86%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'90ms'}}><div className="icon">🎯</div><h4>Role Fit</h4><p>Experience relevancy to the target job role.</p><div className="bar"><span style={{"--w":"74%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'180ms'}}><div className="icon">🏗️</div><h4>Structure</h4><p>Clear sections and ATS friendly formatting.</p><div className="bar"><span style={{"--w":"70%"}} /></div></div>
          <div className="criterion fade-in-up" style={{animationDelay:'270ms'}}><div className="icon">📈</div><h4>Impact</h4><p>Quantified achievements and outcomes.</p><div className="bar"><span style={{"--w":"68%"}} /></div></div>
        </div>
        <Accordion
          items={[
            { icon: "🔑", title: "Keyword Match", desc: "We look for high-signal skills in the JD.", points: ["Tech/domain keywords", "Certifications", "Tooling experience"] },
            { icon: "🎯", title: "Role Fit", desc: "Experience aligned to responsibilities.", points: ["Relevant projects", "Impact on similar domains"] },
            { icon: "📈", title: "Impact", desc: "Quantified results and clear outcomes.", points: ["% improvements", "Revenue/time savings"] },
          ]}
        />
        <div className="timeline-fancy timeline-animated" style={{textAlign:'left'}}>
          <div className="tl-step"><div className="tl-emoji">📥</div><div className="tl-title">Ingest</div><div className="tl-desc">Upload resumes and JD.</div></div>
          <div className="tl-step"><div className="tl-emoji">🧮</div><div className="tl-title">Score</div><div className="tl-desc">Strict evaluation across criteria.</div></div>
          <div className="tl-step"><div className="tl-emoji">🏁</div><div className="tl-title">Rank</div><div className="tl-desc">Sorted list with summaries.</div></div>
        </div>

        <div className="showcase">
          <div className="highlight floaty"><h4>Fast Batches</h4><p>Upload 100+ resumes per run.</p></div>
          <div className="highlight floaty" style={{animationDelay:'120ms'}}><h4>Share Results</h4><p>Export CSV or share with your team.</p></div>
          <div className="highlight floaty" style={{animationDelay:'240ms'}}><h4>Role Presets</h4><p>Start with templates for common roles.</p></div>
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
        @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>
    </main>
  );
}


