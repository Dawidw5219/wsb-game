import type { GameBackgroundProps } from "@/types";

export const GameBackground = ({ children }: GameBackgroundProps) => {
  const renderLasers = () => {
    const colors = ["cyan", "green", "blue", "lime"];
    return [...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`fixed top-0 w-0.5 h-full opacity-60 animate-pulse`}
        style={{
          left: `${20 + i * 25}%`,
          background: `linear-gradient(to bottom, transparent, ${colors[i]}, transparent)`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${2 + i * 0.5}s`,
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 relative overflow-hidden">
      {renderLasers()}

      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      {children}
    </div>
  );
};
