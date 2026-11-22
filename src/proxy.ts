import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getPreferredLocale(acceptLanguage: string | null): "FR" | "DE" | "ES" {
  if (!acceptLanguage) return "FR";

  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) => /^q\s*=/i.test(parameter));
      const quality = qualityParameter ? Number(qualityParameter.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of candidates) {
    if (tag === "de" || tag.startsWith("de-")) return "DE";
    if (tag === "es" || tag.startsWith("es-")) return "ES";
    if (tag === "fr" || tag.startsWith("fr-")) return "FR";
  }

  return "FR";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    const locale = getPreferredLocale(request.headers.get("accept-language"));
    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
  }

  const locale = pathname.startsWith("/DE") ? "de" : pathname.startsWith("/ES") ? "es" : "fr";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-cbg-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/", "/FR/:path*", "/DE/:path*", "/ES/:path*"],
};
