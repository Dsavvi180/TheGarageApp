import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  return (
    <View style={styles.mainCard}>
      <View style={[styles.firstWidget, styles.shadowBox]}>
        <TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="angle-right" size={30} color={Colors.gray} />

            <Text style={{ fontSize: 17, fontWeight: 400 }}>
              Current Service
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: Colors.gray }}>20% Complete</Text>{" "}
          <AntDesign name="loading1" size={24} color="#00589A" />
        </View>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  mainCard: {
    position: "absolute",
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    marginTop: 155,
    backgroundColor: "#f2f2f4",
    height: "100%",
    width: "100%",
    zIndex: 2,
    // justifyContent: 'center',
    alignItems: "center",
    paddingTop: 20,
  },
  firstWidget: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 32,
    height: 20,
  },
  shadowBox: {
    width: "90%",
    // flex: 0.001,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // iOS Shadow
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 1, // Vertical shadow
    },
    shadowOpacity: 0.15, // Shadow transparency
    shadowRadius: 2, // Shadow blur
    // Android Shadow
    elevation: 5, // Elevation for shadow
  },
});
