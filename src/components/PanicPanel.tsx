"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const STEPS = [
  { icon: "🤝", title: "Shake It Off", desc: "Shake your hands vigorously. Move that adrenaline.", dur: 10 },
  { icon: "🔄", title: "Roll & Release", desc: "Shoulders back 5 times. Drop the tension.", dur: 10 },
  { icon: "🦸", title: "Power Pose", desc: "Hands on hips. Chin up. Yes, ridiculous. Yes, works.", dur: 15 },
  { icon: "🌊", title: "Deep Breath", desc: "In 4... hold 4... out 6. You've got this.", dur: 14 },
  { icon: "🎤", title: "First Line", desc: "Whisper your opening. Now you know how to start.", dur: 11 },
];

export default function PanicPanel() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef(false);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        const check = setInterval(() => {
          if (cancelRef.current) { clearTimeout(id); clearInterval(check); resolve(); }
        }, 200);
      }),
    []
  );

  const run = useCallback(async () => {
    cancelRef.current = false;
    let elapsed = 0;
    for (let i = 0; i < STEPS.length; i++) {
      if (cancelRef.current) return;
      setStep(i);
      for (let s = 0; s < STEPS[i].dur; s++) {
        if (cancelRef.current) return;
        await sleep(1000);
        elapsed++;
        setProgress((elapsed / 60) * 100);
      }
    }
    setDone(true);
    setStep(STEPS.length);
  }, [sleep]);

  const start = useCallback(() => { setActive(true); setDone(false); setStep(-1); setProgress(0); run(); }, [run]);
  const cancel = useCallback(() => { cancelRef.current = true; setActive(false); setDone(false); setStep(-1); setProgress(0); }, []);

  useEffect(() => () => { cancelRef.current = true; }, []);

  return (
    <div className="text-center" style={{ animation: "fade-up 0.35s ease" }}>
      {/* Headline */}
      <div className="mb-5 text-left">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-rose text-white font-display text-xs font-black border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]">
            03
          </span>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-ink-faint">★ Emergency ★</p>
        </div>
      </div>

      {/* Big panic card */}
      <div className="bg-rose-bg border-2 border-ink p-6 sm:p-8 shadow-[3px_3px_0_var(--color-ink)] mb-5">
        <h2 className="font-display text-4xl sm:text-5xl font-black uppercase leading-[0.95] tracking-tight mb-4">
          Press<br />in case<br />of <span className="italic normal-case text-rose">doom</span>
        </h2>

        <button
          onClick={active ? cancel : done ? () => setDone(false) : start}
          className={`font-display text-xs font-black uppercase tracking-wider px-8 py-3 border-2 border-ink transition-all duration-150 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
            done
              ? "bg-sage text-white shadow-[2px_2px_0_var(--color-ink)]"
              : active
              ? "bg-sage text-white shadow-[2px_2px_0_var(--color-ink)]"
              : "bg-rose text-white shadow-[2px_2px_0_var(--color-ink)] hover:shadow-[1px_1px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5"
          }`}
          style={!active && !done ? { animation: "pulse-soft 2s ease-in-out infinite" } : {}}
        >
          {done ? "🎤 Go get them" : active ? "Cancel" : "1-Tap →"}
        </button>
      </div>

      {/* Steps */}
      {active && (
        <div className="text-left" style={{ animation: "fade-up 0.3s ease" }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 mb-1 border-l-3 transition-all duration-300 ${
                i === step
                  ? "border-l-sage bg-sage-bg"
                  : i < step
                  ? "border-l-sage/30 opacity-40"
                  : "border-l-rule opacity-20"
              }`}
            >
              <span className="font-display text-xs font-black text-ink-faint w-5">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">{s.icon} {s.title}</p>
                <p className="text-xs text-ink-light leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
          <div className="h-1 bg-cream-dark mt-3 overflow-hidden">
            <div className="h-full bg-sage transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
