import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function LanguageScreen() {
  const router = useRouter();

  const goNext = () => {
    router.push("/onboarding1");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Yellow Section */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/iconblack.png")}
          style={styles.logo}
        />
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Welcome Back 🚗✨</Text>

        <TouchableOpacity style={styles.langButton} onPress={goNext}>
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={goNext}>
          <Text style={styles.langText}>தமிழ்</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={goNext}>
          <Text style={styles.langText}>සිංහල</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDBD00" },

  topSection: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    borderRadius: 150,
  },

  bottomSection: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    elevation: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
  },

  langButton: {
    width: "95%",
    backgroundColor: "#F5F5F5",
    paddingVertical: 18,
    borderRadius: 50,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    alignItems: "center",
  },

  langText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
});


