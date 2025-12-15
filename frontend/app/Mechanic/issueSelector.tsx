import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Pressable, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

// Categories
const CATEGORIES = [
    { id: 'common', label: 'Common' },
    { id: 'light', label: 'Light Vehicle' },
    { id: 'heavy', label: 'Heavy Vehicle' },
    { id: 'ev', label: 'EV / Hybrid' },
];

// Expanded Issues Data
const ALL_ISSUES = [
    // COMMON
    { id: 'engine', label: 'Engine Start', icon: 'engine', lib: MaterialCommunityIcons, category: 'common' },
    { id: 'battery', label: 'Battery Dead', icon: 'car-battery', lib: FontAwesome5, category: 'common' },
    { id: 'tyre', label: 'Flat Tyre', icon: 'disc', lib: Ionicons, category: 'common' },
    { id: 'brake', label: 'Brake Fail', icon: 'car-brake-alert', lib: MaterialCommunityIcons, category: 'common' },
    { id: 'lock', label: 'Car Locked', icon: 'lock-closed', lib: Ionicons, category: 'common' },
    { id: 'fuel', label: 'Out of Fuel', icon: 'gas-station', lib: MaterialCommunityIcons, category: 'common' },

    // LIGHT VEHICLE
    { id: 'ac', label: 'AC Cooling', icon: 'fan', lib: MaterialCommunityIcons, category: 'light' },
    { id: 'lights', label: 'Lights / Bulb', icon: 'lightbulb', lib: MaterialIcons, category: 'light' },
    { id: 'sensors', label: 'Sensor Error', icon: 'eye', lib: Ionicons, category: 'light' },
    { id: 'wiper', label: 'Wipers', icon: 'wiper', lib: MaterialCommunityIcons, category: 'light' },
    { id: 'audio', label: 'Audio / Elec', icon: 'musical-notes', lib: Ionicons, category: 'light' },
    { id: 'glass', label: 'Glass / Mirror', icon: 'mirror', lib: MaterialCommunityIcons, category: 'light' },

    // HEAVY VEHICLE
    { id: 'hydraulics', label: 'Hydraulics', icon: 'water', lib: Ionicons, category: 'heavy' },
    { id: 'air_brake', label: 'Air Brakes', icon: 'air-filter', lib: MaterialCommunityIcons, category: 'heavy' },
    { id: 'gearbox', label: 'Gearbox', icon: 'cog', lib: FontAwesome5, category: 'heavy' },
    { id: 'suspension', label: 'Suspension', icon: 'car-repair', lib: MaterialIcons, category: 'heavy' },
    { id: 'clutch', label: 'Clutch', icon: 'disc', lib: Ionicons, category: 'heavy' },
    { id: 'towing', label: 'Heavy Towing', icon: 'tow-truck', lib: MaterialCommunityIcons, category: 'heavy' },

    // EV / HYBRID
    { id: 'ev_charge', label: 'Charging', icon: 'charging-station', lib: FontAwesome5, category: 'ev' },
    { id: 'hv_battery', label: 'HV Battery', icon: 'battery-charging', lib: MaterialCommunityIcons, category: 'ev' },
    { id: 'software', label: 'Software', icon: 'code-working', lib: Ionicons, category: 'ev' },
    { id: 'motor', label: 'Motor Noise', icon: 'speedometer', lib: Ionicons, category: 'ev' },
    { id: 'inverter', label: 'Inverter', icon: 'flash', lib: Ionicons, category: 'ev' },
    { id: 'thermal', label: 'Thermal', icon: 'thermometer', lib: Ionicons, category: 'ev' },
];

