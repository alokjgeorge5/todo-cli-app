import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "./TaskItem";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("habitflow-tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habitflow-tasks", JSON.stringify(tasks));
    updateDailyCount();
  }, [tasks]);

  const updateDailyCount = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayCompleted = tasks.filter(
      (t) => t.completed && t.date === today
    ).length;
    
    const dailyCount = JSON.parse(
      localStorage.getItem("habitflow-daily-count") || "{}"
    );
    dailyCount[today] = todayCompleted;
    localStorage.setItem("habitflow-daily-count", JSON.stringify(dailyCount));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        date: new Date().toISOString().split("T")[0],
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id: string, newText: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const todayTasks = tasks.filter(
    (task) => task.date === new Date().toISOString().split("T")[0]
  );

  return (
    <div className="glass-card warm-glass rounded-2xl p-8 h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Today's Tasks
      </h2>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-0">
        {todayTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No tasks yet. Add one below!
          </p>
        ) : (
          todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              onToggle={toggleTask}
              onEdit={editTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="glass-input border-border focus-visible:ring-primary"
        />
        <Button
          onClick={addTask}
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};
