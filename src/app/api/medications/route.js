import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; 
import { adminDb } from "@/utils/firebaseAdmin";

export async function POST(request) {
  // Use the exported authOptions here to verify the session
  console.log("api hitting backed")
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const medicationData = await request.json();
    console.log("medicationData",medicationData)
    // Save to Firebase using the Admin SDK
    // const docRef = await adminDb.collection('medications').add({
    //   name: medicationData.name,
    //   dosage: medicationData.dosage,
    //   startDate: medicationData.startDate,
    //   times: medicationData.times,
    //   userId: session.user.email,
    //   createdAt: new Date().toISOString(),
    // });
    const docRef = await adminDb
      .collection('users')             // 1. Enter the users collection
      .doc(session.user.email)         // 2. Select the specific user's document
      .collection('medications')       // 3. Enter that user's private medications folder
      .add({                           // 4. Add the pill data
        name: medicationData.name,
        dosage: medicationData.dosage,
        startDate: medicationData.startDate,
        times: medicationData.times,
        createdAt: new Date().toISOString(),
      });
    return NextResponse.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("FULL FIREBASE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}