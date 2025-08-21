import { ArrowRight } from "lucide-react";

interface ActionButtonsProps {
  isLoading: boolean;
  onNextQuestion: () => void;
  onShareResult: () => void;
}

export function ActionButtons({
  isLoading,
  onNextQuestion,
}: ActionButtonsProps) {
  return (
    <div className="text-center">
      <button
        onClick={onNextQuestion}
        disabled={isLoading}
        className="inline-flex items-center space-x-2 rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <span>{isLoading ? "Loading..." : "Next Question"}</span>
        {!isLoading && <ArrowRight size={18} />}
      </button>

      {/* TODO: add back later */}
      {/* <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onShareResult}
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
        >
          Share Result
        </Button>
        <Button
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-slate-800 px-6 py-3 rounded-xl font-semibold bg-transparent"
        >
          Challenge Friend
        </Button>
      </div> */}
    </div>
  );
}
