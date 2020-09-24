/**
 * PATCH /content/form/section/:id
 */

export interface UpdateFormSectionRequest {
  /** ID of the section to update. */
  id: string;
  /** Section title. */
  title?: string;
  /** Additional description. Will clear the description if it's set to `null`. */
  description?: string;
  /**
   * Sort order of the section on the form.
   * (Sections with equal or greater order number than given are pushed down - order number is increased)
   */
  sortOrder?: number;
}
