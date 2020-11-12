/**
 * Interface for Age Demegraphics Response
 */

import { ReportOrganization } from '../../common/entities'
import { BucketSegment } from '../entities'

export interface AgeDemographicsSegment {
  organization: ReportOrganization
  buckets: Array<BucketSegment>
}
