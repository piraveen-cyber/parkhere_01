import { Stack, Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../config/supabaseClient";
import { View, Text } from "react-native";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* 👇 Redirect happens BEFORE rendering Stack screens */}
      {isAuthenticated ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/" />
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "white" },
        }}
      >
        {/* All screens defined ONE time */}
        <Stack.Screen name="index" />
        <Stack.Screen name="phoneAuth" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
