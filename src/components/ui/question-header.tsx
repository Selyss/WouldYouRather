import { CategoryChip } from "./category-chip";

interface QuestionHeaderProps {
  authorUsername?: string | null;
  prompt?: string;
  category?: "GENERAL" | "ANIMALS" | "CAREER" | "ETHICS" | "FOOD" | "FUN" | "HEALTH" | "MONEY" | "POP_CULTURE" | "RELATIONSHIPS" | "SCI_FI" | "SUPERPOWERS" | "TRAVEL";
}

export function QuestionHeader({ authorUsername, prompt = "Would you rather...", category }: QuestionHeaderProps) {
  return (
    <div className="text-center mb-2 md:mb-12 px-4 md:px-8 lg:px-16">
      {/* Mobile: Compact horizontal layout */}
      <div className="md:hidden mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {category && <CategoryChip category={category} />}
        </div>
        <p className="text-slate-400 text-xs">
          {authorUsername ? `By ${authorUsername}` : "System"}
        </p>
      </div>

      {/* Desktop: Centered vertical layout */}
      <div className="hidden md:block mb-4 flex justify-center">
        {category && <CategoryChip category={category} />}
      </div>

      <h2 className="font-serif font-black text-2xl md:text-4xl text-white mb-4 leading-tight">
        {prompt}
      </h2>

      <p className="hidden md:block text-slate-400 text-lg">
        {authorUsername ? `Created by ${authorUsername}` : "System Question"}
      </p>
    </div>
  );
}
