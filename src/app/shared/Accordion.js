"use client";
import { useState } from "react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="accordion">
      {items.map((it, idx) => (
        <div className="acc-item" key={idx}>
          <div className="acc-header" onClick={() => setOpen(open===idx?null:idx)}>
            <div className="acc-icon">{it.icon}</div>
            <div className="acc-title">{it.title}</div>
          </div>
          {open===idx && (
            <div className="acc-body">
              <div>{it.desc}</div>
              {it.points && (
                <ul className="acc-points">
                  {it.points.map((p, i)=>(<li key={i}>{p}</li>))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


