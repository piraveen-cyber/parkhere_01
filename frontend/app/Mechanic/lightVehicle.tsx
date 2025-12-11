// import React from "react";
// import {
//     View,
//     Text,
//     Image,
//     StyleSheet,
//     Pressable,
//     ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";

// export default function LightVehicle() {
//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

//                 {/* Header */}
//                 <View style={styles.headerRow}>
//                     <Pressable onPress={() => router.back()}>
//                         <View style={styles.backBtn}>
//                             <Text style={{ fontSize: 28 }}>←</Text>
//                         </View>
//                     </Pressable>

//                     <Text style={styles.headerText}>Light Vehicle</Text>

//                     <Image
//                         source={require("../../assets/profile.jpg")}
//                         style={styles.profileImg}
//                     />
//                 </View>

//                 {/* Two Wheeler */}
//                 <Pressable style={styles.card} onPress={() => router.push("../Mechanic/twoWheeler")}>
//                     <View style={styles.iconWrapper}>
//                         <Image
//                             source={require("../../assets/two_wheeler.png")}
//                             style={styles.icon}
//                         />
//                     </View>
//                     <Text style={styles.cardText}>Two wheeler</Text>
//                 </Pressable>

//                 {/* Three Wheeler */}
//                 <Pressable
//                     style={styles.card}
//                     onPress={() => router.push("../Mechanic/threeWheeler")}
//                 >
//                     <View style={styles.iconWrapper}>
//                         <Image
//                             source={require("../../assets/three_wheeler.png")}
//                             style={styles.icon}
//                         />
//                     </View>
//                     <Text style={styles.cardText}>Three wheeler</Text>
//                 </Pressable>

//                 {/* Four Wheeler */}
//                 <Pressable
//                     style={styles.card}
//                     onPress={() => router.push("../Mechanic/fourWheeler")}
//                 >
//                     <View style={styles.iconWrapper}>
//                         <Image
//                             source={require("../../assets/four_wheeler.png")}
//                             style={styles.icon}
//                         />
//                     </View>
//                     <Text style={styles.cardText}>Four Wheeler</Text>
//                 </Pressable>
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#000",
//         paddingHorizontal: 15,
//     },

//     headerRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginVertical: 15,
//     },

//     backBtn: {
//         width: 50,
//         height: 50,
//         backgroundColor: "#FFD700",
//         borderRadius: 50,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     headerText: {
//         color: "#E8E813",
//         fontSize: 24,
//         fontWeight: "900",
//     },

//     profileImg: {
//         width: 50,
//         height: 50,
//         borderRadius: 50,
//     },

//     card: {
//         backgroundColor: "rgba(255,255,0,0.10)",
//         borderWidth: 2,
//         borderColor: "#FFD700",
//         borderRadius: 20,
//         padding: 20,
//         marginTop: 25,
//         flexDirection: "row",
//         alignItems: "center",
//     },

//     iconWrapper: {
//         width: 70,
//         height: 70,
//         borderRadius: 50,
//         backgroundColor: "#F7FF00",
//         alignItems: "center",
//         justifyContent: "center",
//         marginRight: 20,
//     },

//     icon: {
//         width: 45,
//         height: 45,
//         resizeMode: "contain",
//     },

//     cardText: {
//         color: "#FFD700",
//         fontSize: 22,
//         fontWeight: "700",
//     },
// });
