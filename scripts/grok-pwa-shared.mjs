import { existsSync,readFileSync } from "node:fs";
import { join } from "node:path";
export function acceptsHtml(v){return !v||String(v).includes("text/html")||String(v).includes("*/*");}
export function isInstallQuery(url){const p=new URL(String(url??"/"),"http://localhost").searchParams;return ["1","true"].includes(p.get("install"))&&p.get("platform")==="ios";}
export function isDocumentPath(p){return !String(p).startsWith(("/api/","/__grok/","/@"))&&!/\.[a-z0-9]+$/i.test(String(p));}
export function renderInstallPageHtml(t,{host,url}={}){return String(t).replaceAll("{{APP_NAME}}",escapeHtml(String(host||"CancerCompanion"))).replaceAll("{{APP_URL}}",escapeHtml(String(url||"/").replace(/[?&](install|platform)=[^&]*/g,"")));}
export function renderWebManifest(host){return JSON.stringify({name:"CancerCompanion",short_name:"CancerCompanion",start_url:"/",display:"standalone",theme_color:"#0B6B63",background_color:"#ffffff",icons:[{src:"/favicon.svg",sizes:"any",type:"image/svg+xml"}]});}
export function snapshotOgIdentity(root){return {site:{title:"CancerCompanion"}};}
export function injectGrokPwaHead(html){return String(html).replace("</head>",'<meta name="theme-color" content="#0B6B63"><link rel="manifest" href="/__grok/manifest.webmanifest"></head>');}
export function createHeadInjector(){let buf="";return {push(chunk){buf+=Buffer.from(chunk).toString("utf8");const i=buf.toLowerCase().indexOf("</head>");if(i<0)return [];const out=buf.slice(0,i)+'<meta name="theme-color" content="#0B6B63"><link rel="manifest" href="/__grok/manifest.webmanifest">'+buf.slice(i);buf="";return [Buffer.from(out)];},flush(){if(!buf)return [];const b=Buffer.from(buf);buf="";return [b];}};}
export function escapeHtml(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
