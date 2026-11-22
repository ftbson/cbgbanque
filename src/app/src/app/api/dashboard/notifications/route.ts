import { and, desc, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notificationsTable } from "@/lib/schema";

export async function GET() {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const notifications = await db.select().from(notificationsTable)
      .where(eq(notificationsTable.userId, user.id))
      .orderBy(desc(notificationsTable.createdAt));
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("Erreur lors du chargement des notifications :", error);
    return NextResponse.json({ success: false, message: "Impossible de charger les notifications." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getApprovedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    let where;
    if ("markAll" in body && body.markAll === true) {
      where = and(eq(notificationsTable.userId, user.id), isNull(notificationsTable.readAt));
    } else if ("notificationId" in body && typeof body.notificationId === "string") {
      where = and(
        eq(notificationsTable.userId, user.id),
        eq(notificationsTable.id, body.notificationId),
      );
    } else {
      return NextResponse.json({ success: false, message: "Données invalides." }, { status: 400 });
    }

    await db.update(notificationsTable)
      .set({ readAt: new Date().toISOString() })
      .where(where);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications :", error);
    return NextResponse.json({ success: false, message: "Impossible de mettre à jour les notifications." }, { status: 500 });
  }
}
