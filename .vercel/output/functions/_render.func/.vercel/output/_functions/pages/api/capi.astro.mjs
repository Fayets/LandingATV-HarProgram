import '../../chunks/quiz_BA9gkinc.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request, clientAddress }) {
  {
    console.error("[CAPI] Falta META_CAPI_ACCESS_TOKEN en el entorno del servidor");
    return new Response(JSON.stringify({ error: "missing_capi_token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
