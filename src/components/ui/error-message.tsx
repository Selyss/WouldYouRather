interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-4">
        <div className="text-red-300 text-center">{message}</div>
      </div>
    </div>
  );
}
