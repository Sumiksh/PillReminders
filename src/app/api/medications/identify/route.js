import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// 1. Initialize the SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Define the exact JSON structure for the pill data
const pillSchema = {
  description: "Pharmaceutical identification data for a pill",
  type: SchemaType.OBJECT,
  properties: {
    imprint: {
      type: SchemaType.STRING,
      description: "The letters or numbers stamped on the pill surface.",
    },
    color: {
      type: SchemaType.STRING,
      description: "The primary color of the medication (e.g., White, Blue/Yellow).",
    },
    shape: {
      type: SchemaType.STRING,
      description: "The geometric shape (e.g., Round, Oval, Capsule-shaped).",
    },
    visualDescription: {
      type: SchemaType.STRING,
      description: "A one-sentence description of the pill's overall look.",
    },
    isValidMedicine: {
      type: SchemaType.BOOLEAN,
      description: "True if the input is a known medicine, False otherwise.",
    }
  },
  required: ["imprint", "color", "shape", "visualDescription", "isValidMedicine"],
};

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return Response.json({ error: "Medicine name is required" }, { status: 400 });
    }

    // 3. Configure the model with System Instructions
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Use 1.5-flash or 2.0-flash-lite for speed
      temperature: 0,
      systemInstruction: `You are a strict pharmaceutical database assistant. 
      Your only job is to provide physical identification characteristics of medications. 
      If the user provides a name that is not a real medicine, set isValidMedicine to false. 
      Do not provide medical advice.`,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: pillSchema,
      },
    });

    // 4. Generate the content
    const prompt = `Identify the physical characteristics for the medication: ${name}.`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Parse and return the JSON
    const pillData = JSON.parse(responseText);

    return Response.json({ 
      query: name,
      data: pillData 
    });

  } catch (error) {
    console.error("AI Error:", error);

    // Handle Rate Limiting (429) specifically
    if (error.message?.includes("429")) {
      return Response.json(
        { error: "Quota exceeded. Please wait a moment before trying again." }, 
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}