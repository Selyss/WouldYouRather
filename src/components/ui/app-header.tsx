import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "./button";

interface AppHeaderProps {
  session: any;
}

export function AppHeader({ session }: AppHeaderProps) {
  const router = useRouter();

  return (
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

      <div className="flex items-center gap-6">
        {session ? (
          <>
            <div className="hidden md:flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
              <span className="text-slate-300 text-sm font-medium">Welcome, {session.user.username}!</span>
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
