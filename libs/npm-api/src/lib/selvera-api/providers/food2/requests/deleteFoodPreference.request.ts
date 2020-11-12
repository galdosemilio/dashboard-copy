/**
 * DELETE /food/preference
 */

export interface DeleteFoodPreferenceRequest {
  /** The id of the organization. */
  organization: string
  /** Food tracking mode id. */
  modeId: string
}
