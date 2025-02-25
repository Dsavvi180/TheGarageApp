import { useFonts } from "expo-font";
import {
  Link,
  SplashScreen,
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
  usePathname,
  Slot,
} from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";
import { tokenCache } from "@/cache";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import useNavigationHandler from "./navigationHandler";
import SignOutButton from "./components/signOutButton";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

const InitialLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const expoRouter = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useNavigationHandler();
  useEffect(() => {
    if (!loaded) {
      SplashScreen.preventAutoHideAsync(); // Prevent splash screen auto-hide during loading
    } else {
      SplashScreen.hideAsync(); // Hide splash screen when fonts are loaded
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={expoRouter.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={expoRouter.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: "",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={expoRouter.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(authenticated)"
        options={{
          title: "",
          headerBackTitle: "",
          headerShown: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => <SignOutButton />,
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <StatusBar style="light" />
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Background remains white
  },
});
