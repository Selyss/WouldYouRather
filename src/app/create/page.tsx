"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthHeader } from "~/components/ui/auth-header";
import { CreatePageHeader } from "~/components/ui/create-page-header";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent"></div>

        {/* Header */}
        <AuthHeader />        <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-84px)] px-4 py-12">
          <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Sign In Required</CardTitle>
              <CardDescription className="text-slate-400">
                You need to be signed in to create questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                <Link href="/">Back to Questions</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent"></div>

      {/* Header */}
      <CreatePageHeader username={session.user.username} />      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Create a New "Would You Rather" Question
            </CardTitle>
            <CardDescription className="text-slate-400">
              Give people two interesting choices to pick from!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="optionA" className="block text-sm font-medium text-slate-300 mb-2">
                  Option A
                </label>
                <textarea
                  id="optionA"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Enter the first option..."
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  disabled={isLoading}
                  maxLength={200}
                />
                <div className="text-right text-sm text-slate-400 mt-1">
                  {optionA.length}/200 characters
                </div>
              </div>

              <div className="text-center text-slate-400 font-medium text-lg">
                OR
              </div>

              <div>
                <label htmlFor="optionB" className="block text-sm font-medium text-slate-300 mb-2">
                  Option B
                </label>
                <textarea
                  id="optionB"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Enter the second option..."
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  disabled={isLoading}
                  maxLength={200}
                />
                <div className="text-right text-sm text-slate-400 mt-1">
                  {optionB.length}/200 characters
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-900/50 border border-red-700 p-4">
                  <div className="text-sm text-red-300 text-center">{error}</div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Link href="/">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !optionA.trim() || !optionB.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Creating..." : "Create Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
