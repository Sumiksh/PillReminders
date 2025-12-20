import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { adminDb } from "@/utils/firebaseAdmin";

export async function POST(request) {
  // 1. Verify the user is logged in using the session
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Get data from the frontend request
    const medicationData = await request.json();

    // 3. Save to Firestore using Admin SDK
    const docRef = await adminDb.collection('medications').add({
      ...medicationData,
      userId: session.user.email, // Securely attach the user email from the session
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: "Saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}