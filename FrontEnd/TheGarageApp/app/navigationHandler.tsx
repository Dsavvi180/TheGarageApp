import {
  useRouter,
  useSegments,
  usePathname,
  useRootNavigationState,
} from "expo-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-expo";

const useNavigationHandler = () => {
  const expoRouter = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const currentPath = usePathname();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const rootLayoutComponentIsMounted = !rootNavigationState?.key;

  const inAuthGroup =
    segments?.[0] === "(authenticated)" || segments?.[0] === "map";
  const hasRedirected = useRef(false);

  // const isDevelopment = true
  useEffect(() => {
    // console.log("User is signed in: ", isSignedIn);
    // console.log("User is in authenticated section: ", inAuthGroup);
    // console.log("hasRedirected: ", hasRedirected.current);
    if (rootLayoutComponentIsMounted || !isLoaded || hasRedirected.current)
      return;

    if (isSignedIn && !inAuthGroup) {
      hasRedirected.current = true;
      console.log("Navigating to map...");
      expoRouter.replace("/(authenticated)/dashboard");
    } else if (!isSignedIn && inAuthGroup) {
      hasRedirected.current = true;
      console.log("Navigating back to /");
      expoRouter.replace("/");
    }
  }, [
    isSignedIn,
    isLoaded,
    inAuthGroup,
    rootLayoutComponentIsMounted,
    currentPath,
    segments,
  ]);
};

export default useNavigationHandler;
