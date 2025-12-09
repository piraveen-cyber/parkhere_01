import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParkingScreen() {
  const [selectedType, setSelectedType] = useState("car");

  const vehicleTypes = [
    { id: "car", label: "CAR", icon: require("../../assets/images/carpark.png") },
    { id: "bike", label: "BIKE", icon: require("../../assets/images/bikepark.png") },
    { id: "bus", label: "BUS", icon: require("../../assets/images/buspark.png") },
    { id: "van", label: "VAN", icon: require("../../assets/images/vanpark.png") },
    {
      id: "threewheel",
      label: "Three Wheeler",
      icon: require("../../assets/images/tukpark.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* MAP BACKGROUND */}
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      />

      {/* FLOATING SEARCH BOX */}
      <TouchableOpacity
        style={styles.searchBox}
        onPress={() => router.push("../parking/nearBySearch")}
      >
        <TextInput
          placeholder="Where are you going to?"
          placeholderTextColor="#999"
          style={styles.searchInput}
          editable={false}
        />
      </TouchableOpacity>

      {/* VEHICLE TYPE SELECTOR */}
      <View style={styles.categoryWrapper}>
        <FlatList
          data={vehicleTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedType === item.id && styles.categoryActive,
              ]}
              onPress={() => setSelectedType(item.id)}
            >
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text
                style={[
                  styles.categoryText,
                  selectedType === item.id && { color: "#FFD400" },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* FLOATING CURRENT LOCATION BUTTON */}
      <TouchableOpacity
        style={styles.floatButton}
        onPress={() => router.push("../parking/nearByParking")}
      >
        <Text style={styles.centerIcon}>📍</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /** SEARCH BOX */
  searchBox: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 5,
  },
  searchInput: { fontSize: 16 },

  /** CATEGORY LIST */
  categoryWrapper: {
    position: "absolute",
    top: 140,
    paddingLeft: 10,
  },
  categoryCard: {
    backgroundColor: "#fff",
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  categoryActive: {
    backgroundColor: "#FFF4B0",
  },
  categoryIcon: {
    width: 35,
    height: 35,
    marginBottom: 4,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },

  /** GPS CENTER BUTTON */
  floatButton: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
    backgroundColor: "#FFD400",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  centerIcon: {
    fontSize: 28,
  },
});
