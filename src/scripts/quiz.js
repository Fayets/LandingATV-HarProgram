import {
  WEBHOOK_URL, REDIRECT_URL, STORAGE_KEY, OPTIONS, QUESTIONS, MAX_SCORE,
  levelFor, labelFor, isQualified, onResult, QUALIFY,
  META_LEAD_EVENT, META_CAPI_ENDPOINT, META_CUSTOM_EVENT,
} from "../config/quiz.js";

const lead = {
  nombre: "", email: "", telefono: "", instagram: "",
  ocupacion: "", calificacion: "",
  puntaje: 0, nivel: "", respuestas: [],
};

new URLSearchParams(location.search).forEach((v, k) => {
  if (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].includes(k))
    lead[k] = v;
});
lead.referrer = document.referrer || "";
lead.pagina   = location.href;

const answers = new Array(QUESTIONS.length).fill(null);
let qIndex = 0;
const TOTAL_SCREENS = 2 + QUESTIONS.length; // datos + calificación + preguntas

const steps  = document.querySelectorAll(".step");
const bar    = document.getElementById("bar");
const qCount = document.getElementById("q-count");
const qText  = document.getElementById("q-text");
const qSub   = document.getElementById("q-sub");
const qOpts  = document.getElementById("q-opts");

const setBar = (current) => { bar.style.width = Math.min(100, (current / TOTAL_SCREENS) * 100) + "%"; };

function showStep(n) {
  steps.forEach((s) => s.classList.toggle("active", s.dataset.step == n));
  document.getElementById("optin-form").scrollIntoView({ behavior: "smooth", block: "center" });
}

const computeScore = () => answers.reduce((s, v) => s + (v || 0), 0);

function saveProgress() {
  const score = computeScore();
  const nivel = levelFor(score);
  lead.puntaje    = score;
  lead.nivel      = nivel;
  lead.respuestas = answers.slice();
  const data = {
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono,
    instagram: lead.instagram,
    ocupacion: lead.ocupacion,
    calificacion: lead.calificacion,
    respuestas: answers,
    puntaje: score,
    nivel,
    actualizado: new Date().toISOString(),
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

/* ---- Selector de código de país (dropdown propio) ---- */
const phoneTrigger = document.getElementById("phone-code-trigger");
const phoneList    = document.getElementById("phone-code-list");
const phoneFlag    = document.getElementById("phone-code-flag");
const phoneValue   = document.getElementById("phone-code-value");
const phoneCodInput = document.getElementById("telefono-cod");

// Se saca del .card (que tiene overflow:hidden) para que el dropdown
// no quede recortado, y se posiciona con position:fixed en JS.
document.body.appendChild(phoneList);

function positionPhoneList() {
  const r = phoneTrigger.getBoundingClientRect();
  const pad = 8;
  const maxW = Math.min(260, window.innerWidth - pad * 2);
  phoneList.style.width = `${maxW}px`;
  phoneList.style.top = `${r.bottom + 8}px`;
  phoneList.style.left = `${Math.max(pad, Math.min(r.left, window.innerWidth - maxW - pad))}px`;
}

phoneTrigger.addEventListener("click", () => {
  const willOpen = phoneList.hidden;
  if (willOpen) positionPhoneList();
  phoneList.hidden = !willOpen;
  phoneTrigger.setAttribute("aria-expanded", String(willOpen));
});

window.addEventListener("scroll", (e) => {
  if (phoneList.contains(e.target)) return; // scroll dentro de la lista: no cerrar
  phoneList.hidden = true;
  phoneTrigger.setAttribute("aria-expanded", "false");
}, true);
window.addEventListener("resize", () => { if (!phoneList.hidden) positionPhoneList(); });

phoneList.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", () => {
    phoneList.querySelectorAll("li").forEach((o) => { o.classList.remove("selected"); o.setAttribute("aria-selected", "false"); });
    li.classList.add("selected");
    li.setAttribute("aria-selected", "true");
    phoneFlag.textContent  = li.dataset.flag;
    phoneValue.textContent = li.dataset.code;
    phoneCodInput.value    = li.dataset.code;
    phoneList.hidden = true;
    phoneTrigger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (!phoneTrigger.contains(e.target) && !phoneList.contains(e.target)) {
    phoneList.hidden = true;
    phoneTrigger.setAttribute("aria-expanded", "false");
  }
});

