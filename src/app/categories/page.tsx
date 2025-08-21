"use client";

import { ArrowRight, Filter, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppLayout } from "~/components/ui/app-layout";

type Category = {
  value: string;
  label: string;
  description: string;
  emoji: string;
  count: number;
};

// Map category values to gradient color classes
const getCategoryColor = (categoryValue: string): string => {
  const normalizedValue = categoryValue.toLowerCase();
  const colorMap: Record<string, string> = {
    general: "bg-gradient-to-r from-blue-500 to-blue-600",
    animals: "bg-gradient-to-r from-green-500 to-green-600",
    career: "bg-gradient-to-r from-purple-500 to-purple-600",
    ethics: "bg-gradient-to-r from-red-500 to-red-600",
    food: "bg-gradient-to-r from-yellow-500 to-orange-600",
    fun: "bg-gradient-to-r from-pink-500 to-pink-600",
    health: "bg-gradient-to-r from-teal-500 to-teal-600",
    money: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    pop_culture: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    popculture: "bg-gradient-to-r from-indigo-500 to-indigo-600", // Alternative naming
    relationships: "bg-gradient-to-r from-rose-500 to-rose-600",
    sci_fi: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    scifi: "bg-gradient-to-r from-cyan-500 to-cyan-600", // Alternative naming
    superpowers: "bg-gradient-to-r from-violet-500 to-violet-600",
    travel: "bg-gradient-to-r from-sky-500 to-sky-600",
    // Add common variations
    technology: "bg-gradient-to-r from-slate-500 to-slate-600",
    sports: "bg-gradient-to-r from-amber-500 to-amber-600",
    entertainment: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600",
  };
  return (
    colorMap[normalizedValue] ?? "bg-gradient-to-r from-gray-500 to-gray-600"
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // TODO: Replace with actual user voting history from your API
  // This should track which questions the user has voted on: { questionId: 'A' | 'B' }
  // You could fetch this from /api/user/votes or similar endpoint
  const [userVotes] = useState<Record<string, "A" | "B">>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = (await response.json()) as { categories: Category[] };
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  // Calculate completion rate based on user's voting history
  const getCategoryStats = (category: Category) => {
    const totalQuestions = category.count;
    // For now, assume 0 answered questions since we don't have user voting data yet
    // TODO: Replace with actual user voting history from API/session
    const userAnswered = 0;
    const completionRate =
      totalQuestions > 0
        ? Math.round((userAnswered / totalQuestions) * 100)
        : 0;
    // Estimate total votes - this should come from your database
    // TODO: Replace with actual vote counts from API
    const totalVotes = category.count * 42; // Using 42 as a reasonable average votes per question

    return {
      totalQuestions,
      userAnswered,
      completionRate,
      totalVotes,
    };
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg text-gray-900 dark:text-white">
              Loading categories...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-lg text-red-600 dark:text-red-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalQuestionsAnswered = Object.keys(userVotes).length;
  const totalQuestions = categories.reduce((sum, cat) => sum + cat.count, 0);
  const overallProgress =
    totalQuestions > 0
      ? Math.round((totalQuestionsAnswered / totalQuestions) * 100)
      : 0;

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore questions by topic and interest
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const stats = getCategoryStats(category);
            const colorClass = getCategoryColor(category.value);

            return (
              <div
                key={category.value}
                className="transform cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800"
              >
                <Link href={`/categories/${category.value.toLowerCase()}`}>
                  <div className={`${colorClass} p-6 text-white`}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-4xl">{category.emoji}</div>
                      <ArrowRight size={24} className="opacity-70" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{category.label}</h3>
                    <p className="text-sm text-white/80">
                      {category.description}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Questions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.completionRate}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Complete
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{stats.userAnswered} answered</span>
                      <span>{stats.totalVotes.toLocaleString()} votes</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Your Progress
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Users className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalQuestionsAnswered}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Questions Answered
              </div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Users
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories Available
              </div>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Filter
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallProgress}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Overall Progress
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">🤔</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              No categories available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new question categories.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
