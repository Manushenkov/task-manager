import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { testLocaleSetup } from "../../locales/testLocaleSetup";
import { taskService } from "../../services/taskManager";
import type { Task } from "../../types/global";
import TaskList from "./TaskList";

vi.mock("../../services/taskManager", () => ({
  taskService: {
    getTasks: vi.fn(),
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTaskStatus: vi.fn(),
    updateTask: vi.fn(),
  },
}));

const mockTasks: Task[] = [
  { id: "1", title: "Test task 1", completed: false },
  { id: "2", title: "Test task 2", completed: true },
];

describe("TaskList component", () => {
  beforeAll(testLocaleSetup);
  beforeEach(() => {
    (taskService.getTasks as any).mockResolvedValue(mockTasks);
  });

  it("renders fetched tasks", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText("Test task 1")).toBeInTheDocument();
      expect(screen.getByText("Test task 2")).toBeInTheDocument();
    });
  });

  it("adds a new task", async () => {
    (taskService.addTask as any).mockResolvedValue({
      id: "3",
      title: "New Task",
      completed: false,
    });

    render(<TaskList />);
    await waitFor(() => screen.getByText("Test task 1"));

    const input = screen.getByPlaceholderText("Add a new task");
    const button = screen.getByRole("button", { name: /add task/i });

    await userEvent.type(input, "New Task");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("deletes a task", async () => {
    (taskService.getTasks as any).mockResolvedValue(mockTasks);
    (taskService.deleteTask as any).mockResolvedValue(undefined);

    render(<TaskList />);
    await waitFor(() => screen.getByText("Test task 1"));

    const icon = screen.getAllByTestId("DeleteIcon")[0];
    const button = icon.closest("button");
    if (button) userEvent.click(button);

    await waitFor(() =>
      expect(taskService.deleteTask).toHaveBeenCalledWith("1"),
    );

    expect(screen.queryByText("Test task 1")).not.toBeInTheDocument();
  });

  it("edits a task title", async () => {
    (taskService.getTasks as any).mockResolvedValue(mockTasks);
    const updatedTask = {
      id: "1",
      title: "Test task 1 updated",
      completed: false,
    };
    (taskService.updateTask as any).mockResolvedValue(updatedTask);

    render(<TaskList />);
    await waitFor(() => screen.getByText("Test task 1"));

    const task1Text = screen.getByText("Test task 1");
    userEvent.click(task1Text);

    const input = await screen.findByDisplayValue("Test task 1");
    await userEvent.clear(input);
    await userEvent.type(input, "Test task 1 updated");
    fireEvent.blur(input);

    await waitFor(() =>
      expect(taskService.updateTask).toHaveBeenCalledWith(
        "1",
        "Test task 1 updated",
      ),
    );

    expect(screen.getByText("Test task 1 updated")).toBeInTheDocument();
  });

  it("toggles task completed", async () => {
    (taskService.getTasks as any).mockResolvedValue(mockTasks);
    const toggledTask = { id: "1", completed: true };
    (taskService.toggleTaskStatus as any).mockResolvedValue(toggledTask);

    render(<TaskList />);
    await waitFor(() => screen.getByText("Test task 1"));

    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.length).toBeGreaterThan(0);

    userEvent.click(checkboxes[0]);

    await waitFor(() =>
      expect(taskService.toggleTaskStatus).toHaveBeenCalledWith("1", true),
    );

    expect(checkboxes[0].checked).toBe(true);
  });

  it("filters tasks", async () => {
    (taskService.getTasks as any).mockResolvedValue(mockTasks);

    render(<TaskList />);
    await waitFor(() => screen.getByText("Test task 1"));

    const allFilter = screen.getByRole("button", { name: "All" });
    const activeFilter = screen.getByRole("button", { name: "Active" });
    const completedFilter = screen.getByRole("button", { name: "Completed" });

    expect(screen.getByText("Test task 1")).toBeInTheDocument();
    expect(screen.getByText("Test task 2")).toBeInTheDocument();

    userEvent.click(activeFilter);
    await waitFor(() =>
      expect(screen.queryByText("Test task 2")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Test task 1")).toBeInTheDocument();
    expect(screen.queryByText("Test task 2")).not.toBeInTheDocument();

    userEvent.click(completedFilter);
    await waitFor(() =>
      expect(screen.queryByText("Test task 1")).not.toBeInTheDocument(),
    );
    expect(screen.queryByText("Test task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Test task 2")).toBeInTheDocument();

    userEvent.click(allFilter);
    await waitFor(() =>
      expect(screen.queryByText("Test task 1")).toBeInTheDocument(),
    );
    expect(screen.getByText("Test task 1")).toBeInTheDocument();
    expect(screen.getByText("Test task 2")).toBeInTheDocument();
  });
});
