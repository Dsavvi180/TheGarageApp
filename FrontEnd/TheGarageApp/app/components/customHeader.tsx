import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  const expoRouter = useRouter();
  return (
    <BlurView
      intensity={0}
      tint="extraLight"
      style={{ paddingTop: top, paddingBottom: 75, backgroundColor: "#00589A" }}
    >
      <View style={[styles.container]}>
        <View style={[styles.main]}>
          <View>
            <Text style={{ fontSize: 37, fontWeight: 600, color: "white" }}>
              TheGarage
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.roundBtn}>
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>
                SG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                expoRouter.replace("/(authenticated)/map");
              }}
            >
              <SimpleLineIcons name="map" size={31} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.headerLower}>
        <View style={{ marginTop: -2 }}>
          <Text style={{ color: "white" }}>
            Customer Booking & Account Portal
          </Text>
        </View>
      </View>
    </BlurView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 60,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLower: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
  },
});
