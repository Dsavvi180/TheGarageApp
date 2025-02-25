import { useClerk, useSession } from "@clerk/clerk-react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Button, TouchableOpacity, Text } from "react-native";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const currentSession = useSession();
  const expoRouter = useRouter();
  const handleSignOut = async () => {
    try {
      // Redirect to your desired page
      await signOut();
      if (currentSession) {
        await currentSession.session?.end();
        expoRouter.replace("/");
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text
        style={{
          color: "black",
          fontWeight: "300", // Customize font weight here
          fontSize: 16,
        }}
      >
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};

export default SignOutButton;
