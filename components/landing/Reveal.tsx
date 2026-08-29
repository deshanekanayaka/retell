"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Entrance motion, exactly the budget docs/07 section 5.5 grants the marketing
// surface: opacity plus a rise of at most 16px, ease-out, fired once.
//
// The element is only hidden from inside the effect, and only when it is still
// below the viewport at that moment. That ordering is the accessibility
// floor: with JavaScript unavailable nothing was ever hidden, and content
// already on screen at load (the hero) never blinks out to animate back in.
// Reduced motion is handled twice over: the effect bails, and the CSS classes
// are inert inside the media query in case the preference changes mid-visit.
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("reveal-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
