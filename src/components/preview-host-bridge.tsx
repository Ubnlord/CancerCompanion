/** Mount once in the root so preview chrome can drive navigation. */
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { collectRoutePathsFromTree, installPreviewHostBridge } from "@/lib/preview-host-bridge";
export function PreviewHostBridge(){
 const router=useRouter();
 useEffect(()=>installPreviewHostBridge({navigate:(path)=>router.history.push(path),getRoutePaths:()=>collectRoutePathsFromTree(router.routeTree)}),[router]);
 return null;
}
