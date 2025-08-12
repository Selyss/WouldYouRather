interface ResultsBarProps {
  aPercentage: number;
  bPercentage: number;
  aVotes: number;
  bVotes: number;
}

export function ResultsBar({ aPercentage, bPercentage, aVotes, bVotes }: ResultsBarProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-2xl font-black text-blue-400 mb-1">{aPercentage}%</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-red-400 mb-1">{bPercentage}%</div>
        </div>
      </div>

      <div className="w-full h-6 rounded-full overflow-hidden bg-slate-700 shadow-inner">
        <div className="h-full flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${aPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out"
            style={{ width: `${bPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>{aVotes.toLocaleString()} votes</span>
        <span>{bVotes.toLocaleString()} votes</span>
      </div>
    </div>
  );
}
