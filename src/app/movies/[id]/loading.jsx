import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-[85vh] w-full flex-col items-center justify-center gap-4 bg-black text-white/60"
    >
      <Loader2
        aria-hidden="true"
        className="size-8 text-red-500 motion-safe:animate-spin"
      />
      <p className="text-sm tracking-wide">Preparing your movie...</p>
    </div>
  );
}
