"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppLayout } from "~/components/ui/app-layout";
import Link from "next/link";

type Category = {
  value: string;
  label: string;
  description: string;
  emoji: string;
  count: number;
};

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading categories...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-white mb-4">
              Browse Categories
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Explore different types of "Would You Rather" questions. Each category offers unique scenarios and dilemmas to challenge your decision-making.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.value}
                href={`/categories/${category.value.toLowerCase()}`}
                className="group relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-700/80 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {/* Category Emoji */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>

                {/* Category Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Question Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {category.count === 0 
                      ? "No questions yet" 
                      : `${category.count} question${category.count === 1 ? '' : 's'}`
                    }
                  </span>
                  <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/40 transition-colors">
                    <svg 
                      className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-bold text-white mb-2">No categories available</h3>
              <p className="text-slate-400">Check back later for new question categories.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
