import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapCellProps {
  date: string;
  count: number;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export const HeatmapCell = ({ date, count, size = "small", onClick }: HeatmapCellProps) => {
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const intensity = getIntensity(count);

  const sizeClasses = {
    small: "w-3 h-3",
    medium: "w-7 h-7",
    large: "w-12 h-12",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "rounded-[3px] transition-all duration-300 hover:scale-115 hover:border-2 hover:border-primary cursor-pointer animate-fade-in",
              sizeClasses[size],
              intensity === 0 && "bg-heatmap-0",
              intensity === 1 && "bg-heatmap-1",
              intensity === 2 && "bg-heatmap-2",
              intensity === 3 && "bg-heatmap-3",
              intensity === 4 && "bg-heatmap-4"
            )}
            style={{
              animationDelay: `${Math.random() * 100}ms`,
            }}
          />
        </TooltipTrigger>
        <TooltipContent className="glass-card border-border">
          <p className="text-sm font-medium">
            {formatDate(date)} • {count} {count === 1 ? "task" : "tasks"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
