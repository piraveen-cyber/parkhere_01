import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";

export default function OwnerLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0D1B2A" : "#FFFFFF";
  // Distinct active color for Owner mode (e.g., Purple or Orange vs Yellow)
  // Let's stick to the brand Yellow for now but maybe different background
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
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="spots"
        options={{
          title: "My Parking",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car-outline" size={23} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
