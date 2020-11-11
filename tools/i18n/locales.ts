import { appLocales } from '../../libs/npm-api/src/lib/selvera-api/services/i18n.config'

export const locales = Object.keys(appLocales).map((locale: string) =>
  locale.toLowerCase()
)
