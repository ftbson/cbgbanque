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
  if (request.nextUrl.pathname !== "/") return NextResponse.next();

  const locale = getPreferredLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}`, request.url), 307);
}

export const config = { matcher: ["/"] };
