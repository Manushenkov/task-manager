import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "material-react-toastify";
import { ErrorBoundary} from "react-error-boundary"

import GlobalErrorPage from "./components/GlobalErrorPage";
import LanguageSwitch from "./components/LanguageSwitch/LanguageSwitch";
import TaskList from "./components/TaskList/TaskList";
import ThemeSwitch from "./components/ThemeSwitch/ThemeSwitch";
import { GlobalErrorProvider } from "./GlobalErrorProvider";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-end gap-2 mt-2">
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
      <ErrorBoundary fallbackRender={() => <GlobalErrorPage />}>
        <GlobalErrorProvider>
          <TaskList />
          <ToastContainer position="bottom-right" />
        </GlobalErrorProvider>
      </ErrorBoundary>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
