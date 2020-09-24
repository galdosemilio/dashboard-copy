/**
 * PUT /goal/:id
 */

export interface UpdateGoalRequest {
  /** Account goal ID to update. */
  id: string;
  /** The numeric value to set for this goal. */
  quantity: number;
}