/* ---- Paso 0 · Datos ---- */
function setErr(id, msg) {
  const el    = document.getElementById(id);
  const hint  = document.querySelector(`.hint[data-for="${id}"]`);
  const group = el.closest(".phone-group");
  el.classList.toggle("err", !!msg);
  if (group) group.classList.toggle("err", !!msg);
  if (hint) hint.textContent = msg || "";
  return !msg;
}

document.getElementById("datos-continue").addEventListener("click", () => {
  const nombre      = document.getElementById("nombre").value.trim();
  const email       = document.getElementById("email").value.trim();
  const telCod      = document.getElementById("telefono-cod").value;
  const telNum      = document.getElementById("telefono").value.trim();
  const instagram   = document.getElementById("instagram").value.trim();

  let ok = true;
  ok = setErr("nombre",    nombre.length < 2 ? "Escribí tu nombre" : "") && ok;
  ok = setErr("email",     /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Revisá tu email") && ok;
  ok = setErr("telefono",  telNum.replace(/\D/g, "").length < 6 ? "Revisá tu número" : "") && ok;
  ok = setErr("instagram", instagram.length < 2 ? "Escribí tu usuario de Instagram" : "") && ok;
  if (!ok) return;

  const telefono = `${telCod} ${telNum}`;
  Object.assign(lead, { nombre, email, telefono, instagram });
  saveProgress();
  setBar(1);
  showStep(1);
});

/* ---- Paso 1 · Calificación ---- */
const qualifyOpts    = document.getElementById("qualify-opts");
const qualifySubOpts = document.getElementById("qualify-sub-opts");
const qualifyOther   = document.getElementById("qualify-other");
const qualifyText    = document.getElementById("qualify-text");
const ocupacionInput = document.getElementById("ocupacion");

qualifyOpts.querySelectorAll(".opt").forEach((b) => {
  b.addEventListener("click", () => {
    const val = b.dataset.value;
    lead.ocupacion = val;

    if (val === QUALIFY.otherLabel) {
      qualifyOpts.style.display = "none";
      qualifyOther.style.display = "block";
      ocupacionInput.focus();
      return;
    }

    const sub = QUALIFY.subQuestions[val];
    if (sub) {
      qualifyOpts.style.display = "none";
      qualifyText.textContent = sub.question;
      qualifySubOpts.innerHTML = "";
      qualifySubOpts.style.display = "grid";
      sub.options.forEach((opt) => {
        const sb = document.createElement("button");
        sb.className = "opt";
        sb.type = "button";
        sb.innerHTML = `<span class="opt-row"><span>${opt}</span><span class="arrow">→</span></span>`;
        sb.addEventListener("click", () => {
          lead.calificacion = opt;
          saveProgress();
          setBar(2);
          showStep(2);
          renderQuestion();
        });
        qualifySubOpts.appendChild(sb);
      });
    } else {
      saveProgress();
      setBar(2);
      showStep(2);
      renderQuestion();
    }
  });
});

document.getElementById("qualify-continue").addEventListener("click", () => {
  const val = ocupacionInput.value.trim();
  if (val.length < 2) { ocupacionInput.classList.add("err"); return; }
  lead.ocupacion = val;
  lead.calificacion = "";
  saveProgress();
  setBar(2);
  showStep(2);
  renderQuestion();
});

/* ---- Paso 2 · Quiz ---- */
function renderQuestion() {
  const q    = QUESTIONS[qIndex];
  const opts = q.options || OPTIONS;

  qCount.textContent = `Pregunta ${qIndex + 1} de ${QUESTIONS.length}`;
  qText.textContent  = q.text;
  qSub.style.display = q.options ? "none" : "block";

  qOpts.innerHTML = "";
  opts.forEach((o) => {
    const b = document.createElement("button");
    b.className = "opt" + (answers[qIndex] === o.points ? " selected" : "");
    b.type = "button";
    b.innerHTML = `<span class="opt-row"><span>${o.label}</span><span class="arrow">→</span></span>`;
    b.addEventListener("click", () => selectAnswer(o.points));
    qOpts.appendChild(b);
  });

  setBar(2 + qIndex + 1);
}

async function selectAnswer(points) {
  answers[qIndex] = points;
  saveProgress();

  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    renderQuestion();
  } else {
    await finishQuiz();
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function metaLeadKey(person) {
  const raw = person.email || person.telefono || (crypto.randomUUID?.() ?? String(Date.now()));
  return String(raw).replace(/[^a-zA-Z0-9]/g, "").slice(0, 32) || String(Date.now());
}

async function sendCapi(payload) {
  try {
    const res = await fetch(META_CAPI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    console.log(`[CAPI client] ${payload.event_name} ${res.status}`, {
      events_received: json.events_received,
      fbtrace_id: json.fbtrace_id,
      error: json.error,
    });
    return json;
  } catch (err) {
    console.error(`[CAPI client] Error ${payload.event_name}:`, err);
    return null;
  }
}

/* ---- Fin del quiz: se envía TODO junto (datos + calificación + puntaje) ---- */
async function finishQuiz() {
  const score      = computeScore();
  const nivel      = levelFor(score);
  const calificado = isQualified(lead.ocupacion, lead.calificacion);

  Object.assign(lead, {
    fecha: new Date().toISOString(),
    nivel_label: labelFor(nivel),
    calificado,
    respuestas_detalle: QUESTIONS.map((q, i) => {
      const opts  = q.options || OPTIONS;
      const label = opts.find((o) => o.points === answers[i])?.label ?? "";
      return `${i + 1}. ${q.text} → ${label}`;
    }).join("\n"),
  });

  // Un solo campo con todo el perfil del lead, para no tener que crear
  // y mapear un Custom Field distinto en GHL por cada dato.
  lead.perfil_lead = [
    `Instagram: ${lead.instagram || "-"}`,
    `Ocupación: ${lead.ocupacion || "-"}`,
    lead.calificacion ? `Detalle: ${lead.calificacion}` : null,
    `Puntaje: ${score}/${MAX_SCORE}`,
    `Nivel de sobrecarga: ${labelFor(nivel)}`,
    `Calificado (Meta): ${calificado ? "Sí" : "No"}`,
  ].filter(Boolean).join("\n");
  saveProgress();

  try {
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } else {
      console.log("Lead capturado (sin webhook):", lead);
    }
  } catch (err) {
    console.error("Error al enviar:", err);
  }

  // Meta Pixel + CAPI: mismos eventos, mismo momento, event_id distinto por evento.
  // Condición: lead calificado (ocupación económica). No está invertida:
  // si calificado === false, no se dispara ni Lead ni registroCompletado.
  if (calificado) {
    const ts = Date.now();
    const leadKey = metaLeadKey(lead);
    const leadEventId = `lead_${leadKey}_${ts}`;
    const registroEventId = `registroCompletado_${leadKey}_${ts}`;
    // Ojo: nunca mandar `nivel` (o cualquier dato que sugiera estado de
    // salud/estrés) como parámetro del evento — Meta lo bloquea porque
    // metodohar.com está categorizado como "Salud y bienestar".
    const customData = { content_name: "Lead Generico" };

    if (typeof window.fbq === "function") {
      window.fbq("track", META_LEAD_EVENT, customData, { eventID: leadEventId });
      window.fbq("trackCustom", META_CUSTOM_EVENT, customData, { eventID: registroEventId });
    }

    const capiBase = {
      event_source_url: location.href,
      email: lead.email,
      telefono: lead.telefono,
      nombre: lead.nombre,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc") || (lead.fbclid ? `fb.1.${ts}.${lead.fbclid}` : undefined),
      custom_data: customData,
    };

    await Promise.all([
      sendCapi({ ...capiBase, event_name: META_LEAD_EVENT, event_id: leadEventId }),
      sendCapi({ ...capiBase, event_name: META_CUSTOM_EVENT, event_id: registroEventId }),
    ]);
  }

  if (REDIRECT_URL) { location.href = REDIRECT_URL; return; }

  const redirected = onResult({ score, nivel, lead });
  if (!redirected) showResult(score, nivel);
}

function showResult() {
  const wa = document.getElementById("whatsapp-btn");
  const anim = document.getElementById("process-anim");
  const label = document.getElementById("process-label");
  const msg = `Hola titi, quiero mi resultado personalizado. Mi nombre es: ${lead.nombre}`;
  wa.href = `https://wa.me/5492615870933?text=${encodeURIComponent(msg)}`;
  showStep(3);
  setBar(TOTAL_SCREENS);

  setTimeout(() => {
    anim.classList.add("is-done");
    label.classList.add("is-done");
    label.textContent = "¡Listo!";
    wa.classList.remove("is-disabled");
    wa.removeAttribute("aria-disabled");
  }, 5000);
}

/* ---- init ---- */
