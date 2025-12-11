import React from "react";
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function NeedMechanicHelp() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()}>
                        <View style={styles.backBtn}>
                            <Text style={{ fontSize: 24 }}>←</Text>
                        </View>
                    </Pressable>

                    <Text style={styles.headerText}>Need Mechanic Help</Text>

                    <Image
                        source={require("../../assets/images/carpark.png")}
                        style={styles.profileImg}
                    />
                </View>

                {/* Light Vehicle */}
                <Pressable style={styles.card} onPress={() => router.push("../Mechanic/lightVehicle")}>
                    <View style={styles.iconWrapper}>
                        <Image
                            source={require("../../assets/images/carpark.png")}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.cardText}>Light Vehicle</Text>
                </Pressable>

                {/* Heavy Vehicle */}
                <Pressable style={styles.card} onPress={() => router.push("../Mechanic/hevyVehicle")}>
                    <View style={styles.iconWrapper}>
                        <Image
                            source={require("../../assets/images/carpark.png")}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.cardText}>Heavy Vehicle</Text>
                </Pressable>

                {/* Electric Vehicle */}
                <Pressable style={styles.card} onPress={() => router.push("../Mechanic/EV")}>
                    <View style={styles.iconWrapper}>
                        <Image
                            source={require("../../assets/images/carpark.png")}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.cardText}>Electric Vehicle</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 15,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 15,
    },

    backBtn: {
        width: 45,
        height: 45,
        backgroundColor: "#FFD700",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    headerText: {
        color: "#E8E813",
        fontSize: 22,
        fontWeight: "800",
    },

    profileImg: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },

    card: {
        backgroundColor: "rgba(255,255,0,0.1)",
        borderWidth: 2,
        borderColor: "#FFD700",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    iconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#F7FF00",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
    },

    icon: {
        width: 45,
        height: 45,
        resizeMode: "contain",
    },

    cardText: {
        color: "#FFD700",
        fontSize: 22,
        fontWeight: "700",
    },
});
