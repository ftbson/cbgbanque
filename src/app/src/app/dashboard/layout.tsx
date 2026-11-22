import { redirect } from "next/navigation";
import { getApprovedUser } from "@/lib/auth";
import DashboardShell from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getApprovedUser();
  if (!user) redirect("/login");

  return <DashboardShell>{children}</DashboardShell>;
}
