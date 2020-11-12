/**
 * POST /content/form/section
 */

export interface CreateFormSectionRequest {
  /** A form (ID) for which the section belongs to. */
  form: string
  /** Section title. */
  title: string
  /** Additional description. */
  description?: string
  /**
   * Sort order of the sections on the form.
   * (Sections with equal or greater order number are pushed down - order number is increased)
   */
  sortOrder: number
}
