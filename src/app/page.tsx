"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppHeader } from "~/components/ui/app-header";
import { QuestionHeader } from "~/components/ui/question-header";
import { OptionCard } from "~/components/ui/option-card";
import { VsButton, VsButtonMobile } from "~/components/ui/vs-button";
import { ResultsBar } from "~/components/ui/results-bar";
import { ActionButtons } from "~/components/ui/action-buttons";
import { ErrorMessage } from "~/components/ui/error-message";
import { EmptyState } from "~/components/ui/empty-state";
import { LoadingState, LoadingText } from "~/components/ui/loading-state";

type Question = {
  id: number;
  optionA: string;
  optionB: string;
  prompt: string;
  author: {
    username: string;
  };
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    loadNextQuestion();
  }, [status]);

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
    const text = `I chose "${selectedOption === "A" ? question?.optionA : question?.optionB}" - ${selectedOption === "A" ? voteResults?.aPercentage : voteResults?.bPercentage}% of people agree! What would you choose?`;
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <AppHeader session={session} />

      {/* Main Content */}
      <main className="px-4 md:px-8 py-2 md:py-12">
        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {isLoading && !question ? (
          <LoadingText message="Loading question..." />
        ) : !question ? (
            <EmptyState session={session} />
          ) : (
              <>
                {/* Question Title */}
                <QuestionHeader authorUsername={question.author.username} prompt={question.prompt} />

                {/* Choice Cards */}
                <div className="max-w-6xl mx-auto">
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8 relative">
                    {/* Option A */}
                    <OptionCard
                      option="A"
                      text={question.optionA}
                      isSelected={selectedOption === "A"}
                      hasVoted={hasVoted}
                      isLoading={isLoading}
                      isAnimating={isAnimating}
                      onClick={() => !hasVoted && !isLoading && handleVote("A")}
                    />

                    {/* Option B */}
                    <OptionCard
                      option="B"
                      text={question.optionB}
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
                      text={question.optionA}
                      isSelected={selectedOption === "A"}
                      hasVoted={hasVoted}
                      isLoading={isLoading}
                      isAnimating={isAnimating}
                      onClick={() => !hasVoted && !isLoading && handleVote("A")}
                    />

                    {/* Option B */}
                    <OptionCard
                      option="B"
                      text={question.optionB}
                      isSelected={selectedOption === "B"}
                      hasVoted={hasVoted}
                      isLoading={isLoading}
                      isAnimating={isAnimating}
                      onClick={() => !hasVoted && !isLoading && handleVote("B")}
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
                    <ActionButtons
                      isLoading={isLoading}
                      onNextQuestion={loadNextQuestion}
                      onShareResult={shareResult}
                    />
                  )}
                </div>
              </>
        )}
      </main>
    </div>
  );
}
