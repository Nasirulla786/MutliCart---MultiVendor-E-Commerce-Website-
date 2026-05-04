import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, role, targetRole } = await req.json();

    // ================= VALIDATION =================
    if (!messages || !role || !targetRole) {
      return NextResponse.json(
        { suggestionsSend: [] },
        { status: 400 }
      );
    }

    // ================= ROLE CONTEXT =================
    const roleMatrix: Record<string, string> = {
      "vendor-user": "Vendor should respond politely and support user queries.",
      "user-vendor": "User should ask clear product/service related questions.",
      "admin-vendor": "Admin should ensure compliance and system rules.",
      "vendor-admin": "Vendor should provide required business details.",
    };

    const roleKey = `${role}-${targetRole}`;
    const roleContext = roleMatrix[roleKey] || "";

    // ================= PROMPT (IMPROVED) =================
    const prompt = `
You are a chat suggestion AI.

Generate EXACTLY 3 short chat suggestions.

Rules:
- Each line = 1 suggestion
- No numbering
- No bullets
- Max 12 words each
- Only plain text

Context:
${roleContext}

Chat History:
${JSON.stringify(messages)}

Output:
`;

    // ================= GEMINI CALL =================
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    // ================= DEBUG (IMPORTANT) =================
    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    // ================= SAFE TEXT EXTRACTION =================
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") || "";

    // ================= EMPTY CHECK =================
    if (!text || text.trim().length === 0) {
      console.log("EMPTY GEMINI RESPONSE DETECTED");

      return NextResponse.json({
        suggestionsSend: [
          "How can I help you?",
          "Please share more details",
          "I will assist you shortly",
        ],
      });
    }

    // ================= CLEAN + SPLIT =================
    const suggestionsSend = text
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
      .slice(0, 3);

    // ================= RESPONSE =================
    return NextResponse.json({
      suggestionsSend,
    });
  } catch (err) {
    console.log("AI ROUTE ERROR:", err);

    return NextResponse.json(
      {
        suggestionsSend: [
          "Try again later",
          "AI temporarily unavailable",
          "Please retry request",
        ],
      },
      { status: 500 }
    );
  }
}
