import "./App.css";

import { ToastContainer } from "react-toastify";

import { TaskList } from "./TaskList/TaskList";

function App() {
  return (
    <>
      <TaskList />
      <ToastContainer />
    </>
  );
}

export default App;
