"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Difficulty = "chill" | "spicy" | "chaos";

interface Heckle {
  text: string;
  tip: string;
}

const HECKLES: Record<Difficulty, Heckle[]> = {
  chill: [
    { text: "📱 Someone's phone just went off. It's playing the Macarena.", tip: "Smile and say: 'At least someone brought music.'" },
    { text: "🥱 A person in row 3 just yawned. Dramatically.", tip: "Think: they probably had a long day. It's not about you." },
    { text: "🚪 Someone walked in late and tripped over a chair.", tip: "Pause. Let the moment pass. Resume like a pro." },
    { text: "💬 Two people in the back are whispering to each other.", tip: "They're probably saying you're doing great. Probably." },
    { text: "📸 Someone took a photo of your slide. With flash on.", tip: "You're so good they're documenting it." },
    { text: "🍬 Someone is unwrapping a candy. Very. Slowly.", tip: "The crinkle will end. Your speech won't. Stay focused." },
    { text: "👶 A baby started cooing in the audience.", tip: "Even babies are engaged with your content. That's range." },
    { text: "🔔 A notification pinged from the speaker system.", tip: "Technology fails everyone. Press on." },
  ],
  spicy: [
    { text: "🚶 Someone just stood up and left.", tip: "Bathroom exists. Their bladder is not a review." },
    { text: "💻 Front row person is on their laptop. Typing loudly.", tip: "Maybe they're taking notes. Aggressive, passionate notes." },
    { text: "🤦 Someone in the audience just facepalmed.", tip: "They probably remembered they left the oven on." },
    { text: "😴 You spot someone who has genuinely fallen asleep.", tip: "You're so soothing it's basically ASMR. Compliment." },
    { text: "🗣️ Someone said 'Actually...' loud enough for everyone.", tip: "Make eye contact. Assert dominance. Continue." },
    { text: "📞 Someone answered their phone. Full conversation.", tip: "Pause. Stare. Peer pressure will handle it." },
    { text: "🖐️ Someone raised their hand but you're mid-sentence.", tip: "'I'll take questions at the end' — greatest shield ever." },
    { text: "😂 A group just laughed. You didn't say anything funny.", tip: "Coincidence. Humans laugh randomly. It's documented." },
  ],
  chaos: [
    { text: "🔥 The fire alarm just went off. False alarm, but still.", tip: "'Now THAT was a tough act to follow.'" },
    { text: "🎤 Your microphone just cut out mid-word.", tip: "Project from the diaphragm. Ancient speakers had no mics." },
    { text: "📽️ Your slides just crashed. Blue screen of death.", tip: "You ARE the presentation. Slides were decoration." },
    { text: "🤡 Someone in the front row is making faces at you.", tip: "They paid to be here. They're getting the show." },
    { text: "🐦 A bird just flew into the room somehow.", tip: "'Even nature wanted to hear this talk.' Resume." },
    { text: "💡 The lights just flickered ominously.", tip: "Your energy is affecting the electrical grid." },
    { text: "📱 Your own phone started ringing. From the podium.", tip: "'Sorry, my TED Talk recruiter keeps calling.'" },
    { text: "🪑 Your podium just wobbled and almost fell.", tip: "Physics tried to stop you. Physics lost." },
  ],
};

const INTERVALS: Record<Difficulty, [number, number]> = {
  chill: [5000, 10000],
  spicy: [3000, 7000],
  chaos: [1500, 4000],
};

const AUTO_DISMISS: Record<Difficulty, number> = { chill: 10000, spicy: 8000, chaos: 6000 };

const DISMISS_MSGS = [
  "Brushed off. Easy.",
  "Handled like a pro.",
  "Barely flinched.",
  "Ice cold. Next.",
  "Unfazed. You're getting good.",
  "The crowd didn't notice.",
];

