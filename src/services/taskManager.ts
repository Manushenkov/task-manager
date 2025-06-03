import type { Task } from "../types/global";

const STORAGE_KEY = "tasks";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getTasksFromStorage = (): Task[] => {
  const tasks = localStorage.getItem(STORAGE_KEY);

  return tasks ? JSON.parse(tasks) : [];
};

const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const simulateError = (errorChancePercentage: number = 30): void => {
  if (Math.random() <= errorChancePercentage / 100) {
    throw new Error("Random error");
  }
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await simulateDelay(1000);

    // handle strategy: show the error page and suggest a retry
    simulateError();

    return getTasksFromStorage();
  },

  async addTask(title: string): Promise<Task> {
    await simulateDelay(500);

    // handle strategy: show a notification
    simulateError();

    const tasks = getTasksFromStorage();
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  },

  async deleteTask(id: string): Promise<void> {
    await simulateDelay(500);

    // handle strategy: show a notification
    simulateError();

    const tasks = getTasksFromStorage();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    saveTasksToStorage(filteredTasks);
  },

  async toggleTaskStatus(id: string, newState: boolean): Promise<Task> {
    await simulateDelay(300);

    // handle strategy: show a notification
    simulateError();

    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: newState,
    };
    saveTasksToStorage(tasks);

    return tasks[taskIndex];
  },

  async updateTask(id: string, title: string): Promise<Task> {
    await simulateDelay(300);

    // handle strategy: show a notification and restore old value
    simulateError();

    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title,
    };
    saveTasksToStorage(tasks);

    return tasks[taskIndex];
  },
};
