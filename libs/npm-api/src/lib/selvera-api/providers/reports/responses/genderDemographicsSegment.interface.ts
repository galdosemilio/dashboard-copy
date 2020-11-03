/**
 * Interface for Gender Demographics
 */

import { ReportOrganization } from '../../common/entities'
import { GenderBreakdown } from '../entities'

export interface GenderDemographicsSegment {
  organization: ReportOrganization
  male: GenderBreakdown
  female: GenderBreakdown
}
