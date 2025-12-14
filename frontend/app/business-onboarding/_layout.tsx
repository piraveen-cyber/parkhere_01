import { Stack } from "expo-router";

export default function BusinessOnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="service-selection" />
            <Stack.Screen name="personal-details" />
            <Stack.Screen name="parking-location" />
            <Stack.Screen name="parking-address" />
            <Stack.Screen name="parking-rules" />
            <Stack.Screen name="parking-pricing" />
            <Stack.Screen name="parking-facilities" />
            <Stack.Screen name="verification-docs" />
            <Stack.Screen name="review" />
        </Stack>
    );
}
