"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  fading: boolean;
  onEnter: () => void;
}

const LINES = [
  { text: "Your hands are sweaty.", style: "" },
  { text: "Your heart is racing.", style: "text-rose" },
  { text: "Welcome — you're in the right place, Maria.", style: "font-semibold not-italic mt-3" },
];

export default function WelcomeScreen({ fading, onEnter }: Props) {
  const [typed, setTyped] = useState<string[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setTyped([""]);
  }, []);

  useEffect(() => {
    if (lineIdx >= LINES.length) {
      setTimeout(() => setShowButton(true), 400);
      return;
    }
    if (typed.length === 0) return;

    const line = LINES[lineIdx];
    if (charIdx < line.text.length) {
      const t = setTimeout(() => {
        setTyped((prev) => {
          const next = [...prev];
          next[lineIdx] = line.text.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx(charIdx + 1);
      }, 45);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx(lineIdx + 1);
        setCharIdx(0);
        setTyped((prev) => [...prev, ""]);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, typed.length]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 bg-cream transition-all duration-500 ${
        fading ? "opacity-0 scale-[1.01]" : "opacity-100"
      }`}
    >
      <div className="text-center max-w-sm">
        {/* Masthead */}
        <div className="mb-8">
          <div className="border-t-2 border-ink" />
          <div className="border-t border-ink mt-0.5 mb-3" />
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-none">
            SpeakEasy<span className="text-rose">!</span>
          </h1>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-ink-faint mt-1.5">
            Your stage-fright survival kit &middot; Est. 2024
          </p>
          <div className="border-t border-ink mt-3" />
          <div className="border-t-2 border-ink mt-0.5" />
        </div>

        {/* Typewriter lines */}
        <div className="space-y-1 mb-2">
          {LINES.map((line, i) => (
            <p
              key={i}
              className={`font-display text-xl sm:text-2xl italic leading-relaxed transition-opacity duration-300 ${line.style} ${
                i <= lineIdx ? "opacity-100" : "opacity-0"
              }`}
            >
              {typed[i] || " "}
              {i === lineIdx && lineIdx < LINES.length && (
                <span
                  className="inline-block w-0.5 h-[1em] bg-rose ml-0.5 align-text-bottom"
                  style={{ animation: "blink 0.8s step-end infinite" }}
                />
              )}
            </p>
          ))}
        </div>

        {/* Enter button */}
        <div className={`mt-8 transition-all duration-500 ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <button
            onClick={onEnter}
            className="font-display text-sm font-black uppercase tracking-wider px-8 py-3.5 bg-rose text-white border-2 border-ink shadow-[3px_3px_0_var(--color-ink)] transition-all duration-150 hover:shadow-[1px_1px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Let&apos;s fix that →
          </button>
          <p className="text-[0.6rem] text-ink-faint mt-4 italic">
            no audience members were harmed in the making of this app
          </p>
        </div>
      </div>
    </div>
  );
}
