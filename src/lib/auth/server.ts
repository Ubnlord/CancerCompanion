import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { getCookie } from "@tanstack/react-start/server";
import { ensureDbReady,getPglite } from "../db";
import { pgliteDialect } from "./pglite-dialect";
import { emailAndPasswordEnabled } from "./email-password";
import { GROK_PROVIDERS } from "./providers";
import { GROK_ISSUER_DEFAULT,PREVIEW_CLIENT_ID,PREVIEW_CLIENT_SECRET,PREVIEW_ALLOWED_HOSTS } from "./preview";

void ensureDbReady();
const env=(k:string)=>process.env[k]?.trim()||undefined;
const disabled=env("VITE_AUTH_ENABLED")==="false";
const clientId=env("GROK_AUTH_CLIENT_ID")??PREVIEW_CLIENT_ID;
const clientSecret=env("GROK_AUTH_CLIENT_SECRET")??PREVIEW_CLIENT_SECRET;
export const authConfigured=!disabled&&Boolean(clientId&&clientSecret);
const issuer=(env("GROK_AUTH_ISSUER")??GROK_ISSUER_DEFAULT).replace(/\/+$/,"");
const database=env("DATABASE_URL")?new Pool({connectionString:env("DATABASE_URL")}):{dialect:pgliteDialect(()=>getPglite()),type:"postgres" as const};
const globalRef=globalThis as typeof globalThis&{__ccAuthSecret?:string};
globalRef.__ccAuthSecret??=randomBytes(32).toString("hex");
const oauth=authConfigured?genericOAuth({config:GROK_PROVIDERS.map(({providerId,idp})=>({providerId,clientId:clientId!,clientSecret:clientSecret!,authorizationUrl:issuer+"/api/auth/oauth2/authorize",tokenUrl:issuer+"/api/auth/oauth2/token",userInfoUrl:issuer+"/api/auth/oauth2/userinfo",scopes:["openid","profile","email"],authorizationUrlParams:{idp,prompt:"login"}}))}):null;
const baseURL=env("BETTER_AUTH_URL")??"http://localhost:8080";
export const SESSION_TOKEN_COOKIE="__Host-grok-auth.session_token";
export const auth=betterAuth({
 baseURL,secret:env("BETTER_AUTH_SECRET")??globalRef.__ccAuthSecret,database,
 trustedOrigins:[baseURL,"http://localhost:8080","http://127.0.0.1:8080"],
 ...(emailAndPasswordEnabled?{emailAndPassword:{enabled:true}}:{}),
 advanced:{useSecureCookies:false,defaultCookieAttributes:{secure:true,sameSite:"lax",path:"/"},cookies:{session_token:{name:SESSION_TOKEN_COOKIE}}},
 plugins:[...(oauth?[oauth]:[]),bearer(),tanstackStartCookies()],
});
export function readSessionToken():string|null{return getCookie(SESSION_TOKEN_COOKIE)??null;}
export {GROK_PROVIDERS};
