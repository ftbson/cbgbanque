import { redirect } from "next/navigation";

export default function Home() {
  // Fallback redirect in case middleware doesn't run
  // Middleware at src/middleware.ts handles language detection and redirect
  redirect("/FR");
}