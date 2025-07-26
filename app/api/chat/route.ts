import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ response: "❌ Por favor, envía un mensaje válido." });
  }

  const prompt = {
    contents: [
      {
        parts: [
          {
            text: `
Eres un asistente virtual amable y profesional de INGELEAN S.A.S., una empresa ubicada en Pereira, Risaralda (Colombia).

Información clave:
- Servicios: desarrollo de software, automatización industrial, mantenimiento preventivo y correctivo, soluciones de hardware e inteligencia artificial.
- Cobertura: Eje Cafetero y todo Colombia.
- Horario: lunes a viernes de 8:00 a.m. a 5:00 p.m.
- Contacto: contacto@ingelean.com | WhatsApp 300 123 4567.
- Experiencia: más de 5 años con pymes, startups y empresas.

Si el usuario saluda, respóndele con cortesía. Si hace preguntas técnicas fuera del contexto empresarial, sugiere hablar con un asesor humano.

Consulta del usuario: "${message}"
          `,
          },
        ],
      },
    ],
  };

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify(prompt),
      }
    );

    const data = await geminiRes.json();

    const response =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "🤖 No tengo una respuesta clara en este momento. ¿Te gustaría que te contacte un asesor humano?";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("❌ Error consultando Gemini 2.0 Flash:", error);
    return NextResponse.json(
      {
        response:
          "❌ Ocurrió un error al generar la respuesta. Por favor intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}
