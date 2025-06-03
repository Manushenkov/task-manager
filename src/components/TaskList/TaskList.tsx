import { List, Paper, Skeleton, Typography } from "@mui/material";
import clsx from "clsx";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { FilterStatus } from "./constants";
import TaskFilter from "./TaskFilter/TaskFilter";
import TaskInput from "./TaskInput/TaskInput";
import TaskItem from "./TaskItem/TaskItem";
import { useTaskList } from "./useTaskList";

const TaskList = () => {
  const { t } = useTranslation();
  const {
    tasks,
    filter,
    newTaskTitle,
    loading,
    isAddingTask,
    tasksUiState,
    handleFilterChange,
    handleAddTask,
    handleNewTaskTitleChange,
    handleDeleteTask,
    handleEditSave,
    handleToggleTask,
  } = useTaskList();

  const filteredTasks = tasks.filter((task) => {
    if (filter === FilterStatus.Completed) return task.completed;
    if (filter === FilterStatus.Active) return !task.completed;

    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10">
      <Paper className="p-6">
        <Typography className="text-center pb-5" variant="h4">
          {t("title")}
        </Typography>
        <TaskInput
          disabled={isAddingTask || loading}
          value={newTaskTitle}
          onChange={handleNewTaskTitleChange}
          onSubmit={handleAddTask}
        />
        <TaskFilter value={filter} onChange={handleFilterChange} />
        <List>
          {loading &&
            Array(3)
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
                  {...task}
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
