import { NextResponse } from "next/server";
import { getApprovedUser } from "@/lib/auth";

export async function POST() {
  const user = await getApprovedUser();
  if (!user) return NextResponse.json({ success: false, message: "Authentification requise." }, { status: 401 });

  return NextResponse.json({
    success: false,
    message: "La validation OTP par un administrateur n'est pas prise en charge. La demande doit être enregistrée directement en attente de validation.",
  }, { status: 410 });
}
