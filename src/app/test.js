"use client"

import { useState } from "react";

export default function StreamedData() {
  const [data, setData] = useState("");

  const fetchStream = async () => {
    const response = await fetch("/api/ser");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setData((prev) => prev + decoder.decode(value));
    }
  };

  return (
    <div>
      <button onClick={fetchStream}>Start Streaming</button>
      <pre>{data}</pre>
    </div>
  );
}
