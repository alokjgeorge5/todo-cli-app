import { TaskList } from "@/components/TaskList";
import { HabitCalendar } from "@/components/HabitCalendar";

const Index = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-3rem)]">
          <div className="w-full md:w-[30%] h-[40%] md:h-full">
            <TaskList />
          </div>
          <div className="w-full md:w-[70%] h-[60%] md:h-full">
            <HabitCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
