"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored || document.documentElement.getAttribute("data-theme") || "light";
    if (document.documentElement.getAttribute("data-theme") !== initial) {
      document.documentElement.setAttribute("data-theme", initial);
    }
    setTheme(initial);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="brand brand-animated">ATS Resume Suite</Link>
        <div className="nav-links">
          <Link href="/analyze" className="nav-link">Analyze</Link>
          <Link href="/bulk" className="nav-link">Bulk</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}


