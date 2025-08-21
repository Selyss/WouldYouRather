"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLayout } from "~/components/ui/app-layout";

// Category mapping to match AI UI structure with your existing backend categories
const categories = [
  {
    id: "GENERAL",
    name: "General",
    description: "Everyday choices and general topics",
    icon: "🤔",
    color: "bg-blue-500",
  },
  {
    id: "CAREER",
    name: "Career",
    description: "Professional and work-related decisions",
    icon: "💼",
    color: "bg-green-500",
  },
  {
    id: "RELATIONSHIPS",
    name: "Relationships",
    description: "Love, friendship, and social connections",
    icon: "❤️",
    color: "bg-pink-500",
  },
  {
    id: "FUN",
    name: "Entertainment",
    description: "Movies, music, games, and fun",
    icon: "🎬",
    color: "bg-purple-500",
  },
  {
    id: "FOOD",
    name: "Food & Drink",
    description: "Culinary choices and taste preferences",
    icon: "🍕",
    color: "bg-orange-500",
  },
  {
    id: "TRAVEL",
    name: "Travel",
    description: "Adventures and destinations",
    icon: "✈️",
    color: "bg-cyan-500",
  },
  {
    id: "HEALTH",
    name: "Health",
    description: "Wellness and lifestyle choices",
    icon: "💪",
    color: "bg-emerald-500",
  },
  {
    id: "MONEY",
    name: "Money",
    description: "Financial decisions and choices",
    icon: "💰",
    color: "bg-yellow-500",
  },
  {
    id: "SUPERPOWERS",
    name: "Superpowers",
    description: "Fantasy and superhero scenarios",
    icon: "⚡",
    color: "bg-indigo-500",
  },
  {
    id: "ETHICS",
    name: "Ethics",
    description: "Moral and ethical dilemmas",
    icon: "⚖️",
    color: "bg-gray-500",
  },
  {
    id: "ANIMALS",
    name: "Animals",
    description: "Animal-related choices",
    icon: "🐾",
    color: "bg-amber-500",
  },
  {
    id: "SCI_FI",
    name: "Sci-Fi",
    description: "Science fiction and futuristic scenarios",
    icon: "🚀",
    color: "bg-violet-500",
  },
  {
    id: "POP_CULTURE",
    name: "Pop Culture",
    description: "Trends, celebrities, and popular culture",
    icon: "🎭",
    color: "bg-rose-500",
  },
];

export default function CreateQuestionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("Would you rather...");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [category, setCategory] = useState<
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
    | "TRAVEL"
  >("GENERAL");
  const [sensitiveContent, setSensitiveContent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Additional state for AI UI features
  const [showSuccess, setShowSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-slate-700 bg-slate-800/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                Sign In Required
              </CardTitle>
              <CardDescription className="text-slate-400">
                You need to be signed in to create questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Link href="/">Back to Questions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!optionA.trim() || !optionB.trim()) {
      setError("Both options are required");
      return;
    }

    if (!prompt.trim()) {
      setError("Question prompt is required");
      return;
    }

    if (optionA.length > 200 || optionB.length > 200) {
      setError("Each option must be less than 200 characters");
      return;
    }

    if (prompt.length > 100) {
      setError("Prompt must be less than 100 characters");
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
          prompt: prompt.trim(),
          optionA: optionA.trim(),
          optionB: optionB.trim(),
          category: category,
          sensitiveContent: sensitiveContent,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Failed to create question");
        return;
      }

      // Redirect back to home page
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setPrompt("Would you rather...");
      setOptionA("");
      setOptionB("");
      setCategory("GENERAL");
      setSensitiveContent(false);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex items-center">
            <Plus className="mr-3 text-blue-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create a Question
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share a thought-provoking &ldquo;Would You Rather&rdquo; with
                the community
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="mb-6 flex items-center rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="mr-3 text-green-600" size={20} />
              <div>
                <div className="font-medium text-green-800 dark:text-green-300">
                  Question Created Successfully!
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Your question has been added to the community.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Question
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Would you rather..."
                  className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-4 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  maxLength={100}
                  disabled={isLoading}
                />
                <div className="absolute right-2 bottom-2 text-sm text-gray-400 dark:text-gray-500">
                  {prompt.length}/100
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Option A
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
                    A
                  </div>
                  <textarea
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="First option..."
                    className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={2}
                    maxLength={200}
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2 text-sm text-gray-400 dark:text-gray-500">
                    {optionA.length}/200
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Option B
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500 text-sm font-bold text-white">
                    B
                  </div>
                  <textarea
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Second option..."
                    className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-900 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows={2}
                    maxLength={200}
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2 text-sm text-gray-400 dark:text-gray-500">
                    {optionB.length}/200
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as typeof category)}
                    disabled={isLoading}
                    className={`rounded-lg border-2 p-2 text-xs transition-all ${
                      category === cat.id
                        ? `${cat.color} border-current text-white`
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-1 text-sm">{cat.icon}</div>
                      <div
                        className={`font-medium ${category === cat.id ? "text-white" : "text-gray-900 dark:text-white"}`}
                      >
                        {cat.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitive Content Checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  id="sensitiveContent"
                  type="checkbox"
                  checked={sensitiveContent}
                  onChange={(e) => setSensitiveContent(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <div className="ml-3">
                  <label
                    htmlFor="sensitiveContent"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Contains sensitive content
                  </label>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Check this if the question contains mature, adult, or
                    potentially offensive content
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="mr-3 text-red-600" size={20} />
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                asChild
                variant="outline"
                className="h-12 flex-1 rounded-xl border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                <Link href="/">Cancel</Link>
              </Button>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !prompt.trim() ||
                  !optionA.trim() ||
                  !optionB.trim()
                }
                className="flex-1 transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Creating Question...
                  </div>
                ) : (
                  "Create Question"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips - AI UI Feature */}
        <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">
          <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-300">
            💡 Tips for Great Questions
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>
              • Make both options equally appealing to create interesting
              debates
            </li>
            <li>• Be specific and clear - avoid vague or confusing language</li>
            <li>• Consider the consequences or context of each choice</li>
            <li>• Keep it appropriate and respectful for all audiences</li>
            <li>
              • Think about what would make YOU genuinely curious about
              others&apos; choices
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
