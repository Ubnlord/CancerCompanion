/**
 * Authentication providers for CancerCompanion deployments.
 *
 * Sandbox-specific OAuth client credentials must never be included in this
 * repository. Configure the app's own OAuth client through private environment
 * variables on the deployment platform.
 */
export const PREVIEW_CLIENT_ID = "";
export const PREVIEW_CLIENT_SECRET = "";
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";
export const PREVIEW_ALLOWED_HOSTS = [] as const;
