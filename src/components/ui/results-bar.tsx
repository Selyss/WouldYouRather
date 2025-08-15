import { useState, useEffect } from "react";

interface ResultsBarProps {
  aPercentage: number;
  bPercentage: number;
  aVotes: number;
  bVotes: number;
}

export function ResultsBar({ aPercentage, bPercentage, aVotes, bVotes }: ResultsBarProps) {
    const [animatedAPercentage, setAnimatedAPercentage] = useState(0);
    const [animatedBPercentage, setAnimatedBPercentage] = useState(0);
  const [displayAPercentage, setDisplayAPercentage] = useState(0);
  const [displayBPercentage, setDisplayBPercentage] = useState(0);

    useEffect(() => {
      // Reset display percentages when new data arrives
      setDisplayAPercentage(0);
      setDisplayBPercentage(0);

      // Start bar width animation after component mounts
      const barTimer = setTimeout(() => {
            setAnimatedAPercentage(aPercentage);
            setAnimatedBPercentage(bPercentage);
        }, 100);

      // Animate the percentage numbers with a counting effect
      const duration = 1500; // Match the bar animation duration
      const steps = 60; // Number of animation steps
      const stepDuration = duration / steps;

      let currentStep = 0;

      const numberTimer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        // Use easeOut animation curve for smooth counting
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setDisplayAPercentage(Math.round(aPercentage * easeOut));
        setDisplayBPercentage(Math.round(bPercentage * easeOut));

        if (currentStep >= steps) {
          clearInterval(numberTimer);
          // Ensure we end up with exact final values
          setDisplayAPercentage(aPercentage);
          setDisplayBPercentage(bPercentage);
        }
      }, stepDuration);

      return () => {
        clearTimeout(barTimer);
        clearInterval(numberTimer);
      };
    }, [aPercentage, bPercentage]);

  return (
    <div className="max-w-4xl mx-auto mb-4 md:mb-8">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-black text-blue-400 mb-1">{displayAPercentage}%</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-black text-red-400 mb-1">{displayBPercentage}%</div>
        </div>
      </div>

      <div className="w-full h-4 md:h-6 rounded-full overflow-hidden bg-slate-700 shadow-inner relative">
              {/* Blue bar (Option A) - animates from left */}
              <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1500 ease-out rounded-l-full"
                  style={{ width: `${animatedAPercentage}%` }}
              />
              {/* Red bar (Option B) - animates from right */}
              <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-400 to-red-600 transition-all duration-1500 ease-out rounded-r-full"
                  style={{ width: `${animatedBPercentage}%` }}
              />
      </div>

      <div className="flex justify-between mt-1 md:mt-2 text-xs text-slate-500">
        <span>{aVotes.toLocaleString()} votes</span>
        <span>{bVotes.toLocaleString()} votes</span>
      </div>
    </div>
  );
}
