/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TELEGRAM_BOT_TOKEN: string;
  readonly PUBLIC_TELEGRAM_CHAT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
