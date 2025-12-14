import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Linking, Alert, Dimensions, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

const { width } = Dimensions.get('window');

export default function MechanicProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {
        id: 'm1',
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        reviews: 124,
        experience: '8 Years',
        jobs: 850,
        skills: ['Engine Repair', 'Brake Systems', 'Diagnostics', 'Hybrid Tech'],
        certifications: ['Certified Auto Mechanic (CAM)', 'EV Specialist L2'],
        about: 'Expert in Japanese and European vehicles. Dedicated to quick and reliable roadside assistance. Available 24/7 for emergency repairs.',
        isOnline: true
    };

    const [booking, setBooking] = useState(false);
    const scrollY = new Animated.Value(0);

    const handleBookNow = () => {
        router.push({
            pathname: '/Mechanic/bookingSummary',
            params: {
                ...params,
                mechanic: JSON.stringify(mechanic)
            }
        });
    };

    const handleCall = () => Linking.openURL(`tel:+94771234567`);
    const handleChat = () => Alert.alert("Chat", "Opening chat with mechanic...");

    // Header Animations
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [300, 100],
        extrapolate: 'clamp'
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* ANIMATED HEADER */}
            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
                <Animated.Image
                    source={{ uri: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070' }}
                    style={[styles.headerImg, { opacity: imageOpacity }]}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />

                {/* Navbar */}
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtnBlur}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtnBlur}>
                        <Ionicons name="heart-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Mechanic Info Overlay (Fades out on scroll) */}
                <Animated.View style={[styles.headerInfo, { opacity: imageOpacity }]}>
                    <View style={styles.verifiedTag}>
                        <MaterialCommunityIcons name="check-decagram" size={14} color="#FFF" />
                        <Text style={styles.verifiedText}>VERIFIED PRO</Text>
                    </View>
                    <Text style={styles.headerName}>{mechanic.name}</Text>
                    <Text style={styles.headerExp}>{mechanic.experience} Experience • 2.5km Away</Text>
                </Animated.View>
            </Animated.View>

            {/* SCROLLABLE CONTENT */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={[styles.bodyContainer, { backgroundColor: colors.background }]}>

                    {/* AVATAR OVERLAP */}
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                            {mechanic.isOnline && <View style={[styles.onlineDot, { borderColor: colors.background }]} />}
                        </View>

                        <View style={styles.mainStats}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={[styles.ratingVal, { color: colors.text }]}>{mechanic.rating}</Text>
                                <Text style={styles.ratingCount}>({mechanic.reviews})</Text>
                            </View>
                            <View style={styles.jobBadge}>
                                <FontAwesome5 name="tools" size={12} color={accent} />
                                <Text style={[styles.jobText, { color: accent }]}>{mechanic.jobs}+ Jobs</Text>
                            </View>
                        </View>
                    </View>

                    {/* QUICK STATS CARD */}
                    <View style={[styles.statsCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F7FA' }]}>
                        <View style={styles.statItem}>
                            <SimpleLineIcons name="clock" size={20} color={colors.text} />
                            <Text style={[styles.statNum, { color: colors.text }]}>25<Text style={{ fontSize: 12 }}>min</Text></Text>
                            <Text style={styles.statLbl}>Arrival</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#DDD' }]} />
                        <View style={styles.statItem}>
                            <SimpleLineIcons name="badge" size={20} color={colors.text} />
                            <Text style={[styles.statNum, { color: colors.text }]}>100%</Text>
                            <Text style={styles.statLbl}>Success</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#DDD' }]} />
                        <View style={styles.statItem}>
                            <SimpleLineIcons name="wallet" size={20} color={colors.text} />
                            <Text style={[styles.statNum, { color: colors.text }]}>$$</Text>
                            <Text style={styles.statLbl}>Rates</Text>
                        </View>
                    </View>

                    {/* ABOUT */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>About Mechanic</Text>
                        <Text style={[styles.aboutText, { color: colors.subText }]}>{mechanic.about}</Text>
                    </View>

                    {/* SKILLS */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Expertise</Text>
                        <View style={styles.skillRow}>
                            {mechanic.skills?.map((skill: string, i: number) => (
                                <View key={i} style={[styles.skillChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#EEE' }]}>
                                    <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                                </View>
                            )) || <Text style={{ color: colors.subText }}>No specific skills listed.</Text>}
                        </View>
                    </View>

                    {/* CERTIFICATIONS */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Certifications</Text>
                        {mechanic.certifications?.map((cert: string, i: number) => (
                            <View key={i} style={[styles.certRow, { borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
                                <View style={[styles.certIconBox, { backgroundColor: 'rgba(57, 255, 20, 0.1)' }]}>
                                    <MaterialCommunityIcons name="certificate-outline" size={20} color={accent} />
                                </View>
                                <Text style={[styles.certText, { color: colors.subText }]}>{cert}</Text>
                            </View>
                        )) || <Text style={{ color: colors.subText }}>No certifications listed.</Text>}
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* FLOATING ACTION BAR */}
            <View style={[styles.floatingBar, { backgroundColor: isDark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <View style={styles.floatRow}>
                    <TouchableOpacity style={[styles.circleBtn, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]} onPress={handleCall}>
                        <Ionicons name="call" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.circleBtn, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]} onPress={handleChat}>
                        <Ionicons name="chatbubble-ellipses" size={22} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bookBtn, { backgroundColor: accent, shadowColor: accent }]}
                        onPress={handleBookNow}
                        disabled={booking}
                    >
                        <Text style={[styles.bookText, { color: isDark ? '#FFF' : '#000' }]}>
                            {booking ? "PROCESSING..." : "BOOK NOW"}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color={isDark ? "#FFF" : "#000"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerContainer: { width: '100%', overflow: 'hidden' },
    headerImg: { width: '100%', height: '100%', resizeMode: 'cover' },

    navBar: {
        position: 'absolute', top: 50, width: '100%',
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20
    },
    iconBtnBlur: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },

    headerInfo: {
        position: 'absolute', bottom: 40, left: 20, right: 20
    },
    verifiedTag: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: 'rgba(0,200,83,0.8)', alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 8
    },
    verifiedText: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    headerName: { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    headerExp: { fontSize: 14, color: '#DDD', fontWeight: '500' },

    scrollContent: { paddingTop: 260 },
    bodyContainer: {
        flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        marginTop: -30, paddingHorizontal: 24, paddingTop: 10
    },

    avatarRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -50, marginBottom: 20 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: '#1F1F1F' },
    onlineDot: {
        position: 'absolute', bottom: 5, right: 0,
        width: 20, height: 20, borderRadius: 10,
        backgroundColor: '#00C853', borderWidth: 3
    },
    mainStats: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingVal: { fontSize: 16, fontWeight: '700' },
    ratingCount: { fontSize: 14, color: '#888' },
    jobBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(57, 255, 20, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    jobText: { fontSize: 12, fontWeight: '700' },

    statsCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 20, padding: 20, marginBottom: 25
    },
    statItem: { alignItems: 'center', flex: 1 },
    statNum: { fontSize: 18, fontWeight: '800', marginVertical: 4 },
    statLbl: { fontSize: 12, color: '#888', fontWeight: '500' },
    statDivider: { width: 1, height: 30 },

    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    aboutText: { fontSize: 15, lineHeight: 24 },

    skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    skillChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
    skillText: { fontSize: 13, fontWeight: '600' },

    certRow: {
        flexDirection: 'row', alignItems: 'center', gap: 15,
        paddingVertical: 12, borderBottomWidth: 1
    },
    certIconBox: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center'
    },
    certText: { fontSize: 15, fontWeight: '500' },

    floatingBar: {
        position: 'absolute', bottom: 0, width: '100%',
        paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 35,
        borderTopWidth: 1
    },
    floatRow: { flexDirection: 'row', gap: 15 },
    circleBtn: {
        width: 54, height: 54, borderRadius: 27,
        alignItems: 'center', justifyContent: 'center'
    },
    bookBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        height: 54, borderRadius: 27,
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    },
    bookText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
