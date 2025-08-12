"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!optionA.trim() || !optionB.trim()) {
      setError("Both options are required");
      return;
    }

    if (optionA.length > 200 || optionB.length > 200) {
      setError("Each option must be less than 200 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionA: optionA.trim(),
          optionB: optionB.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create question");
        return;
      }

      // Redirect back to home page
      router.push("/");
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Question</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Back to Game
              </Link>
              <span className="text-sm text-gray-600">
                Welcome, {session.user.username}!
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create a New "Would You Rather" Question
            </h2>
            <p className="text-gray-600">
              Give people two interesting choices to pick from!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="optionA" className="block text-sm font-medium text-gray-700 mb-2">
                Option A
              </label>
              <textarea
                id="optionA"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the first option..."
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                disabled={isLoading}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {optionA.length}/200 characters
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium text-lg">
              OR
            </div>

            <div>
              <label htmlFor="optionB" className="block text-sm font-medium text-gray-700 mb-2">
                Option B
              </label>
              <textarea
                id="optionB"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the second option..."
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                disabled={isLoading}
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {optionB.length}/200 characters
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="flex space-x-4">
              <Link
                href="/"
                className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !optionA.trim() || !optionB.trim()}
                className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Question"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
