import { NextRequest, NextResponse } from "next/server"
import * as SibApiV3Sdk from "@sendinblue/client"
import { trackEmailTranscript } from "@/lib/analytics"

export async function POST(req: NextRequest) {
  try {
    const { email, userName, messages, sessionId } = await req.json()

    if (!email || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!)

    const formattedMessages = messages
      .map(
        (msg: any) =>
          `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.sender === "user" ? "🧑 Tú" : "🤖 INGELEAN"}: ${
            msg.text
          }`
      )
      .join("\n")

    const htmlContent = `
      <h2>Transcripción de tu conversación con INGELEAN Assistant</h2>
      <p><strong>Nombre:</strong> ${userName || "No proporcionado"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <hr/>
      <pre style="font-family: monospace; background: #f4f4f4; padding: 1em; border-radius: 8px;">
${formattedMessages}
      </pre>
      <p>Gracias por usar nuestro asistente virtual.</p>
    `

    const sendSmtpEmail = {
      to: [{ email }],
      sender: { name: "INGELEAN Assistant", email: "no-reply@ingelean.com" },
      subject: "📝 Transcripción de tu conversación con INGELEAN",
      htmlContent,
    }

    await apiInstance.sendTransacEmail(sendSmtpEmail)

    // Opcional: rastreo en Supabase
    await trackEmailTranscript(sessionId, email, userName, messages.length, true)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error enviando correo:", error)
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 })
  }
}
