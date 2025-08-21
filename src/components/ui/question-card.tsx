import { MessageCircle, User } from "lucide-react";
import { useState } from "react";

interface QuestionCardProps {
  question: {
    id: number;
    prompt: string;
    category: string;
    author: { username: string } | null;
    responses: { text: string; order: number }[];
    _count?: { votes: number };
  };
  onVote: (choice: "A" | "B") => void;
  userVote?: "A" | "B";
  showResults?: boolean;
  voteResults?: {
    aPercentage: number;
    bPercentage: number;
    aVotes: number;
    bVotes: number;
  };
  isLoading?: boolean;
}

export function QuestionCard({
  question,
  onVote,
  userVote,
  showResults = false,
  voteResults,
  isLoading = false,
}: QuestionCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<"A" | "B" | null>(null);

  const handleVote = (choice: "A" | "B") => {
    if (userVote || showResults || isLoading) return;

    setIsAnimating(true);
    onVote(choice);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const optionA = question.responses.find((r) => r.order === 0)?.text || "";
  const optionB = question.responses.find((r) => r.order === 1)?.text || "";

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 ${
        isAnimating ? "scale-105" : ""
      }`}
    >
      <div className="p-6 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
              {question.category}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <User size={16} className="mr-1" />
            {question.author?.username || "Anonymous"}
          </div>
        </div>

        <h3 className="mb-6 text-xl leading-relaxed font-semibold text-gray-800 dark:text-gray-200">
          {question.prompt}
        </h3>

        <div className="space-y-4">
          {/* Option A */}
          <div
            className={`group relative cursor-pointer transition-all duration-300 ${
              userVote || showResults ? "" : "hover:scale-102"
            }`}
            onMouseEnter={() => setHoveredOption("A")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleVote("A")}
          >
            <div
              className={`rounded-xl border-2 p-6 transition-all duration-300 ${
                userVote === "A"
                  ? "border-blue-500 bg-blue-50 shadow-md dark:bg-blue-900/30"
                  : userVote || showResults
                    ? "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                    : hoveredOption === "A"
                      ? "border-blue-300 bg-blue-50 shadow-sm dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-200 dark:border-gray-600 dark:hover:border-blue-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center">
                    <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-bold text-white">
                      A
                    </span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Option A
                    </span>
                  </div>
                  <p className="ml-14 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {optionA}
                  </p>
                </div>
                {(userVote || showResults) && voteResults && (
                  <div className="ml-4 text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {voteResults.aPercentage}%
                    </div>
                    <div className="text-base text-gray-500">
                      {voteResults.aVotes.toLocaleString()} votes
                    </div>
                  </div>
                )}
              </div>
              {(userVote || showResults) && voteResults && (
                <div className="mt-4 ml-14">
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                      style={{ width: `${voteResults.aPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Option B */}
          <div
            className={`group relative cursor-pointer transition-all duration-300 ${
              userVote || showResults ? "" : "hover:scale-102"
            }`}
            onMouseEnter={() => setHoveredOption("B")}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleVote("B")}
          >
            <div
              className={`rounded-xl border-2 p-6 transition-all duration-300 ${
                userVote === "B"
                  ? "border-purple-500 bg-purple-50 shadow-md dark:bg-purple-900/30"
                  : userVote || showResults
                    ? "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                    : hoveredOption === "B"
                      ? "border-purple-300 bg-purple-50 shadow-sm dark:bg-purple-900/20"
                      : "border-gray-200 hover:border-purple-200 dark:border-gray-600 dark:hover:border-purple-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center">
                    <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-lg font-bold text-white">
                      B
                    </span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Option B
                    </span>
                  </div>
                  <p className="ml-14 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {optionB}
                  </p>
                </div>
                {(userVote || showResults) && voteResults && (
                  <div className="ml-4 text-right">
                    <div className="text-3xl font-bold text-purple-600">
                      {voteResults.bPercentage}%
                    </div>
                    <div className="text-base text-gray-500">
                      {voteResults.bVotes.toLocaleString()} votes
                    </div>
                  </div>
                )}
              </div>
              {(userVote || showResults) && voteResults && (
                <div className="mt-4 ml-14">
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-1000 ease-out"
                      style={{ width: `${voteResults.bPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <MessageCircle size={16} className="mr-1" />
            {question._count?.votes?.toLocaleString() ?? 0} votes
          </span>
        </div>
      </div>
    </div>
  );
}
