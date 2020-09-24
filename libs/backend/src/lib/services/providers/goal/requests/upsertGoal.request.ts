/**
 * PUT /goal
 */

export interface UpsertGoalRequest {
  /** Upsert a goal record and associate with this account. Optional for Client requests, otherwise required. */
  account?: string;
  /** Array of objects which contain goal IDs and quantities. At least one goal is required. */
  goals: Array<{
    /** Goal type ID to upsert. */
    goalTypeId: string;
    /** The numeric value to set for this goal. */
    quantity: number;
  }>;
}
