import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import MapView from "react-native-maps";
import { useRouter } from "expo-router";

const vehicles = [
  { id: "car", label: "CAR", icon: require("../../assets/images/carpark.png") },
  { id: "bike", label: "BIKE", icon: require("../../assets/images/bikepark.png") },
  { id: "bus", label: "BUS", icon: require("../../assets/images/buspark.png") },
  { id: "van", label: "VAN", icon: require("../../assets/images/vanpark.png") },
  { id: "three", label: "Three Wheeler", icon: require("../../assets/images/tukpark.png") },
];

export default function SelectVehicle() {
  const router = useRouter();
  const [selected, setSelected] = useState("car");

  return (
    <View style={{ flex: 1 }}>
      {/* Map Background */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Where are you going to?</Text>
      </View>

      {/* Vehicle Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.vehicleContainer}
      >
        {vehicles.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelected(item.id)}
            style={[
              styles.vehicleCard,
              selected === item.id && styles.selectedCard,
            ]}
          >
            <Image
              source={item.icon}
              style={[
                styles.icon,
                selected === item.id && styles.selectedIcon,
              ]}
            />
            <Text
              style={[
                styles.label,
                selected === item.id && styles.selectedLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatButton}
        onPress={() =>
          router.push(
            "../parkmap" 
          )
        }
      >
        <Text style={styles.arrow}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: "85%",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
  },
  searchText: {
    color: "#777",
    fontSize: 16,
  },
  vehicleContainer: {
    position: "absolute",
    top: 130,
    paddingHorizontal: 10,
  },
  vehicleCard: {
    backgroundColor: "#fff",
    width: 80,
    height: 85,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  selectedCard: {
    backgroundColor: "#FFE15A",
  },
  icon: {
    width: 35,
    height: 35,
    tintColor: "#555",
  },
  selectedIcon: {
    tintColor: "#000",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
  },
  selectedLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  floatButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 65,
    height: 65,
    backgroundColor: "#FFD400",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
  },
  arrow: {
    fontSize: 32,
    color: "#fff",
  },
});
