import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { usersTable, withdrawalRequestsTable } from "@/lib/schema";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
    }

    const rows = await db
      .select({
        id: withdrawalRequestsTable.id,
        userId: withdrawalRequestsTable.userId,
        recipientName: withdrawalRequestsTable.recipientName,
        iban: withdrawalRequestsTable.iban,
        bic: withdrawalRequestsTable.bic,
        amountCents: withdrawalRequestsTable.amountCents,
        description: withdrawalRequestsTable.description,
        otpCode: withdrawalRequestsTable.otpCode,
        status: withdrawalRequestsTable.status,
        createdAt: withdrawalRequestsTable.createdAt,
        userFirstName: usersTable.firstName,
        userLastName: usersTable.lastName,
        userEmail: usersTable.email,
      })
      .from(withdrawalRequestsTable)
      .leftJoin(usersTable, eq(withdrawalRequestsTable.userId, usersTable.id))
      .orderBy(desc(withdrawalRequestsTable.createdAt));

    return NextResponse.json({ success: true, withdrawals: rows });
  } catch (error) {
    console.error("Erreur lors de la récupération des retraits :", error);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
