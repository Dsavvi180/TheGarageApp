import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Page = () => {
  return (
    <ImageBackground
      source={require("../assets/images/icon.png")}
      style={[styles.container, { backgroundColor: "white" }]}
      resizeMode="contain"
      imageStyle={styles.imageShift}
    >
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>
        </Text>
      </View>
      <View style={styles.buttons}>
        <Link
          href={"/login"}
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: "#00589A" },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "400" }}>
              Log In
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={"/signup"}
          style={[
            defaultStyles.pillButton,
            { flex: 1, backgroundColor: "black" },
          ]}
          asChild
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "400", color: "white" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageShift: {
    right: -15, // Adjust this value to shift the image to the right
    transform: [{ scale: 0.70 }],
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  header: {
    fontSize: 36,
    fontWeight: "400",
    textTransform: "uppercase",
    color: "black",
    textAlign: 'center'
    
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 25,
  },
});

export default Page;
