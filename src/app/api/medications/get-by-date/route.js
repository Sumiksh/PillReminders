import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { adminDb } from "@/utils/firebaseAdmin";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get the date from the URL (e.g., /api/medications/get-by-date?date=2025-12-21)
  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get('date');
  console.log("selectedDate",selectedDate)

  try {
    const medsSnapshot = await adminDb
      .collection('users')
      .doc(session.user.email)
      .collection('medications')
      .where('startDate', '==', selectedDate) // Only get meds that have started
      .get();

    const medications = medsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter logic: In a real app, you'd check frequency/endDate here. 
    // For now, we return all active meds started on or before this date.
    return NextResponse.json(medications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}