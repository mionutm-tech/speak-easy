"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  fading: boolean;
  onEnter: () => void;
}

const LINES = [
  { text: "Your hands are sweaty.", color: "text-peach-400" },
  { text: "Your heart is racing.", color: "text-coral" },
  { text: "Welcome — you're in the right place, Maria.", color: "text-lavender-300", big: true },
];

export default function WelcomeScreen({ fading, onEnter }: Props) {
  const [typed, setTyped] = useState<string[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setTyped([""]);
  }, []);

  useEffect(() => {
    if (lineIdx >= LINES.length) {
      setTimeout(() => setShowButton(true), 500);
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
      }, 50);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setShowCursor(false);
        setTimeout(() => {
          setLineIdx(lineIdx + 1);
          setCharIdx(0);
          setTyped((prev) => [...prev, ""]);
          setShowCursor(true);
        }, 300);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, typed.length]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-gradient-to-br from-peach-50 via-lavender-100 to-mint-100 transition-all duration-700 ${
        fading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      }`}
    >
      <div className="text-center max-w-sm sm:max-w-lg">
        <div className="text-5xl mb-6" style={{ animation: "float 3s ease-in-out infinite" }}>
          🎤
        </div>

        {LINES.map((line, i) => (
          <div
            key={i}
            className={`font-display leading-relaxed mb-1.5 transition-opacity duration-300 ${
              line.color
            } ${line.big ? "text-2xl sm:text-3xl font-semibold mt-3 not-italic" : "text-xl sm:text-2xl italic"} ${
              i <= lineIdx ? "opacity-100" : "opacity-0"
            }`}
          >
            {typed[i] || ""}
            {i === lineIdx && showCursor && lineIdx < LINES.length && (
              <span
                className="inline-block w-0.5 h-[1.1em] bg-coral ml-0.5 align-text-bottom"
                style={{ animation: "blink 0.7s step-end infinite" }}
              />
            )}
          </div>
        ))}

        <div
          className={`mt-8 transition-all duration-500 ${
            showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onEnter}
            className="font-display text-base sm:text-lg font-medium px-7 py-3 rounded-full border border-coral/40 bg-coral/10 text-coral transition-all hover:bg-coral/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Let&apos;s fix that
          </button>
          <p className="text-xs text-text-muted mt-3">
            no audience members were harmed in the making of this app
          </p>
        </div>
      </div>
    </div>
  );
}
