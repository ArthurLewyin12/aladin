import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 shadow-sm transition-all hover:shadow-md",
        bgColor,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <p className="text-4xl font-bold text-gray-900">
            {value} <span className="text-lg font-semibold">{subtitle}</span>
          </p>
        </div>
        <div className={cn("flex-shrink-0 ml-4", iconColor)}>{icon}</div>
      </div>
    </div>
  );
}
