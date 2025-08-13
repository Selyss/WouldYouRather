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

    useEffect(() => {
        // Start animation after component mounts
        const timer = setTimeout(() => {
            setAnimatedAPercentage(aPercentage);
            setAnimatedBPercentage(bPercentage);
        }, 100);

        return () => clearTimeout(timer);
    }, [aPercentage, bPercentage]);

  return (
    <div className="max-w-4xl mx-auto mb-4 md:mb-8">
      <div className="flex justify-between items-center mb-2 md:mb-4">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-black text-blue-400 mb-1">{aPercentage}%</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-black text-red-400 mb-1">{bPercentage}%</div>
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
