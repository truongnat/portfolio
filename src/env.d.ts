/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TELEGRAM_BOT_TOKEN: string;
  readonly PUBLIC_TELEGRAM_CHAT_ID: string;
  readonly APP_VERSION: string;
  readonly APP_HASH: string;
  readonly APP_LICENSE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
