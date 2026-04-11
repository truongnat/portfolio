/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TELEGRAM_BOT_TOKEN: string;
  readonly PUBLIC_TELEGRAM_CHAT_ID: string;
  readonly APP_VERSION: string;
  readonly APP_HASH: string;
  readonly APP_LICENSE: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly CERTIFICATE_SIGNING_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
