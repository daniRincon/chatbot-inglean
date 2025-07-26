-- Crear tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  duration INTEGER, -- in seconds
  email_sent BOOLEAN DEFAULT FALSE,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Crear tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  sender TEXT NOT NULL, -- 'user' or 'bot'
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  response_time INTEGER, -- in milliseconds
  was_from_faq BOOLEAN DEFAULT FALSE,
  faq_category TEXT
);

-- Crear tabla de interacciones FAQ
CREATE TABLE IF NOT EXISTS faq_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Crear tabla de transcripciones por email
CREATE TABLE IF NOT EXISTS email_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  email TEXT NOT NULL,
  user_name TEXT,
  message_count INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  success BOOLEAN NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_faq_interactions_session_id ON faq_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_faq_interactions_timestamp ON faq_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_email_transcripts_session_id ON email_transcripts(session_id);
CREATE INDEX IF NOT EXISTS idx_email_transcripts_sent_at ON email_transcripts(sent_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_transcripts ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (permitir todas las operaciones para el service role)
CREATE POLICY "Enable all operations for service role" ON chat_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all operations for service role" ON chat_messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all operations for service role" ON faq_interactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all operations for service role" ON email_transcripts
  FOR ALL USING (auth.role() = 'service_role');
