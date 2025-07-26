"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Cog,
  Building,
  Zap,
} from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: React.ReactNode
  keywords: string[]
}

const faqData: FAQItem[] = [
  {
    id: "servicios",
    question: "¿Qué servicios ofrece INGELEAN?",
    answer:
      "Ofrecemos desarrollo de software, automatización industrial, mantenimiento preventivo, hardware y soluciones en IA.",
    category: "Servicios",
    icon: <Cog className="w-4 h-4" />,
    keywords: ["servicios", "ofrece", "desarrollo", "software", "automatización"],
  },
  {
    id: "ubicacion",
    question: "¿Dónde están ubicados?",
    answer: "Estamos ubicados en Pereira, Risaralda - Colombia.",
    category: "Información",
    icon: <MapPin className="w-4 h-4" />,
    keywords: ["ubicados", "donde", "dirección", "pereira"],
  },
  {
    id: "horarios",
    question: "¿Cuáles son los horarios de atención?",
    answer: "Nuestro horario de atención es de lunes a viernes de 8:00 a.m. a 5:00 p.m.",
    category: "Información",
    icon: <Clock className="w-4 h-4" />,
    keywords: ["horario", "atención", "lunes", "viernes"],
  },
  {
    id: "cotizacion",
    question: "¿Cómo solicitar una cotización?",
    answer: "Puedes solicitar una cotización escribiéndonos a contacto@ingelean.com o usando nuestro formulario web.",
    category: "Ventas",
    icon: <Mail className="w-4 h-4" />,
    keywords: ["cotización", "solicitar", "precio", "presupuesto"],
  },
  {
    id: "automatizacion",
    question: "¿Trabajan con automatización industrial?",
    answer: "Sí, tenemos experiencia en automatización industrial para empresas del Eje Cafetero.",
    category: "Servicios",
    icon: <Zap className="w-4 h-4" />,
    keywords: ["automatización", "industrial", "eje", "cafetero"],
  },
  {
    id: "soporte",
    question: "¿Ofrecen soporte técnico?",
    answer: "Ofrecemos soporte técnico tanto presencial como remoto para nuestros clientes.",
    category: "Servicios",
    icon: <HelpCircle className="w-4 h-4" />,
    keywords: ["soporte", "técnico", "presencial", "remoto"],
  },
  {
    id: "contacto",
    question: "¿Cómo contactar con ventas?",
    answer: "Puedes comunicarte con ventas al correo ventas@ingelean.com o al WhatsApp 300 123 4567.",
    category: "Ventas",
    icon: <Phone className="w-4 h-4" />,
    keywords: ["ventas", "contactar", "whatsapp", "teléfono"],
  },
  {
    id: "empresas",
    question: "¿Trabajan con empresas pequeñas?",
    answer: "Sí, trabajamos con empresas de todos los tamaños, incluyendo startups y pymes.",
    category: "Información",
    icon: <Building className="w-4 h-4" />,
    keywords: ["empresas", "pequeñas", "startups", "pymes"],
  },
]

const categories = ["Todos", "Servicios", "Información", "Ventas"]

interface FAQPanelProps {
  onQuestionSelect: (question: string) => void
}

export function FAQPanel({ onQuestionSelect }: FAQPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredFAQ =
    selectedCategory === "Todos" ? faqData : faqData.filter((item) => item.category === selectedCategory)

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          Preguntas Frecuentes
        </CardTitle>
        <p className="text-sm text-gray-600">Haz clic en cualquier pregunta para enviarla al chat</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Category filters */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs ${
                  selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {filteredFAQ.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div
                className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-purple-600">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.question}</h4>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                {expandedItems.includes(item.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {expandedItems.includes(item.id) && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3 mt-3">{item.answer}</p>
                  <Button
                    size="sm"
                    onClick={() => onQuestionSelect(item.question)}
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Preguntar esto
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
