interface CategoryChipProps {
  category: "GENERAL" | "ANIMALS" | "CAREER" | "ETHICS" | "FOOD" | "FUN" | "HEALTH" | "MONEY" | "POP_CULTURE" | "RELATIONSHIPS" | "SCI_FI" | "SUPERPOWERS" | "TRAVEL";
}

export function CategoryChip({ category }: CategoryChipProps) {
  const categoryConfig = {
    GENERAL: { bg: "bg-gray-900/50", text: "text-gray-300", border: "border-gray-700/50", label: "General" },
    ANIMALS: { bg: "bg-amber-900/50", text: "text-amber-300", border: "border-amber-700/50", label: "Animals" },
    CAREER: { bg: "bg-blue-900/50", text: "text-blue-300", border: "border-blue-700/50", label: "Career" },
    ETHICS: { bg: "bg-purple-900/50", text: "text-purple-300", border: "border-purple-700/50", label: "Ethics" },
    FOOD: { bg: "bg-orange-900/50", text: "text-orange-300", border: "border-orange-700/50", label: "Food" },
    FUN: { bg: "bg-green-900/50", text: "text-green-300", border: "border-green-700/50", label: "Fun" },
    HEALTH: { bg: "bg-red-900/50", text: "text-red-300", border: "border-red-700/50", label: "Health" },
    MONEY: { bg: "bg-yellow-900/50", text: "text-yellow-300", border: "border-yellow-700/50", label: "Money" },
    POP_CULTURE: { bg: "bg-pink-900/50", text: "text-pink-300", border: "border-pink-700/50", label: "Pop Culture" },
    RELATIONSHIPS: { bg: "bg-rose-900/50", text: "text-rose-300", border: "border-rose-700/50", label: "Relationships" },
    SCI_FI: { bg: "bg-cyan-900/50", text: "text-cyan-300", border: "border-cyan-700/50", label: "Sci-Fi" },
    SUPERPOWERS: { bg: "bg-indigo-900/50", text: "text-indigo-300", border: "border-indigo-700/50", label: "Superpowers" },
    TRAVEL: { bg: "bg-teal-900/50", text: "text-teal-300", border: "border-teal-700/50", label: "Travel" }
  };

  const config = categoryConfig[category];
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
    >
      {config.label}
    </span>
  );
}
