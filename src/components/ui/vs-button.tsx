interface VsButtonProps {
  className?: string;
}

export function VsButton({ className = "" }: VsButtonProps) {
  return (
    <div className={`w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-800 animate-pulse ${className}`}>
      <span className="text-white font-black text-xl drop-shadow-lg">VS</span>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-60 -z-10 animate-pulse"></div>
    </div>
  );
}

export function VsButtonMobile({ className = "" }: VsButtonProps) {
  return (
    <div className={`w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse ${className}`}>
      <span className="text-white font-black text-lg drop-shadow-lg">VS</span>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-60 -z-10 animate-pulse"></div>
    </div>
  );
}
