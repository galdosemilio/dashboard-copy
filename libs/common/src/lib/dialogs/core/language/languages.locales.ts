import { appLocales, loc2API, locales, locBase } from '@coachcare/common/shared'
import { find } from 'lodash'

// group the supported locales
export interface SupportedLocale {
  language: {
    code: string
    name: string
    nativeName: string
  }
  countries: Array<{
    code: string
    name: string
    nativeCountry: string
    flag: any
  }>
}
export let localeList: Array<SupportedLocale> = []

locales.map((code) => {
  const locale = appLocales[code]
  const base = locBase(code)
  // set the base locale
  let parent = find(localeList, { language: { code: base } })
  if (!parent) {
    parent = {
      language: {
        name: locale.name,
        nativeName: locale.nativeName,
        code: base
      },
      countries: []
    }
    localeList.push(parent)
  }
  // set the country
  parent.countries.push({
    code: loc2API(code),
    name: locale.country,
    nativeCountry: locale.nativeCountry,
    flag: locale.flag
  })
})

// sort them language and country
// localeList = sortBy(localeList, 'language.name');
// localeList.map(lang => (lang.countries = sortBy(lang.countries, 'name')));
