import { Card } from "./card";

interface OptionCardProps {
  option: "A" | "B";
  text: string;
  isSelected?: boolean;
  hasVoted: boolean;
  isLoading: boolean;
  isAnimating: boolean;
  onClick: () => void;
}

export function OptionCard({ 
  option, 
  text, 
  isSelected = false, 
  hasVoted, 
  isLoading, 
  isAnimating, 
  onClick 
}: OptionCardProps) {
  const isOptionA = option === "A";
  const hoverBorderColor = isOptionA ? "hover:border-blue-400" : "hover:border-red-400";
  const selectedBorderColor = isOptionA ? "border-blue-500 bg-blue-900/20" : "border-red-500 bg-red-900/20";
  const gradientFrom = isOptionA ? "from-blue-400" : "from-red-400";
  const gradientTo = isOptionA ? "to-blue-600" : "to-red-600";

  return (
    <Card
      className={`group relative p-12 bg-slate-800 border-2 border-slate-600 ${hoverBorderColor} cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[320px] flex flex-col items-center justify-center ${
        isAnimating && isSelected ? "animate-pulse scale-[1.02]" : ""
      } ${hasVoted && isSelected ? selectedBorderColor : ""} ${
        isLoading ? "pointer-events-none opacity-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-8`}>
            <span className="text-white text-xl font-bold">{option}</span>
          </div>
          <p className="text-white text-2xl font-semibold leading-relaxed">{text}</p>
        </div>
      </div>
    </Card>
  );
}
