import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/launch")({ component: Launch });

function Launch() {
  return <Navigate to="/box" />;
}
