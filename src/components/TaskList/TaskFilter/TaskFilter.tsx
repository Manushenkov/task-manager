import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { FilterStatus } from "../constants";

const TaskFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (newStatus: FilterStatus) => void;
}) => {
  const { t } = useTranslation();

  const handleOnChange = (
    _: React.MouseEvent<HTMLElement>,
    value: FilterStatus,
  ) => {
    onChange(value);
  };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      size="small"
      value={value}
      onChange={handleOnChange}
    >
      <ToggleButton value={FilterStatus.All}>{t("filters.all")}</ToggleButton>
      <ToggleButton value={FilterStatus.Active}>
        {t("filters.active")}
      </ToggleButton>
      <ToggleButton value={FilterStatus.Completed}>
        {t("filters.completed")}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default memo(TaskFilter);
