import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CompanionMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/field";
import { MedicalDisclaimer } from "@/components/disclaimer";
export const Route = createFileRoute("/login")({ component: Login });
function Login() {
 const { user, isPending } = useCurrentUserState();
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState<string|null>(null); const [busy,setBusy]=useState(false);
 if(isPending) return <main className="app-stage grid min-h-dvh place-items-center"><div className="skeleton h-24 w-64 rounded-[24px]"/></main>;
 if(user) return <Navigate to="/home"/>;
 async function onSubmit(e:React.FormEvent){e.preventDefault();setError(null);setBusy(true);try{const {error:err}=await authClient.signIn.email({email,password});if(err)throw new Error(err.message??"Could not sign in");window.location.href="/home";}catch(err){setError(err instanceof Error?err.message:"Could not sign in");setBusy(false);}}
 return <main className="app-stage grid min-h-dvh place-items-center px-5 py-10"><div className="w-full max-w-sm"><CompanionMark className="size-10"/><h1 className="mt-5 font-display text-3xl text-ink dark:text-white">Welcome back</h1><p className="mt-1 text-sm text-muted">Sign in to your private companion.</p>{authEnabled?<><form onSubmit={onSubmit} className="mt-6 space-y-3"><div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></div><FieldError>{error}</FieldError><Button type="submit" className="w-full" disabled={busy}>{busy?"Signing in…":"Sign in"}</Button></form><p className="mt-3 text-center text-sm"><Link to="/forgot-password" className="text-teal underline-offset-2 hover:underline">Forgot password</Link></p><div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line dark:bg-white/10"/>or<span className="h-px flex-1 bg-line dark:bg-white/10"/></div><div className="space-y-2">{GROK_PROVIDERS.map(p=><Button key={p.providerId} variant="outline" className="w-full" onClick={()=>void signIn(p.providerId,{callbackURL:"/home"})}>Continue with {p.label}</Button>)}</div><p className="mt-5 text-center text-sm text-muted">New here? <Link to="/signup" className="font-medium text-teal">Create an account</Link></p></>:<p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>}<MedicalDisclaimer className="mt-8"/></div></main>;
}