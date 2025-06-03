import { toast } from "material-react-toastify";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { taskService } from "../../services/taskManager";
import type { Task } from "../../types/global";
import { FilterStatus } from "./constants";
import type { TaskUiState } from "./types";

export const useTaskList = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasksUiState, setTasksUiState] = useState<{
    [id: string]: TaskUiState;
  }>({});
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  useEffect(() => {
    taskService.getTasks().then((loadedTasks) => {
      setTasks(loadedTasks);
      setLoading(false);
    });
  }, []);

  const toggleIsDeleting = useCallback(
    (id: string, newValue: boolean) => {
      setTasksUiState((prev) => ({
        ...prev,
        [id]: { ...prev[id], isDeleting: newValue },
      }));
    },
    [setTasksUiState],
  );

  const toggleIsUpdatingChecked = useCallback(
    (id: string, newValue: boolean) => {
      setTasksUiState((prev) => ({
        ...prev,
        [id]: { ...prev[id], isUpdatingChecked: newValue },
      }));
    },
    [setTasksUiState],
  );

  const toggleIsUpdatingTitle = useCallback(
    (id: string, newValue: boolean) => {
      setTasksUiState((prev) => ({
        ...prev,
        [id]: { ...prev[id], isUpdatingTitle: newValue },
      }));
    },
    [setTasksUiState],
  );

  const updateTask = useCallback(
    (id: string, newTask: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...newTask } : task)),
      );
    },
    [setTasks],
  );

  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;

    setIsAddingTask(true);
    try {
      const newTask = await taskService.addTask(newTaskTitle.trim());
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error(t("errors.task.addFailed"));
    }
    setIsAddingTask(false);
  }, [newTaskTitle, t]);

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        toggleIsDeleting(id, true);

        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));

        // cleanup the statuses for the deleted task
        setTasksUiState((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast.error(t("errors.task.deleteFailed"));
        toggleIsDeleting(id, false);
      }
    },
    [toggleIsDeleting, t],
  );

  const handleToggleTask = useCallback(
    async (id: string, newState: boolean) => {
      // Optimistically update the state
      updateTask(id, { completed: newState });

      try {
        toggleIsUpdatingChecked(id, true);
        const updatedTask = await taskService.toggleTaskStatus(id, newState);

        // Replace optimistic update with actual server response
        updateTask(id, { completed: updatedTask.completed });
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error(t("errors.task.updateStatusFailed"));

        // Revert to previous state on error
        updateTask(id, { completed: !newState });
      } finally {
        toggleIsUpdatingChecked(id, false);
      }
    },
    [updateTask, toggleIsUpdatingChecked, t],
  );

  const handleEditSave = useCallback(
    async (id: string, previousTitle: string, newTitle: string) => {
      // Optimistically update the task title
      updateTask(id, { title: newTitle });

      try {
        toggleIsUpdatingTitle(id, true);

        const updatedTask = await taskService.updateTask(id, newTitle);

        // Replace optimistic update with actual server response
        updateTask(id, { title: updatedTask.title });
      } catch (error) {
        console.error("Failed to save task:", error);
        toast.error(t("errors.task.saveFailed"));

        // Revert to previous state of the task
        updateTask(id, { title: previousTitle });
      } finally {
        toggleIsUpdatingTitle(id, false);
      }
    },
    [updateTask, toggleIsUpdatingTitle, t],
  );

  return {
    tasks,
    filter,
    newTaskTitle,
    loading,
    isAddingTask,
    tasksUiState,
    handleFilterChange: setFilter,
    handleNewTaskTitleChange: setNewTaskTitle,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    handleEditSave,
  };
};
