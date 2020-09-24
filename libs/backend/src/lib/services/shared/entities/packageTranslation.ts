/**
 * PackageTranslation
 */

export interface PackageTranslation {
  /** Locale of the translation. */
  locale: string;
  /** Package title in specific locale. */
  title: string;
  /** Package description in specific locale. */
  description?: string;
}
