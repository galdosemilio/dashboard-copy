/**
 * Selectors and AutoCompleters Options
 */

export interface SelectorOption {
  value: any
  viewValue: any
  viewSubvalue?: any
  disabled?: boolean
}

export interface AutocompleterOption extends SelectorOption {
  viewNote?: any
}

// i18n
export interface TranslatedItem {
  [lang: string]: string
}
export interface TranslatedOption extends SelectorOption {
  viewValue: TranslatedItem
  viewSubvalue?: TranslatedItem
}
