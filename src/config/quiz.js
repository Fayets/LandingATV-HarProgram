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

/* 6 preguntas del test. Opciones en orden A/B/C = 0/1/2 puntos. */
export const QUESTIONS = [
  {
    text: "¿Te despertás pensando en cosas del trabajo o en cosas que tenés que resolver?",
    options: [
      { label: "No, arranco el día tranquilo y a mi ritmo", points: 0 },
      { label: "Varios días sí, me levanto y ya siento el peso de todo lo que tengo encima", points: 1 },
      { label: "Todos los días. Antes de poner un pie en el piso ya estoy corriendo atrás de los pendientes", points: 2 },
    ],
  },
  {
    text: "Ante cosas mínimas que te molestan en el día, ¿cómo reaccionás?",
    options: [
      { label: "Lo dejo pasar rápido, no me engancho", points: 0 },
      { label: "Me quedo rumiándolo y me cambia el humor por un buen rato", points: 1 },
      { label: "Exploto por cualquier cosa y después me carcome la culpa por cómo reaccioné", points: 2 },
    ],
  },
  {
    text: "Cuando estás en un momento que debería ser para disfrutar, ¿dónde está tu cabeza?",
    options: [
      { label: "Ahí, disfrutando de verdad lo que estoy viviendo", points: 0 },
      { label: "Los pendientes me invaden y me cuesta volver al momento", points: 1 },
      { label: "Estoy con el cuerpo, pero no con la cabeza. Y me doy cuenta cuando ya pasó", points: 2 },
    ],
  },
  {
    text: "¿Sentís que dejaste de ser quien eras antes del trabajo o de tener tu empresa?",
    options: [
      { label: "No, sigo siendo yo y mantengo lo que me gusta", points: 0 },
      { label: "Fui dejando cosas que me hacían bien, casi sin darme cuenta", points: 1 },
      { label: "Sí. Me miro y no me reconozco, el trabajo se llevó a la persona que era", points: 2 },
    ],
  },
  {
    text: "Si seguís al ritmo actual, ¿qué es lo que más te preocupa que pase?",
    options: [
      { label: "Nada en particular, siento que puedo sostenerlo", points: 0 },
      { label: "Que un día no dé más y todo se me venga encima", points: 1 },
      { label: "Que cuando quiera frenar ya sea tarde y haya perdido cosas que no se recuperan", points: 2 },
    ],
  },
  {
    text: "¿Qué tan importante es para vos resolver esta situación que estás viviendo hoy?",
    options: [
      { label: "Quiero empezar a resolverlo antes de que empeore", points: 0 },
      { label: "Sé que no puedo seguir así mucho tiempo más", points: 1 },
      { label: "Ya esperé demasiado. Necesito cambiarlo ahora, no doy más así", points: 2 },
    ],
  },
];

/* 6 × 2 = 12 */
export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...(q.options || OPTIONS).map((o) => o.points)),
  0
);

/* Curva pedida por el cliente: "alto" es el resultado por defecto. "bajo"
   solo con todo en A (score 0); "moderado" hasta un cuarto del máximo. */
export function levelFor(score) {
  if (score <= 0) return "bajo";
  if (score <= 3) return "moderado";
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