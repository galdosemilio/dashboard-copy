import { appLocales } from '@coachcare/sdk/dist/lib/services/i18n.config'

export const locales = Object.keys(appLocales).map((locale: string) =>
  locale.toLowerCase()
)
