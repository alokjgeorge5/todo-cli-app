import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeatmapCell } from "./HeatmapCell";

type ViewMode = "week" | "month" | "year";

export const HabitCalendar = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("year");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyCount, setDailyCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("habitflow-daily-count");
    if (stored) {
      setDailyCount(JSON.parse(stored));
    }
  }, []);

  const generateDates = (mode: ViewMode) => {
    const dates: string[] = [];
    const today = new Date();
    let days = 0;

    switch (mode) {
      case "week":
        days = 7;
        break;
      case "month":
        days = 30;
        break;
      case "year":
        days = 365;
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  };

  const dates = generateDates(viewMode);

  const getGridConfig = () => {
    switch (viewMode) {
      case "week":
        return {
          cols: 7,
          gap: "gap-2",
          size: "large" as const,
        };
      case "month":
        return {
          cols: 10,
          gap: "gap-1.5",
          size: "medium" as const,
        };
      case "year":
        return {
          cols: 53,
          gap: "gap-1",
          size: "small" as const,
        };
    }
  };

  const config = getGridConfig();

  return (
    <div className="glass-card rounded-2xl p-8 h-full flex flex-col relative">
      <div className="glass-clock rounded-3xl px-4 py-2 absolute top-12 right-12 z-10">
        <p className="text-lg font-medium text-muted-foreground">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>

      <h1 className="text-[32px] font-bold text-foreground mb-8">
        Habit Progress
      </h1>

      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as ViewMode)}
        className="mb-6"
      >
        <TabsList className="bg-muted/50">
          <TabsTrigger
            value="week"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-250"
          >
            Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-250"
          >
            Month
          </TabsTrigger>
          <TabsTrigger
            value="year"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-250"
          >
            Year
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-auto">
        {viewMode === "year" ? (
  <div className="animate-slide-in" key={viewMode}>
   {/* Month labels */}
<div className="flex mb-2">
  <div className="w-8" /> {/* Spacer for day labels */}
  <div className="flex-1">
    <div className="relative h-5" style={{ width: "742px" }}>
      {(() => {
        const labels: JSX.Element[] = [];
        const today = new Date();
        
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);
        
        // Track months in order with their positions
        const monthData: Array<{ month: string; week: number; year: number }> = [];
        let currentDate = new Date(startDate);
        let lastMonth = "";
        
        // Collect all month positions
        for (let week = 0; week < 53; week++) {
          const monthName = currentDate.toLocaleDateString("en-US", { month: "short" });
          const year = currentDate.getFullYear();
          const monthKey = `${monthName} ${year}`;
          
          if (monthKey !== lastMonth) {
            monthData.push({ month: monthName, week, year });
            lastMonth = monthKey;
          }
          
          currentDate.setDate(currentDate.getDate() + 7);
        }
        
        // Render all labels with smart spacing
        monthData.forEach((data, index) => {
          const prevWeek = index > 0 ? monthData[index - 1].week : -10;
          const weekGap = data.week - prevWeek;
          
          // Show label if:
          // 1. First label, OR
          // 2. Enough space (>= 2 weeks), OR
          // 3. New year started
          const showLabel = 
            index === 0 || 
            weekGap >= 2 || 
            (index > 0 && data.year !== monthData[index - 1].year);
          
          if (showLabel) {
            labels.push(
              <div
                key={`${data.month}-${data.week}`}
                className="text-xs text-muted-foreground absolute"
                style={{
                  left: `${data.week * 14}px`,
                }}
              >
                {data.month}
              </div>
            );
          }
        });
        
        return labels;
      })()}
    </div>
  </div>
</div>



    {/* Calendar grid */}
    <div className="flex gap-3">
      {/* Day of week labels */}
      <div className="flex flex-col gap-[3px] justify-start text-[11px] text-muted-foreground" style={{ paddingTop: "2px" }}>
        <div style={{ height: "12px" }} />
        <div style={{ height: "12px" }}>Mon</div>
        <div style={{ height: "12px" }} />
        <div style={{ height: "12px" }}>Wed</div>
        <div style={{ height: "12px" }} />
        <div style={{ height: "12px" }}>Fri</div>
        <div style={{ height: "12px" }} />
      </div>

      {/* Heatmap cells organized by week (columns) */}
      <div className="flex gap-[2px]">
        {(() => {
          const today = new Date();
          
          // Calculate start date (52 weeks ago from today)
          const startDate = new Date(today);
          startDate.setDate(today.getDate() - 364); // 364 days = 52 weeks
          
          // Adjust to start on Sunday
          const dayOfWeek = startDate.getDay();
          startDate.setDate(startDate.getDate() - dayOfWeek);
          
          const weeks: JSX.Element[] = [];
          
          for (let week = 0; week < 53; week++) {
            const weekDays: JSX.Element[] = [];
            
            for (let day = 0; day < 7; day++) {
              const currentDate = new Date(startDate);
              currentDate.setDate(startDate.getDate() + (week * 7) + day);
              
              // Only show cells up to today
              if (currentDate <= today) {
                const dateStr = currentDate.toISOString().split("T")[0];
                
                weekDays.push(
                  <HeatmapCell
                    key={dateStr}
                    date={dateStr}
                    count={dailyCount[dateStr] || 0}
                    size="small"
                  />
                );
              } else {
                // Empty placeholder for future dates
                weekDays.push(
                  <div key={`empty-${week}-${day}`} style={{ width: "12px", height: "12px" }} />
                );
              }
            }
            
            weeks.push(
              <div key={week} className="flex flex-col gap-[3px]">
                {weekDays}
              </div>
            );
          }
          
          return weeks;
        })()}
      </div>
    </div>

    {/* Legend */}
    <div className="mt-6 flex items-center justify-end gap-2">
      <span className="text-sm text-muted-foreground">Less</span>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-[3px] ${
              level === 0 ? "bg-heatmap-0" :
              level === 1 ? "bg-heatmap-1" :
              level === 2 ? "bg-heatmap-2" :
              level === 3 ? "bg-heatmap-3" :
              "bg-heatmap-4"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">More</span>
    </div>
  </div>
) : 
 (
          <div
            className={`grid ${config.gap} animate-slide-in`}
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
            key={viewMode}
          >
            {dates.map((date) => (
              <HeatmapCell
                key={date}
                date={date}
                count={dailyCount[date] || 0}
                size={config.size}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
