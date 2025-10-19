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
        return { outer: "h-4 w-4", inner: "h-3 w-3", border: "border-[1.5px]" };
      case "sm":
        return { outer: "h-6 w-6", inner: "h-4 w-4", border: "border-2" };
      case "md":
        return { outer: "h-8 w-8", inner: "h-6 w-6", border: "border-2" };
      case "lg":
        return { outer: "h-14 w-14", inner: "h-11 w-11", border: "border-[3px]" };
      case "xl":
        return { outer: "h-20 w-20", inner: "h-16 w-16", border: "border-4" };
      default:
        return { outer: "h-8 w-8", inner: "h-6 w-6", border: "border-2" };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={cn("flex justify-center items-center", containerClassName)}>
      <div className="relative backdrop-blur-sm" role="status" aria-label="Chargement">
        {/* Cercle extérieur - Gris foncé */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-gray-900 border-t-transparent border-r-transparent animate-spin",
            sizeClasses.outer,
            sizeClasses.border,
            className,
          )}
          style={{ animationDuration: "1s" }}
        />

        {/* Cercle intérieur - Gris clair */}
        <div
          className={cn(
            "absolute inset-0 m-auto rounded-full border-gray-400 border-b-transparent border-l-transparent animate-spin",
            sizeClasses.inner,
            sizeClasses.border,
          )}
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />

        {/* Espace invisible pour maintenir les dimensions */}
        <div className={cn("opacity-0", sizeClasses.outer)} />

        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
}
