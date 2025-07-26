"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { DailyStatsChart, FAQCategoriesChart, EngagementChart } from "@/components/dashboard/charts"
import {
  MessageSquare,
  Users,
  Mail,
  Clock,
  TrendingUp,
  RefreshCw,
  Calendar,
  Zap,
  BarChart3,
  Activity,
  ArrowLeft,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

interface ChatMetrics {
  totalSessions: number
  totalMessages: number
  avgMessagesPerSession: number
  avgSessionDuration: number
  emailsSent: number
  topFAQCategories: Array<{ category: string; count: number }>
  dailyStats: Array<{
    date: string
    sessions: number
    messages: number
    emails: number
  }>
  responseTimeStats: {
    avg: number
    min: number
    max: number
  }
  userEngagement: {
    shortSessions: number
    mediumSessions: number
    longSessions: number
  }
}

// Mock data for demonstration
const mockMetrics: ChatMetrics = {
  totalSessions: 156,
  totalMessages: 892,
  avgMessagesPerSession: 5.7,
  avgSessionDuration: 245,
  emailsSent: 23,
  topFAQCategories: [
    { category: "Servicios", count: 45 },
    { category: "Información", count: 32 },
    { category: "Ventas", count: 28 },
    { category: "Soporte", count: 15 },
    { category: "Precios", count: 12 },
  ],
  dailyStats: [
    { date: "2024-01-20", sessions: 12, messages: 68, emails: 3 },
    { date: "2024-01-21", sessions: 15, messages: 85, emails: 4 },
    { date: "2024-01-22", sessions: 18, messages: 102, emails: 5 },
    { date: "2024-01-23", sessions: 22, messages: 125, emails: 6 },
    { date: "2024-01-24", sessions: 19, messages: 108, emails: 4 },
    { date: "2024-01-25", sessions: 25, messages: 142, emails: 7 },
    { date: "2024-01-26", sessions: 28, messages: 158, emails: 8 },
  ],
  responseTimeStats: {
    avg: 850,
    min: 245,
    max: 1850,
  },
  userEngagement: {
    shortSessions: 45,
    mediumSessions: 78,
    longSessions: 33,
  },
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<ChatMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(30)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    try {
      // For now, use mock data. Replace with actual API call later
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading
      setMetrics(mockMetrics)
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [selectedPeriod, fetchMetrics])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatResponseTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-lg text-gray-600">Cargando métricas...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar métricas</h2>
            <Button onClick={fetchMetrics} className="bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Chat
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard INGELEAN Assistant
              </h1>
              <p className="text-gray-600 mt-2">Métricas y análisis del chatbot</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ir al Chatbot
              </Button>
            </Link>
            <div className="flex gap-2">
              {[7, 30, 90].map((days) => (
                <Button
                  key={days}
                  variant={selectedPeriod === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(days)}
                  className={selectedPeriod === days ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {days} días
                </Button>
              ))}
            </div>
            <Button onClick={fetchMetrics} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Sistema Activo
          </Badge>
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            Últimos {selectedPeriod} días
          </Badge>
        </div>

        {/* Main Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Sesiones"
            value={metrics.totalSessions.toLocaleString()}
            description="Conversaciones iniciadas"
            icon={Users}
          />
          <MetricCard
            title="Total de Mensajes"
            value={metrics.totalMessages.toLocaleString()}
            description="Mensajes intercambiados"
            icon={MessageSquare}
          />
          <MetricCard
            title="Emails Enviados"
            value={metrics.emailsSent.toLocaleString()}
            description="Transcripciones por correo"
            icon={Mail}
          />
          <MetricCard
            title="Duración Promedio"
            value={formatDuration(Math.round(metrics.avgSessionDuration))}
            description="Tiempo por sesión"
            icon={Clock}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Mensajes por Sesión"
            value={metrics.avgMessagesPerSession.toFixed(1)}
            description="Promedio de interacciones"
            icon={TrendingUp}
          />
          <MetricCard
            title="Tiempo de Respuesta"
            value={formatResponseTime(metrics.responseTimeStats.avg)}
            description={`Min: ${formatResponseTime(metrics.responseTimeStats.min)} | Max: ${formatResponseTime(metrics.responseTimeStats.max)}`}
            icon={Zap}
          />
          <MetricCard
            title="Tasa de Email"
            value={`${((metrics.emailsSent / metrics.totalSessions) * 100).toFixed(1)}%`}
            description="Usuarios que solicitan transcripción"
            icon={BarChart3}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-7">
          <DailyStatsChart data={metrics.dailyStats} />
          <FAQCategoriesChart data={metrics.topFAQCategories} />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <EngagementChart data={metrics.userEngagement} />

          {/* Top FAQ Questions */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Preguntas Más Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topFAQCategories.slice(0, 5).map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600">
                        {index + 1}
                      </div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <Badge variant="secondary">{item.count} consultas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Dashboard actualizado en tiempo real • INGELEAN © 2024</p>
        </div>
      </div>
    </div>
  )
}
