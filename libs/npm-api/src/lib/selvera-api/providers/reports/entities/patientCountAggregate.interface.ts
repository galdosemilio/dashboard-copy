/**
 * PatientCountAggregate
 */

import { ReportOrganization } from '../../common/entities'
import { PackageRegistration, Registrations } from './'

export interface PatientCountAggregate {
  data: Array<PackageRegistration>
  organization: ReportOrganization
  registrations: Registrations
}
