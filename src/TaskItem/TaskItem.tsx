import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  isUpdatingChecked: boolean;
  isUpdatingTitle: boolean;
  isDeleting: boolean;
  onEditSave: (id: string, title: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

const TaskItem = ({
  id,
  title,
  completed,
  isUpdatingChecked,
  isUpdatingTitle,
  isDeleting,
  onEditSave,
  onDeleteTask,
  onToggleTask,
}: TaskItemProps) => {
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTitle(e.target.value);

  const handleSave = () => {
    const trimmedNewTitle = newTitle.trim();
    if (trimmedNewTitle !== "" && trimmedNewTitle !== title) {
      onEditSave(id, trimmedNewTitle);
    } else {
      setNewTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSave();
    }
  };

  const handleDeleteClick = () => onDeleteTask(id);

  const isCheckboxDisabled = isUpdatingChecked || isDeleting;

  const handleCheckboxChange = () => {
    if (!isCheckboxDisabled) onToggleTask(id);
  };

  const handleListItemTextClick = () => {
    if (!isCheckboxDisabled) setIsEditing(true);
  };

  const handleListItemTextFocus = () => setIsEditing(true);

  return (
    <ListItem
      className="transition-colors"
      secondaryAction={
        <IconButton onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <div className="select-none">
        <Checkbox
          checked={completed}
          className={"transition-colors duration-100"}
          sx={
            isCheckboxDisabled
              ? {
                  "&.Mui-checked": {
                    color: "text.disabled",
                  },
                  color: "text.disabled",
                }
              : undefined
          }
          onChange={handleCheckboxChange}
        />
      </div>

      {isEditing ? (
        <TextField
          autoFocus
          fullWidth
          multiline
          size="small"
          value={newTitle}
          onBlur={handleSave}
          onChange={handleTitleChange}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <ListItemText
          className={clsx("transition-colors duration-100 break-word", {
            "line-through text-gray-500": completed,
            "text-neutral-300": isUpdatingTitle || isDeleting,
          })}
          primary={newTitle}
          tabIndex={0}
          onClick={handleListItemTextClick}
          onFocus={handleListItemTextFocus}
        />
      )}
    </ListItem>
  );
};

export default TaskItem;
