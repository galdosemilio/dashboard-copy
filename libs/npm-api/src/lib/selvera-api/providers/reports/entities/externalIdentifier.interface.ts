/**
 * External identifier object
 */

import { ReportOrganization } from '../../common/entities'

export interface ExternalIdentifier {
  /** External identifier object */
  id: string
  /** External identifier name */
  name: string
  /** External identifier value */
  value: string
  /** A flag indicating if this external identifier is individual to an account, or an organization-wide one */
  isIndividual: boolean
  /** External identifier organization object */
  organization: ReportOrganization
}
