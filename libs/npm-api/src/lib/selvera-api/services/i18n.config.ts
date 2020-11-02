import { find } from 'lodash';

/**
 * Supported Locales
 */

export interface AppLocaleDefinition {
    name: string;
    country: string;
    native: string;
    nativeCountry: string;
    rtl?: boolean;
}

export interface AppLocale extends AppLocaleDefinition {
    code: string;
}

export interface SupportedLocale {
    language: {
        code: string;
        name: string;
    };
    countries: Array<{
        code: string;
        name: string;
        native: string;
    }>;
}

// keep up to date with tools/i18n/locales

export type AppLocaleCode =
    | 'en'
    | 'en-CA'
    | 'en-GB'
    | 'en-AU'
    | 'en-NZ'
    | 'es'
    | 'es-MX'
    | 'es-CO'
    | 'es-CL'
    | 'es-US'
    | 'de'
    | 'fr'
    | 'it'
    | 'pt'
    | 'pt-BR'
    | 'ar-SA'
    | 'ar-KW'
    | 'ar-BH'
    | 'ar-AE'
    | 'ar-EG'
    | 'ar-OM'
    | 'ar-LB'
    | 'da'
    | 'he';

export const appLocales: { [key in AppLocaleCode]: AppLocaleDefinition } = {
    en: {
        name: 'English',
        country: 'United States',
        native: 'English',
        nativeCountry: 'United States'
    },
    'en-CA': {
        name: 'English',
        country: 'Canada',
        native: 'English',
        nativeCountry: 'Canada'
    },
    'en-GB': {
        name: 'English',
        country: 'United Kingdom',
        native: 'English',
        nativeCountry: 'United Kingdom'
    },
    'en-AU': {
        name: 'English',
        country: 'Australia',
        native: 'English',
        nativeCountry: 'Australia'
    },
    'en-NZ': {
        name: 'English',
        country: 'New Zealand',
        native: 'English',
        nativeCountry: 'New Zealand'
    },
    es: {
        name: 'Spanish',
        country: 'Spain',
        native: 'Español',
        nativeCountry: 'España'
    },
    'es-MX': {
        name: 'Spanish',
        country: 'Mexico',
        native: 'Español',
        nativeCountry: 'México'
    },
    'es-CO': {
        name: 'Spanish',
        country: 'Colombia',
        native: 'Español',
        nativeCountry: 'Colombia'
    },
    'es-CL': {
        name: 'Spanish',
        country: 'Chile',
        native: 'Español',
        nativeCountry: 'Chile'
    },
    'es-US': {
        name: 'Spanish',
        country: 'United States',
        native: 'Español',
        nativeCountry: 'Estados Unidos'
    },
    de: {
        name: 'German',
        country: 'Germany',
        native: 'Deutsche',
        nativeCountry: 'Deutschland'
    },
    fr: {
        name: 'French',
        country: 'France',
        native: 'Français',
        nativeCountry: 'La France'
    },
    it: {
        name: 'Italian',
        country: 'Italy',
        native: 'Italiano',
        nativeCountry: 'Italia'
    },
    pt: {
        name: 'Portuguese',
        country: 'Portugal',
        native: 'Português',
        nativeCountry: 'Portugal'
    },
    'pt-BR': {
        name: 'Portuguese',
        country: 'Brazil',
        native: 'Português',
        nativeCountry: 'Brasil'
    },
    'ar-SA': {
        name: 'Arabic',
        country: 'Saudi Arabia',
        native: 'عربى',
        nativeCountry: 'المملكة العربية السعودية',
        rtl: true
    },
    'ar-KW': {
        name: 'Arabic',
        country: 'Kuwait',
        native: 'عربى',
        nativeCountry: 'الكويت',
        rtl: true
    },
    'ar-BH': {
        name: 'Arabic',
        country: 'Bahrain',
        native: 'عربى',
        nativeCountry: 'البحرين',
        rtl: true
    },
    'ar-AE': {
        name: 'Arabic',
        country: 'United Arab Emirates',
        native: 'عربى',
        nativeCountry: 'الإمارات العربية المتحدة',
        rtl: true
    },
    'ar-EG': {
        name: 'Arabic',
        country: 'Egypt',
        native: 'عربى',
        nativeCountry: 'مصر',
        rtl: true
    },
    'ar-OM': {
        name: 'Arabic',
        country: 'Oman',
        native: 'عربى',
        nativeCountry: 'سلطنة عمان',
        rtl: true
    },
    'ar-LB': {
        name: 'Arabic',
        country: 'Lebanon',
        native: 'عربى',
        nativeCountry: 'لبنان',
        rtl: true
    },
    da: {
        name: 'Danish',
        country: 'Denmark',
        native: 'Dansk',
        nativeCountry: 'Danmark'
    },
    he: {
        name: 'Hebrew',
        country: 'Israel',
        native: 'עברי',
        nativeCountry: 'ישראל',
        rtl: true
    }
};

export const locales = Object.keys(appLocales) as Array<AppLocaleCode>;

/**
 * Locales List
 */

export const LOCALES: Array<AppLocale> = locales.map(code => ({
    ...appLocales[code],
    code: loc2API(code)
}));

/**
 * Utilities
 */

export function loc2RFC(code: string) {
    return (code.slice(0, 3) + code.slice(3, 5).toUpperCase()) as AppLocaleCode;
}

export function loc2API(code: string) {
    return code.toLowerCase();
}

export function locBase(code: string) {
    return code.slice(0, 2);
}

export function locIsRtl(code: AppLocaleCode) {
    return appLocales[loc2RFC(code)].rtl ? true : false;
}

// group the supported locales
export let supportedLocales: Array<SupportedLocale> = [];

locales.map(code => {
    const locale = appLocales[code];
    const base = locBase(code);
    // set the base locale
    let parent = find(supportedLocales, { language: { code: base } });
    if (!parent) {
        parent = { language: { name: locale.name, code: base }, countries: [] };
        supportedLocales.push(parent);
    }
    // set the country
    parent.countries.push({
        code: loc2API(code),
        name: locale.country,
        native: locale.native
    });
});

// sort them language and country
// supportedLocales = sortBy(supportedLocales, 'language.name');
// supportedLocales.map(lang => (lang.countries = sortBy(lang.countries, 'name')));
