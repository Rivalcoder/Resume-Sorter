"use client";
import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "system", content: "Hi! Ask me about resume tips, ATS and bulk shortlisting." }]);
  const [typing, setTyping] = useState(false);
  const panelRef = useRef(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((m)=>[...m, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMessages((m)=>[...m, { role: "assistant", content: data.reply || "" }]);
    } catch {
      setMessages((m)=>[...m, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally { setTyping(false); }
  }

  useEffect(()=>{
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, messages]);

  return (
    <>
      <button
        className="chat-fab"
        aria-label="Open chat"
        onClick={()=>setOpen((v)=>!v)}
      >
        💬
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">Assistant <button className="chat-close" onClick={()=>setOpen(false)}>✕</button></div>
          <div className="chat-body" ref={panelRef}>
            {messages.map((m, i)=> (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="bubble">{m.content}</div>
              </div>
            ))}
            {typing && (
              <div className="typing"><span className="dotty"></span><span className="dotty"></span><span className="dotty"></span></div>
            )}
          </div>
          <div className="chat-input">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type your message..." onKeyDown={(e)=>{ if(e.key==='Enter') sendMessage(); }} />
            <button className="btn" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}


