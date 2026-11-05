import { useEffect, useState, type ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { createServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME="CancerCompanion";
const fetchSessionUser=createServerFn({method:"GET"}).handler(async()=>{
 const {getSessionUser}=await import("@/lib/auth/verify.server");
 const u=await getSessionUser();
 return u?{id:u.id,email:u.email}:null;
});
function Providers({children}:{children:ReactNode}){
 const [client]=useState(()=>new QueryClient());
 useEffect(()=>{
  const stored=window.localStorage.getItem("cc-theme")??"system";
  const dark=stored==="dark"||(stored==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark",dark);
 },[]);
 return <QueryClientProvider client={client}>{children}<Toaster position="top-center" toastOptions={{className:"font-[Figtree] rounded-2xl"}}/></QueryClientProvider>;
}
export const Route=createRootRoute({
 beforeLoad:async()=>({sessionUser:await fetchSessionUser()}),
 head:()=>({meta:[{charSet:"utf-8"},{name:"viewport",content:"width=device-width, initial-scale=1, viewport-fit=cover"},{title:APP_NAME},{name:"description",content:"Support for every step of the cancer journey."},{name:"theme-color",content:"#0B6B63"}],links:[{rel:"icon",type:"image/svg+xml",href:"/favicon.svg"},{rel:"stylesheet",href:appCss},{rel:"manifest",href:"/__grok/manifest.webmanifest"},{rel:"apple-touch-icon",href:"/__grok/icon-180.png"}]}),
 component:()=><html lang="en" className="antialiased" suppressHydrationWarning><head><HeadContent/></head><body><PreviewHostBridge/><AuthProvider><Providers><Outlet/></Providers></AuthProvider><Scripts/></body></html>,
});
