import Link from "next/link";
import FeatureRail from "./shared/FeatureRail";

export default function Home() {
  return (
    <main className="container">
      <section className="hero reveal">
        <div className="bg-grid" />
        <div className="blob one" />
        <div className="blob two" />
        <div className="hero-inner">
          <h1 className="gradient-text">Supercharge Your Hiring With AI-Powered ATS</h1>
          <p>Analyze resumes, shortlist at scale, and match candidates to roles with precision.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/analyze" className="btn">Analyze Resume</Link>
            <Link href="/bulk" className="btn btn-outline">Bulk Shortlist</Link>
          </div>
        </div>
      </section>

      <div className="marquee" style={{ marginTop: 16 }}>
        <div className="marquee-track">
          <span>ATS Scoring</span>
          <span>Keyword Match</span>
          <span>Bulk Shortlisting</span>
          <span>JD Comparison</span>
          <span>Hard Scores</span>
          <span>Strict Analysis</span>
          <span>Resume Tips</span>
          <span>Fast Streaming</span>
        </div>
        <div className="marquee-track" aria-hidden>
          <span>ATS Scoring</span>
          <span>Keyword Match</span>
          <span>Bulk Shortlisting</span>
          <span>JD Comparison</span>
          <span>Hard Scores</span>
          <span>Strict Analysis</span>
          <span>Resume Tips</span>
          <span>Fast Streaming</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat reveal delay-1"><h3>10x</h3><p>Faster shortlisting</p></div>
        <div className="stat reveal delay-2"><h3>95%</h3><p>Keyword coverage</p></div>
        <div className="stat reveal delay-3"><h3>100+</h3><p>Resumes per batch</p></div>
      </div>

      <section className="section reveal">
        <div className="split">
          <div>
            <h2>Strict ATS Evaluation</h2>
            <p className="lead">Hard scoring, keyword matching and detailed recommendations tailored to your role.</p>
            <div className="stats">
              <div className="stat"><h3>100+</h3><p>Signals analyzed</p></div>
              <div className="stat"><h3>0-100</h3><p>Hard score output</p></div>
              <div className="stat"><h3>Instant</h3><p>Streaming results</p></div>
            </div>
          </div>
          <div className="feature-visual shine tilt">
            <div className="heatmap"></div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="split reverse">
          <div>
            <h2>Bulk Shortlisting</h2>
            <p className="lead">Upload many resumes, compare with JD, and get a ranked shortlist.</p>
            <div className="timeline">
              <div className="step"><h4>1. Upload</h4><p>Drop multiple PDFs and a requirement file.</p></div>
              <div className="step"><h4>2. Analyze</h4><p>We score each resume strictly against the role.</p></div>
              <div className="step"><h4>3. Review</h4><p>Get a ranked list with summaries and export options.</p></div>
            </div>
          </div>
          <div className="feature-visual shine tilt">
            <div className="ranklist">
              <div className="rank-row"><div className="rank-name" style={{width:'70%'}}></div><div className="rank-score" style={{width:60}}></div></div>
              <div className="rank-row"><div className="rank-name" style={{width:'56%'}}></div><div className="rank-score" style={{width:48}}></div></div>
              <div className="rank-row"><div className="rank-name" style={{width:'62%'}}></div><div className="rank-score" style={{width:40}}></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <h2>What You Can Do</h2>
        <p className="lead">Swipe through capabilities — optimized for speed and clarity.</p>
        <div className="rail-wrap">
          <FeatureRail>
            <div className="panel">
              <div className="sparkles" />
              <div className="icon">🔎</div>
              <span className="badge">Insights</span>
              <h3>Keyword Gap</h3>
              <p>Instantly find missing skills and terms vs JD.</p>
              <div className="progress" style={{"--to":"82%"}}><span /></div>
            </div>
            <div className="panel">
              <div className="sparkles" />
              <div className="icon">🧩</div>
              <span className="badge">Design</span>
              <h3>Formatting Tips</h3>
              <p>Actionable design guidance for ATS compatibility.</p>
              <div className="progress" style={{"--to":"68%"}}><span /></div>
            </div>
            <div className="panel">
              <div className="sparkles" />
              <div className="icon">🏆</div>
              <span className="badge">Scoring</span>
              <h3>Experience Depth</h3>
              <p>Strict scoring for relevance and achievements.</p>
              <div className="progress" style={{"--to":"76%"}}><span /></div>
            </div>
            <div className="panel">
              <div className="sparkles" />
              <div className="icon">📤</div>
              <span className="badge">Workflow</span>
              <h3>Export Results</h3>
              <p>CSV export and shareable links for teams.</p>
              <div className="progress" style={{"--to":"90%"}}><span /></div>
            </div>
            <div className="panel">
              <div className="sparkles" />
              <div className="icon">📄</div>
              <span className="badge">Speed</span>
              <h3>Templates</h3>
              <p>Role presets to speed up evaluation setup.</p>
              <div className="progress" style={{"--to":"70%"}}><span /></div>
            </div>
          </FeatureRail>
        </div>
      </section>

      <div className="features-list">
        <div className="feature-row reveal delay-1">
          <div className="chip">🧪</div>
          <div className="feature-content">
            <h3>Single Resume Analyzer</h3>
            <p>Upload a resume with optional JD and get strict ATS scoring.</p>
          </div>
          <Link href="/analyze" className="feature-cta">Open Analyzer →</Link>
        </div>

        <div className="feature-row reveal delay-2">
          <div className="chip">📦</div>
          <div className="feature-content">
            <h3>Bulk Shortlisting</h3>
            <p>Upload multiple resumes, add a requirement, and rank candidates.</p>
          </div>
          <Link href="/bulk" className="feature-cta">Start Bulk Upload →</Link>
        </div>

        <div className="feature-row reveal delay-3">
          <div className="chip">🔎</div>
          <div className="feature-content">
            <h3>Keyword Gap & Suggestions</h3>
            <p>Identify missing keywords vs role and get improvement tips.</p>
        </div>
          <Link href="/analyze" className="feature-cta">Run Check →</Link>
          </div>

        <div className="feature-row reveal delay-1">
          <div className="chip">📄</div>
          <div className="feature-content">
            <h3>Role Templates</h3>
            <p>Pick role presets to auto-fill requirements for fast analysis.</p>
            </div>
          <Link href="/analyze" className="feature-cta">Browse Templates →</Link>
        </div>

        <div className="feature-row reveal delay-2">
          <div className="chip">📤</div>
          <div className="feature-content">
            <h3>Export & Share</h3>
            <p>Export ranked results as CSV or share a link with recruiters.</p>
              </div>
          <Link href="/bulk" className="feature-cta">Export Options →</Link>
          </div>

        <div className="feature-row reveal delay-3">
          <div className="chip">💡</div>
          <div className="feature-content">
            <h3>Tips & Best Practices</h3>
            <p>Get curated guidance to improve resumes and job descriptions.</p>
      </div>
          <Link href="/analyze" className="feature-cta">Read Tips →</Link>
      </div>
    </div>
    </main>
  );
}
