import { Button } from "./button";

interface ActionButtonsProps {
  isLoading: boolean;
  onNextQuestion: () => void;
  onShareResult: () => void;
}

export function ActionButtons({ isLoading, onNextQuestion, onShareResult }: ActionButtonsProps) {
  return (
    <div className="text-center space-y-4">
      <Button
        onClick={onNextQuestion}
        disabled={isLoading}
        className="bg-white hover:bg-gray-100 text-slate-800 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? "Loading..." : "Next Challenge →"}
      </Button>

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
