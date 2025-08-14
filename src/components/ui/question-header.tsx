interface QuestionHeaderProps {
  authorUsername: string;
  prompt?: string;
}

export function QuestionHeader({ authorUsername, prompt = "Would you rather..." }: QuestionHeaderProps) {
  return (
    <div className="text-center mb-2 md:mb-12">
      <h2 className="hidden md:block font-serif font-black text-4xl md:text-6xl text-white mb-4 leading-tight">
        {prompt}
      </h2>
      <p className="text-slate-400 text-xs md:text-lg">
        Created by {authorUsername}
      </p>
    </div>
  );
}
