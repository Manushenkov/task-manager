import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, useColorScheme } from "@mui/material";
import { memo } from "react";

// TODO - fix theme flicker when loading the page in dark mode by default
const ThemeSwitch = () => {
  const { mode, setMode } = useColorScheme();

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <IconButton onClick={toggleColorMode}>
      {mode === "dark" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default memo(ThemeSwitch);
