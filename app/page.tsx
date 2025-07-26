"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Download, BarChart3, HelpCircle } from "lucide-react"
import { EmailDialog } from "@/components/email-dialog"
import Link from "next/link"

interface Message {
  sender: string
  text: string
  timestamp: Date
}

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Expanded FAQ data with 14 questions
const faqData = [
  {
    id: "servicios",
    question: "¿Qué servicios ofrece INGELEAN?",
    category: "Servicios",
  },
  {
    id: "ubicacion",
    question: "¿Dónde están ubicados?",
    category: "Información",
  },
  {
    id: "horarios",
    question: "¿Cuál es el horario de atención?",
    category: "Información",
  },
  {
    id: "soporte",
    question: "¿Ofrecen soporte técnico?",
    category: "Servicios",
  },
  {
    id: "cotizacion",
    question: "¿Cómo solicitar una cotización?",
    category: "Ventas",
  },
  {
    id: "automatizacion",
    question: "¿Tienen experiencia en automatización industrial?",
    category: "Servicios",
  },
  {
    id: "ciudades",
    question: "¿En qué ciudades trabajan?",
    category: "Información",
  },
  {
    id: "software",
    question: "¿Desarrollan soluciones de software?",
    category: "Servicios",
  },
  {
    id: "ventas",
    question: "¿Cómo contacto al área de ventas?",
    category: "Ventas",
  },
  {
    id: "pymes",
    question: "¿Trabajan con empresas pequeñas o pymes?",
    category: "Información",
  },
  {
    id: "ia",
    question: "¿Ofrecen inteligencia artificial?",
    category: "Servicios",
  },
  {
    id: "mantenimiento",
    question: "¿Realizan mantenimiento preventivo y correctivo?",
    category: "Servicios",
  },
  {
    id: "precios",
    question: "¿Cuáles son los precios?",
    category: "Ventas",
  },
  {
    id: "experiencia",
    question: "¿Cuánta experiencia tienen?",
    category: "Información",
  },
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola! Soy el asistente virtual de INGELEAN. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showFAQ, setShowFAQ] = useState(true)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [sessionId] = useState(() => generateSessionId())
  const sessionStarted = useRef(false)

  // Track analytics functions (simplified for now)
  const trackChatSession = useCallback(async (sessionId: string, userAgent?: string) => {
    try {
      // Implement tracking logic here
      console.log("Tracking session:", sessionId, userAgent)
    } catch (error) {
      console.error("Error tracking session:", error)
    }
  }, [])

  const trackMessage = useCallback(
    async (sessionId: string, sender: "user" | "bot", message: string, responseTime?: number) => {
      try {
        // Implement tracking logic here
        console.log("Tracking message:", sessionId, sender, message, responseTime)
      } catch (error) {
        console.error("Error tracking message:", error)
      }
    },
    [],
  )

  // Initialize session tracking
  useEffect(() => {
    if (!sessionStarted.current) {
      const userAgent = navigator.userAgent
      trackChatSession(sessionId, userAgent)
      sessionStarted.current = true

      // Track initial bot message
      trackMessage(sessionId, "bot", messages[0].text)
    }

    // End session when user leaves
    const handleBeforeUnload = () => {
      console.log("Ending session:", sessionId)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [sessionId, trackChatSession, trackMessage, messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Track user message
    await trackMessage(sessionId, "user", input)

    const currentInput = input
    setInput("")
    setIsLoading(true)

    const startTime = Date.now()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await res.json()
      const responseTime = Date.now() - startTime

      const botMessage: Message = {
        sender: "bot",
        text: data.response || "Lo siento, ocurrió un error.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Track bot message with response time
      await trackMessage(sessionId, "bot", botMessage.text, responseTime)
    } catch {
      const errorMessage: Message = {
        sender: "bot",
        text: "Lo siento, ocurrió un error de conexión.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])

      // Track error message
      await trackMessage(sessionId, "bot", errorMessage.text, Date.now() - startTime)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFAQSelect = (question: string) => {
    setInput(question)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col p-4">
        {/* Header */}
        <div className="text-center py-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              INGELEAN Assistant
            </h1>
          </div>
          <p className="text-gray-600">Tu asistente virtual especializado en soluciones tecnológicas</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary">Disponible 24/7</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailDialog(true)}
              disabled={messages.length <= 1}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Enviar por email
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                <BarChart3 className="w-3 h-3 mr-1" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowFAQ(!showFAQ)} className="text-xs">
              <HelpCircle className="w-3 h-3 mr-1" />
              {showFAQ ? "Ocultar" : "Mostrar"} FAQ
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* FAQ Panel - Left Side */}
          {showFAQ && (
            <div className="w-80 flex-shrink-0">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    Preguntas Frecuentes
                  </CardTitle>
                  <p className="text-sm text-gray-600">Haz clic en cualquier pregunta para enviarla al chat</p>
                </CardHeader>

                <CardContent className="flex-1 p-0 min-h-0">
                  {/* Scrollable FAQ List */}
                  <div className="h-full overflow-y-auto px-6 pb-6">
                    <div className="space-y-3">
                      {faqData.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                          onClick={() => handleFAQSelect(item.question)}
                        >
                          <div className="p-4 hover:bg-gray-50">
                            <h4 className="font-medium text-sm text-gray-900 mb-2">{item.question}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Area - Right Side */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Container */}
            <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm min-h-0">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  Conversación
                  <Badge variant="outline" className="text-xs ml-auto">
                    ID: {sessionId.split("_")[2]}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback
                            className={`text-xs ${
                              msg.sender === "user" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-800 rounded-bl-md border"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-1">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md border">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="border-t bg-gray-50/50 p-4 flex-shrink-0">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe tu pregunta sobre nuestros servicios..."
                        className="resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl px-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["¿Qué servicios ofrecen?", "Horarios de atención", "Solicitar cotización"].map(
                      (suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => setInput(suggestion)}
                          className="text-xs rounded-full border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                          disabled={isLoading}
                        >
                          {suggestion}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="text-center py-4 flex-shrink-0">
          <p className="text-xs text-gray-500">Desarrollado por INGELEAN • Soluciones tecnológicas innovadoras</p>
        </div>
      </div>

      {/* Email Dialog */}
      <EmailDialog
        isOpen={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        messages={messages}
        sessionId={sessionId}
      />
    </div>
  )
}
