import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({ component: Docs });

function Docs() {
  return <Navigate to="/paper" />;
}
