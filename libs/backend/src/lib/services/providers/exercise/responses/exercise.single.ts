/**
 * GET /measurement/exercise/:id
 */

export interface ExerciseSingle {
  /** ID of the exercise entry. */
  id: string;
  /** Account ID of the exercise entry. */
  account: string;
  /** Activity time span of the exercise. */
  activitySpan: {
    /** Start of activity time span. */
    start: string;
    /** End of activity time span. */
    end: string;
  };
  /** Exercise type object. */
  exerciseType: {
    /** Exercise type ID. */
    id: string;
    /** Exercise type name. */
    name: string;
    /** Exercise type description. */
    description: string;
    /** A flag indicating whether exercise type is active or not. */
    isActive: boolean;
  };
  /** Exercise-account creation timestamp. */
  createdAt: string;
  /** Exercise intensity. */
  intensity: number;
  /** Exercise note. */
  note?: string;
}
