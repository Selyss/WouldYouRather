"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { AppLayout } from "~/components/ui/app-layout";
import { QuestionHeader } from "~/components/ui/question-header";
import { OptionCard } from "~/components/ui/option-card";
import { VsButton, VsButtonMobile } from "~/components/ui/vs-button";
import { ResultsBar } from "~/components/ui/results-bar";
import { ActionButtons } from "~/components/ui/action-buttons";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Question = {
  id: number;
  prompt: string;
  category: string;
  sensitiveContent: boolean;
  score: number;
  responses: {
    id: number;
    text: string;
    order: number;
  }[];
  author: {
    username: string;
  } | null;
  _count: {
    votes: number;
  };
};

type VoteResults = {
  totalVotes: number;
  aVotes: number;
  bVotes: number;
  aPercentage: number;
  bPercentage: number;
};

const CATEGORY_INFO: Record<string, { label: string; emoji: string; description: string }> = {
  general: { label: "General", emoji: "🤔", description: "Everyday choices and decisions" },
  animals: { label: "Animals", emoji: "🐾", description: "Animal-related questions" },
  career: { label: "Career", emoji: "💼", description: "Work and professional life" },
  ethics: { label: "Ethics", emoji: "⚖️", description: "Moral and ethical dilemmas" },
  food: { label: "Food", emoji: "🍽️", description: "Culinary choices and preferences" },
  fun: { label: "Fun", emoji: "🎉", description: "Entertainment and leisure" },
  health: { label: "Health", emoji: "🏥", description: "Health and wellness topics" },
  money: { label: "Money", emoji: "💰", description: "Financial decisions" },
  pop_culture: { label: "Pop Culture", emoji: "🎬", description: "Movies, music, and trends" },
  relationships: { label: "Relationships", emoji: "💕", description: "Love, friendship, and social connections" },
  sci_fi: { label: "Sci-Fi", emoji: "🚀", description: "Science fiction scenarios" },
  superpowers: { label: "Superpowers", emoji: "⚡", description: "Superhero abilities and powers" },
  travel: { label: "Travel", emoji: "✈️", description: "Adventures and destinations" },
};

export default function CategoryPage() {
  const { data: session } = useSession();
  const params = useParams();
  const category = params.category as string;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const categoryInfo = CATEGORY_INFO[category] || { 
    label: category.charAt(0).toUpperCase() + category.slice(1), 
    emoji: "🤔", 
    description: "Questions in this category" 
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/questions/category/${category}`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setHasVoted(false);
        setVoteResults(null);
        setSelectedOption(null);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions for this category");
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchQuestions();
    }
  }, [category]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleVote = async (choice: "A" | "B") => {
    if (!currentQuestion || hasVoted || isLoading) return;

    setIsLoading(true);
    setSelectedOption(choice);
    setIsAnimating(true);

    try {
      const response = await fetch(`/api/questions/${currentQuestion.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responseId: currentQuestion.responses[choice === "A" ? 0 : 1]?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoteResults(data.results);
        setHasVoted(true);
        setError("");
      } else {
        setError(data.error || "Failed to submit vote");
        setSelectedOption(null);
      }
    } catch (error) {
      setError("Failed to submit vote");
      setSelectedOption(null);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const loadNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHasVoted(false);
      setVoteResults(null);
      setSelectedOption(null);
      setError("");
    } else {
      // Reached end of questions, could implement pagination here
      setError("No more questions in this category");
    }
  };

  const shareResult = async () => {
    if (!currentQuestion || !voteResults) return;

    const shareText = `I just voted on: "${currentQuestion.prompt}" - Check it out on Would You Rather!`;
    const shareUrl = `${window.location.origin}/questions/${currentQuestion.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Would You Rather?",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      // Could show a toast notification here
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading questions...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error && questions.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">{categoryInfo.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Questions Found</h2>
            <p className="text-slate-400 mb-6">
              There are currently no questions in the {categoryInfo.label} category.
            </p>
            <div className="space-y-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </Link>
              <Link
                href="/"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Or browse all questions
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!currentQuestion) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">{categoryInfo.emoji}</div>
            <p className="text-white text-lg">No questions available</p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Category Header */}
      <div className="px-4 md:px-8 pt-6 pb-4 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl">{categoryInfo.emoji}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-white">
                {categoryInfo.label}
              </h1>
              <p className="text-slate-400">{categoryInfo.description}</p>
            </div>
          </div>
          
          <div className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="px-4 md:px-8 py-6 md:py-12">
        {/* Error Message */}
        {error && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Question Header */}
        <QuestionHeader
          authorUsername={currentQuestion.author?.username}
          prompt={currentQuestion.prompt}
          category={currentQuestion.category as any}
        />

        {/* Choice Cards */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8 relative">
            {/* Option A */}
            <OptionCard
              option="A"
              text={currentQuestion.responses[0]?.text || ""}
              isSelected={selectedOption === "A"}
              hasVoted={hasVoted}
              isLoading={isLoading}
              isAnimating={isAnimating}
              onClick={() => !hasVoted && !isLoading && handleVote("A")}
            />

            {/* Option B */}
            <OptionCard
              option="B"
              text={currentQuestion.responses[1]?.text || ""}
              isSelected={selectedOption === "B"}
              hasVoted={hasVoted}
              isLoading={isLoading}
              isAnimating={isAnimating}
              onClick={() => !hasVoted && !isLoading && handleVote("B")}
            />

            {/* Desktop VS Button */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <VsButton />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col gap-2 mb-4 relative">
            {/* Option A */}
            <OptionCard
              option="A"
              text={currentQuestion.responses[0]?.text || ""}
              isSelected={selectedOption === "A"}
              hasVoted={hasVoted}
              isLoading={isLoading}
              isAnimating={isAnimating}
              onClick={() => !hasVoted && !isLoading && handleVote("A")}
            />

            {/* Option B */}
            <OptionCard
              option="B"
              text={currentQuestion.responses[1]?.text || ""}
              isSelected={selectedOption === "B"}
              hasVoted={hasVoted}
              isLoading={isLoading}
              isAnimating={isAnimating}
              onClick={() => !hasVoted && !isLoading && handleVote("B")}
            />

            {/* Mobile VS Button */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <VsButtonMobile />
            </div>
          </div>

          {hasVoted && voteResults && (
            <div className="mb-4 md:mb-8">
              <ResultsBar
                aPercentage={voteResults.aPercentage}
                bPercentage={voteResults.bPercentage}
                aVotes={voteResults.aVotes}
                bVotes={voteResults.bVotes}
              />
            </div>
          )}

          {/* Action Buttons */}
          {hasVoted && (
            <ActionButtons
              isLoading={isLoading}
              onNextQuestion={loadNextQuestion}
              onShareResult={shareResult}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
