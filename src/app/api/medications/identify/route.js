import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { name } = await request.json();

    // SWITCH TO FLASH-LITE FOR HIGHER RATE LIMITS
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", // Much more stable for free tier
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Identify physical attributes for: ${name}. Return JSON: {imprint, color, shape, visualDescription}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ name, ...JSON.parse(text) });

  } catch (error) {
    // If we still hit a 429, return a cleaner message to the UI
    if (error.message?.includes("429")) {
      return Response.json({ error: "System busy. Please wait 10 seconds." }, { status: 429 });
    }
    return Response.json({ error: "Error identifying pill" }, { status: 500 });
  }
}