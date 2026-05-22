"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const STEPS = [
  { icon: "🤝", title: "Shake It Off", desc: "Shake your hands vigorously for 10 seconds. Get that adrenaline moving.", dur: 10 },
  { icon: "🔄", title: "Roll & Release", desc: "Roll your shoulders back 5 times. Drop the tension you're wearing as earrings.", dur: 10 },
  { icon: "🦸", title: "Power Pose", desc: "Hands on hips, chin up, chest out. Hold for 15 seconds. Yes, it looks ridiculous.", dur: 15 },
  { icon: "🌊", title: "One Deep Breath", desc: "In through the nose for 4... hold for 4... out through the mouth for 6.", dur: 14 },
  { icon: "🎤", title: "Say Your First Line", desc: "Whisper your opening line. Just the first sentence. Now go crush it.", dur: 11 },
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

  const start = useCallback(() => {
    setActive(true);
    setDone(false);
    setStep(-1);
    setProgress(0);
    run();
  }, [run]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setActive(false);
    setDone(false);
    setStep(-1);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  return (
    <div className="pt-2 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-peach-400 mb-1">
        03 — The Big Red Button
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-1">
        Stage Fright Protocol
      </h2>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-md mx-auto">
        Going on stage in under a minute? This is your 60-second emergency calming routine.
      </p>

      {/* The Button */}
      <div className="relative inline-block mb-5">
        <div
          className="absolute -inset-4 rounded-full border border-warm-red/15"
          style={active ? {} : { animation: "panic-pulse 2s ease-in-out infinite" }}
        />
        <div
          className="absolute -inset-8 rounded-full border border-warm-red/8"
          style={active ? {} : { animation: "panic-pulse 2s ease-in-out infinite 0.5s" }}
        />
        <button
          onClick={active ? cancel : start}
          className={`relative z-10 w-40 h-40 sm:w-44 sm:h-44 rounded-full font-display text-sm font-bold uppercase tracking-wide leading-snug text-white transition-all active:scale-95 ${
            done
              ? "bg-gradient-to-br from-mint-300 to-mint-200 border-2 border-mint-300 shadow-[0_0_40px_rgba(126,207,179,0.3)]"
              : active
              ? "bg-gradient-to-br from-mint-300 to-emerald-400 border-2 border-mint-300 shadow-[0_0_40px_rgba(126,207,179,0.3)]"
              : "bg-gradient-to-br from-red-400 to-red-500 border-2 border-warm-red shadow-[0_0_30px_rgba(232,85,78,0.2)] hover:scale-105"
          }`}
        >
          {done ? "🎤\nGO GET\nTHEM" : active ? "CANCEL\nROUTINE" : "I'M ABOUT\nTO GO\nON STAGE"}
        </button>
      </div>

      {/* Routine steps */}
      {active && (
        <div className="text-left max-w-sm mx-auto">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3.5 py-2.5 mb-2 rounded-xl transition-all duration-500 ${
                i === step
                  ? "glass-sm translate-x-1.5 opacity-100 border-mint-300/30"
                  : i < step
                  ? "opacity-40"
                  : "opacity-25"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  i === step
                    ? "bg-mint-300 text-white"
                    : i < step
                    ? "bg-mint-200/50 text-mint-300"
                    : "bg-white/30 text-text-muted"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold">
                  {s.icon} {s.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}

          <div className="h-1 bg-white/30 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mint-300 to-lavender-300 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
