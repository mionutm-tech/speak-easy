"use client";

import { useState, useRef } from "react";

const AFFIRMATIONS = [
  { text: "Remember: the audience is just imagining YOU in your underwear.", cat: "perspective shift" },
  { text: "You've survived every awkward moment so far. You're batting 1,000.", cat: "track record" },
  { text: "Fun fact: 73% of the audience is thinking about lunch right now.", cat: "statistical comfort" },
  { text: "Your voice is someone's favorite sound and they just don't know it yet.", cat: "future fan club" },
  { text: "Plot twist: everyone in the audience has also forgotten their own name at some point.", cat: "shared humanity" },
  { text: "You know who else got nervous before speaking? Literally every great speaker ever.", cat: "elite company" },
  { text: "The butterflies in your stomach are just doing a standing ovation early.", cat: "reframe" },
  { text: "Worst case: you mess up, and the internet doesn't even notice because it's too busy arguing.", cat: "perspective" },
  { text: "Your anxiety thinks this is dangerous. It also thinks a loud noise is a bear attack.", cat: "anxiety logic" },
  { text: "Somewhere out there, a golden retriever believes in you unconditionally.", cat: "universal support" },
  { text: "You've already done the hard part: you showed up. Everything else is just talking.", cat: "skills inventory" },
  { text: "The audience wants you to succeed. Nobody goes to a talk hoping it's terrible.", cat: "crowd psychology" },
  { text: "Remember: confidence is just anxiety wearing a blazer.", cat: "wardrobe wisdom" },
  { text: "Every 'um' you say is just your brain loading the next incredible thought.", cat: "buffering" },
  { text: "Marie Curie was too busy discovering radium to worry about public speaking.", cat: "role model" },
  { text: "If a kid can present about their hamster with zero fear, you can do this.", cat: "spirit animal" },
  { text: "Your heartbeat right now is basically a pre-show hype song your body is playing for you.", cat: "biological DJ" },
  { text: "You could say nothing for 30 seconds and the audience would think it's a 'dramatic pause.'", cat: "pro tip" },
  { text: "The person judging you the hardest is you. And your taste in judges is questionable.", cat: "inner critic review" },
  { text: "You're about to give people the gift of your knowledge. They should be nervous.", cat: "power reversal" },
];

export default function BoostPanel() {
  const [text, setText] = useState("Press the button. Your future confident self is waiting.");
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
    }, 350);
  }

  return (
    <div className="pt-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-peach-400 mb-1">
        02 — Confidence Injection Center
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-1">
        You Need to Hear This
      </h2>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-md">
        Scientifically unverified affirmations that are nonetheless 100% true. Hit the button. Trust the process.
      </p>

      <div className="glass p-5 sm:p-7">
        <div className="min-h-[130px] flex items-center justify-center text-center px-2 mb-5">
          <div>
            <p
              className={`font-display text-lg sm:text-xl font-medium leading-relaxed text-amber-600 transition-all duration-350 ${
                switching ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              {text}
            </p>
            {cat && (
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-text-muted mt-3">
                — {cat}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          className="block mx-auto font-display text-sm sm:text-base font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-gold to-peach-300 text-text-main transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
        >
          ⚡ Hit Me With Confidence
        </button>
      </div>
    </div>
  );
}
