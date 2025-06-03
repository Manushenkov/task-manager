import type { SelectChangeEvent } from "@mui/material";
import { FormControl, MenuItem, Select } from "@mui/material";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGE_MAP = {
  en: "🇬🇧 English",
  pt: "🇧🇷 Português",
  // Add more as needed
} as const;

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="flex justify-end">
      <FormControl className="ml-auto" size="small">
        <Select
          sx={{ minWidth: 120 }}
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          {Object.entries(LANGUAGE_MAP).map(([code, label]) => (
            <MenuItem key={code} value={code}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default memo(LanguageSwitch);
