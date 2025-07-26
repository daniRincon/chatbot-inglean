import { supabaseAdmin } from "./supabase"

export interface ChatMetrics {
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

export async function trackChatSession(sessionId: string, userAgent?: string, ipAddress?: string) {
  try {
    const { error } = await supabaseAdmin.from("chat_sessions").insert({
      session_id: sessionId,
      user_agent: userAgent,
      ip_address: ipAddress,
    })

    if (error) {
      console.error("Error tracking chat session:", error)
    }
  } catch (error) {
    console.error("Error tracking chat session:", error)
  }
}

export async function trackMessage(
  sessionId: string,
  sender: "user" | "bot",
  message: string,
  responseTime?: number,
  wasFromFAQ?: boolean,
  faqCategory?: string,
) {
  try {
    // Insert message
    const { error: messageError } = await supabaseAdmin.from("chat_messages").insert({
      session_id: sessionId,
      sender,
      message,
      response_time: responseTime,
      was_from_faq: wasFromFAQ,
      faq_category: faqCategory,
    })

    if (messageError) {
      console.error("Error tracking message:", messageError)
      return
    }

    // Update session message count
    const { data: session } = await supabaseAdmin
      .from("chat_sessions")
      .select("message_count")
      .eq("session_id", sessionId)
      .single()

    if (session) {
      await supabaseAdmin
        .from("chat_sessions")
        .update({
          message_count: (session.message_count || 0) + 1,
        })
        .eq("session_id", sessionId)
    }
  } catch (error) {
    console.error("Error tracking message:", error)
  }
}

export async function trackFAQInteraction(sessionId: string, questionId: string, question: string, category: string) {
  try {
    const { error } = await supabaseAdmin.from("faq_interactions").insert({
      session_id: sessionId,
      question_id: questionId,
      question,
      category,
    })

    if (error) {
      console.error("Error tracking FAQ interaction:", error)
    }
  } catch (error) {
    console.error("Error tracking FAQ interaction:", error)
  }
}

export async function trackEmailTranscript(
  sessionId: string,
  email: string,
  userName: string | undefined,
  messageCount: number,
  success: boolean,
) {
  try {
    // Insert email transcript record
    const { error: emailError } = await supabaseAdmin.from("email_transcripts").insert({
      session_id: sessionId,
      email,
      user_name: userName,
      message_count: messageCount,
      success,
    })

    if (emailError) {
      console.error("Error tracking email transcript:", emailError)
      return
    }

    // Update session if email was sent successfully
    if (success) {
      await supabaseAdmin
        .from("chat_sessions")
        .update({
          email_sent: true,
          user_email: email,
        })
        .eq("session_id", sessionId)
    }
  } catch (error) {
    console.error("Error tracking email transcript:", error)
  }
}

export async function endChatSession(sessionId: string) {
  try {
    const { data: session } = await supabaseAdmin
      .from("chat_sessions")
      .select("start_time")
      .eq("session_id", sessionId)
      .single()

    if (session) {
      const startTime = new Date(session.start_time)
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      await supabaseAdmin
        .from("chat_sessions")
        .update({
          end_time: endTime.toISOString(),
          duration,
        })
        .eq("session_id", sessionId)
    }
  } catch (error) {
    console.error("Error ending chat session:", error)
  }
}

export async function getChatMetrics(days = 30): Promise<ChatMetrics> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateISO = startDate.toISOString()

    // Total sessions
    const { count: totalSessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateISO)

    // Total messages
    const { count: totalMessages } = await supabaseAdmin
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .gte("timestamp", startDateISO)

    // Get sessions for calculations
    const { data: sessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("message_count, duration")
      .gte("created_at", startDateISO)

    // Calculate averages
    const avgMessagesPerSession =
      sessions && sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.message_count || 0), 0) / sessions.length
        : 0

    const avgSessionDuration =
      sessions && sessions.length > 0
        ? sessions.filter((s) => s.duration).reduce((sum, s) => sum + (s.duration || 0), 0) /
          sessions.filter((s) => s.duration).length
        : 0

    // Emails sent
    const { count: emailsSent } = await supabaseAdmin
      .from("email_transcripts")
      .select("*", { count: "exact", head: true })
      .gte("sent_at", startDateISO)
      .eq("success", true)

    // Top FAQ categories
    const { data: faqData } = await supabaseAdmin
      .from("faq_interactions")
      .select("category")
      .gte("timestamp", startDateISO)

    const categoryCount: Record<string, number> = {}
    faqData?.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
    })

    const topFAQCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Daily stats
    const dailyStats = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      const nextDateStr = nextDate.toISOString().split("T")[0]

      const { count: daySessions } = await supabaseAdmin
        .from("chat_sessions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", dateStr)
        .lt("created_at", nextDateStr)

      const { count: dayMessages } = await supabaseAdmin
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .gte("timestamp", dateStr)
        .lt("timestamp", nextDateStr)

      const { count: dayEmails } = await supabaseAdmin
        .from("email_transcripts")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", dateStr)
        .lt("sent_at", nextDateStr)
        .eq("success", true)

      dailyStats.push({
        date: dateStr,
        sessions: daySessions || 0,
        messages: dayMessages || 0,
        emails: dayEmails || 0,
      })
    }

    // Response time stats
    const { data: responseTimeData } = await supabaseAdmin
      .from("chat_messages")
      .select("response_time")
      .gte("timestamp", startDateISO)
      .eq("sender", "bot")
      .not("response_time", "is", null)

    let responseTimeStats = { avg: 0, min: 0, max: 0 }
    if (responseTimeData && responseTimeData.length > 0) {
      const times = responseTimeData.map((d) => d.response_time).filter((t) => t !== null)
      if (times.length > 0) {
        responseTimeStats = {
          avg: times.reduce((sum, t) => sum + t, 0) / times.length,
          min: Math.min(...times),
          max: Math.max(...times),
        }
      }
    }

    // User engagement
    const { count: shortSessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateISO)
      .lte("duration", 120)
      .not("duration", "is", null)

    const { count: mediumSessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateISO)
      .gte("duration", 121)
      .lte("duration", 600)

    const { count: longSessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDateISO)
      .gte("duration", 601)

    return {
      totalSessions: totalSessions || 0,
      totalMessages: totalMessages || 0,
      avgMessagesPerSession,
      avgSessionDuration,
      emailsSent: emailsSent || 0,
      topFAQCategories,
      dailyStats,
      responseTimeStats,
      userEngagement: {
        shortSessions: shortSessions || 0,
        mediumSessions: mediumSessions || 0,
        longSessions: longSessions || 0,
      },
    }
  } catch (error) {
    console.error("Error getting chat metrics:", error)
    throw error
  }
}
