import { NextResponse } from "next/server"

const faq: Record<string, string> = {
  "servicios ofrece":
    "🚀 INGELEAN ofrece desarrollo de software, automatización industrial, mantenimiento preventivo, hardware y soluciones en IA.",
  ubicados: "📍 Estamos ubicados en Pereira, Risaralda - Colombia.",
  "horario de atención": "🕒 Nuestro horario de atención es de lunes a viernes de 8:00 a.m. a 5:00 p.m.",
  cotización:
    "💼 Puedes solicitar una cotización escribiéndonos a contacto@ingelean.com o usando nuestro formulario web.",
  automatización: "⚙️ Sí, tenemos experiencia en automatización industrial para empresas del Eje Cafetero.",
  "soporte técnico": "🛠️ Ofrecemos soporte técnico tanto presencial como remoto para nuestros clientes.",
  "ciudades trabajan": "🌎 Principalmente en el Eje Cafetero, pero también atendemos proyectos en todo el país.",
  "soluciones de software": "💻 Desarrollamos soluciones a medida como ERP, CRM, sistemas de monitoreo, entre otros.",
  ventas: "📞 Puedes comunicarte con ventas al correo ventas@ingelean.com o al WhatsApp 300 123 4567.",
  "empresas pequeñas": "🏢 Sí, trabajamos con empresas de todos los tamaños, incluyendo startups y pymes.",
  "inteligencia artificial": "🤖 Desarrollamos soluciones de IA personalizadas para optimizar procesos empresariales.",
  mantenimiento: "🔧 Ofrecemos servicios de mantenimiento preventivo y correctivo para equipos industriales.",
  precios:
    "💰 Nuestros precios son competitivos y se ajustan al presupuesto de cada proyecto. ¡Solicita tu cotización!",
  experiencia: "📈 Contamos con más de 5 años de experiencia en el sector tecnológico del Eje Cafetero.",
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({
        response: "❌ Por favor, envía un mensaje válido.",
      })
    }

    const lower = message.toLowerCase()
    const key = Object.keys(faq).find((k) => lower.includes(k))

    const response = key
      ? faq[key]
      : "🤔 Lo siento, por ahora solo puedo responder preguntas frecuentes sobre nuestros servicios. ¿Te gustaría que te contacte un asesor humano? Puedes escribirnos a contacto@ingelean.com"

    // Simulate a small delay for more realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response: "❌ Lo siento, ocurrió un error interno. Por favor, intenta nuevamente.",
      },
      { status: 500 },
    )
  }
}
