import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { names } = await request.json();

    const results = await Promise.all(names.map(async (name) => {
      // openFDA search query for the specific drug label
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(name)}"&limit=1`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.error || !data.results) {
        return { name, why: "Information not found", precautions: "Consult your doctor." };
      }

      const result = data.results[0];

      return {
        name,
        // openFDA fields are often arrays of strings
        why: result.indications_and_usage?.[0] || "Usage information not available.",
        precautions: result.precautions?.[0] || result.warnings?.[0] || "No specific precautions listed.",
      };
    }));

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ data: [] });
  }
}