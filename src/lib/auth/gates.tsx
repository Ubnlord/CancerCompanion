import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { authEnabled, GROK_PROVIDERS, signIn, signOut } from "./client";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

export const SIGN_IN_PATH = "/login";
export function SignedIn({children}:{children:ReactNode}) {
  const {user}=useCurrentUserState(); return user ? <>{children}</> : null;
}
export function SignedOut({children}:{children:ReactNode}) {
  const {user,isPending}=useCurrentUserState(); return isPending||user ? null : <>{children}</>;
}
export function RedirectToSignIn({to=SIGN_IN_PATH}:{to?:string}) {
  return <Navigate to={to as "/login"} />;
}
export function SignInGate({children,fallback}:{children:ReactNode;fallback?:ReactNode}) {
  const {user,isPending}=useCurrentUserState();
  if(isPending)return null;
  return user ? <>{children}</> : <>{fallback ?? <SignInButtons/>}</>;
}
export function SignInButtons() {
  return <div className="flex w-full max-w-sm flex-col gap-2">{GROK_PROVIDERS.map(p=><button key={p.providerId} type="button" onClick={()=>signIn(p.providerId,{callbackURL:"/"})} className="w-full rounded-xl border px-4 py-3">Continue with {p.label}</button>)}</div>;
}
export function UserButton() {
  const user=useCurrentUser();
  if(!user)return null;
  return <div className="flex items-center gap-2"><span className="text-sm">{user.displayName??user.primaryEmail??"Account"}</span>{authEnabled?<button type="button" className="text-sm underline" onClick={()=>void signOut()}>Sign out</button>:null}</div>;
}
