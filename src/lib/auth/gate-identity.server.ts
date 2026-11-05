import { importJWK,jwtVerify,type JWK,type JWTVerifyGetKey } from "jose";
import { env,isWorkspacePreview } from "../env.server";
export const GATE_IDENTITY_HEADER="x-grok-identity";
export const GATE_JWKS_PATH="/__gate/identity-key";
const PREVIEW_AUDIENCE="preview";
export const PREVIEW_GATE_ORIGIN="http://127.0.0.1:6014";
export type GateIdentity={sub:string;email:string|null;name:string|null;teamId:string|null};
export type GateJwks={keys:JWK[]};
export function gateIdentityEnabled(){return env("VITE_AUTH_ENABLED")!=="false";}
export function gateTokenAudience(){return isWorkspacePreview()?PREVIEW_AUDIENCE:"app:"+env("GROK_PROJECT_ID");}
export function gateKeyResolver(url:string,fetcher=async(u:string):Promise<GateJwks|null>=>{try{const r=await fetch(u,{headers:{accept:"application/json"},redirect:"manual"});if(!r.ok)return null;const j=await r.json() as GateJwks;return Array.isArray(j.keys)?j:null;}catch{return null;}}):JWTVerifyGetKey {
 let cache:{keys:JWK[];at:number}|null=null;
 return async header=>{if(!cache||Date.now()-cache.at>300000){const jwks=await fetcher(url);if(jwks)cache={keys:jwks.keys,at:Date.now()};}
 const kid=typeof header.kid==="string"?header.kid:undefined;const key=cache?.keys.find(k=>k.kty==="OKP"&&k.crv==="Ed25519"&&(!kid||k.kid===kid));if(!key)throw new Error("No matching gate key");return importJWK(key,"EdDSA");};
}
export async function verifyGateIdentityToken(token:string,options:{issuer:string;audience:string;getKey:JWTVerifyGetKey}):Promise<GateIdentity|null>{try{const {payload}=await jwtVerify(token,options.getKey,{algorithms:["EdDSA"],issuer:options.issuer,audience:options.audience,requiredClaims:["sub","iat","exp"],maxTokenAge:"10 minutes"});const sub=typeof payload.sub==="string"?payload.sub.trim():"";return sub?{sub,email:typeof payload.email==="string"?payload.email:null,name:typeof payload.name==="string"?payload.name:null,teamId:typeof payload.team_id==="string"?payload.team_id:null}:null;}catch{return null;}}
export async function gateIdentityFromHeaders(headers:Headers):Promise<GateIdentity|null>{if(!gateIdentityEnabled())return null;const token=headers.get(GATE_IDENTITY_HEADER)?.trim();if(!token)return null;const host=headers.get("x-forwarded-host")??headers.get("host")??"";const issuer=env("GROK_GATE_ORIGIN")??(isWorkspacePreview()?PREVIEW_GATE_ORIGIN:host.includes("grok.me")?"https://gate.grok.me":"");if(!issuer)return null;return verifyGateIdentityToken(token,{issuer,audience:gateTokenAudience(),getKey:gateKeyResolver(issuer.replace(/\/+$/,"")+GATE_JWKS_PATH)});}
