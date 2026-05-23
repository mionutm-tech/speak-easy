"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Difficulty = "chill" | "spicy" | "chaos";
interface Heckle { text: string; tip: string; }

const HECKLES: Record<Difficulty, Heckle[]> = {
  chill: [
    { text: "📱 Someone's phone went off. Playing the Macarena.", tip: "'At least someone brought music.'" },
    { text: "🥱 Person in row 3 yawned. Dramatically.", tip: "Long day. Not about you." },
    { text: "🚪 Someone walked in late. Tripped over a chair.", tip: "Pause. Let it pass. Resume." },
    { text: "💬 Two people whispering in the back.", tip: "They're saying you're great. Probably." },
    { text: "📸 Someone photographed your slide. With flash.", tip: "So good they're documenting it." },
    { text: "🍬 Someone unwrapping a candy. Very. Slowly.", tip: "The crinkle ends. Your speech won't." },
    { text: "👶 A baby started cooing.", tip: "Even babies are engaged. Range." },
  ],
  spicy: [
    { text: "🚶 Someone stood up and left.", tip: "Bathroom. Not a performance review." },
    { text: "💻 Front row typing loudly on a laptop.", tip: "Maybe they're taking passionate notes." },
    { text: "😴 Someone has genuinely fallen asleep.", tip: "So soothing it's basically ASMR." },
    { text: "🗣️ 'Actually...' rang out loud and clear.", tip: "Eye contact. Dominance. Continue." },
    { text: "📞 Someone answered their phone. Full chat.", tip: "Pause. Stare. Peer pressure works." },
    { text: "🖐️ Hand raised mid-sentence.", tip: "'Questions at the end' — greatest shield." },
    { text: "😂 A group laughed. Nothing was funny.", tip: "Humans laugh randomly. Documented." },
  ],
  chaos: [
    { text: "🔥 Fire alarm. False alarm, but still.", tip: "'Tough act to follow.'" },
    { text: "🎤 Mic cut out mid-word.", tip: "Ancient speakers had no mics." },
    { text: "📽️ Slides crashed. Blue screen of death.", tip: "YOU are the presentation." },
    { text: "🐦 A bird flew into the room.", tip: "'Even nature wanted to hear this.'" },
    { text: "💡 Lights flickered ominously.", tip: "Your energy broke the grid." },
    { text: "📱 YOUR phone rang. From the podium.", tip: "'TED Talk recruiter keeps calling.'" },
    { text: "🪑 Podium wobbled. Almost fell.", tip: "Physics tried. Physics lost." },
  ],
};

const INTERVALS: Record<Difficulty, [number, number]> = { chill: [5000, 9000], spicy: [3000, 6000], chaos: [1500, 3500] };
const AUTO_DISMISS: Record<Difficulty, number> = { chill: 10000, spicy: 8000, chaos: 5000 };
const DISMISS_MSGS = ["Brushed off.", "Handled.", "Barely flinched.", "Ice cold.", "Unfazed.", "Nobody noticed."];

