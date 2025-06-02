import { Box, Button, Typography } from "@mui/material";
import { useErrorBoundary } from "react-error-boundary";

export default function GlobalErrorPage() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <Box p={6} textAlign="center">
      <Typography fontWeight="bold" mb={2} variant="h4">
        Something went wrong
      </Typography>
      <Typography mb={2}>
        We encountered an unexpected error. Try reloading the page.
      </Typography>
      <Button color="primary" variant="contained" onClick={resetBoundary}>
        Retry
      </Button>
    </Box>
  );
}
