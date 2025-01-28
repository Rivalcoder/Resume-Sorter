export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Transfer-Encoding", "chunked");

  const chunks = ["Hello", " ", "streaming", " ", "data!"];
  (async function streamChunks() {
    for (const chunk of chunks) {
      res.write(chunk);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    res.end();
  })();
}
