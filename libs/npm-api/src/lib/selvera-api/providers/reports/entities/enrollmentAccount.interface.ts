/**
 * Interface for Enrollment Account
 */

import { ReportAccount } from '../../common/entities'

export interface EnrollmentAccount extends ReportAccount {
  /** Account e-mail */
  email: string
}
