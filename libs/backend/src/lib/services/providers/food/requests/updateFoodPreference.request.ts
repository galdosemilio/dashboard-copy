/**
 * PATCH /food/preference
 */

export interface UpdateFoodPreferenceRequest {
  /** The id of the organization. */
  organization: string;
  /** Food tracking mode id. */
  modeId: string;
  /** Food tracking mode activity state. */
  modeActive: boolean;
}
