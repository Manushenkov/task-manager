import { Button, TextField } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { KeyboardKey } from "../../../constants/global";

const TaskInput = ({
  disabled,
  value,
  onChange,
  onSubmit,
}: {
  disabled: boolean;
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
}) => {
  const { t } = useTranslation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleOnkeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyboardKey.Enter) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="flex-1 min-w-[200px]">
        <TextField
          fullWidth
          disabled={disabled}
          placeholder={t("taskInput.placeholder")}
          size="small"
          value={value}
          variant="outlined"
          onChange={handleOnChange}
          onKeyDown={handleOnkeyDown}
        />
      </div>
      <Button disabled={disabled} variant="contained" onClick={onSubmit}>
        {t("taskInput.addButton")}
      </Button>
    </div>
  );
};

export default memo(TaskInput);
