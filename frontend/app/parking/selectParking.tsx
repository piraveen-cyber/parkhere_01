import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SelectParking() {
  const parkingSpot = {
    name: "Lekki Gardens Car Park A",
    price: "N200",
    spaces: 9,
    distance: "3 mins walk",
    lat: 6.9278,
    lng: 79.8619,
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* MAP */}
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: parkingSpot.lat,
          longitude: parkingSpot.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {/* Yellow user marker */}
        <Marker
          coordinate={{ latitude: 6.9271, longitude: 79.8612 }}
          pinColor="#FFD400"
        />

        {/* Green Parking Marker */}
        <Marker coordinate={{ latitude: parkingSpot.lat, longitude: parkingSpot.lng }}>
          <View style={styles.greenParkMarker}>
            <MaterialIcons name="local-parking" size={22} color="#fff" />
          </View>
        </Marker>
      </MapView>

      {/* TOP SEARCH BOX */}
      <View style={styles.searchBox}>
        <Ionicons name="location" size={20} color="#555" />
        <Text style={styles.searchText}>{parkingSpot.name}</Text>
        <Ionicons name="close" size={20} color="#777" />
      </View>

      {/* WHITE BOTTOM SHEET */}
      <View style={styles.bottomSheet}>
        <View style={styles.rowBetween}>
          <Text style={styles.priceText}>{parkingSpot.price}/Hr</Text>
          <Text style={styles.parkingName}>{parkingSpot.name}</Text>
        </View>

        <View style={styles.line} />

        <Text style={styles.detailText}>
          Spaces Available: <Text style={styles.value}>{parkingSpot.spaces} slots</Text>
        </Text>

        <Text style={styles.detailText}>
          Distance to Venue: <Text style={styles.value}>{parkingSpot.distance}</Text>
        </Text>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../parking/selectSlot")} // 🚀 route to selectSlot
        >
          <Text style={styles.buttonText}>PICK PARKING SLOT</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /** Search Box */
  searchBox: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 6,
  },
  searchText: {
    fontSize: 16,
    flex: 1,
    fontWeight: "600",
  },

  /** Green P Marker */
  greenParkMarker: {
    backgroundColor: "green",
    padding: 6,
    borderRadius: 10,
  },

  /** Bottom sheet */
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 15,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  priceText: {
    fontSize: 22,
    fontWeight: "900",
  },

  parkingName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
  },

  line: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  detailText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },

  value: {
    fontWeight: "700",
    color: "#000",
  },

  /** Button */
  button: {
    backgroundColor: "#FFD400",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
