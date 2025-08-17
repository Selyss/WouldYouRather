"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppLayout } from "~/components/ui/app-layout";
import { Card, CardContent } from "~/components/ui/card";
import { CategoryChip } from "~/components/ui/category-chip";
import { BarChart3, Heart, Trophy, Calendar, User, MessageSquare } from "lucide-react";

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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-slate-300">Loading profile...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl text-red-400 mb-4">{error}</div>
            <button 
              onClick={() => window.location.href = "/auth/signin"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-slate-300">No profile data found</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            <User className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">@{profileData.user.username}</h1>
          <p className="text-slate-400">
            Question Creator • Member since {formatJoinDate(profileData.user.joinedAt)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{profileData.stats.questionsCreated}</div>
              <div className="text-sm text-slate-400">Questions Created</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{profileData.stats.votesCount}</div>
              <div className="text-sm text-slate-400">Votes Cast</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{profileData.stats.pointsEarned}</div>
              <div className="text-sm text-slate-400">Points Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#{profileData.stats.rank}</div>
              <div className="text-sm text-slate-400">Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Questions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Recent Questions</h2>
          {profileData.recentQuestions.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">You haven't created any questions yet</p>
                <button 
                  onClick={() => window.location.href = "/create"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Create Your First Question
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profileData.recentQuestions.map((question) => (
                <Card key={question.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{question.prompt}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <CategoryChip category={question.category as any} />
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {question.votes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {question.responses.length > 0 && (
                      <div className="flex gap-4 text-sm">
                        <div className="flex-1">
                          <span className="text-blue-400 font-medium">A:</span>
                          <span className="text-slate-300 ml-2">{question.responses[0]?.text}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-red-400 font-medium">B:</span>
                          <span className="text-slate-300 ml-2">{question.responses[1]?.text}</span>
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
