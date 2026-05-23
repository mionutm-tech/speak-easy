"use client";

import { useState, useRef } from "react";

const AFFIRMATIONS = [
  { text: "Remember: the audience is just imagining YOU in your underwear.", cat: "perspective shift" },
  { text: "You've survived every awkward moment so far. Batting 1,000.", cat: "track record" },
  { text: "Fun fact: 73% of the audience is thinking about lunch right now.", cat: "statistical comfort" },
  { text: "Your voice is someone's favorite sound and they just don't know it yet.", cat: "future fan club" },
  { text: "Everyone in the audience has forgotten their own name at some point.", cat: "shared humanity" },
  { text: "You know who else got nervous? Literally every great speaker ever.", cat: "elite company" },
  { text: "The butterflies in your stomach are doing a standing ovation early.", cat: "reframe" },
  { text: "Your anxiety thinks this is dangerous. It also thinks loud noises are bear attacks.", cat: "anxiety logic" },
  { text: "Somewhere out there, a golden retriever believes in you unconditionally.", cat: "universal support" },
  { text: "You showed up. Everything else is just talking.", cat: "skills inventory" },
  { text: "The audience wants you to succeed. Nobody attends a talk hoping it's terrible.", cat: "crowd psychology" },
  { text: "Confidence is just anxiety wearing a blazer.", cat: "wardrobe wisdom" },
  { text: "Every 'um' is your brain loading the next incredible thought.", cat: "buffering" },
  { text: "You could say nothing for 30 seconds and they'd call it a dramatic pause.", cat: "pro tip" },
  { text: "The person judging you hardest is you. Your taste in judges? Questionable.", cat: "inner critic" },
  { text: "You're giving people the gift of knowledge. They should be nervous.", cat: "power reversal" },
];

export default function BoostPanel() {
  const [text, setText] = useState("Tap the button. Your confident self is waiting.");
  const [cat, setCat] = useState("");
  const [switching, setSwitching] = useState(false);
  const lastIdx = useRef(-1);

  function generate() {
    setSwitching(true);
    setTimeout(() => {
      let idx: number;
      do { idx = Math.floor(Math.random() * AFFIRMATIONS.length); } while (idx === lastIdx.current);
      lastIdx.current = idx;
      setText(AFFIRMATIONS[idx].text);
      setCat(AFFIRMATIONS[idx].cat);
      setSwitching(false);
    }, 300);
  }

  return (
    <div style={{ animation: "fade-up 0.35s ease" }}>
      {/* Headline */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-rose text-white font-display text-xs font-black border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]">
            02
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight">
            Pull a real<br /><span className="italic normal-case text-rose">pep talk.</span>
          </h2>
        </div>
        <p className="text-sm text-ink-light mt-2 leading-relaxed">
          Scientifically unverified. Nonetheless <span className="underline decoration-butter/60">100% true</span>.
        </p>
      </div>

      {/* Card */}
      <div className="bg-butter-bg border-2 border-ink p-6 sm:p-8 shadow-[3px_3px_0_var(--color-ink)]">
        <div className="min-h-[130px] flex items-center justify-center text-center mb-5">
          <div>
            <p
              className={`font-display text-lg sm:text-xl font-bold leading-relaxed text-ink italic transition-all duration-300 ${
                switching ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
              }`}
            >
              &ldquo;{text}&rdquo;
            </p>
            {cat && (
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-faint mt-3">
                — {cat}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full font-display text-xs font-black uppercase tracking-wider py-3 bg-butter text-ink border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] transition-all duration-150 hover:shadow-[1px_1px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          ⚡ Hit me with confidence
        </button>
      </div>
    </div>
  );
}
