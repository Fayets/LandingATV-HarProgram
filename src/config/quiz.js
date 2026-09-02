/* ============================================================
   CONFIGURACIÓN DEL TEST
   ============================================================ */

export const WEBHOOK_URL  = "https://services.leadconnectorhq.com/hooks/6AXxx9s97IS27Fdc7uxK/webhook-trigger/0e78fa98-aa0c-4162-9e8b-d5d3b0c4178e";
export const REDIRECT_URL = "";
export const STORAGE_KEY  = "har_test_estres";

export const META_PIXEL_ID   = "1557580399168368"; // Pixel ID de Meta (Events Manager)
export const META_LEAD_EVENT = "Lead"; // Evento estándar que se dispara solo para leads calificados


/* Opciones estándar — Siempre primero, Nunca al final */
export const OPTIONS = [
  { label: "Siempre",  points: 2 },
  { label: "A veces",  points: 1 },
  { label: "Nunca",    points: 0 },
];

/* Opciones propias de la última pregunta (urgencia) */
export const URGENCY_OPTIONS = [
  { label: "Ya esperé demasiado, necesito cambiar esta situación ahora", points: 3 },
  { label: "Quiero empezar a resolverlo antes que empeore",              points: 2 },
  { label: "Sé que no puedo seguir así por mucho tiempo",                points: 1 },
  { label: "Hoy elijo convivir con este nivel de sobrecarga",            points: 0 },
];

/* Tus 10 preguntas + la de urgencia al final (11 en total) */
export const QUESTIONS = [
  { text: "Termino el día sin poder bajar un cambio, aunque ya no esté en el trabajo." },
  { text: "Me cuesta apagar la cabeza con temas del trabajo o del día, incluso cuando ya no hay nada urgente." },
  { text: "Puedo pasar de estar tranquilo a reaccionar de más en cuestión de segundos." },
  { text: "Me cuesta desconectar de verdad: o me quedo enganchado al ritmo del día, o al otro día arranco sin batería." },
  { text: "Siento que cargo con más responsabilidad de la que puedo sostener, y que si aflojo, algo se cae." },
  { text: "Últimamente prefiero aislarme un poco de la gente antes que mostrar que el ritmo me está superando." },
  { text: "Me enojo por cosas mínimas, reacciono mal con las personas que mas quiero (pareja, hijos) y después me siento culpable." },
  { text: "Siento que mi vida personal (pareja, hijos, amigos, tiempo para mí) quedó en un segundo plano frente a mis responsabilidades." },
  { text: "Me preocupa que, si sigo así, esto termine afectando mi rendimiento, mi trabajo o mis vínculos más importantes en poco tiempo." },
  { text: "Aunque por fuera parece que todo va bien, por dentro siento que estoy en piloto automático y no logro nombrar por qué." },
  {
    text: "¿Qué tan importante es para vos resolver esta situación que estás viviendo hoy?",
    options: URGENCY_OPTIONS,
  },
];

/* Se calcula solo: 10×2 + 3 = 23 */
export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...(q.options || OPTIONS).map((o) => o.points)),
  0
);

/* Curva pedida por el cliente: "alto" es el resultado por defecto para
   la gran mayoría de respuestas reales. "moderado" tiene un rango real
   (respuestas mayormente bajas, con algún "A veces" mezclado), y "bajo"
   solo aparece si TODO fue "Nunca" (score = 0) — casi imposible en la
   práctica. */
export function levelFor(score) {
  if (score <= 0) return "bajo";
  if (score <= 6) return "moderado";
  return "alto";
}

const NIVEL_LABELS = { bajo: "Sobrecarga baja", moderado: "Sobrecarga moderada", alto: "Sobrecarga alta" };
export function labelFor(nivel) {
  return NIVEL_LABELS[nivel] ?? nivel;
}

/* Calificado/Descalificado para el Pixel de Meta: se basa en el PERFIL
   ECONÓMICO (ocupación + sub-respuesta), no en el nivel de sobrecarga.
     - Empresario: califica siempre.
     - Emprendedor: califica solo con "vivo de mi emprendimiento" o
       "tengo un equipo de personas que trabajan conmigo".
     - Profesional: califica con cualquier sub-respuesta menos
       "trabajo en relación de dependencia".
     - Otro: nunca califica. */
export function isQualified(ocupacion, calificacion) {
  if (ocupacion === "Empresario") return true;

  if (ocupacion === "Emprendedor") {
    return (
      calificacion === "Vivo de mi emprendimiento" ||
      calificacion === "Tengo un equipo de personas que trabajan conmigo"
    );
  }

  if (ocupacion === "Profesional") {
    return !!calificacion && calificacion !== "Trabajo en relación de dependencia";
  }

  return false; // "Otro"
}

export const LEVEL_COPY = {
  bajo: {
    title: "Tu nivel de sobrecarga está bajo control",
    msg:   "Vas bien. Igual te enviaremos tu resultado por WhatsApp para que sigas rindiendo igual.",
  },
  moderado: {
    title: "Hay puntos de sobrecarga que conviene mirar",
    msg:   "Hay puntos que ya te están pasando factura. Te vamos a enviar tu perfil personalizado por WhatsApp con los pasos a seguir.",
  },
  alto: {
    title: "Tu nivel de sobrecarga es alto",
    msg:   "Es momento de actuar. Te enviaremos tu resultado por WhatsApp con un plan claro para revertirlo.",
  },
};

/* Pregunta de calificación + sub-preguntas condicionales */
export const QUALIFY = {
  question: "¿A qué te dedicás?",
  options: ["Profesional", "Emprendedor", "Empresario", "Otro"],
  otherLabel: "Otro",
  otherPrompt: "¿A qué te dedicás?",

  subQuestions: {
    "Profesional": {
      question: "¿Cuál de estas opciones describe mejor tu situación actual?",
      options: [
        "Trabajo en relación de dependencia",
        "Trabajo de forma independiente",
        "Tengo mi propio estudio o firma",
        "Dirijo un equipo de profesionales",
      ],
    },
    "Emprendedor": {
      question: "¿En qué etapa estás hoy de tu emprendimiento?",
      options: [
        "Estoy dando mis primeros pasos",
        "Ya vendo, pero todavía es inestable",
        "Vivo de mi emprendimiento",
        "Tengo un equipo de personas que trabajan conmigo",
      ],
    },
    "Empresario": {
      question: "¿Cuántas personas trabajan actualmente en tu empresa?",
      options: [
        "Solo yo",
        "Entre 2 y 5 personas",
        "Entre 6 y 20 personas",
        "Más de 20 personas",
      ],
    },
  },
};

export function onResult({ score, nivel, lead }) {
  // if (nivel === "alto") { location.href = "https://tusitio.com/oferta-urgente"; return true; }
  return false;
}