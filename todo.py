tasks = []

def add_task():
    title = input("Enter task title: ")
    tasks.append({'title': title, 'done': False})

def list_tasks():
    if not tasks:
        print("No tasks yet!")
        return
    for i, task in enumerate(tasks, 1):
        status = "✓" if task['done'] else " "
        print(f"{i}. [{status}] {task['title']}")

def mark_done():
    list_tasks()
    try:
        task_num = int(input("Mark task number as done: "))
        if 1 <= task_num <= len(tasks):
            tasks[task_num - 1]['done'] = True
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
