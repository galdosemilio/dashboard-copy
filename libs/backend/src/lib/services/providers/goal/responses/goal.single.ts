/**
 * GET /goal
 */

export interface GoalSingle {
  /** A collection of goals. */
  goals: Array<{
    /** The account-goal association ID. */
    id: string;
    /** The quantity associated with the goal. */
    quantity: number;
    /** Type of the associated goal. */
    type: {
      /** ID of the goal type. */
      id: string;
      /** Name of the goal type. */
      name: string;
      /** Code of the goal type. */
      code: string;
    };
  }>;
}
