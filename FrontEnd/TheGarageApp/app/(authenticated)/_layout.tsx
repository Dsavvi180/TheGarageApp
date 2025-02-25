import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import SignOutButton from "../components/signOutButton";
import CustomHeader from "../components/customHeader";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  const expoRouter = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="map"
        options={{
          title: "Pick a store",
          headerBackTitle: "",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: {
            fontWeight: "300", // Apply font weight here
            fontSize: 21, // Optional: Customize font size
            color: "black", // Optional: Customize text color
          },
          headerLeft: () => <SignOutButton />,
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          // title: "Dashboard",
          headerTransparent: true,
          headerShown: true,
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: {
            fontWeight: "300", // Apply font weight here
            fontSize: 21, // Optional: Customize font size
            color: "black", // Optional: Customize text color
          },
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}
