import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en from './en.json';
import ta from './ta.json';
import si from './si.json';

const RESOURCES = {
    en: { translation: en },
    ta: { translation: ta },
    si: { translation: si },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            const storedLanguage = await AsyncStorage.getItem('user-language');
            if (storedLanguage) {
                return callback(storedLanguage);
            }
            // Fallback to device locale or default
            const locale = Localization.getLocales()[0]?.languageCode;
            return callback(locale || 'en');
        } catch (error) {
            console.log('Error reading language', error);
            return callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n
    //.use(LANGUAGE_DETECTOR) // TODO: Fix type error with custom detector if needed, or use simple init
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources: RESOURCES,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Manually handle async detection to avoid suspense issues in some RN setups
// or just set default and let the component handle loading state if needed.
// For now, let's try to load from storage immediately after init or use a simple approach.

const initI18n = async () => {
    try {
        const storedLanguage = await AsyncStorage.getItem('user-language');
        if (storedLanguage) {
            await i18n.changeLanguage(storedLanguage);
        }
    } catch (e) {
        console.error("Failed to load language", e);
    }
};

initI18n();

export default i18n;
