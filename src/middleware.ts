import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Parse the Accept-Language header and return the preferred supported locale.
 * Supported locales: fr, de, es
 * Default: fr
 */
function getPreferredLocale(acceptLanguage: string | null): "fr" | "de" | "es" {
  if (!acceptLanguage) {
    return "fr";
  }

  // Parse Accept-Language header
  // Format: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6"
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      const quality = qValue ? parseFloat(qValue) : 1.0;
      return { code: code.trim().toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Check each language in order of preference
  for (const { code } of languages) {
    // Check for exact matches first (e.g., "fr", "de", "es")
    if (code === "fr" || code.startsWith("fr-")) {
      return "fr";
    }
    if (code === "de" || code.startsWith("de-")) {
      return "de";
    }
    if (code === "es" || code.startsWith("es-")) {
      return "es";
    }
  }

  // Default to French if no supported language found
  return "fr";
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only handle the root path "/"
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language");
    const locale = getPreferredLocale(acceptLanguage);

    // Build the redirect URL
    const redirectUrl = new URL(`/${locale.toUpperCase()}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // For all other paths, continue normally
  return NextResponse.next();
}

export const config = {
  // Only run middleware on the root path
  matcher: ["/"],
};