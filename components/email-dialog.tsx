"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  sender: string
  text: string
  timestamp: Date
}

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  sessionId: string
}

export function EmailDialog({ isOpen, onClose, messages, sessionId }: EmailDialogProps) {
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSend = async () => {
    if (!email.trim()) {
      setStatus({
        type: "error",
        message: "Por favor ingresa tu email",
      })
      return
    }

    setIsLoading(true)
    setStatus({ type: null, message: "" })

    try {
      const response = await fetch("/api/send-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          userName: userName.trim() || undefined,
          messages: messages,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: "¡Transcripción enviada exitosamente! Revisa tu correo.",
        })
        setTimeout(() => {
          onClose()
          setEmail("")
          setUserName("")
          setStatus({ type: null, message: "" })
        }, 2000)
      } else {
        setStatus({
          type: "error",
          message: data.error || "Error al enviar el correo",
        })
      }
    } catch {
      setStatus({
        type: "error",
        message: "Error de conexión. Intenta nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setStatus({ type: null, message: "" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600" />
            Enviar transcripción por correo
          </DialogTitle>
          <DialogDescription>Te enviaremos una copia completa de esta conversación a tu email.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nombre (opcional)</Label>
            <Input
              id="userName"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {status.type && (
            <Alert className={status.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {status.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={status.type === "success" ? "text-green-800" : "text-red-800"}>
                {status.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !email.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
