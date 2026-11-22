import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });
  }

  return NextResponse.json({
    success: false,
    message: "La transmission d'un code OTP par l'administration n'est pas prise en charge.",
  }, { status: 410 });
}
