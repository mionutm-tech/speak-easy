"use client";

import { useState } from "react";

type CrowdType = "potatoes" | "dogs" | "npcs" | "grandmas";

const CROWDS: Record<CrowdType, { emoji: string; label: string; desc: string; message: string }> = {
  potatoes: {
    emoji: "🥔",
    label: "Supportive Potatoes",
    desc: "No expectations. Just happy to be here.",
    message: "They're just sitting there. Supportively. Being potatoes.",
  },
  dogs: {
    emoji: "🐕",
    label: "Golden Retrievers",
    desc: "Unconditional love and tail wags.",
    message: "Every single tail is wagging. They love your presentation already.",
  },
  npcs: {
    emoji: "🤖",
    label: "NPCs on Loop",
    desc: "Stuck in an animation cycle.",
    message: "They're on a loop. They'll clap at exactly the same time no matter what.",
  },
  grandmas: {
    emoji: "👵",
    label: "Proud Grandmas",
    desc: "They think you're the smartest person alive.",
    message: '"Oh honey, that was WONDERFUL!" — all of them, before you even start.',
  },
};

const TYPES: CrowdType[] = ["potatoes", "dogs", "npcs", "grandmas"];

export default function CrowdPanel() {
  const [selected, setSelected] = useState<CrowdType | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  function pick(type: CrowdType) {
    if (type === selected) return;
    setTransitioning(true);
    setTimeout(() => {
      setSelected(type);
      setTransitioning(false);
    }, 250);
  }

  const crowd = selected ? CROWDS[selected] : null;

  return (
    <div className="pt-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-peach-400 mb-1">
        05 — Audience Makeover Studio
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-1">
        Reimagine Your Crowd
      </h2>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-md">
        They say to imagine the audience in their underwear, but we can do better. Pick your preferred hallucination.
      </p>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {TYPES.map((type) => {
          const c = CROWDS[type];
          return (
            <button
              key={type}
              onClick={() => pick(type)}
              className={`glass-sm p-3.5 text-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] ${
                selected === type
                  ? "!border-peach-300 !bg-peach-100/50"
                  : ""
              }`}
            >
              <span className={`text-3xl block mb-1.5 transition-transform duration-300 ${
                selected === type ? "scale-110" : ""
              }`}>
                {c.emoji}
              </span>
              <p className="font-display text-xs sm:text-sm font-semibold text-text-main mb-0.5">
                {c.label}
              </p>
              <p className="text-[0.65rem] text-text-secondary leading-snug">{c.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div className="glass p-5 sm:p-7 text-center min-h-[160px] flex flex-col items-center justify-center">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-text-muted mb-3">
          Your Audience Right Now
        </p>
        <div
          className={`text-2xl sm:text-3xl leading-[2.2] tracking-[0.3em] transition-opacity duration-300 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {crowd ? (
            <>
              {Array(5).fill(crowd.emoji).join(" ")}
              <br />
              {Array(5).fill(crowd.emoji).join(" ")}
              <br />
              {Array(5).fill(crowd.emoji).join(" ")}
            </>
          ) : (
            <>
              🧑 🧑 🧑 🧑 🧑<br />
              🧑 🧑 🧑 🧑 🧑<br />
              🧑 🧑 🧑 🧑 🧑
            </>
          )}
        </div>
        <p className="font-display italic text-sm text-peach-400 mt-3">
          {crowd ? crowd.message : "Pick a vibe above to transform your audience"}
        </p>
      </div>

      {/* Footer quote */}
      <div className="text-center mt-6 px-4">
        <p className="font-display italic text-sm text-text-secondary leading-relaxed">
          &ldquo;The only thing we have to fear is fear itself.<br />
          Also, wireless mic feedback. That&apos;s terrifying too.&rdquo;
        </p>
        <p className="text-[0.65rem] text-text-muted mt-2">
          SpeakEasy — made with sweaty palms and good intentions
        </p>
      </div>
    </div>
  );
}
