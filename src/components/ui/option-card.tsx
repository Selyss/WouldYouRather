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

  // Apply selected styling if the option is selected (regardless of vote status)
  const isHighlighted = isSelected;

  return (
    <Card
      className={`group relative p-8 md:p-12 bg-slate-800 border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[240px] md:min-h-[320px] flex flex-col items-center justify-center ${isHighlighted
          ? selectedBorderColor // Keep selected styling when clicked
          : `border-slate-600 ${hoverBorderColor}` // Default + hover when not selected
        } ${
        isAnimating && isSelected ? "animate-pulse scale-[1.02]" : ""
        } ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center transition-transform mb-6 md:mb-8 ${isHighlighted ? "scale-110" : "group-hover:scale-110"
            }`}>
            <span className="text-white text-xl md:text-xl font-bold">{option}</span>
          </div>
          <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed">{text}</p>
        </div>
      </div>
    </Card>
  );
}
