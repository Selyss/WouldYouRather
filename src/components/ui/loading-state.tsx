interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-xl text-white">{message}</div>
    </div>
  );
}

export function LoadingText({ message = "Loading question..." }: LoadingStateProps) {
  return (
    <div className="text-center">
      <div className="text-xl text-white">{message}</div>
    </div>
  );
}
