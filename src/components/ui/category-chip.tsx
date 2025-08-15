interface CategoryChipProps {
  category: "ETHICS" | "FUN";
}

export function CategoryChip({ category }: CategoryChipProps) {
  const isEthics = category === "ETHICS";
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isEthics 
          ? "bg-purple-900/50 text-purple-300 border border-purple-700/50" 
          : "bg-green-900/50 text-green-300 border border-green-700/50"
      }`}
    >
      {isEthics ? "Ethics" : "Fun"}
    </span>
  );
}
