import { Button, Paper, Typography } from "@mui/material";
import { useErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

export default function GlobalErrorPage() {
  const { resetBoundary } = useErrorBoundary();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10">
      <Paper className="p-6">
        <Typography fontWeight="bold" mb={2} variant="h4">
          {t("errors.global.title")}
        </Typography>
        <Typography mb={2}>{t("errors.global.message")}</Typography>
        <Button color="primary" variant="contained" onClick={resetBoundary}>
          {t("errors.global.retryButton")}
        </Button>
      </Paper>
    </div>
  );
}