export default function HecklePanel() {
  const [running, setRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("chill");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [prompt, setPrompt] = useState("Hit start and brace yourself. Interruptions incoming.");
  const [tip, setTip] = useState("");
  const [phase, setPhase] = useState<"waiting" | "incoming" | "survived">("waiting");
  const [showDismiss, setShowDismiss] = useState(false);

  const runningRef = useRef(false);
  const heckleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentHeckle = useRef<Heckle | null>(null);

  const clearTimers = useCallback(() => {
    if (heckleTimer.current) clearTimeout(heckleTimer.current);
    if (autoTimer.current) clearTimeout(autoTimer.current);
  }, []);

  const scheduleNext = useCallback(() => {
    if (!runningRef.current) return;
    const [min, max] = INTERVALS[difficulty];
    const delay = min + Math.random() * (max - min);
    heckleTimer.current = setTimeout(() => {
      if (!runningRef.current) return;
      const pool = HECKLES[difficulty];
      const h = pool[Math.floor(Math.random() * pool.length)];
      currentHeckle.current = h;
      setPhase("incoming");
      setPrompt(h.text);
      setTip(h.tip);
      setShowDismiss(true);

      autoTimer.current = setTimeout(() => {
        if (runningRef.current && currentHeckle.current === h) dismiss();
      }, AUTO_DISMISS[difficulty]);
    }, delay);
  }, [difficulty]);

  const dismiss = useCallback(() => {
    if (!runningRef.current || !currentHeckle.current) return;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    currentHeckle.current = null;

    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    setPhase("survived");
    setPrompt(DISMISS_MSGS[Math.floor(Math.random() * DISMISS_MSGS.length)]);
    setTip("");
    setShowDismiss(false);

    scheduleNext();
  }, [scheduleNext]);

  const start = useCallback(() => {
    runningRef.current = true;
    setRunning(true);
    setScore(0);
    setStreak(0);
    setPhase("waiting");
    setPrompt("Get ready... something is about to happen...");
    setTip("");
    setShowDismiss(false);
    scheduleNext();
  }, [scheduleNext]);

  const stop = useCallback(() => {
    runningRef.current = false;
    clearTimers();
    currentHeckle.current = null;
    setRunning(false);
    setShowDismiss(false);
    setTip("");
    setPhase("survived");
    setPrompt(score > 0 ? `Session over! Score: ${score}. The real audience will be easier.` : "Hit start and brace yourself.");
  }, [clearTimers, score]);

  useEffect(() => {
    return () => { runningRef.current = false; clearTimers(); };
  }, [clearTimers]);

  return (
    <div className="pt-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-peach-400 mb-1">
        04 — Chaos Desensitization Lab
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-main mb-1">
        Heckle Simulator
      </h2>
      <p className="text-sm text-text-secondary mb-5 leading-relaxed max-w-md">
        Random worst-case interruptions will pop up. Stay cool and dismiss them. If you survive this, real life is a breeze.
      </p>

      {/* Stage card */}
      <div className="glass p-5 sm:p-7 mb-4 relative min-h-[220px] flex flex-col items-center justify-center">
        {/* Score bar */}
        <div className="absolute top-3 left-4 right-4 flex justify-between text-[0.65rem] font-semibold uppercase tracking-wider">
          <span className="text-amber-600">Score: {score}</span>
          {streak >= 3 && <span className="text-mint-300">🔥 {streak} streak!</span>}
        </div>

        <p
          className={`font-display text-base sm:text-lg font-medium leading-relaxed text-center max-w-sm px-2 ${
            phase === "incoming" ? "text-warm-red" : phase === "survived" ? "text-mint-300" : "text-text-secondary"
          }`}
          style={phase === "incoming" ? { animation: "heckle-shake 0.4s ease" } : {}}
          key={prompt}
        >
          {prompt}
        </p>

        {tip && (
          <p className="text-xs text-text-muted italic mt-3 text-center max-w-xs">{tip}</p>
        )}

        {showDismiss && (
          <button
            onClick={dismiss}
            className="mt-4 text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full border border-mint-300 text-mint-300 bg-mint-100/50 hover:bg-mint-200/60 transition-all active:scale-95"
          >
            😎 Brush It Off
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={running ? stop : start}
          className={`font-display text-sm font-semibold px-5 py-2.5 rounded-full transition-all active:scale-95 ${
            running
              ? "bg-text-muted/20 text-text-secondary"
              : "bg-gradient-to-r from-coral to-warm-red text-white hover:shadow-lg"
          }`}
        >
          {running ? "Stop Session" : "Start Heckling"}
        </button>
        <div className="flex gap-1.5">
          {(["chill", "spicy", "chaos"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                difficulty === d
                  ? "border-peach-400 text-peach-400 bg-peach-400/10"
                  : "border-white/50 text-text-secondary bg-white/30 hover:border-peach-300"
              }`}
            >
              {d === "chill" ? "Chill" : d === "spicy" ? "Spicy" : "Chaos"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
