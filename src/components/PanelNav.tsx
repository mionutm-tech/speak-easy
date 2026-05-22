"use client";

interface Props {
  panels: { id: string; label: string }[];
  current: number;
  goTo: (index: number) => void;
}

export default function PanelNav({ panels, current, goTo }: Props) {
  return (
    <nav className="relative z-30 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-white/50 backdrop-blur-xl border-b border-white/50 shrink-0">
      <div className="font-display text-lg font-bold text-peach-400 tracking-tight">
        SpeakEasy <span className="text-text-muted font-light text-sm">v1.0</span>
      </div>
      <div className="flex gap-0.5 sm:gap-1 flex-wrap justify-end">
        {panels.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            className={`text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-200 ${
              i === current
                ? "text-peach-400 bg-peach-400/10 border border-peach-400/25"
                : "text-text-secondary border border-transparent hover:bg-white/50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