export default function HecklePanel() {
  const [running, setRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("chill");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [prompt, setPrompt] = useState("Tap start. Chaos incoming.");
  const [tip, setTip] = useState("");
  const [phase, setPhase] = useState<"wait" | "incoming" | "ok">("wait");
  const [showDismiss, setShowDismiss] = useState(false);

  const runRef = useRef(false);
  const hTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const curRef = useRef<Heckle | null>(null);

  const clear = useCallback(() => { if (hTimer.current) clearTimeout(hTimer.current); if (aTimer.current) clearTimeout(aTimer.current); }, []);

  const scheduleNext = useCallback(() => {
    if (!runRef.current) return;
    const [min, max] = INTERVALS[difficulty];
    hTimer.current = setTimeout(() => {
      if (!runRef.current) return;
      const pool = HECKLES[difficulty];
      const h = pool[Math.floor(Math.random() * pool.length)];
      curRef.current = h;
      setPhase("incoming");
      setPrompt(h.text);
      setTip(h.tip);
      setShowDismiss(true);
      aTimer.current = setTimeout(() => { if (runRef.current && curRef.current === h) dismiss(); }, AUTO_DISMISS[difficulty]);
    }, min + Math.random() * (max - min));
  }, [difficulty]);

  const dismiss = useCallback(() => {
    if (!runRef.current || !curRef.current) return;
    if (aTimer.current) clearTimeout(aTimer.current);
    curRef.current = null;
    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    setPhase("ok");
    setPrompt(DISMISS_MSGS[Math.floor(Math.random() * DISMISS_MSGS.length)]);
    setTip("");
    setShowDismiss(false);
    scheduleNext();
  }, [scheduleNext]);

  const start = useCallback(() => {
    runRef.current = true; setRunning(true); setScore(0); setStreak(0);
    setPhase("wait"); setPrompt("Get ready..."); setTip(""); setShowDismiss(false);
    scheduleNext();
  }, [scheduleNext]);

  const stop = useCallback(() => {
    runRef.current = false; clear(); curRef.current = null;
    setRunning(false); setShowDismiss(false); setTip("");
    setPhase("ok");
    setPrompt(score > 0 ? `Done! ${score} survived.` : "Tap start. Chaos incoming.");
  }, [clear, score]);

  useEffect(() => () => { runRef.current = false; clear(); }, [clear]);

  return (
    <div style={{ animation: "fade-up 0.35s ease" }}>
      {/* Headline */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-rose text-white font-display text-xs font-black border-2 border-ink shadow-[2px_2px_0_var(--color-ink)]">
            04
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight">
            Heckle<br /><span className="italic normal-case text-rose">simulator.</span>
          </h2>
        </div>
        <p className="text-sm text-ink-light mt-2 leading-relaxed">
          Survive this and <span className="underline decoration-rose/40">real life is a breeze</span>.
        </p>
      </div>

      {/* Stage */}
      <div className="bg-white border-2 border-ink p-5 sm:p-7 shadow-[3px_3px_0_var(--color-ink)] min-h-[180px] flex flex-col items-center justify-center relative mb-4">
        <div className="absolute top-3 left-4 right-4 flex justify-between text-[0.55rem] font-bold uppercase tracking-wider">
          <span className="text-butter">Score: {score}</span>
          {streak >= 3 && <span className="text-sage">🔥 {streak}</span>}
        </div>

        <p
          className={`font-display text-base sm:text-lg font-bold leading-relaxed text-center max-w-xs transition-all duration-300 ${
            phase === "incoming" ? "text-rose" : phase === "ok" ? "text-sage" : "text-ink-faint"
          }`}
          style={phase === "incoming" ? { animation: "gentle-shake 0.35s ease" } : {}}
          key={prompt}
        >
          {prompt}
        </p>

        {tip && <p className="text-xs text-ink-faint italic mt-2 text-center max-w-xs">{tip}</p>}

        {showDismiss && (
          <button
            onClick={dismiss}
            className="mt-4 font-display text-xs font-black uppercase tracking-wider px-5 py-2 bg-sage-bg text-sage border-2 border-ink shadow-[2px_2px_0_var(--color-ink)] transition-all duration-150 active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          >
            😎 Brush it off
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <button
          onClick={running ? stop : start}
          className={`font-display text-xs font-black uppercase tracking-wider px-5 py-2.5 border-2 border-ink transition-all duration-150 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
            running
              ? "bg-cream-dark text-ink-faint shadow-[2px_2px_0_var(--color-ink)]"
              : "bg-rose text-white shadow-[2px_2px_0_var(--color-ink)]"
          }`}
        >
          {running ? "Stop" : "Start"}
        </button>
        <div className="flex border-2 border-ink overflow-hidden">
          {(["chill", "spicy", "chaos"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-[0.6rem] font-bold uppercase tracking-wider px-3 py-2 transition-colors ${
                difficulty === d ? "bg-ink text-cream" : "bg-cream text-ink-faint hover:text-ink"
              } ${d !== "chaos" ? "border-r-2 border-ink" : ""}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
