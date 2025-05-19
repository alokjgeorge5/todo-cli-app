tasks = []

def add_task():
    title = input("Enter task title: ")
    priority = assign_priority(title)
    print(f"Auto-assigned priority: {priority}")
    tasks.append({'title': title, 'done': False, 'priority': priority})

def assign_priority(title):
    title_lower = title.lower()
    if any(word in title_lower for word in ["urgent", "asap", "tonight", "now", "immediately"]):
        return "High"
    elif any(word in title_lower for word in ["soon", "important", "today"]):
        return "Medium"
    else:
        return "Low"
    
def list_tasks():
    if not tasks:
        print("No tasks yet!")
        return
    priority_order = {'High': 1, 'Medium': 2, 'Low': 3}
    sorted_tasks = sorted(tasks, key=lambda t: priority_order.get(t['priority'], 4))
    for i, task in enumerate(sorted_tasks, 1):
        status = "✓" if task['done'] else " "
        print(f"{i}. [{status}] [{task['priority']}] {task['title']}")

def mark_done():
    if not tasks:
        print("No tasks yet!")
        return
    list_tasks()
    try:
        task_num = int(input("Mark task number as done: "))
        if 1 <= task_num <= len(tasks):
            # Instead of indexing tasks directly, mark done in sorted list
            priority_order = {'High': 1, 'Medium': 2, 'Low': 3}
            sorted_tasks = sorted(tasks, key=lambda t: priority_order.get(t['priority'], 4))
            task_to_mark = sorted_tasks[task_num - 1]
            # Find this task in original list and mark done
            for task in tasks:
                if task == task_to_mark:
                    task['done'] = True
                    break
        else:
            print("Invalid task number.")
    except ValueError:
        print("Please enter a valid number.")


def main():
    while True:
        print("\nOptions: 1) Add Task  2) List Tasks  3) Mark Done  4) Quit")
        choice = input("Choose an option: ").strip()
        if choice == '1':
            add_task()
        elif choice == '2':
            list_tasks()
        elif choice == '3':
            mark_done()
        elif choice == '4':
            print("Bye!")
            break
        else:
            print("Invalid choice, try again.")

if __name__ == "__main__":
    main()
