# 🤖 INGELEAN Assistant – Chatbot Inteligente

**INGELEAN Assistant** es un chatbot web desarrollado para brindar atención automatizada a clientes de INGELEAN S.A.S., especializado en soluciones tecnológicas. Usa inteligencia artificial con Google Gemini para responder consultas en lenguaje natural, registra métricas en Supabase y permite enviar la conversación por correo electrónico.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología            | Descripción                                      |
|-----------------------|--------------------------------------------------|
| **Next.js 15**        | Framework web fullstack                          |
| **Tailwind CSS**      | Estilos modernos y responsivos                   |
| **Shadcn/ui**         | Componentes de UI accesibles y personalizables   |
| **Supabase**          | Backend y base de datos en tiempo real           |
| **Google Gemini API** | Procesamiento de lenguaje natural (NLP)          |
| **Brevo (Sendinblue)**| Envío de correos con transcripción del chat      |
| **Recharts**          | Visualización de métricas en el dashboard        |

---

## 📁 Estructura del Proyecto

/chatbot-inglean
├── app/
│ ├── api/
│ │ ├── chat/route.ts # Lógica del chatbot
│ │ └── send-transcript/route.ts # Envío de transcripción por correo
│ ├── dashboard/ # Página del dashboard analítico
│ └── page.tsx # Página principal del chatbot
├── components/
│ ├── dashboard/ # Gráficas e indicadores
│ ├── email-dialog.tsx # Modal para enviar correo
│ ├── faq-panel.tsx # Panel de preguntas frecuentes
│ └── ui/ # Componentes de interfaz
├── lib/
│ ├── analytics.ts # Funciones de métricas
│ ├── supabase.ts # Configuración de Supabase
├── scripts/
│ └── create-tables.sql # Script de creación de tablas
├── .env.local # Variables de entorno (no versionar)
└── README.md # Documentación del proyecto

yaml
Copiar
Editar

---

## 🔐 Variables de Entorno

Asegúrate de crear un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role
BREVO_API_KEY=tu_api_key_de_brevo
✨ Funcionalidades
✅ Chatbot inteligente
Procesamiento de lenguaje natural con Gemini.

Identificación de preguntas frecuentes.

Conversaciones únicas por sesión.

📋 Panel de Preguntas Frecuentes
14 preguntas predefinidas con categorías y filtros.

Acceso rápido a preguntas comunes.

Registro de interacciones con métricas.

📬 Transcripción por Email
Modal para ingresar nombre y correo.

Envío de toda la conversación al email del usuario.

Registro de éxito o error de envío.

📊 Dashboard Analítico
Sesiones totales, mensajes, duración promedio.

Gráficos diarios de actividad, duración de sesiones y uso de FAQs.

Calcula tasas de respuesta y tasa de envíos por correo.

🗃️ Base de Datos en Supabase
Tablas creadas (scripts/create-tables.sql):

chat_sessions

chat_messages

faq_interactions

email_transcripts

Políticas RLS habilitadas para seguridad, con acceso total al service_role.

🚀 Despliegue
El proyecto está desplegado en Vercel, integrado con GitHub y con variables de entorno configuradas en el panel de control.

Para desplegar:

bash
Copiar
Editar
npm run build
Para desarrollo local:

bash
Copiar
Editar
npm install
npm run dev
🧪 Demostración Visual
Chat en tiempo real con scroll automático

Modal de envío por correo

Dashboard visual con gráficos e indicadores

📈 Mejoras Futuras
Soporte multilenguaje

Entrenamiento con embeddings propios

Panel de administración para editar preguntas frecuentes

Modo oscuro

Conexión a WhatsApp o Telegram

📄 Licencia
Desarrollado por INGELEAN S.A.S. – Todos los derechos reservados © 2024.