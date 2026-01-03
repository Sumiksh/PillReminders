import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define a schema for a LIST of pills
const pillBatchSchema = {
  type: SchemaType.OBJECT,
  properties: {
    medications: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          imprint: { type: SchemaType.STRING },
          color: { type: SchemaType.STRING },
          shape: { type: SchemaType.STRING },
          visualDescription: { type: SchemaType.STRING },
          isValidMedicine: { type: SchemaType.BOOLEAN }
        },
        required: ["name", "imprint", "color", "shape", "visualDescription", "isValidMedicine"]
      }
    }
  },
  required: ["medications"]
};

export async function POST(request) {
  try {
    const { names } = await request.json(); // Expecting an array: ["Advil", "Tylenol"]

    if (!names || !Array.isArray(names)) {
      return Response.json({ error: "An array of medicine names is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      temperature: 0,
      systemInstruction: "You are a pharmaceutical database. Provide physical characteristics for the list of medications provided. If a name is invalid, set isValidMedicine to false.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: pillBatchSchema,
      },
    });

    const prompt = `Identify these medications: ${names.join(", ")}.`;
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());

    return Response.json(data.medications); 
  } catch (error) {
    console.error("AI Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}