export default function IssueSelector() {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    // Theme Colors
    const accent = colors.primary;
    const textPrimary = colors.text;
    const textSecondary = colors.subText;

    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState('common');

    const toggleIssue = (id: string) => {
        if (selectedIssues.includes(id)) {
            setSelectedIssues(selectedIssues.filter(i => i !== id));
        } else {
            setSelectedIssues([...selectedIssues, id]);
        }
    };

    const params = useLocalSearchParams();

    const handleContinue = () => {
        router.push({
            pathname: '/Mechanic/serviceType',
            params: {
                ...params,
                issues: JSON.stringify(selectedIssues)
            }
        });
    };

    const displayedIssues = ALL_ISSUES.filter(i => i.category === activeCategory);

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <LinearGradient
                colors={isDark ? ['#000000', '#141414', '#000000'] : ['#FFFFFF', '#F0F2F5', '#E1E5EA']}
                style={StyleSheet.absoluteFill}
            />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color: textPrimary }]}>What&apos;s the problem?</Text>
                    <Text style={[styles.subtitle, { color: textSecondary }]}>Identify the main issues</Text>
                </View>
            </View>

            {/* CATEGORY TABS */}
            <View style={{ height: 60 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 25, gap: 10 }}
                >
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.catChip,
                                    {
                                        backgroundColor: isActive
                                            ? accent
                                            : (isDark ? 'rgba(255,255,255,0.08)' : '#FFF'),
                                        borderColor: isActive ? accent : (isDark ? '#333' : '#E0E0E0'),
                                        borderWidth: 1
                                    }
                                ]}
                                onPress={() => setActiveCategory(cat.id)}
                            >
                                <Text style={[
                                    styles.catText,
                                    { color: isActive ? (isDark ? '#FFF' : '#000') : textSecondary } // Fix for light mode text contrast
                                ]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* GRID */}
                <View style={styles.grid}>
                    {displayedIssues.map((item) => {
                        const IconLib = item.lib;
                        const isSelected = selectedIssues.includes(item.id);

                        return (
                            <Pressable
                                key={item.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isSelected
                                            ? (isDark ? 'rgba(247, 175, 5, 0.15)' : 'rgba(57, 255, 20, 0.1)') // Dynamic Tint
                                            : (isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'),
                                        borderColor: isSelected ? accent : (isDark ? '#333' : '#E0E0E0'),
                                        shadowOpacity: isDark ? 0 : 0.05
                                    }
                                ]}
                                onPress={() => toggleIssue(item.id)}
                            >
                                <View style={[
                                    styles.iconBox,
                                    {
                                        backgroundColor: isSelected ? accent : (isDark ? '#222' : '#F5F5F5'),
                                        borderColor: isDark ? '#333' : '#EEE'
                                    }
                                ]}>
                                    <IconLib
                                        name={item.icon as any}
                                        size={28}
                                        color={isSelected ? (isDark ? '#FFF' : '#000') : (isDark ? '#FFF' : '#555')}
                                    />
                                </View>
                                <Text style={[styles.cardLabel, { color: textPrimary }]}>{item.label}</Text>

                                {isSelected && (
                                    <View style={[styles.checkBadge, { backgroundColor: accent }]}>
                                        <Ionicons name="checkmark" size={12} color={isDark ? "#FFF" : "#000"} />
                                    </View>
                                )}
                            </Pressable>
                        )
                    })}
                </View>

                {/* NOT SURE HELPER */}
                <TouchableOpacity
                    style={[styles.notSureBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderColor: isDark ? '#333' : '#EEE', borderWidth: 1 }]}
                    onPress={() => toggleIssue('unknown')}
                >
                    <Ionicons name="help-circle-outline" size={24} color={textSecondary} />
                    <Text style={[styles.notSureText, { color: textSecondary }]}>Not sure? Select &quot;Unknown Issue&quot;</Text>
                    {selectedIssues.includes('unknown') &&
                        <Ionicons name="checkmark-circle" size={20} color={accent} style={{ marginLeft: 'auto' }} />
                    }
                </TouchableOpacity>

                {/* OTHER SERVICE BUTTON - Preserved */}
                <TouchableOpacity
                    style={[styles.notSureBox, { marginTop: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF', borderColor: isDark ? '#333' : '#EEE', borderWidth: 1 }]}
                    onPress={() => toggleIssue('other')}
                >
                    <MaterialCommunityIcons name="toolbox-outline" size={22} color={textSecondary} />
                    <Text style={[styles.notSureText, { color: textSecondary }]}>Other Service Request</Text>
                    {selectedIssues.includes('other') &&
                        <Ionicons name="checkmark-circle" size={20} color={accent} style={{ marginLeft: 'auto' }} />
                    }
                </TouchableOpacity>

            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, {
                backgroundColor: isDark ? '#141414' : '#FFF',
                borderTopColor: isDark ? '#333' : '#EEE'
            }]}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: accent, opacity: selectedIssues.length > 0 ? 1 : 0.5, shadowColor: accent }]}
                    disabled={selectedIssues.length === 0}
                    onPress={handleContinue}
                >
                    <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#000' }]}>CONTINUE</Text>
                    <Ionicons name="arrow-forward" size={20} color={isDark ? "#FFF" : "#000"} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60, paddingHorizontal: 25, paddingBottom: 10,
        flexDirection: 'row', alignItems: 'center'
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center', marginRight: 15
    },
    title: { fontSize: 24, fontWeight: '800' },
    subtitle: { fontSize: 14, marginTop: 4 },

    catChip: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, alignItems: 'center', justifyContent: 'center'
    },
    catText: { fontWeight: '700', fontSize: 14 },

    scrollContent: { padding: 25, paddingBottom: 120 },

    grid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between', gap: 15
    },
    card: {
        width: '47%', aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, padding: 10,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowRadius: 5
    },
    iconBox: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center', marginBottom: 15,
        borderWidth: 1
    },
    cardLabel: { fontSize: 14, fontWeight: '700', textAlign: 'center' },

    checkBadge: {
        position: 'absolute', top: 10, right: 10,
        width: 20, height: 20, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center'
    },

    notSureBox: {
        marginTop: 30, flexDirection: 'row',
        alignItems: 'center', gap: 10,
        padding: 15, borderRadius: 12
    },
    notSureText: { fontSize: 14, fontWeight: '500' },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40,
        borderTopWidth: 1
    },
    btn: {
        height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowOpacity: 0.4, shadowRadius: 10
    },
    btnText: { fontSize: 18, fontWeight: '800', letterSpacing: 1 }
});
