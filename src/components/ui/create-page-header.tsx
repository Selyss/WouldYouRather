import Link from "next/link";

interface CreatePageHeaderProps {
  username: string;
}

export function CreatePageHeader({ username }: CreatePageHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-6 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
      <Link href="/" className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-slate-800 text-xl font-bold">?</span>
        </div>
        <div>
          <h1 className="font-serif font-black text-xl text-white">Would You Rather?</h1>
          <p className="text-slate-300 text-sm font-medium">Create a new question</p>
        </div>
      </Link>
      
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-slate-300 hover:text-white text-sm font-medium"
        >
          Back to Game
        </Link>
        <span className="text-sm text-slate-400">
          Welcome, {username}!
        </span>
      </div>
    </header>
  );
}
