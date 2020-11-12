/**
 * PATCH /content/form/:id
 */

export interface UpdateFormRequest {
  /** ID of the form to retrieve. */
  id: string
  /** Form name. */
  name?: string
  /** A flag indicating if the form allows adding addendums. */
  allowAddendum?: boolean
  /** Maximum allowed submissions for a form. Can be set to `null` to clear the value. */
  maximumSubmissions?: number
  /** A flag indicating if the form is active. */
  isActive?: boolean
}
