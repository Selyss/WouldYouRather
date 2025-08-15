import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./button";

interface AppHeaderProps {
  session: any;
}

export function AppHeader({ session }: AppHeaderProps) {
  const router = useRouter();
  const [contentPreference, setContentPreference] = useState<"ALL" | "SAFE_ONLY" | "ADULT_ONLY">("SAFE_ONLY");
  const [isChanging, setIsChanging] = useState(false);

  // Fetch user's content preference when signed in
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/sensitive-content")
        .then(res => res.json())
        .then(data => {
          if (data.contentPreference) {
            setContentPreference(data.contentPreference);
          }
        })
        .catch(console.error);
    }
  }, [session?.user?.id]);

  const changeContentPreference = async (newPreference: "ALL" | "SAFE_ONLY" | "ADULT_ONLY") => {
    if (!session?.user?.id || isChanging) return;
    
    setIsChanging(true);
    try {
      const response = await fetch("/api/user/sensitive-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentPreference: newPreference,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContentPreference(data.contentPreference);
        
        // Refresh the page to reload questions with new filter
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to change content preference:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const getPreferenceLabel = (pref: string) => {
    switch (pref) {
      case "ALL": return "Mixed";
      case "SAFE_ONLY": return "Safe";
      case "ADULT_ONLY": return "18+";
      default: return "Safe";
    }
  };

  const getPreferenceColor = (pref: string) => {
    switch (pref) {
      case "ALL": return "bg-blue-600";
      case "SAFE_ONLY": return "bg-green-600";
      case "ADULT_ONLY": return "bg-red-600";
      default: return "bg-green-600";
    }
  };  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-2 md:py-6 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-slate-800 text-lg md:text-xl font-bold">?</span>
        </div>
        <div>
          <h1 className="font-serif font-black text-lg md:text-xl text-white">Would You Rather?</h1>
          <p className="hidden md:block text-slate-300 text-sm font-medium">Make your choice & see the results</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {session ? (
          <>
            <div className="hidden md:flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
              <span className="text-slate-300 text-sm font-medium">Welcome, {session.user.username}!</span>
            </div>

            {/* Content Preference Selector */}
            <div className="flex items-center gap-2">
              <select
                value={contentPreference}
                onChange={(e) => changeContentPreference(e.target.value as "ALL" | "SAFE_ONLY" | "ADULT_ONLY")}
                disabled={isChanging}
                className={`px-3 py-1 rounded-lg text-xs md:text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPreferenceColor(contentPreference)} text-white ${
                  isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <option value="SAFE_ONLY" className="bg-slate-700 text-white">Safe</option>
                <option value="ALL" className="bg-slate-700 text-white">Mixed</option>
                <option value="ADULT_ONLY" className="bg-slate-700 text-white">18+ Only</option>
              </select>
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
  );
}
