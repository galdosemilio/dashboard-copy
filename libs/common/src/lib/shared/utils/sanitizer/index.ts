function sanitizeTranslationString(rawValue: string): string {
  const whitelistRegex = new RegExp(/<\/?(?!(strong|br|a|ul|li))[^>]+?>/gi)
  return rawValue.replace(whitelistRegex, '')
}

export const Sanitizer = { sanitizeTranslationString }
