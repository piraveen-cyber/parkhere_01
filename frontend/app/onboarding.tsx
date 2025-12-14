import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
    FlatList,
    Platform
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";
const { width, height } = Dimensions.get("window");

const SLIDES = [
    {
        id: "1",
        image: require("../assets/images/caronboard.png"),
        titleKey: "bestParkingSpots",
        descKey: "loremIpsum",
    },
    {
        id: "2",
        image: require("../assets/images/maponboard.png"),
        titleKey: "quickNavigation",
        descKey: "loremIpsum",
    },
    {
        id: "3",
        image: require("../assets/images/payment.png"),
        titleKey: "easyPayment",
        descKey: "loremIpsum",
    },
    {
        id: "4",
        image: require("../assets/images/QR.png"),
        titleKey: "seamlessEntry",
        descKey: "scanQrDesc",
        isLast: true
    }
];

const SlideItem = ({ item, scrollX, index }: any) => {
    const { t } = useTranslation();

    const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp'
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp'
    });

    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [50, 0, 50],
        extrapolate: 'clamp'
    });

    const { colors } = useTheme();

    return (
        <View style={styles.slide}>
            <Animated.View style={[styles.imageContainer, { transform: [{ scale }] }]}>
                <View style={[styles.glow, {
                    backgroundColor: colors.primary + '1A',
                    shadowColor: colors.primary
                }]} />
                <Image
                    source={item.image}
                    style={[styles.image, item.id === "4" && { tintColor: colors.text }]}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.View style={[styles.textContainer, { opacity, transform: [{ translateY }] }]}>
                <Text style={[styles.title, { color: colors.text }]}>{t(item.titleKey)}</Text>
                <Text style={[styles.desc, { color: colors.subText }]}>{t(item.descKey)}</Text>
            </Animated.View>
        </View>
    );
};

export default function Onboarding() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fade in animation for the whole screen
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push("/phoneAuth"); // Push so user can back from Auth
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
        } else {
            router.back(); // Go back to Language
        }
    };

    const handleSkip = () => {
        router.replace("/(tabs)/home");
    };

    const Pagination = () => {
        const { colors } = useTheme();
        return (
            <View style={styles.dotsContainer}>
                {SLIDES.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 24, 8],
                        extrapolate: 'clamp'
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });
                    const color = scrollX.interpolate({
                        inputRange,
                        outputRange: [colors.text, colors.primary, colors.text],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={i.toString()}
                            style={[
                                styles.dot,
                                { width: dotWidth, opacity, backgroundColor: color }
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            {isDark && (
                <LinearGradient
                    colors={['#000000', '#141414', '#000000']}
                    style={StyleSheet.absoluteFill}
                />
            )}

            <SafeAreaView style={styles.safeArea}>
                {/* Top Bar */}
                <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={[styles.skipText, { color: colors.text }]}>{t("skip")}</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Carousel */}
                <Animated.FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={useRef(({ viewableItems }: any) => {
                        if (viewableItems && viewableItems.length > 0) {
                            setCurrentIndex(viewableItems[0].index);
                        }
                    }).current}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    scrollEventThrottle={16}
                />

                {/* Bottom Controls */}
                <Animated.View style={[styles.bottomControls, { opacity: fadeAnim }]}>
                    <Pagination />

                    <TouchableOpacity
                        style={styles.mainButton}
                        activeOpacity={0.8}
                        onPress={handleNext}
                    >
                        <LinearGradient
                            colors={isDark ? ['#f7af05', '#FFA500'] : ['#39FF14', '#32CD32']} // Gold Gradient for Dark, Green for Light
                            style={styles.mainButtonGradient}
                        >
                            <Text style={[styles.mainButtonText, { color: isDark ? '#FFF' : '#000' }]}>
                                {currentIndex === SLIDES.length - 1 ? t("getStarted") : t("next")}
                            </Text>
                            <Ionicons
                                name={currentIndex === SLIDES.length - 1 ? "rocket-outline" : "arrow-forward"}
                                size={20}
                                color={isDark ? '#FFF' : '#000'}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* OWNER LINK */}
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => router.push("../business-onboarding/service-selection")}>
                        <Text style={{ color: colors.subText, fontSize: 14 }}>
                            {t('wannaBusiness')} <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('hostNow')}</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        height: 60,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    imageContainer: {
        height: height * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        width: width,
    },
    glow: {
        position: 'absolute',
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width * 0.35,
        backgroundColor: 'rgba(247, 175, 5, 0.1)', // Gold Glow (simulated)
        shadowColor: '#f7af05',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    image: {
        width: width * 0.8,
        height: '100%',
    },
    textContainer: {
        paddingHorizontal: 40,
        alignItems: 'center',
        width: width,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 36,
    },
    desc: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
    },
    bottomControls: {
        paddingHorizontal: 24,
        paddingBottom: 30,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: "row",
        marginBottom: 30,
        gap: 8,
        height: 10,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    mainButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#f7af05",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    mainButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    mainButtonText: {
        fontSize: 18,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
