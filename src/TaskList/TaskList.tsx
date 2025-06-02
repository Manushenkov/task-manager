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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { taskService } from "../services/taskManager";
import TaskItem from "../TaskItem/TaskItem";
import type { Task } from "../types/global";

enum FilterStatus {
  All = "all",
  Active = "active",
  Completed = "completed",
}

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<{
    [id: string]: {
      isUpdatingChecked: boolean;
      isUpdatingTitle: boolean;
      isDeleting: boolean;
    };
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

  const toggleIsDeleting = (id: string, newValue: boolean) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [id]: { ...prev[id], isDeleting: newValue },
    }));
  };

  const toggleIsUpdatingChecked = (id: string, newValue: boolean) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [id]: { ...prev[id], isUpdatingChecked: newValue },
    }));
  };

  const toggleIsUpdatingTitle = (id: string, newValue: boolean) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [id]: { ...prev[id], isUpdatingTitle: newValue },
    }));
  };

  const updateTask = (id: string, newTask: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...newTask } : task)),
    );
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsAddingTask(true);
    try {
      const newTask = await taskService.addTask(newTaskTitle);
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task");
    }
    setIsAddingTask(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      toggleIsDeleting(id, true);

      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      // cleanup the statuses for the deleted task
      setTaskStatuses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
      toggleIsDeleting(id, false);
    }
  };

  const handleToggleTask = async (id: string) => {
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
  };

  const handleEditSave = async (id: string, newTitle: string) => {
    const prevTask = tasks.find((task) => task.id === id);
    if (!prevTask) return;

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
      updateTask(id, { title: prevTask.title });
    } finally {
      toggleIsUpdatingTitle(id, false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === FilterStatus.Completed) return task.completed;
    if (filterStatus === FilterStatus.Active) return !task.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
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
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
              }}
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
          onChange={(_, value) => value && setFilterStatus(value)}
        >
          <ToggleButton value={FilterStatus.All}>All</ToggleButton>
          <ToggleButton value={FilterStatus.Active}>Active</ToggleButton>
          <ToggleButton value={FilterStatus.Completed}>Completed</ToggleButton>
        </ToggleButtonGroup>
        <List>
          {loading && (
            <List>
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="mb-2">
                    <Skeleton height={60} variant="rectangular" />
                  </div>
                ))}
            </List>
          )}
          {!loading &&
            filteredTasks.map((task, idx) => (
              <div
                key={task.id}
                className={clsx({
                  "border-b border-gray-200": idx !== filteredTasks.length - 1,
                })}
              >
                <TaskItem
                  {...taskStatuses[task.id]}
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
