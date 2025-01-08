"use client";
import "./home.css";
import { useState } from "react";
import { marked } from "marked";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileName("");
      setError("No file selected.");
      return;
    }

    setFileName(file.name);
    setError(""); // Clear any previous errors
    setResponse(""); // Reset previous response
    setIsLoading(true); // Set loading state to true

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
      setResponse(data.message || "File uploaded successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to process your resume. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Convert the Markdown response to HTML
  const getFormattedResponse = (response) => {
    return marked(response);
  };

  return (
    <div className="home-body">
      <div>
        <h1 className="head">Resume Checker</h1>
      </div>
      <div>
        <h3>Upload your resume and get instant feedback on your chances of getting hired!</h3>
      </div>
      <div>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="input-box">
          <p>Drop your resume here or choose a file.</p>
          <label htmlFor="fileInput" className="custom-file-label">
            Upload Resume Here..
          </label>
          {fileName && <p>Selected File: {fileName}</p>}
        </div>
      </div>
      <div className="response">
        {isLoading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )} {/* Display loader animation */}
        {error && <p className="error">{error}</p>}
        {response && (
          <div
            className="success"
            dangerouslySetInnerHTML={{ __html: getFormattedResponse(response) }}
          />
        )}
      </div>
    </div>
  );
}
