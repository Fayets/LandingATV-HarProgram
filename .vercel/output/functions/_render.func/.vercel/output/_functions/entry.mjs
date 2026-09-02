import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_EC-ufCDC.mjs';
import { manifest } from './manifest_BGnBFLx5.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/capi.astro.mjs');
const _page2 = () => import('./pages/thank-you-page.astro.mjs');
const _page3 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/capi.js", _page1],
    ["src/pages/thank-you-page/index.astro", _page2],
    ["src/pages/index.astro", _page3]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2ead3a5b-b9ba-4a91-9b4d-6d508695a396",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
