"use client";
import { useEffect, useRef, useState } from "react";

export default function FeatureRail({ children }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onScroll() {
      const panels = Array.from(el.children);
      const { scrollLeft, clientWidth } = el;
      const idx = Math.round(scrollLeft / (clientWidth * 0.85));
      setActive(Math.max(0, Math.min(idx, panels.length - 1)));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className="rail" ref={ref}>{children}</div>
      <div className="dots">
        {Array.from({ length: Array.isArray(children) ? children.length : 0 }).map((_, i) => (
          <span key={i} className={`dot${i===active?" active":""}`}></span>
        ))}
      </div>
    </div>
  );
}


