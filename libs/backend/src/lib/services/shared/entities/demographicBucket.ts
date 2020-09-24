/**
 * DemographicBucket
 */

export interface DemographicBucket {
  bucket: {
    /** Bucket name. */
    name: string;
  };
  /** Number of people in the given age bucket. */
  count: number;
  /** Percentage of people in the given age bucket. */
  percentage: number;
}
