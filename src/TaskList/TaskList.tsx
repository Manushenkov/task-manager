import {
  Button,
  List,
  Paper,
  Skeleton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import React, { memo, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { KeyboardKey } from "../constants/global";
import { taskService } from "../services/taskManager";
import TaskItem from "../TaskItem/TaskItem";
import type { Task } from "../types/global";

enum FilterStatus {
  All = "all",
  Active = "active",
  Completed = "completed",
}

/*
    Upon clicking the checkbox (isUpdatingChecked), only disable the checkbox.
    Upon updating the title (isUpdatingTitle), only disable the title input.
    Upon deleting a task (isDeleting), disable the delete button, checkbox and input.
*/
type TaskUiState = {
  isUpdatingChecked: boolean;
  isUpdatingTitle: boolean;
  isDeleting: boolean;
};

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [tasksUiState, setTasksUiState] = useState<{
    [id: string]: TaskUiState;
  }>({});
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  useEffect(() => {
    taskService.getTasks().then((loadedTasks) => {
      setTasks(loadedTasks);
      setLoading(false);
    });
  }, []);

  // useCallbacks are only used to avoid re-renders of the TaskItem list
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
      toast.error("Failed to add task");
    }
    setIsAddingTask(false);
  }, [newTaskTitle]);

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
        toast.error("Failed to delete task");
        toggleIsDeleting(id, false);
      }
    },
    [toggleIsDeleting],
  );

  const handleToggleTask = useCallback(
    async (id: string) => {
      try {
        toggleIsUpdatingChecked(id, true);
        const updatedTask = await taskService.toggleTaskStatus(id);
        updateTask(id, { completed: updatedTask.completed });
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error("Failed to update task status");
      } finally {
        toggleIsUpdatingChecked(id, false);
      }
    },
    [updateTask, toggleIsUpdatingChecked],
  );

  const handleEditSave = useCallback(
    async (id: string, previousTitle: string, newTitle: string) => {
      // optimistically update the task title
      updateTask(id, { title: newTitle });

      try {
        toggleIsUpdatingTitle(id, true);

        const updatedTask = await taskService.updateTask(id, newTitle);

        // Replace optimistic update with actual server response
        updateTask(id, { title: updatedTask.title });
      } catch (error) {
        console.error("Failed to save task:", error);
        toast.error("Failed to save task");
        // revert to previous state of the task
        updateTask(id, { title: previousTitle });
      } finally {
        toggleIsUpdatingTitle(id, false);
      }
    },
    [updateTask, toggleIsUpdatingTitle],
  );

  const handleNewTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.target.value);
  };

  const handleNewTaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyboardKey.Enter) {
      handleAddTask();
    }
  };

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    value: FilterStatus,
  ) => {
    setFilterStatus(value);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === FilterStatus.Completed) return task.completed;
    if (filterStatus === FilterStatus.Active) return !task.completed;

    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10">
      <Paper className="p-6">
        <Typography className="text-center text-gray-800" variant="h4">
          Task List
        </Typography>
        <div className="flex flex-wrap gap-2 mb-1">
          <div className="flex-1 min-w-[200px]">
            <TextField
              fullWidth
              disabled={isAddingTask || loading}
              placeholder="Add a new task"
              size="small"
              value={newTaskTitle}
              variant="outlined"
              onChange={handleNewTaskTitleChange}
              onKeyDown={handleNewTaskKeyDown}
            />
          </div>
          <Button
            disabled={isAddingTask || loading}
            variant="contained"
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>
        <ToggleButtonGroup
          exclusive
          color="primary"
          size="small"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <ToggleButton value={FilterStatus.All}>All</ToggleButton>
          <ToggleButton value={FilterStatus.Active}>Active</ToggleButton>
          <ToggleButton value={FilterStatus.Completed}>Completed</ToggleButton>
        </ToggleButtonGroup>
        <List>
          {loading &&
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="mb-2"
                  height={60}
                  variant="rectangular"
                />
              ))}
          {!loading &&
            filteredTasks.map((task, idx) => (
              <div
                key={task.id}
                className={clsx({
                  "border-b border-gray-200": idx !== filteredTasks.length - 1,
                })}
              >
                <TaskItem
                  {...tasksUiState[task.id]}
                  completed={task.completed}
                  id={task.id}
                  title={task.title}
                  onDeleteTask={handleDeleteTask}
                  onEditSave={handleEditSave}
                  onToggleTask={handleToggleTask}
                />
              </div>
            ))}
        </List>
      </Paper>
    </div>
  );
};

export default memo(TaskList);
