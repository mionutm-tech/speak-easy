"use client";

import { useState } from "react";

type CrowdType = "potatoes" | "dogs" | "npcs" | "grandmas";

const CROWDS: Record<CrowdType, { emoji: string; label: string; desc: string; message: string }> = {
  potatoes: { emoji: "🥔", label: "Potatoes", desc: "No expectations. Just vibing.", message: "They're just sitting there. Supportively. Being potatoes." },
  dogs: { emoji: "🐕", label: "Retrievers", desc: "Unconditional tail wags.", message: "Every tail is wagging. They love you already." },
  npcs: { emoji: "🤖", label: "NPCs", desc: "Stuck in an animation cycle.", message: "They'll clap at the same time no matter what." },
  grandmas: { emoji: "👵", label: "Grandmas", desc: "You're a genius to them.", message: '"Oh honey, that was WONDERFUL!" — before you start.' },
};

const TYPES: CrowdType[] = ["potatoes", "dogs", "npcs", "grandmas"];

export default function CrowdPanel() {
  const [selected, setSelected] = useState<CrowdType | null>(null);
  const [fading, setFading] = useState(false);

  function pick(type: CrowdType) {
    if (type === selected) return;
    setFading(true);
    setTimeout(() => { setSelected(type); setFading(false); }, 200);
  }

  const crowd = selected ? CROWDS[selected] : null;

  return (
    <div style={{ animation: "fade-up 0.35s ease" }}>
      {/* Headline */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-rose text-white font-display text-xs font-black border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]">
            05
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight">
            Reimagine<br /><span className="italic normal-case text-rose">the crowd.</span>
          </h2>
        </div>
        <p className="text-sm text-ink-light mt-2 leading-relaxed">
          Underwear? We can do <span className="underline decoration-butter/60">better</span>.
        </p>
      </div>

      {/* Options — newspaper listing style */}
      <div className="border-t-2 border-ink mb-4">
        {TYPES.map((type) => {
          const c = CROWDS[type];
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => pick(type)}
              className={`w-full flex items-center gap-3 px-3 py-3 border-b border-rule text-left transition-all duration-200 ${
                isActive ? "bg-rose-bg" : "hover:bg-cream-dark"
              }`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-black uppercase tracking-wide">{c.label}</p>
                <p className="text-xs text-ink-faint">{c.desc}</p>
              </div>
              <span className={`text-sm transition-colors ${isActive ? "text-rose" : "text-rule"}`}>→</span>
            </button>
          );
        })}
      </div>

      {/* Stage */}
      <div className="bg-white border-2 border-ink p-5 sm:p-7 shadow-[3px_3px_0_var(--color-ink)] text-center">
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-ink-faint mb-3">
          Your audience right now
        </p>
        <div className={`text-2xl leading-[2.2] tracking-[0.2em] transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>
          {crowd ? (
            <>{Array(5).fill(crowd.emoji).join(" ")}<br />{Array(5).fill(crowd.emoji).join(" ")}<br />{Array(5).fill(crowd.emoji).join(" ")}</>
          ) : (
            <>🧑 🧑 🧑 🧑 🧑<br />🧑 🧑 🧑 🧑 🧑<br />🧑 🧑 🧑 🧑 🧑</>
          )}
        </div>
        <p className="font-display italic text-sm text-ink-light mt-3">
          {crowd ? crowd.message : "Pick a vibe above"}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 mb-2">
        <div className="border-t border-rule pt-4">
          <p className="font-display italic text-xs text-ink-faint leading-relaxed">
            &ldquo;The only thing we have to fear is fear itself.<br />
            Also, wireless mic feedback.&rdquo;
          </p>
          <p className="text-[0.5rem] text-ink-faint/50 mt-2 uppercase tracking-wider font-bold">
            SpeakEasy! — sweaty palms &amp; good intentions
          </p>
        </div>
      </div>
    </div>
  );
}
