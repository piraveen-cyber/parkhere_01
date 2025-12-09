import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import MapView, { Marker, Circle } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function NearBySearch() {
    const { t } = useTranslation();
    const [selectedVehicle, setSelectedVehicle] = useState("car");

    const mapRef = useRef(null);

    const vehicleTypes = ["car", "bike", "bus", "van"];

    const parkingLocations = [
        { id: 1, name: "Car Park A", lat: 6.9278, lng: 79.8619 },
        { id: 2, name: "Car Park B", lat: 6.9269, lng: 79.8610 },
        { id: 3, name: "Car Park C", lat: 6.9272, lng: 79.8628 },
    ];

    const animateMapTo = (lat, lng) => {
        mapRef.current?.animateToRegion(
            {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            800
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* MAP */}
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: 6.9271,
                    longitude: 79.8612,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                showsUserLocation
            >

                {/* PARKING MARKERS */}
                {parkingLocations.map((spot) => (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.lat, longitude: spot.lng }}
                        onPress={() => {
                            animateMapTo(spot.lat, spot.lng);
                            router.push("/parking/selectParking");   // ✅ marker → selectParking
                        }}
                    >
                        <View style={styles.parkingIcon}>
                            <MaterialIcons name="local-parking" size={22} color="black" />
                        </View>

                        {/* Ripple circle */}
                        <Circle
                            center={{ latitude: spot.lat, longitude: spot.lng }}
                            radius={120}
                            fillColor="rgba(255,215,0,0.25)"
                            strokeColor="rgba(255,215,0,0.6)"
                        />
                    </Marker>
                ))}
            </MapView>

            {/* SEARCH BOX */}
            <TouchableOpacity
                style={styles.searchBox}
                onPress={() => router.push("../parking/selectParking")}   // ✅ search bar → selectParking
            >
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    placeholder={t('searchLocation')}
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    editable={false}
                />
                <Ionicons name="close" size={20} color="#888" />
            </TouchableOpacity>

            {/* VEHICLE SELECTION BAR */}
            <View style={styles.vehicleBar}>
                <FlatList
                    data={vehicleTypes}
                    horizontal
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedVehicle(item)}
                            style={[
                                styles.vehicleItem,
                                selectedVehicle === item && styles.vehicleActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.vehicleText,
                                    selectedVehicle === item && { color: "#000" },
                                ]}
                            >
                                {t(item)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* CENTER BUTTON */}
            <TouchableOpacity
                style={styles.centerBtn}
                onPress={() => animateMapTo(6.9271, 79.8612)}
            >
                <Ionicons name="navigate" size={28} color="#fff" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

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
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },

    vehicleBar: {
        position: "absolute",
        top: 80,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        left: 20,
        right: 20,
        elevation: 4,
    },
    vehicleItem: {
        backgroundColor: "#f2f2f2",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginRight: 8,
    },
    vehicleActive: {
        backgroundColor: "#FFD400",
    },
    vehicleText: {
        fontWeight: "700",
        color: "#555",
    },

    parkingIcon: {
        backgroundColor: "#FFD400",
        padding: 6,
        borderRadius: 10,
    },

    centerBtn: {
        position: "absolute",
        bottom: 110,
        alignSelf: "center",
        backgroundColor: "#FFD400",
        width: 65,
        height: 65,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        elevation: 10,
    },
});
