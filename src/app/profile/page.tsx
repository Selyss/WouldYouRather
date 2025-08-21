"use client";

import {
  Calendar,
  Edit3,
  Heart,
  MessageSquare,
  Settings,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppLayout } from "~/components/ui/app-layout";
import { CategoryChip } from "~/components/ui/category-chip";

type ProfileData = {
  user: {
    id: string;
    username: string;
    joinedAt: string;
    contentPreference: string;
  };
  stats: {
    questionsCreated: number;
    votesCount: number;
    pointsEarned: number;
    rank: number;
  };
  recentQuestions: Array<{
    id: number;
    prompt: string;
    category: string;
    votes: number;
    responses: Array<{
      text: string;
      order: number;
    }>;
    createdAt: string;
  }>;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setError("You must be signed in to view your profile");
      setIsLoading(false);
      return;
    }

    void loadProfileData();
  }, [session, status]);

  const loadProfileData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = (await response.json()) as { error?: string } & ProfileData;

      if (!response.ok) {
        setError(data.error ?? "Failed to load profile data");
        return;
      }

      setProfileData(data);
    } catch {
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl text-slate-300">Loading profile...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-xl text-red-400">{error}</div>
            <button
              onClick={() => (window.location.href = "/auth/signin")}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profileData) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl text-slate-300">No profile data found</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl space-y-6 p-6">
          {/* Profile Header */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
            <div className="relative h-40 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="bg-opacity-10 absolute inset-0 bg-black"></div>
            </div>
            <div className="relative px-6 pb-6">
              <div className="-mt-20 mb-6 flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-6">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 shadow-xl md:mx-0 dark:border-gray-800">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <div className="text-center md:pb-4 md:text-left">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                      @{profileData.user.username}
                    </h1>
                    <div className="flex flex-col space-y-1 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        Question Creator • Member since{" "}
                        {formatJoinDate(profileData.user.joinedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center space-x-3 md:mt-0 md:justify-end md:pb-4">
                  <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                  <Link
                    href="/settings"
                    className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    title="Account Settings"
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-100 to-blue-200 p-5 text-center shadow-lg dark:border-blue-700 dark:from-blue-900/50 dark:to-blue-800/50">
                  <div className="mb-2 flex items-center justify-center">
                    <Target
                      className="text-blue-700 dark:text-blue-300"
                      size={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {profileData.stats.votesCount}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Questions Answered
                  </div>
                </div>
                <div className="rounded-xl border border-green-300 bg-gradient-to-br from-green-100 to-green-200 p-5 text-center shadow-lg dark:border-green-700 dark:from-green-900/50 dark:to-green-800/50">
                  <div className="mb-2 flex items-center justify-center">
                    <Edit3
                      className="text-green-700 dark:text-green-300"
                      size={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {profileData.stats.questionsCreated}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Questions Created
                  </div>
                </div>
                <div className="rounded-xl border border-orange-300 bg-gradient-to-br from-orange-100 to-orange-200 p-5 text-center shadow-lg dark:border-orange-700 dark:from-orange-900/50 dark:to-orange-800/50">
                  <div className="mb-2 flex items-center justify-center">
                    <Calendar
                      className="text-orange-700 dark:text-orange-300"
                      size={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    3
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    Current Streak
                  </div>
                </div>
                <div className="rounded-xl border border-purple-300 bg-gradient-to-br from-purple-100 to-purple-200 p-5 text-center shadow-lg dark:border-purple-700 dark:from-purple-900/50 dark:to-purple-800/50">
                  <div className="mb-2 flex items-center justify-center">
                    <Trophy
                      className="text-purple-700 dark:text-purple-300"
                      size={24}
                    />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    #{profileData.stats.rank}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Rank
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Activity Overview
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-gray-800 dark:text-gray-200">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Answered {profileData.stats.votesCount} questions
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Keep up the great work!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <div className="text-2xl">✏️</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Created {profileData.stats.questionsCreated} questions
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Great contribution!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        3-day streak
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        You&apos;re on fire!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-800 dark:text-gray-200">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Best Streak
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      7 days
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Account Age
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(profileData.user.joinedAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">
                      Points Earned
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profileData.stats.pointsEarned}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Questions */}
          {profileData.recentQuestions.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                You haven&apos;t created any questions yet
              </p>
              <button
                onClick={() => (window.location.href = "/create")}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Create Your First Question
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Your Recent Questions
              </h2>
              <div className="space-y-4">
                {profileData.recentQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-xl bg-gray-50 p-6 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                          {question.prompt}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <CategoryChip
                              category={
                                question.category as
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
                              }
                            />
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {question.votes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {question.responses.length > 0 && (
                      <div className="grid gap-4 text-sm md:grid-cols-2">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            Option A:
                          </span>
                          <div className="mt-1 text-gray-700 dark:text-gray-300">
                            {question.responses[0]?.text}
                          </div>
                        </div>
                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            Option B:
                          </span>
                          <div className="mt-1 text-gray-700 dark:text-gray-300">
                            {question.responses[1]?.text}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
