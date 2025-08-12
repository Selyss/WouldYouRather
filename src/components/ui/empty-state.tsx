import { useRouter } from "next/navigation";
import { Button } from "./button";

interface EmptyStateProps {
  session: any;
}

export function EmptyState({ session }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center">
      <div className="text-xl text-slate-300 mb-4">
        No questions available. Why not create the first one?
      </div>
      {session ? (
        <Button
          onClick={() => router.push("/create")}
          className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
        >
          Create Question
        </Button>
      ) : (
        <Button
          onClick={() => router.push("/auth/signin")}
          className="bg-white hover:bg-gray-100 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
        >
          Sign In to Create Questions
        </Button>
      )}
    </div>
  );
}
