import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useTheme } from "../../context/themeContext";

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // THEME COLORS
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
          height: Platform.OS === "android" ? 62 : 90,
          paddingBottom: Platform.OS === "android" ? 8 : 25,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: borderColor,
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
