import { cn } from "@/lib/utils";

interface BubbleLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BubbleLoader({
  className,
  size = "md",
}: BubbleLoaderProps) {
  const sizeConfig = {
    sm: {
      container: "w-16",
      bubble: "w-3 h-3",
    },
    md: {
      container: "w-24",
      bubble: "w-4 h-4",
    },
    lg: {
      container: "w-32",
      bubble: "w-5 h-5",
    },
  };

  const { container, bubble } = sizeConfig[size];

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-transparent",
        className
      )}
    >
      <div className={cn("flex items-center justify-between", container)}>
        <div
          className={cn("rounded-full bg-primary animate-pulse", bubble)}
          style={{
            animationDelay: "0s",
            animationDuration: "0.8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
        <div
          className={cn("rounded-full bg-primary animate-pulse", bubble)}
          style={{
            animationDelay: "0.2s",
            animationDuration: "0.8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
        <div
          className={cn("rounded-full bg-primary animate-pulse", bubble)}
          style={{
            animationDelay: "0.4s",
            animationDuration: "0.8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
      </div>
    </div>
  );
}
