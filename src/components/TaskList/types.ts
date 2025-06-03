/*
    When clicking the checkbox (isUpdatingChecked), only disable the checkbox.
    When updating the title (isUpdatingTitle), only disable the title input.
    When deleting a task (isDeleting), disable the delete button, checkbox and input.
*/
export type TaskUiState = {
  isUpdatingChecked: boolean;
  isUpdatingTitle: boolean;
  isDeleting: boolean;
};
