import { motion } from "framer-motion";

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export default function SkeletonCard({ lines = 3, className = "" }: SkeletonCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.div
          className="h-10 w-10 rounded-xl bg-muted animate-shimmer"
          style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%)", backgroundSize: "200% auto" }}
        />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%)", backgroundSize: "200% auto" }} />
          <div className="h-2 w-1/2 rounded-md bg-muted animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%)", backgroundSize: "200% auto", animationDelay: "0.1s" }} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 rounded-md bg-muted animate-shimmer"
          style={{
            width: `${85 - i * 15}%`,
            backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%)",
            backgroundSize: "200% auto",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
