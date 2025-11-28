import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0D1B2A" : "#FFFFFF";
  const activeColor = "#FFD400";
  const inactiveColor = isDark ? "#9FB5C2" : "#999";
  const borderColor = isDark ? "#1B263B" : "#ddd";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,

        tabBarStyle: {
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: borderColor,

          // ⭐ FIX for EVERY phone
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
