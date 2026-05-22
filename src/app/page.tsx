"use client";

import { useState, useCallback, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import PanelNav from "@/components/PanelNav";
import BreathingPanel from "@/components/BreathingPanel";
import BoostPanel from "@/components/BoostPanel";
import PanicPanel from "@/components/PanicPanel";
import HecklePanel from "@/components/HecklePanel";
import CrowdPanel from "@/components/CrowdPanel";

const PANELS = [
  { id: "breathe", label: "Breathe" },
  { id: "boost", label: "Boost" },
  { id: "panic", label: "Panic" },
  { id: "heckle", label: "Heckle" },
  { id: "crowd", label: "Crowd" },
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [fadeWelcome, setFadeWelcome] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const enterApp = useCallback(() => {
    setFadeWelcome(true);
    setTimeout(() => setEntered(true), 800);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index === current || index < 0 || index >= PANELS.length) return;
      setDirection(index > current ? "right" : "left");
      setCurrent(index);
    },
    [current]
  );

  useEffect(() => {
    if (!entered) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entered, current, goTo]);

  // Touch swipe support
  useEffect(() => {
    if (!entered) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) goTo(current + 1);
        else goTo(current - 1);
      }
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
      {!entered && (
        <WelcomeScreen fading={fadeWelcome} onEnter={enterApp} />
      )}

      {entered && (
        <div className="flex flex-col h-full" style={{ animation: "fadeIn 0.6s ease" }}>
          <PanelNav panels={PANELS} current={current} goTo={goTo} />

          <div className="relative flex-1 overflow-hidden">
            {/* Side arrows */}
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="fixed left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full glass flex items-center justify-center text-lg sm:text-xl text-text-secondary transition-all duration-200 active:scale-90 disabled:opacity-0 disabled:pointer-events-none hover:bg-glass-hover"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === PANELS.length - 1}
              className="fixed right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full glass flex items-center justify-center text-lg sm:text-xl text-text-secondary transition-all duration-200 active:scale-90 disabled:opacity-0 disabled:pointer-events-none hover:bg-glass-hover"
              aria-label="Next"
            >
              →
            </button>

            {/* Bottom "Next" bar — very prominent */}
            {current < PANELS.length - 1 && (
              <button
                onClick={() => goTo(current + 1)}
                className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 glass rounded-full flex items-center gap-2 text-sm font-semibold text-peach-400 transition-all duration-200 active:scale-95 hover:bg-glass-hover shadow-lg"
              >
                Next: {PANELS[current + 1].label}
                <span className="text-lg leading-none">→</span>
              </button>
            )}

            {/* Panels */}
            <PanelSlot active={current === 0} direction={direction} index={0} current={current}>
              <BreathingPanel />
            </PanelSlot>
            <PanelSlot active={current === 1} direction={direction} index={1} current={current}>
              <BoostPanel />
            </PanelSlot>
            <PanelSlot active={current === 2} direction={direction} index={2} current={current}>
              <PanicPanel />
            </PanelSlot>
            <PanelSlot active={current === 3} direction={direction} index={3} current={current}>
              <HecklePanel />
            </PanelSlot>
            <PanelSlot active={current === 4} direction={direction} index={4} current={current}>
              <CrowdPanel />
            </PanelSlot>
          </div>

          {/* Dot indicators */}
          <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 flex gap-2 px-3.5 py-2 glass-sm rounded-full">
            {PANELS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-peach-400"
                    : "w-2 bg-text-muted/30 hover:bg-text-muted/50"
                }`}
                aria-label={p.label}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PanelSlot({
  active,
  direction,
  index,
  current,
  children,
}: {
  active: boolean;
  direction: "left" | "right";
  index: number;
  current: number;
  children: React.ReactNode;
}) {
  const isLeft = index < current;
  const isRight = index > current;

  let transform = "translate-x-0 opacity-100";
  if (isRight) transform = "translate-x-16 opacity-0 pointer-events-none";
  if (isLeft) transform = "-translate-x-16 opacity-0 pointer-events-none";

  return (
    <div
      className={`absolute inset-0 transition-all duration-400 ease-out overflow-y-auto px-4 sm:px-6 pb-24 pt-2 flex items-start justify-center ${transform} ${
        active ? "z-10" : "z-0"
      }`}
    >
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
