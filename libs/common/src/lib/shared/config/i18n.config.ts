import {
  AppLocaleCode,
  appLocales as npmLocales
} from '@coachcare/sdk/dist/lib/services/i18n.config'
export { AppLocaleCode } from '@coachcare/sdk/dist/lib/services/i18n.config'

/**
 * Flag information
 */
const localeMetadata = {
  ['en']: {
    flag: '/assets/flag/153-united-states-of-america.png'
  },
  ['en-ca']: {
    flag: '/assets/flag/206-canada.png'
  },
  ['en-gb']: {
    flag: '/assets/flag/262-united-kingdom.png'
  },
  ['en-au']: {
    flag: '/assets/flag/130-australia.png'
  },
  ['en-nz']: {
    flag: '/assets/flag/048-new-zealand.png'
  },
  ['es']: {
    flag: '/assets/flag/044-spain.png'
  },
  ['es-mx']: {
    flag: '/assets/flag/239-mexico.png'
  },
  ['es-co']: {
    flag: '/assets/flag/062-colombia.png'
  },
  ['es-cl']: {
    flag: '/assets/flag/051-chile.png'
  },
  ['es-us']: {
    flag: '/assets/flag/153-united-states-of-america.png'
  },
  ['de']: {
    flag: '/assets/flag/066-germany.png'
  },
  ['fr']: {
    flag: '/assets/flag/077-france.png'
  },
  ['it']: {
    flag: '/assets/flag/011-italy.png'
  },
  ['pt']: {
    flag: '/assets/flag/174-portugal.png'
  },
  ['pt-br']: {
    flag: '/assets/flag/250-brazil.png'
  },
  ['ar-sa']: {
    flag: '/assets/flag/059-saudi-arabia.png'
  },
  ['ar-kw']: {
    flag: '/assets/flag/178-kuwait.png'
  },
  ['ar-bh']: {
    flag: '/assets/flag/116-bahrain.png'
  },
  ['ar-ae']: {
    flag: '/assets/flag/068-united-arab-emirates.png'
  },
  ['ar-eg']: {
    flag: '/assets/flag/079-egypt.png'
  },
  ['ar-om']: {
    flag: '/assets/flag/002-oman.png'
  },
  ['ar-lb']: {
    flag: '/assets/flag/008-lebanon.png'
  },
  ['da']: {
    flag: '/assets/flag/008-lebanon.png'
  },
  ['he']: {
    flag: '/assets/flag/060-israel.png'
  }
}

/**
 * Supported Locales
 */

export interface AppLocaleDefinition {
  name: string
  nativeName: string
  country: string
  nativeCountry: string
  flag: any
  rtl?: boolean
}

export interface AppLocale extends AppLocaleDefinition {
  code: string
}

// keep up to date with tools/i18n/locales
const localeCache: any = {}
Object.keys(npmLocales).forEach((key: string) => {
  const local = npmLocales[key]
  const baseLang = key.split('-')[0].toLowerCase()
  const metadata = localeMetadata[key.toLowerCase()] || {}
  localeCache[key] = {
    name: local.name,
    nativeName: local.native,
    country: local.nativeCountry,
    nativeCountry: local.nativeCountry,
    flag: metadata.flag || localeMetadata[baseLang].flag,
    rtl: baseLang === 'ar' || baseLang === 'he'
  }
})
export const appLocales: { [key in AppLocaleCode]: AppLocaleDefinition } = {
  ...localeCache
}

export const locales = Object.keys(appLocales)

/**
 * Locales List
 */

export const LOCALES: Array<AppLocale> = locales.map((code) => ({
  ...appLocales[code],
  code: loc2API(code)
}))

/**
 * Utilities
 */

export function loc2RFC(code: string) {
  return code.slice(0, 3) + code.slice(3, 5).toUpperCase()
}

export function loc2API(code: string) {
  return code.toLowerCase()
}

export function locBase(code: string) {
  return code.slice(0, 2)
}

export function locIsRtl(code: string) {
  return appLocales[loc2RFC(code)].rtl ? true : false
}
