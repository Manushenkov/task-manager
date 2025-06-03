import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";

export const GlobalErrorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      console.error("Global unhandled promise:", event.reason);
      showBoundary(event.reason);
    };
    window.addEventListener("unhandledrejection", handler);

    return () => window.removeEventListener("unhandledrejection", handler);
  }, [showBoundary]);

  return <>{children}</>;
};
