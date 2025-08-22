interface VsButtonProps {
  className?: string;
}

export function VsButton({ className = "" }: VsButtonProps) {
  return (
      <div className={`w-20 h-20 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-2xl ${className}`}>
      <span className="text-white font-black text-xl drop-shadow-lg">VS</span>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 rounded-full blur-xl opacity-60 -z-10"></div>
    </div>
  );
}

export function VsButtonMobile({ className = "" }: VsButtonProps) {
  return (
      <div className={`w-16 h-16 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-2xl ${className}`}>
      <span className="text-white font-black text-lg drop-shadow-lg">VS</span>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 rounded-full blur-xl opacity-60 -z-10"></div>
    </div>
  );
}
