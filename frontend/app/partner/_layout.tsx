import { Stack } from "expo-router";

export default function PartnerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="parking/index" />
            <Stack.Screen name="mechanic/index" />
            <Stack.Screen name="garage/index" />
        </Stack>
    );
}
