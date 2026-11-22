import { notFound } from "next/navigation";

// The Next.js proxy handles every request to / with an HTTP locale redirect.
// This page is only a defensive fallback and never renders a homepage at /.
export default function RootPage(): never {
  notFound();
}
