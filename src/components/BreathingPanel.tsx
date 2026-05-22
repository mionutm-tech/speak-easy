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
          if (cancelRef.current) {
            clearTimeout(id);
            clearInterval(check);
            resolve();
          }
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
      setPhase("inhale");
      await runCountdown(4);
      if (cancelRef.current) break;

      setPhase("hold");
      await runCountdown(4);
      if (cancelRef.current) break;

      setPhase("exhale");
      await runCountdown(4);
      if (cancelRef.current) break;

      setCycles((c) => c + 1);
    }
  }, [runCountdown]);

  const start = useCallback(() => {
    cancelRef.current = false;
    setRunning(true);
    runCycle();
  }, [runCycle]);

  const stop = useCallback(() => {
    cancelRef.current = true;
    setRunning(false);
    setPhase("idle");
    setCountdown(4);
  }, []);

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  const orbSize = phase === "inhale" || phase === "hold" ? "w-44 h-44 sm:w-48 sm:h-48" : "w-24 h-24 sm:w-28 sm:h-28";
  const orbGlow = phase === "hold" ? "shadow-[0_0_60px_rgba(126,207,179,0.35)]" : phase === "inhale" ? "shadow-[0_0_40px_rgba(126,207,179,0.25)]" : "";

  const phaseLabel = {
    idle: "Ready?",
    inhale: "Breathe in...",
    hold: "Hold it...",
    exhale: "Let it go...",
  }[phase];

  const cycleMessages = [
    "aim for 3, you overachiever",
    "keep going, champion",
    "your brain thanks you",
    "oxygen levels: excellent",
    "you're basically a monk now",
  ];

  return (
    <div className="pt-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-peach-400 mb-1">
        01 — Emergency Oxygen Station
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-1">
        Breathe Like You Mean It
      </h2>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-md">
        Your brain needs oxygen to form words. Let&apos;s make sure it gets some. This is science, not woo-woo.
      </p>

      <div className="glass p-5 sm:p-7 flex flex-col items-center gap-5">
        {/* Orb */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border border-mint-200/40 ${
              running ? "" : "scale-90 opacity-30"
            }`}
            style={running ? { animation: "ring-pulse 12s ease-in-out infinite" } : {}}
          />
          <div
            className={`rounded-full bg-gradient-to-br from-mint-300 to-mint-200/40 flex items-center justify-center transition-all duration-[800ms] ease-out ${orbSize} ${orbGlow}`}
          >
            <span className="font-display text-sm sm:text-base font-medium text-text-main text-center pointer-events-none">
              {phaseLabel}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="font-display text-4xl font-light text-mint-300 tabular-nums">
          {running ? countdown : "4 : 4 : 4"}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={running ? stop : start}
            className={`text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all ${
              running
                ? "bg-mint-300 text-white border-mint-300"
                : "border-mint-300 text-mint-300 bg-mint-100/50 hover:bg-mint-200/60"
            }`}
          >
            {running ? "Stop" : "Start Breathing"}
          </button>
          <button
            onClick={() => { stop(); setCycles(0); }}
            className="text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full border border-mint-300/40 text-mint-300 bg-mint-100/30 hover:bg-mint-200/40 transition-all"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-text-muted text-center">
          Cycles completed: {cycles} — {cycleMessages[Math.min(cycles, cycleMessages.length - 1)]}
        </p>
      </div>
    </div>
  );
}
