import { Stack } from "expo-router";

export default function OwnerOnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="step1" options={{ title: "Business Type" }} />
            <Stack.Screen name="step2" options={{ title: "Verification" }} />
        </Stack>
    );
}
