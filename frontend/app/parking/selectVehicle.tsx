import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import MapView from "react-native-maps";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";



export default function SelectVehicle() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState("car");

  const vehicles = [
    { id: "car", label: t('car'), icon: require("../../assets/images/carpark.png") },
    { id: "bike", label: t('bike'), icon: require("../../assets/images/bikepark.png") },
    { id: "bus", label: t('bus'), icon: require("../../assets/images/buspark.png") },
    { id: "van", label: t('van'), icon: require("../../assets/images/vanpark.png") },
    { id: "three", label: t('threeWheel'), icon: require("../../assets/images/tukpark.png") },
  ];

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
            "../parking/parkMap"
          )
        }
      >
        <Text style={styles.arrow}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  vehicleContainer: {
    position: "absolute",
    top: 80,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -5 }, // iOS shadow
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
