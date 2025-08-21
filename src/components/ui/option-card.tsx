import { useState } from "react";

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
  onClick,
}: OptionCardProps) {
  const [hoveredOption, setHoveredOption] = useState(false);
  const isOptionA = option === "A";

  // Color scheme matching AI UI exactly
  const colorScheme = isOptionA
    ? {
        gradient: "from-blue-500 to-blue-600",
        selectedBorder:
          "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md",
        hoverBorder: "border-blue-300 bg-blue-50 dark:bg-blue-900/20 shadow-sm",
        defaultBorder:
          "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400",
        votedBorder:
          "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700",
      }
    : {
        gradient: "from-purple-500 to-purple-600",
        selectedBorder:
          "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md",
        hoverBorder:
          "border-purple-300 bg-purple-50 dark:bg-purple-900/20 shadow-sm",
        defaultBorder:
          "border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-400",
        votedBorder:
          "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700",
      };

  const getBorderClasses = () => {
    if (isSelected) return colorScheme.selectedBorder;
    if (hasVoted) return colorScheme.votedBorder;
    if (hoveredOption) return colorScheme.hoverBorder;
    return colorScheme.defaultBorder;
  };

  return (
    <div
      className={`group relative cursor-pointer transition-all duration-300 ${
        hasVoted || isLoading ? "" : "hover:scale-102"
      } ${isAnimating && isSelected ? "scale-105" : ""}`}
      onMouseEnter={() => setHoveredOption(true)}
      onMouseLeave={() => setHoveredOption(false)}
      onClick={onClick}
    >
      <div
        className={`min-h-[200px] rounded-xl border-2 p-6 transition-all duration-300 md:min-h-[240px] ${getBorderClasses()} ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div className="flex h-full items-center justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center">
              <span
                className={`h-10 w-10 bg-gradient-to-r ${colorScheme.gradient} mr-4 flex items-center justify-center rounded-lg text-lg font-bold text-white`}
              >
                {option}
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Option {option}
              </span>
            </div>
            <p className="ml-14 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
