"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Flame, Clock, Users, ArrowRight } from "lucide-react";
import { AppLayout } from "~/components/ui/app-layout";
import { QuestionHeader } from "~/components/ui/question-header";
import { OptionCard } from "~/components/ui/option-card";
import { VsButton, VsButtonMobile } from "~/components/ui/vs-button";
import { ResultsBar } from "~/components/ui/results-bar";
import { ActionButtons } from "~/components/ui/action-buttons";
import { ErrorMessage } from "~/components/ui/error-message";
import { LoadingState, LoadingText } from "~/components/ui/loading-state";

type Question = {
  id: number;
  prompt: string;
  category: "GENERAL" | "ANIMALS" | "CAREER" | "ETHICS" | "FOOD" | "FUN" | "HEALTH" | "MONEY" | "POP_CULTURE" | "RELATIONSHIPS" | "SCI_FI" | "SUPERPOWERS" | "TRAVEL";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'unanswered'>('all');

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
      const data = await response.json() as { stats: UserStats };

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
        setError("You've answered all available questions! Create some new ones.");
      } else {
        setQuestion(data);
      }
    } catch (error) {
      setError("Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (choice: "A" | "B") => {
    if (!question || hasVoted) return;

    setIsAnimating(true);
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
        setIsAnimating(false);
        return;
      }

      setHasVoted(true);
      setVoteResults(data.results);
      setIsAnimating(false);
    } catch (error) {
      setError("Failed to submit vote");
      setIsAnimating(false);
    }
  };

  const shareResult = () => {
    if (!question || !selectedOption) return;

    const selectedResponse = question.responses.find(r => r.order === (selectedOption === "A" ? 0 : 1));
    const selectedText = selectedResponse?.text || "";
    const percentage = selectedOption === "A" ? voteResults?.aPercentage : voteResults?.bPercentage;

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
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        {session?.user && (
          <div className="mb-8 px-4 md:px-8 pt-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {session.user.name ?? session.user.username}! 👋</h2>
              <p className="text-blue-100 dark:text-blue-200 mb-4">Ready to make some tough choices? You&apos;re on a 3 day streak!</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Flame className="text-orange-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">Streak</span>
                  </div>
                  <div className="text-2xl font-bold">3</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="text-purple-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">Questions</span>
                  </div>
                  <div className="text-2xl font-bold">{userStats?.questionsCreated ?? 0}</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-300" size={20} />
                    <span className="text-sm text-blue-100 dark:text-blue-200">Answered</span>
                  </div>
                  <div className="text-2xl font-bold">{userStats?.votesCount ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-4 md:px-8 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: 'all', label: 'All Questions', icon: Users },
              { key: 'unanswered', label: 'New for You', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'unanswered')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  filter === key
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 md:px-8 mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {isLoading && !question ? (
          <div className="px-4 md:px-8 py-12">
            <LoadingText message="Loading question..." />
          </div>
        ) : !question ? (
          <div className="px-4 md:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🎉 You&apos;ve answered all questions!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try a different category or create your own question.</p>
              <button
                onClick={() => window.location.href = '/create'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Question
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question Title */}
            <div className="px-4 md:px-8 pb-4 md:pb-8">
              <QuestionHeader
                authorUsername={question.author?.username}
                prompt={question.prompt}
                category={question.category}
              />
            </div>

            {/* Choice Cards */}
            <div className="px-4 md:px-8 pb-6 md:pb-12">
              <div className="max-w-6xl mx-auto">
                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8 relative">
                  {/* Option A */}
                  <OptionCard
                    option="A"
                    text={question.responses[0]?.text ?? ""}
                    isSelected={selectedOption === "A"}
                    hasVoted={hasVoted}
                    isLoading={isLoading}
                    isAnimating={isAnimating}
                    onClick={() => !hasVoted && !isLoading && void handleVote("A")}
                  />

                  {/* Option B */}
                  <OptionCard
                    option="B"
                    text={question.responses[1]?.text ?? ""}
                    isSelected={selectedOption === "B"}
                    hasVoted={hasVoted}
                    isLoading={isLoading}
                    isAnimating={isAnimating}
                    onClick={() => !hasVoted && !isLoading && void handleVote("B")}
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
                    text={question.responses[0]?.text ?? ""}
                    isSelected={selectedOption === "A"}
                    hasVoted={hasVoted}
                    isLoading={isLoading}
                    isAnimating={isAnimating}
                    onClick={() => !hasVoted && !isLoading && void handleVote("A")}
                  />

                  {/* Option B */}
                  <OptionCard
                    option="B"
                    text={question.responses[1]?.text ?? ""}
                    isSelected={selectedOption === "B"}
                    hasVoted={hasVoted}
                    isLoading={isLoading}
                    isAnimating={isAnimating}
                    onClick={() => !hasVoted && !isLoading && void handleVote("B")}
                  />

                  {/* Mobile VS Button - Overlay */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <VsButtonMobile />
                  </div>
                </div>

                {hasVoted && voteResults && (
                  <div className="mb-4 md:mb-8">
                    {/* Combined Results Bar */}
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
                  <>
                    <ActionButtons
                      isLoading={isLoading}
                      onNextQuestion={() => void loadNextQuestion()}
                      onShareResult={shareResult}
                    />
                    
                    {/* Next Question Button */}
                    <div className="text-center mt-6">
                      <button
                        onClick={() => void loadNextQuestion()}
                        disabled={isLoading}
                        className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                      >
                        <span>Next Question</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
