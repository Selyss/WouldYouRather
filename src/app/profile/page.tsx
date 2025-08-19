"use client";

import {
  BarChart3,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppLayout } from "~/components/ui/app-layout";
import { Card, CardContent } from "~/components/ui/card";
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

    loadProfileData();
  }, [session, status]);

  const loadProfileData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load profile data");
        return;
      }

      setProfileData(data);
    } catch (error) {
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
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Profile Header */}
        <div className="relative text-center">
          {/* Settings Gear Button */}
          <Link
            href="/settings"
            className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            title="Account Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            <User className="h-12 w-12" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            @{profileData.user.username}
          </h1>
          <p className="text-slate-400">
            Question Creator • Member since{" "}
            {formatJoinDate(profileData.user.joinedAt)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6 text-center">
              <BarChart3 className="mx-auto mb-2 h-8 w-8 text-blue-500" />
              <div className="text-2xl font-bold text-white">
                {profileData.stats.questionsCreated}
              </div>
              <div className="text-sm text-slate-400">Questions Created</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6 text-center">
              <Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <div className="text-2xl font-bold text-white">
                {profileData.stats.votesCount}
              </div>
              <div className="text-sm text-slate-400">Votes Cast</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6 text-center">
              <BarChart3 className="mx-auto mb-2 h-8 w-8 text-green-500" />
              <div className="text-2xl font-bold text-white">
                {profileData.stats.pointsEarned}
              </div>
              <div className="text-sm text-slate-400">Points Earned</div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6 text-center">
              <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
              <div className="text-2xl font-bold text-white">
                #{profileData.stats.rank}
              </div>
              <div className="text-sm text-slate-400">Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Questions */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">
            Your Recent Questions
          </h2>
          {profileData.recentQuestions.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="p-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                <p className="mb-4 text-lg text-slate-400">
                  You haven't created any questions yet
                </p>
                <button
                  onClick={() => (window.location.href = "/create")}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Create Your First Question
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profileData.recentQuestions.map((question) => (
                <Card
                  key={question.id}
                  className="border-slate-700 bg-slate-800/50 transition-colors hover:bg-slate-800/70"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          {question.prompt}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <CategoryChip category={question.category as any} />
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
                      <div className="flex gap-4 text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-blue-400">A:</span>
                          <span className="ml-2 text-slate-300">
                            {question.responses[0]?.text}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-red-400">B:</span>
                          <span className="ml-2 text-slate-300">
                            {question.responses[1]?.text}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
