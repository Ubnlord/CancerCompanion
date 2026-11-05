import type { ReactNode } from "react";
/** Stable app-wide provider mount; Better Auth's client hook works standalone. */
export function AuthProvider({children}:{children:ReactNode}){return <>{children}</>;}
