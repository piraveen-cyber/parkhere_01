import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

export default function RateMechanic() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [tip, setTip] = useState<number | null>(null);

    const tips = [100, 200, 500, 1000];

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert("Rate Service", "Please select a star rating.");
            return;
        }

        // Here we would submit the review and tip to the backend
        Alert.alert("Feedback Sent!", "Thank you for your review.", [
            { text: "Done", onPress: () => router.push('/(tabs)/home') }
        ]);
    };

    const StarRating = () => (
        <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <FontAwesome
                        name={star <= rating ? "star" : "star-o"}
                        size={40}
                        color={star <= rating ? "#FFD400" : colors.subText}
                        style={{ marginHorizontal: 8 }}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={isDark ? ['#0D1B2A', '#1B263B', '#000'] : ['#FFF', '#F0F2F5']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 100 }}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={isDark ? "#FFF" : "#000"} />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.text }]}>Rate Service</Text>
                    </View>

                    {/* MECHANIC AVATAR */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                            <View style={styles.checkBadge}>
                                <Ionicons name="checkmark" size={16} color="#FFF" />
                            </View>
                        </View>
                        <Text style={[styles.mechName, { color: colors.text }]}>{mechanic.name}</Text>
                        <Text style={{ color: colors.subText }}>How was the service?</Text>
                    </View>

                    {/* RATING */}
                    <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
                        <StarRating />

                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: isDark ? '#333' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                            placeholder="Write a comment (optional)..."
                            placeholderTextColor="#666"
                            multiline
                            value={review}
                            onChangeText={setReview}
                        />
                    </View>

                    {/* TIPS */}
                    <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF', marginTop: 20 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <FontAwesome name="money" size={20} color={accent} style={{ marginRight: 10 }} />
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Add a Tip</Text>
                        </View>

                        <View style={styles.tipRow}>
                            {tips.map((amt) => (
                                <TouchableOpacity
                                    key={amt}
                                    style={[
                                        styles.tipChip,
                                        {
                                            borderColor: tip === amt ? accent : (isDark ? '#444' : '#DDD'),
                                            backgroundColor: tip === amt ? accent : 'transparent'
                                        }
                                    ]}
                                    onPress={() => setTip(tip === amt ? null : amt)}
                                >
                                    <Text style={[styles.tipText, { color: tip === amt ? '#000' : colors.text }]}>{amt}</Text>
                                    <Text style={[styles.currency, { color: tip === amt ? '#000' : colors.subText }]}>LKR</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#000' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: accent }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitText}>SUBMIT REVIEW</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginTop: 15, alignSelf: 'center' }}
                    onPress={() => router.push('/(tabs)/home')}
                >
                    <Text style={{ color: colors.subText, fontWeight: '600' }}>Skip</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 40, marginBottom: 20, position: 'relative'
    },
    closeBtn: {
        position: 'absolute', left: 0,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center'
    },
    title: { fontSize: 18, fontWeight: '700' },

    profileSection: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#333' },
    checkBadge: {
        position: 'absolute', bottom: 5, right: 5,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#000'
    },
    mechName: { fontSize: 22, fontWeight: '800', marginBottom: 5 },

    card: { borderRadius: 20, padding: 20, alignItems: 'center' },

    starRow: { flexDirection: 'row', marginBottom: 20 },
    input: {
        width: '100%', height: 100, borderRadius: 15, borderWidth: 1,
        padding: 15, textAlignVertical: 'top', fontSize: 16
    },

    sectionTitle: { fontSize: 16, fontWeight: '700' },

    tipRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    tipChip: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, marginHorizontal: 5, borderRadius: 12, borderWidth: 1
    },
    tipText: { fontSize: 16, fontWeight: '700' },
    currency: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40, borderTopWidth: 1
    },
    submitBtn: {
        height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#FFD400', shadowOpacity: 0.3, shadowRadius: 10
    },
    submitText: { fontSize: 18, fontWeight: '800', color: '#000', letterSpacing: 1 }
});
