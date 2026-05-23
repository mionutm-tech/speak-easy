"use client";

import { useState, useCallback, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import BreathingPanel from "@/components/BreathingPanel";
import BoostPanel from "@/components/BoostPanel";
import PanicPanel from "@/components/PanicPanel";
import HecklePanel from "@/components/HecklePanel";
import CrowdPanel from "@/components/CrowdPanel";

const PANELS = [
  { id: "breathe", label: "Breathe", icon: "◉" },
  { id: "boost", label: "Mantra", icon: "♦" },
  { id: "panic", label: "Panic", icon: "!" },
  { id: "heckle", label: "Heckle", icon: "⚡" },
  { id: "crowd", label: "Crowd", icon: "☺" },
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [fadeWelcome, setFadeWelcome] = useState(false);
  const [current, setCurrent] = useState(0);

  const enterApp = useCallback(() => {
    setFadeWelcome(true);
    setTimeout(() => setEntered(true), 600);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= PANELS.length || index === current) return;
      setCurrent(index);
    },
    [current]
  );

  useEffect(() => {
    if (!entered) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entered, current, goTo]);

  useEffect(() => {
    if (!entered) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -50) goTo(current + 1);
      if (dx > 50) goTo(current - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [entered, current, goTo]);

  return (
    <>
      {!entered && <WelcomeScreen fading={fadeWelcome} onEnter={enterApp} />}

      {entered && (
        <div className="flex flex-col h-full" style={{ animation: "fade-in 0.4s ease" }}>
          {/* Masthead */}
          <header className="shrink-0 px-4 sm:px-6 pt-3 pb-2">
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="font-display text-xl font-black tracking-tight leading-none">
                  SpeakEasy<span className="text-rose">!</span>
                </h1>
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-ink-faint mt-0.5">
                  Your stage-fright survival kit
                </p>
              </div>
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.15em] text-ink-faint">
                Vol. 01 &middot; Issue {String(current + 1).padStart(2, "0")}
              </p>
            </div>
            <div className="border-t-2 border-ink mt-2" />
            <div className="border-t border-ink mt-0.5" />
          </header>

          {/* Content */}
          <div className="relative flex-1 overflow-hidden">
            {/* Arrows */}
            {current > 0 && (
              <button
                onClick={() => goTo(current - 1)}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-cream border-2 border-ink flex items-center justify-center text-ink text-sm font-bold transition-all duration-150 active:scale-90 hover:bg-cream-dark"
              >
                ‹
              </button>
            )}
            {current < PANELS.length - 1 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30" style={{ animation: "nudge-right 2s ease-in-out infinite" }}>
                <button
                  onClick={() => goTo(current + 1)}
                  className="flex items-center gap-1.5 bg-rose text-white border-2 border-ink px-3.5 py-2 font-display text-[0.6rem] font-black uppercase tracking-wider transition-all duration-150 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0_var(--color-ink)]"
                >
                  Next <span className="text-sm leading-none">›</span>
                </button>
              </div>
            )}

            {/* Panels */}
            <Panel active={current === 0} index={0} current={current}><BreathingPanel /></Panel>
            <Panel active={current === 1} index={1} current={current}><BoostPanel /></Panel>
            <Panel active={current === 2} index={2} current={current}><PanicPanel /></Panel>
            <Panel active={current === 3} index={3} current={current}><HecklePanel /></Panel>
            <Panel active={current === 4} index={4} current={current}><CrowdPanel /></Panel>
          </div>

          {/* Bottom tab bar */}
          <nav className="shrink-0 border-t-2 border-ink bg-cream">
            <div className="flex">
              {PANELS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => goTo(i)}
                  className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-colors duration-200 ${
                    i === current ? "text-rose" : "text-ink-faint hover:text-ink-light"
                  }`}
                >
                  <span className="text-sm font-bold leading-none">{p.icon}</span>
                  <span className="text-[0.55rem] font-bold uppercase tracking-[0.1em]">{p.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function Panel({
  active,
  index,
  current,
  children,
}: {
  active: boolean;
  index: number;
  current: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-y-auto px-4 sm:px-6 pb-4 transition-all duration-300 ease-out ${
        active
          ? "translate-x-0 opacity-100 z-10"
          : index < current
          ? "-translate-x-10 opacity-0 z-0 pointer-events-none"
          : "translate-x-10 opacity-0 z-0 pointer-events-none"
      }`}
    >
      <div className="max-w-lg mx-auto">{children}</div>
    </div>
  );
}
