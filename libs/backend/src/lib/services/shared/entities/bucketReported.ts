/**
 * BucketReported
 */

import { DemographicBucket } from './demographicBucket';

export interface BucketReported {
  /** Organization data. */
  organization: {
    /** Organization ID. */
    id: string;
    /** Organization name. */
    name: string;
  };
  /** Age bucket collection. */
  buckets: Array<DemographicBucket>;
}
