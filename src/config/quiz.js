/* ============================================================
   CONFIGURACIÓN DEL TEST
   ============================================================ */

export const WEBHOOK_URL  = "https://services.leadconnectorhq.com/hooks/6AXxx9s97IS27Fdc7uxK/webhook-trigger/0e78fa98-aa0c-4162-9e8b-d5d3b0c4178e";
export const REDIRECT_URL = "";
export const STORAGE_KEY  = "har_test_ritmo";

export const META_PIXEL_ID   = "1849868122524045"; // Pixel ID de Meta (Events Manager)
export const META_LEAD_EVENT = "Lead"; // Evento estándar que se dispara solo para leads calificados
export const META_CAPI_ENDPOINT = "/api/capi";
// Evento estándar de Meta: los eventos custom quedan bloqueados cuando el
// sitio cae en una categoría restringida (core setup).
export const META_REGISTRATION_EVENT = "CompleteRegistration";


/* Opciones estándar — Siempre primero, Nunca al final */
export const OPTIONS = [
  { label: "Siempre",  points: 2 },
  { label: "A veces",  points: 1 },
  { label: "Nunca",    points: 0 },
];

/* Opciones propias de la última pregunta (urgencia) */
export const URGENCY_OPTIONS = [
  { label: "Quiero empezar a resolverlo antes que empeore",              points: 0 },
  { label: "Sé que no puedo seguir así por mucho tiempo",                points: 1 },
  { label: "Ya esperé demasiado, necesito cambiar esta situación ahora", points: 2 },
];

/* 10 preguntas reformuladas (situaciones puntuales del día a día, no
   síntomas tipo diagnóstico) + la de urgencia al final (11 en total).
   Cada pregunta tiene sus propias 3 opciones, ordenadas de mejor a peor
   (0, 1, 2 puntos). */
export const QUESTIONS = [
  {
    text: "Cuando termina tu jornada laboral, ¿qué tan fácil te resulta desconectar?",
    options: [
      { label: "Corto bien, el trabajo se queda en el trabajo", points: 0 },
      { label: "Me cuesta un poco desconectar del trabajo", points: 1 },
      { label: "No logro bajar un cambio en todo el día", points: 2 },
    ],
  },
  {
    text: "En tus días/momentos libres ¿qué hace tu cabeza?",
    options: [
      { label: "Se relaja, disfruto el momento libre", points: 0 },
      { label: "Tarda un poco en soltar, pero afloja", points: 1 },
      { label: "No para, me cuesta disfrutar los momentos libres", points: 2 },
    ],
  },
  {
    text: "Ante un imprevisto en el día, ¿cómo reaccionás?",
    options: [
      { label: "Lo manejo tranquilo, sin sobresaltarme", points: 0 },
      { label: "Me altero un momento y enseguida me calmo", points: 1 },
      { label: "Puedo pasar de tranquilo a explotar en segundos", points: 2 },
    ],
  },
  {
    text: "Después de un fin de semana, ¿cómo arrancás la semana?",
    options: [
      { label: "Con pilas, listo para arrancar", points: 0 },
      { label: "A media máquina, no estoy al 100%", points: 1 },
      { label: "Como si no hubiera parado, sin batería", points: 2 },
    ],
  },
  {
    text: "Frente a la cantidad de responsabilidades que tenés hoy, ¿cómo te sentís sosteniéndolas?",
    options: [
      { label: "Cómodo, tengo margen de sobra", points: 0 },
      { label: "Ajustado, pero controlo la situación", points: 1 },
      { label: "Siento que si aflojo un poco, algo se cae", points: 2 },
    ],
  },
  {
    text: "Cuando la presión del día a día te empieza a superar, ¿qué solés hacer?",
    options: [
      { label: "Lo hablo con alguien y pido una mano", points: 0 },
      { label: "Sigo adelante solo, sin pedir ayuda", points: 1 },
      { label: "Necesito espacio y no quiero que nadie me hable", points: 2 },
    ],
  },
  {
    text: "Ante cosas mínimas que te molestan en el día, ¿cómo reaccionás?",
    options: [
      { label: "Lo dejo pasar rápido, no me quedo enganchado", points: 0 },
      { label: "Me quedo pensándolo un rato, pero se me pasa", points: 1 },
      { label: "Reacciono mal y después me arrepiento", points: 2 },
    ],
  },
  {
    text: "¿Qué lugar está ocupando tu tiempo libre o tus actividades personales últimamente?",
    options: [
      { label: "El de siempre, sostengo mis espacios sin problema", points: 0 },
      { label: "Achiqué algunos espacios, pero mantengo lo esencial", points: 1 },
      { label: "Prácticamente no tengo espacio para nada que no sea trabajo o responsabilidades", points: 2 },
    ],
  },
  {
    text: "Si seguís al ritmo actual, ¿qué es lo que más te preocupa que pase?",
    options: [
      { label: "Nada en particular, siento que puedo sostenerlo", points: 0 },
      { label: "Que en algún momento puntual no llegue con todo", points: 1 },
      { label: "Que termine afectando cosas importantes en poco tiempo", points: 2 },
    ],
  },
  {
    text: "¿Qué tan seguido sentís que estás \"funcionando en piloto automático\"?",
    options: [
      { label: "Casi nunca, estoy bastante presente en lo que hago", points: 0 },
      { label: "Me pasa de vez en cuando", points: 1 },
      { label: "Me pasa seguido y no logro mejorarlo", points: 2 },
    ],
  },
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
   ECONÓMICO (ocupación + sub-respuesta), no en el resultado del test.
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