/**
 * Interface for GET /warehouse/organization/sign-ups (response)
 */

import { ReportOrganization } from '../../common/entities'

export interface SignupsSnapshotSegment {
  organization: ReportOrganization
  signUps: number // number of new sign ups
}
