/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly META_CAPI_ACCESS_TOKEN?: string;
  readonly META_CAPI_TEST_EVENT_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
