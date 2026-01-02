import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; // 1. Correct import
import { authOptions } from "@/utils/authOptions"; // 2. Correct path to your options
import { db } from '@/utils/firebase'; 
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export async function GET(request) {
  try {
    // Now getServerSession will be defined
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');
    
    if (!queryStr) return NextResponse.json([]);

    // Capitalize first letter (tylenol -> Tylenol) to match typical DB entries
    const normalizedQuery = queryStr.charAt(0).toUpperCase() + queryStr.slice(1);

    // Reference the user-specific subcollection
    const medsRef = collection(db, 'users', session.user.email, 'medications');

    const q = query(
      medsRef,
      where("name", ">=", normalizedQuery),
      where("name", "<=", normalizedQuery + '\uf8ff'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search Error:", error); // This will now catch actual Firebase errors if they occur
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}