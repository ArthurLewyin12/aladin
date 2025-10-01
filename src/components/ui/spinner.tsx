import { cn } from "@/lib/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  containerClassName?: string;
}

export function Spinner({
  size = "md",
  className,
  containerClassName,
}: SpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "h-3 w-3 border-[1.5px]";
      case "sm":
        return "h-4 w-4 border-2";
      case "md":
        return "h-6 w-6 border-2";
      case "lg":
        return "h-10 w-10 border-[3px]";
      case "xl":
        return "h-16 w-16 border-4";
      default:
        return "h-6 w-6 border-2";
    }
  };

  return (
    <div className={cn("flex justify-center items-center", containerClassName)}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-gray-900",
          getSizeClasses(),
          className,
        )}
        role="status"
        aria-label="Chargement"
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
}
