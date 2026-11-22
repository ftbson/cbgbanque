import { NextResponse } from "next/server";
import { desc, sql, sum } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { analyticsVisits } from "@/lib/schema";

function getCountryCode(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    "";

  return /^[a-z]{2}$/i.test(country) ? country.toUpperCase() : "UNKNOWN";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let isSameOrigin = false;
  try {
    isSameOrigin =
      origin !== null && new URL(origin).origin === new URL(request.url).origin;
  } catch {
    isSameOrigin = false;
  }
  if (!isSameOrigin) {
    return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const country = getCountryCode(request);
    const id = `${today}:${country}`;

    await db
      .insert(analyticsVisits)
      .values({ id, visitDate: today, country, visits: 1 })
      .onConflictDoUpdate({
        target: analyticsVisits.id,
        set: { visits: sql`${analyticsVisits.visits} + 1` },
      });

    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement d'une visite :", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer cette visite." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (
    (await cookies()).get("admin_token")?.value !==
    "authenticated_admin_holz_session"
  ) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const [total] = await db
      .select({ visits: sum(analyticsVisits.visits) })
      .from(analyticsVisits);
    const countries = await db
      .select({
        country: analyticsVisits.country,
        visits: sum(analyticsVisits.visits),
      })
      .from(analyticsVisits)
      .groupBy(analyticsVisits.country)
      .orderBy(desc(sum(analyticsVisits.visits)));

    return NextResponse.json(
      {
        totalVisits: Number(total?.visits ?? 0),
        byCountry: countries.map(({ country, visits }) => ({
          country,
          visits: Number(visits ?? 0),
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques de visite :", error);
    return NextResponse.json(
      { error: "Impossible de charger les statistiques de visite." },
      { status: 500 },
    );
  }
}
