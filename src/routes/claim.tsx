import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/claim")({ component: Claim });

function Claim() {
  return <Navigate to="/box" />;
}
