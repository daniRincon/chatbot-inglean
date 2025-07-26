"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface DailyStatsChartProps {
  data: Array<{
    date: string
    sessions: number
    messages: number
    emails: number
  }>
}

export function DailyStatsChart({ data }: DailyStatsChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Actividad Diaria</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => {
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value: string) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES")
              }}
            />
            <Bar dataKey="sessions" fill="#8b5cf6" name="Sesiones" />
            <Bar dataKey="messages" fill="#3b82f6" name="Mensajes" />
            <Bar dataKey="emails" fill="#10b981" name="Emails" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface FAQCategoriesChartProps {
  data: Array<{ category: string; count: number }>
}

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export function FAQCategoriesChart({ data }: FAQCategoriesChartProps) {
  // Custom label function that works with Recharts
  const renderCustomLabel = (entry: any) => {
    const { category, percent } = entry
    if (percent && percent > 0) {
      return `${category} ${(percent * 100).toFixed(0)}%`
    }
    return ""
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Categorías FAQ Más Consultadas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface EngagementChartProps {
  data: {
    shortSessions: number
    mediumSessions: number
    longSessions: number
  }
}

export function EngagementChart({ data }: EngagementChartProps) {
  const chartData = [
    { name: "Cortas (< 2 min)", value: data.shortSessions, fill: "#ef4444" },
    { name: "Medianas (2-10 min)", value: data.mediumSessions, fill: "#f59e0b" },
    { name: "Largas (> 10 min)", value: data.longSessions, fill: "#10b981" },
  ]

  // Custom label function for engagement chart
  const renderEngagementLabel = (entry: any) => {
    const { name, percent } = entry
    if (percent && percent > 0) {
      return `${name} ${(percent * 100).toFixed(0)}%`
    }
    return ""
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Duración de Sesiones</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderEngagementLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
