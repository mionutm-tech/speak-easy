"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Phase = "idle" | "inhale" | "hold" | "exhale";

export default function BreathingPanel() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(4);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const cancelRef = useRef(false);

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        const check = setInterval(() => {
          if (cancelRef.current) { clearTimeout(id); clearInterval(check); resolve(); }
        }, 100);
      }),
    []
  );

  const runCountdown = useCallback(
    async (secs: number) => {
      for (let i = secs; i > 0; i--) {
        if (cancelRef.current) return;
        setCountdown(i);
        await sleep(1000);
      }
    },
    [sleep]
  );

  const runCycle = useCallback(async () => {
    while (!cancelRef.current) {
      setPhase("inhale"); await runCountdown(4); if (cancelRef.current) break;
      setPhase("hold"); await runCountdown(4); if (cancelRef.current) break;
      setPhase("exhale"); await runCountdown(4); if (cancelRef.current) break;
      setCycles((c) => c + 1);
    }
  }, [runCountdown]);

  const start = useCallback(() => { cancelRef.current = false; setRunning(true); runCycle(); }, [runCycle]);
  const stop = useCallback(() => { cancelRef.current = true; setRunning(false); setPhase("idle"); setCountdown(4); }, []);

  useEffect(() => () => { cancelRef.current = true; }, []);

  const orbScale = phase === "inhale" || phase === "hold" ? "scale-100" : "scale-[0.5]";
  const label = { idle: "tap start", inhale: "breathe in", hold: "hold", exhale: "let go" }[phase];
  const msgs = ["aim for 3", "keep going", "your brain thanks you", "basically a monk", "unstoppable"];

  return (
    <div style={{ animation: "fade-up 0.35s ease" }}>
      {/* Headline */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-rose text-white font-display text-xs font-black border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]">
            01
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight">
            Breathe,<br /><span className="italic normal-case text-rose">nerd.</span>
          </h2>
        </div>
        <p className="text-sm text-ink-light mt-2 leading-relaxed">
          Your brain needs oxygen to form words. This is <span className="underline decoration-rose/40">science</span>, not woo-woo.
        </p>
      </div>

      {/* Card */}
      <div className="bg-sage-bg border-2 border-ink p-6 sm:p-8 shadow-[3px_3px_0_var(--color-ink)]">
        <div className="flex flex-col items-center">
          {/* Orb */}
          <div className="relative w-40 h-40 flex items-center justify-center mb-5">
            <div
              className={`w-40 h-40 rounded-full bg-sage-soft border-2 border-sage/30 flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${orbScale}`}
            >
              <div className="text-center">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-ink">{label}</p>
                {running && (
                  <p className="font-display text-4xl font-black text-sage mt-1 tabular-nums">{countdown}</p>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={running ? stop : start}
              className={`font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 border-2 border-ink transition-all duration-150 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                running
                  ? "bg-sage text-white shadow-[2px_2px_0_var(--color-ink)]"
                  : "bg-cream text-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-sage-soft"
              }`}
            >
              {running ? "Stop" : "Start"}
            </button>
            {cycles > 0 && (
              <button
                onClick={() => { stop(); setCycles(0); }}
                className="font-display text-xs font-bold uppercase tracking-wider px-4 py-2.5 text-ink-faint hover:text-ink transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <p className="text-xs text-ink-faint text-center font-medium">
            {cycles} {cycles === 1 ? "cycle" : "cycles"} — {msgs[Math.min(cycles, msgs.length - 1)]}
          </p>
        </div>
      </div>
    </div>
  );
}
