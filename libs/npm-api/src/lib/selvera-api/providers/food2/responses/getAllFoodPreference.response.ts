/**
 * GET /food/preference
 */

export interface GetAllFoodPreferenceResponse {
  /** Food tracking mode object. */
  mode: Array<{
    /** Food tracking mode id. */
    id: string
    /** Food tracking mode description. */
    description: string
    /** Food tracking mode activity state for given organization hierarchy. */
    isActive: boolean
  }>
}
