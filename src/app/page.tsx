"use client";

import { Clock, Flame, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ActionButtons } from "~/components/ui/action-buttons";
import { AppLayout } from "~/components/ui/app-layout";
import { ErrorMessage } from "~/components/ui/error-message";
import { LoadingState, LoadingText } from "~/components/ui/loading-state";
import { QuestionCard } from "~/components/ui/question-card";

type Question = {
  id: number;
  prompt: string;
  category:
    | "GENERAL"
    | "ANIMALS"
    | "CAREER"
    | "ETHICS"
    | "FOOD"
    | "FUN"
    | "HEALTH"
    | "MONEY"
    | "POP_CULTURE"
    | "RELATIONSHIPS"
    | "SCI_FI"
    | "SUPERPOWERS"
    | "TRAVEL";
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

type UserStats = {
  questionsCreated: number;
  votesCount: number;
  pointsEarned: number;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    void loadNextQuestion();
    if (session?.user) {
      void loadUserStats();
    }
  }, [status]);

  const loadUserStats = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch("/api/user/profile");
      const data = (await response.json()) as { stats: UserStats };

      if (response.ok) {
        setUserStats(data.stats);
      }
    } catch {
      // Silently fail for stats
    }
  };

  const loadNextQuestion = async () => {
    setIsLoading(true);
    setError("");
    setHasVoted(false);
    setVoteResults(null);
    setSelectedOption(null);

    try {
      const response = await fetch("/api/questions/random-unseen");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load question");
        return;
      }

      if (data.message) {
        setQuestion(null);
        setError(
          "You've answered all available questions! Create some new ones.",
        );
      } else {
        setQuestion(data);
      }
    } catch (error) {
      setError("Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (!question) return;
    // Just load a new question without recording a vote
    void loadNextQuestion();
  };

  const handleVote = async (choice: "A" | "B") => {
    if (!question || hasVoted) return;

    setSelectedOption(choice);

    try {
      const response = await fetch(`/api/questions/${question.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choice }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to submit vote");
        return;
      }

      setHasVoted(true);
      setVoteResults(data.results);
    } catch (error) {
      setError("Failed to submit vote");
    }
  };

  const shareResult = () => {
    if (!question || !selectedOption) return;

    const selectedResponse = question.responses.find(
      (r) => r.order === (selectedOption === "A" ? 0 : 1),
    );
    const selectedText = selectedResponse?.text || "";
    const percentage =
      selectedOption === "A"
        ? voteResults?.aPercentage
        : voteResults?.bPercentage;

    const text = `I chose "${selectedText}" - ${percentage}% of people agree! What would you choose?`;
    if (navigator.share) {
      navigator.share({
        title: "Would You Rather?",
        text: text,
        url: window.location.href,
      });
    }
  };

  if (status === "loading") {
    return <LoadingState />;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Welcome Header */}
        {session?.user && (
          <div className="mb-8 px-4 pt-6 md:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white dark:from-blue-700 dark:to-purple-700">
              <h2 className="mb-2 text-2xl font-bold">
                Welcome back, {session.user.name ?? session.user.username}! 👋
              </h2>
              <p className="mb-4 text-blue-100 dark:text-blue-200">
                Ready to make some tough choices? You&apos;re on a 3 day streak!
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                  <div className="flex items-center space-x-2">
                    <Flame className="text-orange-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">
                      Streak
                    </span>
                  </div>
                  <div className="text-2xl font-bold">3</div>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                  <div className="flex items-center space-x-2">
                    <Users className="text-purple-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">
                      Questions
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {userStats?.questionsCreated ?? 0}
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">
                      Answered
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {userStats?.votesCount ?? 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 px-4 md:px-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {isLoading && !question ? (
          <div className="px-4 py-12 md:px-8">
            <LoadingText message="Loading question..." />
          </div>
        ) : !question ? (
          <div className="px-4 py-12 md:px-8">
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                🎉 You&apos;ve answered all questions!
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Try a different category or create your own question.
              </p>
              <button
                onClick={() => (window.location.href = "/create")}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Create Question
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Question Card */}
            <div className="px-4 pb-6 md:px-8 md:pb-12">
              <QuestionCard
                question={question}
                onVote={handleVote}
                onSkip={handleSkip}
                userVote={selectedOption ?? undefined}
                showResults={hasVoted}
                voteResults={voteResults ?? undefined}
                isLoading={isLoading}
              />
            </div>

            {/* Action Buttons */}
            {hasVoted && (
              <div className="px-4 md:px-8">
                <ActionButtons
                  isLoading={isLoading}
                  onNextQuestion={() => void loadNextQuestion()}
                  onShareResult={shareResult}
                />
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
