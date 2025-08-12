"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    if (status === "loading") return;
    // Load questions regardless of authentication status
    loadNextQuestion();
  }, [status]);

  const loadNextQuestion = async () => {
    setIsLoading(true);
    setError("");
    setHasVoted(false);
    setVoteResults(null);

    try {
      const response = await fetch("/api/questions/random-unseen");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load question");
        return;
      }

      if (data.message) {
        // No more questions
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

    setIsLoading(true);
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
        return;
      }

      setHasVoted(true);
      setVoteResults(data.results);
    } catch (error) {
      setError("Failed to submit vote");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Would You Rather</h1>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user.username}!
                  </span>
                  <Link
                    href="/create"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Create Question
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome! Sign in to create questions.
                  </span>
                  <Link
                    href="/auth/signin"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700 text-center">{error}</div>
          </div>
        )}

        {isLoading && !question ? (
          <div className="text-center">
            <div className="text-xl">Loading question...</div>
          </div>
        ) : !question ? (
          <div className="text-center">
            <div className="text-xl text-gray-600 mb-4">
              No questions available. Why not create the first one?
            </div>
              {session ? (
              <Link
                href="/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Create Question
              </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium"
                >
                  Sign In to Create Questions
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Would You Rather...
                </h2>
                <p className="text-sm text-gray-600">
                  Created by {question.author.username}
                </p>
              </div>

              {!hasVoted ? (
                <div className="space-y-4">
                  <button
                    onClick={() => handleVote("A")}
                    disabled={isLoading}
                    className="w-full p-6 text-left border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-lg font-medium text-gray-900">
                      A: {question.optionA}
                    </div>
                  </button>

                  <div className="text-center text-gray-500 font-medium">OR</div>

                  <button
                    onClick={() => handleVote("B")}
                    disabled={isLoading}
                    className="w-full p-6 text-left border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-lg font-medium text-gray-900">
                      B: {question.optionB}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 border-2 border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-medium text-gray-900">
                        A: {question.optionA}
                      </div>
                      <div className="text-lg font-bold text-indigo-600">
                        {voteResults?.aPercentage}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${voteResults?.aPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {voteResults?.aVotes} votes
                    </div>
                  </div>

                  <div className="text-center text-gray-500 font-medium">OR</div>

                  <div className="p-6 border-2 border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-medium text-gray-900">
                        B: {question.optionB}
                      </div>
                      <div className="text-lg font-bold text-indigo-600">
                        {voteResults?.bPercentage}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${voteResults?.bPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {voteResults?.bVotes} votes
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <div className="text-sm text-gray-600 mb-4">
                      Total votes: {voteResults?.totalVotes}
                    </div>
                    <button
                      onClick={loadNextQuestion}
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                          {isLoading ? "Loading..." : "Next Question"}
                        </button>
                      </div>
                    </div>
                )}
              </div>
        )}
      </main>
    </div>
  );
}
