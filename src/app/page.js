"use client";
import "./home.css";
import { useState } from "react";
import { marked } from "marked";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [text, setText] = useState("");

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
    if (!text) {
      alert("Please Specify The Job Role To Validate Resume");
      return;
    }
  
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
        
        console.log('Received chunk:', result);
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
    <div className="home-container">
      <div className="left-section">
        <h1 className="head">Resume Analyser</h1>
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
        <div>
          <div className="input-box-2">
            <input
              type="checkbox"
              value={check}
              onChange={handle_request}
              className="checkbox1"
            />
            <p>If There Any Company Released Requirement File</p>
          </div>
          {check && (
            <div className="input-box">
              <input
                type="file"
                id="fileInput1"
                onChange={handleFileChange2}
                style={{ display: "none" }}
              />
              <p>Drop Requirement here or choose a file.</p>
              <label htmlFor="fileInput1" className="custom-file-label">
                Upload Company Requirements Here
              </label>
              {fileName1 && <p className="selected-file">Selected File: {fileName1}</p>}
            </div>
          )}
        </div>
        <div className="boxer">
          <input
            type="text"
            placeholder="Specify The Job Roles You Are Applying..."
            className="text-input-1"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <button onClick={change} className="button-1">
            Submit
          </button>
        </div>

        {(isLoading || response) && (
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
        )}
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
