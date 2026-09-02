export const prerender = false;

import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "../../config/quiz.js";

const GRAPH_VERSION = "v21.0";

function sha256(value) {
  if (!value) return undefined;
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

function splitName(fullName) {
  const parts = normalizeName(fullName).split(/\s+/).filter(Boolean);
  if (!parts.length) return { fn: "", ln: "" };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

function userData({ email, telefono, nombre, clientIp, userAgent, fbp, fbc }) {
  const { fn, ln } = splitName(nombre);
  const data = {
    em: sha256(normalizeEmail(email)),
    ph: sha256(normalizePhone(telefono)),
    fn: sha256(fn),
    ln: ln ? sha256(ln) : undefined,
    client_ip_address: clientIp || undefined,
    client_user_agent: userAgent || undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v));
}

function clientIpFrom(request, clientAddress) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return clientAddress || undefined;
}

export async function POST({ request, clientAddress }) {
  const token = import.meta.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    console.error("[CAPI] Falta META_CAPI_ACCESS_TOKEN en el entorno del servidor");
    return new Response(JSON.stringify({ error: "missing_capi_token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    event_name,
    event_id,
    event_source_url,
    email,
    telefono,
    nombre,
    fbp,
    fbc,
    custom_data,
  } = body || {};

  if (!event_name || !event_id) {
    return new Response(JSON.stringify({ error: "missing_event_fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url: event_source_url || undefined,
        action_source: "website",
        user_data: userData({
          email,
          telefono,
          nombre,
          clientIp: clientIpFrom(request, clientAddress),
          userAgent: request.headers.get("user-agent") || undefined,
          fbp,
          fbc,
        }),
        custom_data: custom_data || undefined,
      },
    ],
  };

  const testCode = import.meta.env.META_CAPI_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    console.log(
      `[CAPI] POST ${event_name} event_id=${event_id} status=${res.status} events_received=${json.events_received ?? "n/a"}`,
      json
    );
    return new Response(JSON.stringify(json), {
      status: res.ok ? 200 : res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`[CAPI] Error enviando ${event_name}:`, err);
    return new Response(JSON.stringify({ error: "capi_request_failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
