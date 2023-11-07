/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_PROJECT_URL: string;
  // Add more custom env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
