/**
 * Alert Preference
 */

import {
  AlertAccountPreference,
  AlertType,
  AlertOrganizationPreference
} from '.'
import { Entity } from '../../common/entities'

export interface AlertPreference {
  /** Preference ID */
  id: number
  /** Alert type */
  type: AlertType
  /** Organization preference */
  organization: AlertOrganizationPreference
  /** Associated packages */
  packages: Entity[]
  /** Organization-account preference. Only provided when 'account' parameter is passed. */
  account?: AlertAccountPreference
}
