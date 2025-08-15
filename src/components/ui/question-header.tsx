import { CategoryChip } from "./category-chip";

interface QuestionHeaderProps {
  authorUsername?: string | null;
  prompt?: string;
  category?: "GENERAL" | "ANIMALS" | "CAREER" | "ETHICS" | "FOOD" | "FUN" | "HEALTH" | "MONEY" | "POP_CULTURE" | "RELATIONSHIPS" | "SCI_FI" | "SUPERPOWERS" | "TRAVEL";
}

export function QuestionHeader({ authorUsername, prompt = "Would you rather...", category }: QuestionHeaderProps) {
  return (
    <div className="text-center mb-2 md:mb-12">
      <div className="mb-4 flex justify-center">
        {category && <CategoryChip category={category} />}
      </div>
      <h2 className="hidden md:block font-serif font-black text-2xl md:text-4xl text-white mb-4 leading-tight px-4 md:px-8 lg:px-16">
        {prompt}
      </h2>
      <p className="text-slate-400 text-xs md:text-lg">
        {authorUsername ? `Created by ${authorUsername}` : "System Question"}
      </p>
    </div>
  );
}
