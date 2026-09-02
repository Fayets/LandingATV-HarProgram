/* ============================================================
   CONFIGURACIÓN DEL TEST
   ============================================================ */


const META_PIXEL_ID   = "1088300166890587"; // Pixel ID de Meta (Events Manager)


/* Opciones estándar — Siempre primero, Nunca al final */
const OPTIONS = [
  { label: "Siempre",  points: 2 },
  { label: "A veces",  points: 1 },
  { label: "Nunca",    points: 0 },
];

/* Opciones propias de la última pregunta (urgencia) */
const URGENCY_OPTIONS = [
  { label: "Ya esperé demasiado, necesito cambiar esta situación ahora", points: 3 },
  { label: "Quiero empezar a resolverlo antes que empeore",              points: 2 },
  { label: "Sé que no puedo seguir así por mucho tiempo",                points: 1 },
  { label: "Hoy elijo convivir con este nivel de sobrecarga",            points: 0 },
];

/* Tus 10 preguntas + la de urgencia al final (11 en total) */
const QUESTIONS = [
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
QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...(q.options || OPTIONS).map((o) => o.points)),
  0
);

/* Pregunta de calificación + sub-preguntas condicionales */
const QUALIFY = {
  question: "¿A qué te dedicás?",
  options: ["Profesional", "Emprendedor", "Empresario", "Otro"],
  otherPrompt: "¿A qué te dedicás?"};

export { META_PIXEL_ID as M, QUALIFY as Q };
