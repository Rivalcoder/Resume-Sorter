"use client";
import "./home.css";
import { useState } from "react";
import { marked } from "marked";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/server", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload the file.");
      }

      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process your resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="left-section">
        <h1 className="head">Resume Checker</h1>
        <h3 className="subhead">
          Upload your resume and get instant feedback on your chances of getting hired!
        </h3>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="input-box">
          <p>Drop your resume here or choose a file.</p>
          <label htmlFor="fileInput" className="custom-file-label">
            Upload Resume Here
          </label>
          {fileName && <p className="selected-file">Selected File: {fileName}</p>}
        </div>
        <div className="response">
          {isLoading && (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          {response && (
            <div
              className="success"
              dangerouslySetInnerHTML={{ __html: marked(response) }}
            />
          )}
        </div>
      </div>
      <div className="right-section">
        <h3>Resume Evaluation Criteria</h3>
        <ul>
          {criteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
 