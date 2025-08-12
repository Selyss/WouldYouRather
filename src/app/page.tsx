"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type Question = {
  id: number;
  optionA: string;
  optionB: string;
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
  const router = useRouter();
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
        setError(data.error || "Failed to submit vote");
        setIsAnimating(false);
        return;
      }

      setTimeout(() => {
        setHasVoted(true);
        setVoteResults(data.results);
        setIsAnimating(false);
      }, 600);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-6 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-slate-800 text-xl font-bold">?</span>
          </div>
          <div>
            <h1 className="font-serif font-black text-xl text-white">Would You Rather?</h1>
            <p className="text-slate-300 text-sm font-medium">Make your choice & see the results</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                <span className="text-slate-300 text-sm font-medium">Welcome, {session.user.username}!</span>
              </div>

              <Button
                onClick={() => router.push("/create")}
                className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                + Add Question
              </Button>

              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-2.5 rounded-xl font-semibold bg-transparent"
              >
                Sign Out
              </Button>
            </>
          ) : (
              <>
                <div className="hidden md:flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                  <span className="text-slate-300 text-sm font-medium">Welcome! Sign in to create questions.</span>
                </div>

                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  Sign In
                </Button>

                <Button
                  onClick={() => router.push("/auth/signup")}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-2.5 rounded-xl font-semibold bg-transparent"
                >
                  Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
              <div className="text-red-300 text-center">{error}</div>
            </div>
          </div>
        )}

        {isLoading && !question ? (
          <div className="text-center">
            <div className="text-xl text-white">Loading question...</div>
          </div>
        ) : !question ? (
          <div className="text-center">
              <div className="text-xl text-slate-300 mb-4">
              No questions available. Why not create the first one?
            </div>
              {session ? (
                <Button
                  onClick={() => router.push("/create")}
                  className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Create Question
                </Button>
              ) : (
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                  >
                    Sign In to Create Questions
                </Button>
              )}
            </div>
          ) : (
              <>
                {/* Question Title */}
                <div className="text-center mb-12">
                  <h2 className="font-serif font-black text-4xl md:text-6xl text-white mb-4 leading-tight">
                    Would you rather...
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Created by {question.author.username}
                  </p>
                </div>

                {/* Choice Cards */}
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-8 mb-8 relative">
                    {/* Option A */}
                    <Card
                      className={`group relative p-12 bg-slate-800 border-2 border-slate-600 hover:border-blue-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[320px] flex flex-col items-center justify-center ${isAnimating && selectedOption === "A" ? "animate-pulse scale-[1.02]" : ""
                        } ${hasVoted && selectedOption === "A" ? "border-blue-500 bg-blue-900/20" : ""} ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                      onClick={() => !hasVoted && !isLoading && handleVote("A")}
                    >
                      <div className="text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-8">
                            <span className="text-white text-xl font-bold">A</span>
                          </div>
                          <p className="text-white text-2xl font-semibold leading-relaxed">{question.optionA}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Option B */}
                    <Card
                      className={`group relative p-12 bg-slate-800 border-2 border-slate-600 hover:border-red-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[320px] flex flex-col items-center justify-center ${isAnimating && selectedOption === "B" ? "animate-pulse scale-[1.02]" : ""
                        } ${hasVoted && selectedOption === "B" ? "border-red-500 bg-red-900/20" : ""} ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                      onClick={() => !hasVoted && !isLoading && handleVote("B")}
                    >
                      <div className="text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-8">
                            <span className="text-white text-xl font-bold">B</span>
                          </div>
                          <p className="text-white text-2xl font-semibold leading-relaxed">{question.optionB}</p>
                        </div>
                      </div>
                    </Card>

                    {/* VS Button */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-800 animate-pulse">
                        <span className="text-white font-black text-xl drop-shadow-lg">VS</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-60 -z-10 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Mobile VS Button */}
                    <div className="flex items-center justify-center mb-8 md:hidden">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <span className="text-white font-black text-lg drop-shadow-lg">VS</span>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-60 -z-10 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {hasVoted && voteResults && (
                    <div className="mb-8">
                      {/* Combined Results Bar */}
                      <div className="max-w-4xl mx-auto mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-black text-blue-400 mb-1">{voteResults.aPercentage}%</div>
                      </div>
                          <div className="text-center">
                            <div className="text-2xl font-black text-red-400 mb-1">{voteResults.bPercentage}%</div>
                      </div>
                    </div>

                        <div className="w-full h-6 rounded-full overflow-hidden bg-slate-700 shadow-inner">
                          <div className="h-full flex">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
                              style={{ width: `${voteResults.aPercentage}%` }}
                            />
                            <div
                              className="bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out"
                              style={{ width: `${voteResults.bPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                          <span>{voteResults.aVotes.toLocaleString()} votes</span>
                          <span>{voteResults.bVotes.toLocaleString()} votes</span>
                    </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {hasVoted && (
                    <div className="text-center space-y-4">
                      <Button
                        onClick={loadNextQuestion}
                        disabled={isLoading}
                        className="bg-white hover:bg-gray-100 text-slate-800 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isLoading ? "Loading..." : "Next Challenge →"}
                      </Button>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={shareResult}
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
                        >
                          Share Result
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
                        >
                          Challenge Friend
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
        )}
      </main>
    </div>
  );
}
