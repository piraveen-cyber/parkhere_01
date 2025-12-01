import { Stack, Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../config/supabaseClient";
import { View, Text } from "react-native";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18n";

// 🌙 GLOBAL THEME PROVIDER
import { ThemeProvider } from "../context/themeContext";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Debug Supabase session in AsyncStorage
  const debugAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKey = keys.find(
        (key) => key.includes("sb-") && key.includes("-authtoken")
      );
      if (sessionKey) {
        const sessionData = await AsyncStorage.getItem(sessionKey);
        console.log("Supabase session data:", sessionData);
      } else {
        console.log("No Supabase session found in storage");
      }
    } catch (error) {
      console.log("AsyncStorage error:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      await debugAsyncStorage();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(
        "Initial session state:",
        session ? "Authenticated" : "Not authenticated"
      );

      setIsAuthenticated(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", { event, session });
        setIsAuthenticated(!!session);
        debugAsyncStorage();
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // ⏳ Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        {/* 🌙 GLOBAL THEME FOR ENTIRE APP */}
        <ThemeProvider>
          {/* ⛔ Redirect must be OUTSIDE stack but INSIDE providers */}
          {isAuthenticated ? (
            <Redirect href="/(tabs)/home" />
          ) : (
            <Redirect href="/" />
          )}

          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            {/* Only declare screens once */}
            <Stack.Screen name="index" />
            <Stack.Screen name="language" />
            <Stack.Screen name="onboarding1" />
            <Stack.Screen name="onboarding2" />
            <Stack.Screen name="onboarding3" />
            <Stack.Screen name="phoneAuth" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="detail" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
