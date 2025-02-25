import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, FlatList, Text, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type LocationType = {
  name: string;
  latitude: number;
  longitude: number;
  id: number;
};

// Sample data
const DATA: LocationType[] = [
  { name: "Location 1", latitude: 37.78825, longitude: -122.4324, id: 1 },
  { name: "Location 2", latitude: 37.78325, longitude: -122.4224, id: 2 },
];

// Location component
const Location = ({ place }: { place: LocationType }) => (
  <View style={styles.listItem}>
    <Text style={styles.listText}>{place.name}</Text>
    <Text style={styles.listSubText}>
      Lat: {place.latitude}, Lng: {place.longitude}
    </Text>
  </View>
);

// Main App component
export default function App() {
  const [isMapEnlarged, setIsMapEnlarged] = useState(false);
  const expoRouter = useRouter();

  const handleMarkerPress = (storeName: string) => {
    console.log(`Navigating to Locations/${storeName}`);
    // Implement navigation logic here
    expoRouter.push(`/Locations/${storeName}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{ height: isMapEnlarged ? "80%" : "20%" }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {DATA.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
              >
                <View style={styles.markerButtonContainer}>
                  <Button
                    title="Go"
                    onPress={() => handleMarkerPress(location.name)}
                  />
                </View>
              </Marker>
            ))}
          </MapView>
          <Button
            title={isMapEnlarged ? "Minimize Map" : "Enlarge Map"}
            onPress={() => setIsMapEnlarged(!isMapEnlarged)}
          />
        </View>

        <View
          style={
            isMapEnlarged
              ? styles.listContainerEnlarged
              : styles.listContainerMinimised
          }
        >
          <FlatList
            data={DATA}
            renderItem={({ item }) => <Location place={item} />} // Pass the entire item object
            keyExtractor={(item) => item.id.toString()} // Convert id to string
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  listContainerEnlarged: {
    marginTop: 50,
    height: "20%",
    padding: 10,
  },
  listContainerMinimised: {
    marginTop: 50,
    height: "80%",
    padding: 10,
  },
  listItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  listText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listSubText: {
    fontSize: 14,
    color: "#555",
  },
  markerButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 5,
    borderRadius: 5,
  },
});
