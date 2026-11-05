import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs:ClassValue[]){return twMerge(clsx(inputs));}
export function nid():string{return crypto.randomUUID();}
export function iso(value:unknown):string{if(value instanceof Date)return value.toISOString();if(typeof value==="string")return value;if(value==null)return "";return String(value);}
export function asNumber(value:unknown,fallback=0):number{if(typeof value==="number"&&Number.isFinite(value))return value;if(typeof value==="string"&&value.trim()){const n=Number(value);if(Number.isFinite(n))return n;}return fallback;}
export function asBool(value:unknown):boolean{return value===true||value==="t"||value==="true"||value===1;}
export function greetingForHour(hour:number):string{if(hour<12)return "Good morning";if(hour<17)return "Good afternoon";return "Good evening";}
export const CURRENCIES=["NGN","USD","GBP","EUR"] as const;
export type Currency=(typeof CURRENCIES)[number];
export const CURRENCY_SYMBOL:Record<Currency,string>={NGN:"₦",USD:"$",GBP:"£",EUR:"€"};
export function formatMoney(amount:number,currency:string):string{const code=(CURRENCIES as readonly string[]).includes(currency)?currency as Currency:"USD";try{return new Intl.NumberFormat("en",{style:"currency",currency:code,maximumFractionDigits:2}).format(amount);}catch{return `${CURRENCY_SYMBOL[code]}${amount.toFixed(2)}`;}}
export function formatDate(value:string):string{const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return new Intl.DateTimeFormat("en",{weekday:"short",month:"short",day:"numeric"}).format(d);}
export function formatDateTime(value:string):string{const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return new Intl.DateTimeFormat("en",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(d);}
export function formatTime(value:string):string{const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return new Intl.DateTimeFormat("en",{hour:"numeric",minute:"2-digit"}).format(d);}
export function todayISODate(now=new Date()):string{const y=now.getFullYear();const m=String(now.getMonth()+1).padStart(2,"0");const d=String(now.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
export function emergencyNumberForCountry(country?:string|null):{number:string;label:string}{const c=(country??"").toLowerCase();if(c.includes("united kingdom")||c==="uk"||c==="gb")return {number:"999",label:"Emergency services (999)"};if(c.includes("nigeria")||c==="ng")return {number:"112",label:"Emergency services (112)"};if(c.includes("united states")||c==="us"||c==="usa"||c.includes("canada"))return {number:"911",label:"Emergency services (911)"};return {number:"112",label:"Emergency services (112)"};}