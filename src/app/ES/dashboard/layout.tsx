import { redirect } from "next/navigation";
import { getApprovedUser } from "@/lib/auth";
import DashboardShell from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getApprovedUser();
  if (!user) redirect("/ES/login");

  return <DashboardShell>{children}</DashboardShell>;
}
