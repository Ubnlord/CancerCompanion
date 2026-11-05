import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppShell } from "@/components/app-shell";
export const Route=createFileRoute("/_app")({component:AppLayout});
function AppLayout(){
 const {user,isPending}=useCurrentUserState();
 if(isPending)return <div className="app-stage"><div className="app-device p-6"><div className="skeleton h-12 rounded-[18px]"/><div className="skeleton mt-4 h-40 rounded-[28px]"/><div className="skeleton mt-3 h-28 rounded-[28px]"/></div></div>;
 if(!user)return <RedirectToSignIn/>;
 return <AppShell><Outlet/></AppShell>;
}
