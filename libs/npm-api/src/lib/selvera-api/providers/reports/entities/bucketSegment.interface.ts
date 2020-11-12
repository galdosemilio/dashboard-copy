/**
 * Bucket Segment
 */

import { Bucket } from './bucket.interface'

export interface BucketSegment {
  count: number
  bucket: Bucket
  percentage: number
}
