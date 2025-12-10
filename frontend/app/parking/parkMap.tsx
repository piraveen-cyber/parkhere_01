import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { getParkingSpots, ParkingSpot } from "../../services/parkingService";
import { useEffect } from "react";

import { useTheme } from "../../context/themeContext";

export default function ParkingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme(); // 👈 use theme
  const [selectedType, setSelectedType] = useState("car");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const spots = await getParkingSpots();
        setParkingSpots(spots);
      } catch (error) {
        console.error("Failed to fetch parking spots:", error);
      }
    };
    fetchSpots();
  }, []);

  const vehicleTypes = [
    { id: "car", label: t('car'), icon: require("../../assets/images/carpark.png") },
    { id: "bike", label: t('bike'), icon: require("../../assets/images/bikepark.png") },
    { id: "bus", label: t('bus'), icon: require("../../assets/images/buspark.png") },
    { id: "van", label: t('van'), icon: require("../../assets/images/vanpark.png") },
    {
      id: "threewheel",
      label: t('threeWheel'),
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
      >
        {parkingSpots.map((spot) => (
          <Marker
            key={spot._id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title={spot.name}
            description={spot.description}
          />
        ))}
      </MapView>

      {/* FLOATING SEARCH BOX */}
      <TouchableOpacity
        style={[styles.searchBox, { backgroundColor: colors.card }]}
        onPress={() => router.push("../parking/nearBySearch")}
      >
        <TextInput
          placeholder={t('whereTo')}
          placeholderTextColor={colors.subText}
          style={[styles.searchInput, { color: colors.text }]}
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
                { backgroundColor: colors.card },
                selectedType === item.id && { backgroundColor: colors.primary + '40', borderColor: colors.primary, borderWidth: 1 },
              ]}
              onPress={() => setSelectedType(item.id)}
            >
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.text },
                  selectedType === item.id && { color: colors.primary },
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
        style={[styles.floatButton, { backgroundColor: colors.primary }]}
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
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchInput: { fontSize: 16 },

  /** CATEGORY LIST */
  categoryWrapper: {
    position: "absolute",
    top: 140,
    paddingLeft: 10,
  },
  categoryCard: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent'
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
  },

  /** GPS CENTER BUTTON */
  floatButton: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  centerIcon: {
    fontSize: 28,
  },
});
